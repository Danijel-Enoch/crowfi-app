import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import { escapeRegExp } from 'lodash'
import { Heading, Flex, Text, Button, AddIcon, InputGroup, SearchIcon, LanguageIcon, DiscordIcon, InstagramIcon, TwitterIcon, TelegramIcon, CheckmarkIcon, CloseIcon, Skeleton, LogoIcon, Spinner, PencilIcon } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { PageBGWrapper, StyledInput, StyledInputLabel, StyledText, StyledTextarea, StyledTextInput, StyledURLInput } from 'components/Launchpad/StyledControls'
import { API_PROFILE } from 'config/constants/endpoints'
import styled from 'styled-components'
import PageHeader from 'components/PageHeader'
import Upload from 'components/Upload'
import InputGroupWithPrefix from 'components/Input/InputGroupWithPrefix'
import CheckboxWithText from 'components/Launchpad/CheckboxWithText'
import Loading from 'components/Loading'
import Dots from 'components/Loader/Dots'
import { useProfileLoggedIn } from 'state/profile/hooks'
import { NFTContractType, ProfileLoginStatus } from 'state/types'
import useToast from 'hooks/useToast'
import AuthGuard from '../Auth'
import { CollectionData, useCreateNFTTokenContract, useRegisterCollection, useUpdateCollection } from '../../hooks/useCreateToken'
import { getCollectionWithSlug, SlugAvailability, useCollectionSlugAvailability } from '../../hooks/useCollections'
import { NFTCollection } from '../../hooks/types'
import { FormState, FormErrors, urlReg, slugReg, urlPathReg } from './types'
import { getFormErrors } from './helpers'

const BlankPage = styled.div`
    position:relative;
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: calc(100vh - 540px);

    ${({ theme }) => theme.mediaQueries.sm} {
        padding-top: 32px;
        min-height: calc(100vh - 380px);
    }

    ${({ theme }) => theme.mediaQueries.md} {
        padding-top: 32px;
        min-height: calc(100vh - 336px);
    }
`

const SpinnerWrapper = styled(Flex)`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
`
const FullWidthFlex = styled(Flex)`
    width: 100%;
`
const StyledPageBody = styled(Flex)`
    filter: ${({ theme }) => theme.card.dropShadow};
    border-radius: ${({ theme }) => theme.radii.default};
    background: white;
    margin: 0px 12px 24px 12px;
    flex: 1;
    z-index: 1;

    ${({ theme }) => theme.mediaQueries.md} {
        margin: 0px 24px 24px 24px;
    }
`

const Label = styled(Text)<{required?: boolean}>`
  font-size: 14px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};

  ${({ required }) =>
  required &&
    `
      &:after {    
        content: " *";
        color: rgb(235, 87, 87);
      }
  `}
`

const LabelDesc = styled(Text)`
  font-size: 12px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.secondary};
`

const FieldGroup = styled(Flex).attrs({flexDirection:"column"})`
    padding: 12px 0px;
`

const StyledErrorLabel = styled(Text)`
  color: ${({ theme }) => theme.colors.failure};
  padding: 2px 8px;
  alpha: 0.8;
  font-size: 10px;
`


const CreateCollection: React.FC = () => {
    const { t } = useTranslation()

    const { slug: collectionSlug } = useParams<{ slug?: string }>()
    const { toastError, toastSuccess } = useToast()
    const history = useHistory()
    const {loginStatus} = useProfileLoggedIn()
    const [collection, setCollection] = useState<NFTCollection>(null)
    const [collectionLoaded, setCollectionLoaded] = useState(false)
    const [pendingTx, setPendingTx] = useState(false)
    const [state, setState] = useState<FormState>({
        mintable: true,
        name: '',
        symbol: '',
        description: '',
        slug: '',
        site: '',
        discord: '',
        twitter: '',
        instagram: '',
        telegram: ''
    })
    const [orgState, setOrgState] = useState<FormState>({
        mintable: true,
        name: '',
        symbol: '',
        description: '',
        slug: '',
        site: '',
        discord: '',
        twitter: '',
        instagram: '',
        telegram: ''
    })
    const {logoFile, bannerFile, featuredFile, name, mintable, symbol, description, slug, site, discord, instagram, medium, twitter, telegram} = state
    const [formError, setFormError] = useState<FormErrors>({})

    const [contractAddress, setContractAddress] = useState('')

    const slugAvailability = useCollectionSlugAvailability(slug)

    const {onCreateTokenContract} = useCreateNFTTokenContract()
    const {onRegisterCollection} = useRegisterCollection()
    const {onUpdateCollection} = useUpdateCollection()

    const isEditing = useMemo(() => {
        return !!collectionSlug
    }, [collectionSlug])

    const [fieldsState, setFieldsState] = useState<{ [key: string]: boolean }>({})
    const updateValue = (key: string, value: string | File | boolean, track = true) => {

        let value_ = value
        if (typeof value_ === 'string') {
            if (key === 'twitter') {
                if (value_.startsWith('https://twitter.com/')) {
                    value_ = value_.replace('https://twitter.com/', '')
                }
            } else if (key === 'discord') {
                if (value_.startsWith('https://discord.gg/')) {
                    value_ = value_.replace('https://discord.gg/', '')
                }
            } else if (key === 'telegram') {
                if (value_.startsWith('https://t.me/')) {
                    value_ = value_.replace('https://t.me/', '')
                }
            } else if (key === 'instagram') {
                if (value_.startsWith('https://instagram.com/')) {
                    value_ = value_.replace('https://instagram.com/', '')
                }
            }
        }

        setState((prevState) => ({
            ...prevState,
            [key]: value_,
        }))

        if (track) {
            if (orgState[key] !== value_) {
                // Keep track of what fields the user has attempted to edit
                setFieldsState((prevFieldsState) => ({
                    ...prevFieldsState,
                    [key]: true,
                }))
            } else {
                setFieldsState((prevFieldsState) => ({
                    ...prevFieldsState,
                    [key]: false,
                }))
            }
        }
    }

    const hasChanges = useMemo(() => {
        return !isEditing || fieldsState.name || fieldsState.slug || fieldsState.description || fieldsState.site || fieldsState.site 
        || fieldsState.discord || fieldsState.instagram || fieldsState.twitter || fieldsState.telegram || fieldsState.logoFile || fieldsState.bannerFile || fieldsState.featuredFile
    }, [isEditing, fieldsState])

    useEffect(() => {
        const fetchCollection = async() => {
            try {
                const collection_ = await getCollectionWithSlug(collectionSlug)
                setCollection(collection_)

                const discord_ = collection_.discord?.startsWith('https://discord.gg/') ? collection_.discord?.replace('https://discord.gg/', '') : collection_.discord
                const instagram_ = collection_.instagram?.startsWith('https://instagram.com/') ? collection_.instagram?.replace('https://instagram.com/', '') : collection_.instagram
                const twitter_ = collection_.twitter?.startsWith('https://twitter.com/') ? collection_.twitter?.replace('https://twitter.com/', '') : collection_.twitter
                const telegram_ = collection_.telegram?.startsWith('https://t.me/') ? collection_.telegram?.replace('https://t.me/', '') : collection_.telegram

                setState({
                    mintable: true,
                    name: collection_.name ?? '',
                    symbol: collection_.symbol ?? '',
                    description: collection_.description ?? '',
                    slug: collection_.slug ?? '',
                    site: collection_.site ?? '',
                    discord: discord_ ?? '',
                    instagram: instagram_ ?? '',
                    twitter: twitter_ ?? '',
                    telegram: telegram_ ?? ''
                })

                setOrgState({
                    mintable: true,
                    name: collection_.name ?? '',
                    symbol: collection_.symbol ?? '',
                    description: collection_.description ?? '',
                    slug: collection_.slug ?? '',
                    site: collection_.site ?? '',
                    discord: discord_ ?? '',
                    instagram: instagram_ ?? '',
                    twitter: twitter_ ?? '',
                    telegram: telegram_ ?? ''
                })
            } finally {
                setCollectionLoaded(true)
            }
        }

        if (collectionSlug) {
            fetchCollection()
        }
        
    }, [collectionSlug])

    const slugAvailabilityIcon = () => {
        if (isEditing && !fieldsState.slug) {
            return (
                <CheckmarkIcon width="18x" height="18px" color="primary"/>
            )
        }
        if (slug && slug.length > 0 && slugReg.test(slug)) {
            
            if (slugAvailability === SlugAvailability.UNKNOWN) {
                return (
                    <Loading/>
                )
            }
            if (slugAvailability === SlugAvailability.VALID) {
                return (
                    <CheckmarkIcon width="18x" height="18px" color="primary"/>
                )
            }
            if (slugAvailability === SlugAvailability.INVALID) {
                return (
                    <CloseIcon width="18x" height="18px"  color="warning"/>
                )
            }
        
        }
        return undefined
    }

    const validateInputs = useCallback(() => {
        const {valid, error} = getFormErrors(state, isEditing, t)
        setFormError(error)
        return valid;
    }, [t, state, isEditing])

    const handleUpdate = useCallback(async () => {
        if (!validateInputs()) {
            return
        }
        try {
            setPendingTx(true)

            const data: CollectionData = {}
            data.name = state.name ?? ''
            if (fieldsState.description) data.description = state.description
            if (fieldsState.site) data.site = state.site
            if (fieldsState.slug) data.slug = state.slug
            if (fieldsState.discord) data.discord = state.discord
            if (fieldsState.instagram) data.instagram = state.instagram
            if (fieldsState.twitter) data.twitter = state.twitter
            if (fieldsState.telegram) data.telegram = state.telegram
            if (fieldsState.logoFile) data.logoFile = state.logoFile
            if (fieldsState.featuredFile) data.featuredFile = state.featuredFile
            if (fieldsState.bannerFile) data.bannerFile = state.bannerFile
            const collection_: any = await onUpdateCollection(collection.slug, data)
            history.push(`/nft/collection/${collection_.slug}`)

            toastSuccess(t('Success'), t('You have been created the collection successfully!'))
        } catch (e) {
            const error = e as any
            const msg = error?.data?.message ?? error?.message ?? t('Failed')
            toastError(
                t('Error'),
                msg,
            )
        } finally {
            setPendingTx(false)
        }
    }, [validateInputs, onUpdateCollection, history, t, toastSuccess, toastError, fieldsState, state, collection])

    const handleCreate = useCallback(async () => {
        if (!validateInputs()) {
            return
        }

        if (!mintable || (contractAddress && contractAddress.length > 0)) {
            try {
                setPendingTx(true)
                const collection_: any = await onRegisterCollection(
                    !mintable ? null : contractAddress, 
                    NFTContractType.ERC1155, 
                    name, 
                    symbol,
                    slug,
                    description, 
                    site, 
                    discord, 
                    instagram,
                    medium, 
                    twitter, 
                    telegram, 
                    logoFile, 
                    featuredFile, 
                    bannerFile
                )
                history.push(`/nft/collection/${collection_.slug}`)
    
                toastSuccess(t('Success'), t('You have been created the collection successfully!'))
            } catch (err) {
                const error = err as any
                toastError(error?.message ? error.message : JSON.stringify(err))
            } finally {
                setPendingTx(false)
            }
        } else {
            try {
                setPendingTx(true)
                const address = await onCreateTokenContract(name, symbol, `${API_PROFILE}/collections/${slug}/uri/{id}`)
                setContractAddress(address)
                const collection_: any = await onRegisterCollection(
                    address, 
                    NFTContractType.ERC1155, 
                    name, 
                    symbol,
                    slug,
                    description, 
                    site, 
                    discord, 
                    instagram,
                    medium, 
                    twitter, 
                    telegram, 
                    logoFile, 
                    featuredFile, 
                    bannerFile
                )
                history.push(`/nft/collection/${collection_.slug}`)
    
                toastSuccess(t('Success'), t('You have been created the collection successfully!'))
            } catch (e) {
                toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
            } finally {
                setPendingTx(false)
            }
        }
        

    }, [toastError, toastSuccess, t, onCreateTokenContract, onRegisterCollection, validateInputs, mintable, contractAddress, slug, history, name, symbol,description, site, discord, instagram, medium, twitter, telegram, logoFile, featuredFile, bannerFile])
    
    if (loginStatus !== ProfileLoginStatus.LOGGEDIN) {
        return <AuthGuard/>
    }
    return (
        <>
        <PageBGWrapper/>
        <PageHeader>
            <Heading as="h1" scale="xl" color="white" style={{textShadow:"2px 3px rgba(255,255,255,0.2)"}}>
                {isEditing ? t('Edit My Colelction') : t('Create New Collection')}
            </Heading>
        </PageHeader>
        <StyledPageBody flexDirection="column" flex="1">
            {isEditing && !collection && !collectionLoaded ? (
                <BlankPage>
                    <SpinnerWrapper >
                        <FullWidthFlex justifyContent="center" alignItems="center">
                            <Spinner />
                        </FullWidthFlex>
                    </SpinnerWrapper>
                </BlankPage>
            ) : isEditing && !collection ? (
            <BlankPage>
                <LogoIcon width="64px" mb="8px" />
                <Heading scale="xxl">404</Heading>
                <Text mb="16px">{t('Oops, page not found.')}</Text>
                <Button as={Link} to="/" scale="sm">
                {t('Back Home')}
                </Button>
            </BlankPage>
            ) : (

                <Flex flexDirection="row" justifyContent="center" margin={["12px", "12px", "12px", "24px"]}>
                <Flex flexDirection="column" maxWidth="960px" width="100%">
                    <FieldGroup>
                        <Label required>{t('Logo imge')}</Label>
                        <LabelDesc>
                            {t("This image will also be used for navigation. 350 x 350 recommended.")}
                        </LabelDesc>
                        <Flex>
                            <Upload 
                                width="120px" 
                                height="120px" 
                                borderRadius="100px" 
                                placeholderSize="110px" 
                                placeholder={collection?.logo}
                                accept="image/*"
                                showClose={false}
                                onSelect={(file) => updateValue('logoFile',file)}
                            />
                        </Flex>
                        {formError.logo && (<StyledErrorLabel>{formError.logo}</StyledErrorLabel>)}
                    </FieldGroup>
                    <FieldGroup>
                        <Label>{t('Featured image')}</Label>
                        <LabelDesc>
                            {t("This image will be used for featuring your collection on the homepage, category pages, or other promotional areas. 600 x 400 recommended.")}
                        </LabelDesc>
                        <Flex>
                            <Upload 
                                accept="image/*"
                                showClose={false}
                                placeholder={collection?.featuredImage}
                                onSelect={(file) => updateValue('featuredFile',file)}
                            />
                        </Flex>
                    </FieldGroup>
                    <FieldGroup>
                        <Label>{t('Banner image')}</Label>
                        <LabelDesc>
                            {t("This image will appear at the top of your collection page. Avoid including too much text in this banner image, as the dimensions change on different devices. 1400 x 400 recommended.")}
                        </LabelDesc>
                        <Flex>
                            <Upload 
                                width="calc(min(700px,100vw - 52px))"  
                                accept="image/*"
                                showClose={false}
                                placeholder={collection?.bannerImage}
                                onSelect={(file) => updateValue('bannerFile',file)}
                            />
                        </Flex>
                    </FieldGroup>
                    <FieldGroup>
                        <Label required>{t('Name')}</Label>
                        <StyledTextInput 
                            placeholder={t('e.g My NFT v2')} 
                            value={name} 
                            onUserInput={(val) => {
                                updateValue('name',val)
                                if (!isEditing) {
                                    updateValue('slug',val.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''))
                                }
                                setFormError({...formError, name: null})
                            }}
                        />
                        {formError.name && (<StyledErrorLabel>{formError.name}</StyledErrorLabel>)}
                    </FieldGroup>
                    {/* { !isEditing && (
                    <FieldGroup>
                        <Label required>{t('Mintable')}</Label>
                        <LabelDesc>
                            {t("Do you want to mint NFT tokens from this collection? If select Yes, we'll create a ERC1155 NFT contract for you.")}
                        </LabelDesc>
                        <CheckboxWithText
                            text={t('Yes')}
                            checked={mintable}
                            onClick={() => updateValue('mintable',true)}
                            />
                        <CheckboxWithText
                            text={t('No')}
                            checked={!mintable}
                            onClick={() => updateValue('mintable',false)}
                            />
                    </FieldGroup>
                    )} */}
                    {!isEditing && mintable && (
                    <FieldGroup>
                        <Label required>{t('Symbol')}</Label>
                        <StyledTextInput 
                            placeholder={t('e.g. TOK')} 
                            value={symbol} 
                            onUserInput={(val) => {
                                updateValue('symbol',val)
                                setFormError({...formError, symbol: null})
                            }}
                        />
                        {formError.symbol && (<StyledErrorLabel>{formError.symbol}</StyledErrorLabel>)}
                    </FieldGroup>
                    )}

                    <FieldGroup>
                        <Label>{t('Description')}</Label>
                        <LabelDesc>
                            {t("Markdown syntax is supported. 0 of 1000 characters used.")}
                        </LabelDesc>
                        <StyledTextarea
                            hasError={description.length > 1000}
                            value={description}
                            placeholder=""
                            onUserInput={(val) => {
                                updateValue('description',val)
                            }}
                        />
                    </FieldGroup>
                    <FieldGroup>
                        <Label>{t('Your collection link')}</Label>
                        <InputGroupWithPrefix
                            prefixText="https://crowfi.app/nft/collection/" 
                            startIcon={<LanguageIcon width="18px" color="secondary"/>}
                            endIcon={slugAvailabilityIcon()}
                            marginTop="8px"
                        >
                            <StyledURLInput
                                errorReg={slugReg}
                                value={slug} 
                                placeholder={t('my-nft-collection')}
                                onUserInput={(val) => updateValue('slug',val)} 
                            />
                        </InputGroupWithPrefix>
                    </FieldGroup>

                    <FieldGroup>
                        <Label>{t('Links')}</Label>
                        <InputGroup startIcon={<LanguageIcon width="18px" color="secondary"/>}>
                            <StyledURLInput
                                errorReg={urlReg}
                                value={site} 
                                placeholder={t('https://yoursite.io')}
                                onUserInput={(val) => updateValue('site',val)} 
                            />
                        </InputGroup>
                        {formError.site && (<StyledErrorLabel>{formError.site}</StyledErrorLabel>)}
                        <InputGroupWithPrefix
                            prefixText="https://discord.gg/" 
                            startIcon={<DiscordIcon width="18px" color="secondary"/>} 
                            marginTop="8px"
                        >
                            <StyledURLInput
                                errorReg={urlPathReg}
                                value={discord} 
                                placeholder={t('abcdef')}
                                onUserInput={(val) => updateValue('discord',val)} 
                            />
                        </InputGroupWithPrefix>
                        <InputGroupWithPrefix
                            prefixText="https://instagram.com/" 
                            startIcon={<InstagramIcon width="18px" color="secondary"/>} 
                            marginTop="8px"
                        >
                            <StyledURLInput
                                errorReg={urlPathReg}
                                value={instagram} 
                                placeholder={t('abcdef')}
                                onUserInput={(val) => updateValue('instagram',val)} 
                            />
                        </InputGroupWithPrefix>
                        <InputGroupWithPrefix
                            prefixText="https://twitter.com/" 
                            startIcon={<TwitterIcon width="18px" color="secondary"/>} 
                            marginTop="8px"
                        >
                            <StyledURLInput
                                errorReg={urlPathReg}
                                value={twitter} 
                                placeholder={t('abcdef')}
                                onUserInput={(val) => updateValue('twitter',val)} 
                            />
                        </InputGroupWithPrefix>
                        <InputGroupWithPrefix
                            prefixText="https://t.me/" 
                            startIcon={<TelegramIcon width="18px" color="secondary"/>} 
                            marginTop="8px"
                        >
                            <StyledURLInput
                                errorReg={urlPathReg}
                                value={telegram} 
                                placeholder={t('abcdef')}
                                onUserInput={(val) => updateValue('telegram',val)} 
                            />
                        </InputGroupWithPrefix>
                    </FieldGroup>
                    { isEditing ? (
                        <Flex>
                            <Button
                                disabled={pendingTx || !hasChanges}
                                onClick={handleUpdate}
                            >
                                {pendingTx ? (<Dots>{t('Processing')}</Dots>) : t('Update')}
                            </Button>
                        </Flex>
                    ) : (
                        <Flex>
                            <Button
                                disabled={pendingTx}
                                onClick={handleCreate}
                            >
                                {pendingTx ? (<Dots>{t('Processing')}</Dots>) : t('Create')}
                            </Button>
                        </Flex>
                    )}

                    
                </Flex>
            </Flex>
            )}
        </StyledPageBody>
        </>
    )
}

export default CreateCollection