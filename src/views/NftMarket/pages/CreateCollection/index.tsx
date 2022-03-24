import React, { useCallback, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { escapeRegExp } from 'lodash'
import { Heading, Flex, Text, Button, AddIcon, InputGroup, SearchIcon, LanguageIcon, DiscordIcon, InstagramIcon, TwitterIcon, TelegramIcon, CheckmarkIcon, CloseIcon } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { PageBGWrapper, StyledInput, StyledInputLabel, StyledText, StyledTextarea, StyledTextInput, StyledURLInput } from 'components/Launchpad/StyledControls'
import { API_PROFILE } from 'config/constants/endpoints'
import styled from 'styled-components'
import PageHeader from 'components/PageHeader'
import Upload from 'components/Upload'
import InputGroupWithPrefix from 'components/Input/InputGroupWithPrefix'
import Loading from 'components/Loading'
import Dots from 'components/Loader/Dots'
import { useProfileLoggedIn } from 'state/profile/hooks'
import { NFTContractType, ProfileLoginStatus } from 'state/types'
import useToast from 'hooks/useToast'
import AuthGuard from '../Auth'
import { useCreateNFTTokenContract, useRegisterCollection } from '../../hooks/useCreateToken'
import { SlugAvailability, useCollectionSlugAvailability } from '../../hooks/useCollections'

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

interface FormErrors {
    logo?: string
    name?: string,
    symbol?: string,
    site?: string
}


const CreateCollection: React.FC = () => {
    const urlReg = RegExp('^(http|https)\\://(www.)?[a-zA-Z0-9@:%._\\+~#?&//=]{1,256}.[a-z]{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)$')
    const slugReg = RegExp('^[a-z][a-z0-9\\-]*[a-z0-9]$')
    const urlPathReg = RegExp('\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)$')
    const { t } = useTranslation()
    const { toastError, toastSuccess } = useToast()
    const history = useHistory()
    const loginStatus = useProfileLoggedIn()
    const [pendingTx, setPendingTx] = useState(false)
    const [logoFile, setLogoFile] = useState(null)
    const [bannerFile, setBannerFile] = useState(null)
    const [featuredFile, setFeaturedFile] = useState(null)
    const [name, setName] = useState('')
    const [symbol, setSymbol] = useState('')
    const [description, setDescription] = useState('')
    const [slug, setSlug] = useState('')
    const [site, setSite] = useState('')
    const [discord, setDiscord] = useState('')
    const [instagram, setInstagram] = useState('')
    const [medium, setMedium] = useState('')
    const [twitter, setTwitter] = useState('')
    const [telegram, setTelegram] = useState('')
    const [formError, setFormError] = useState<FormErrors>({})

    const [contractAddress, setContractAddress] = useState('')

    const slugAvailability = useCollectionSlugAvailability(slug)

    const {onCreateTokenContract} = useCreateNFTTokenContract()
    const {onRegisterCollection} = useRegisterCollection()

    const slugAvailabilityIcon = () => {
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
        let valid = true
        const error: FormErrors = {}

        if (!logoFile) {
            error.logo = t("Logo is required")
            valid = false
        }

        if (!name || name.length === 0) {
            error.name = t('Name is required')
            valid = false
        }
        
        if (!symbol || symbol.length === 0) {
            error.symbol = t('Symbol is required')
            valid = false
        } else if (symbol.length > 20) {
            error.symbol = t('Symbol max length is 20')
            valid = false
        }
        
        if (site && site.length > 0 && urlReg.test(escapeRegExp(site))) {
            error.site = t('Site link is invalid')
            valid = false
        }
        setFormError(error)
        return valid;
    }, [t, logoFile, name, symbol, site, urlReg])

    const handleCreate = useCallback(async () => {
        if (!validateInputs()) {
            return
        }

        if (contractAddress && contractAddress.length > 0) {
            try {
                setPendingTx(true)
                const address = contractAddress
                const collection: any = await onRegisterCollection(address, NFTContractType.ERC1155, name, symbol, description, site, discord, instagram, medium, twitter, telegram, logoFile, featuredFile, bannerFile)
                history.push(`/nft/collection/${collection.slug}`)
    
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
                const collection: any = await onRegisterCollection(address, NFTContractType.ERC1155, name, symbol, description, site, discord, instagram, medium, twitter, telegram, logoFile, featuredFile, bannerFile)
                history.push(`/nft/collection/${collection.slug}`)
    
                toastSuccess(t('Success'), t('You have been created the collection successfully!'))
            } catch (e) {
                toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
            } finally {
                setPendingTx(false)
            }
        }
        

    }, [toastError, toastSuccess, t, onCreateTokenContract, onRegisterCollection, validateInputs, contractAddress, slug, history, name, symbol,description, site, discord, instagram, medium, twitter, telegram, logoFile, featuredFile, bannerFile])
    
    if (loginStatus !== ProfileLoginStatus.LOGGEDIN) {
        return <AuthGuard/>
    }
    return (
        <>
        <PageBGWrapper/>
        <PageHeader>
            <Heading as="h1" scale="xl" color="white" style={{textShadow:"2px 3px rgba(255,255,255,0.2)"}}>
                {t('Create New Collection')}
            </Heading>
        </PageHeader>
        <StyledPageBody flexDirection="column" flex="1">
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
                                accept="image/*"
                                showClose={false}
                                onSelect={(file) => setLogoFile(file)}
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
                                onSelect={(file) => setFeaturedFile(file)}
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
                                width="700px"  
                                accept="image/*"
                                showClose={false}
                                onSelect={(file) => setBannerFile(file)}
                            />
                        </Flex>
                    </FieldGroup>
                    <FieldGroup>
                        <Label required>{t('Name')}</Label>
                        <StyledTextInput 
                            placeholder={t('e.g My NFT v2')} 
                            value={name} 
                            onUserInput={(val) => {
                                setName(val)
                                setSlug(val.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''))
                                setFormError({...formError, name: null})
                            }}
                        />
                        {formError.name && (<StyledErrorLabel>{formError.name}</StyledErrorLabel>)}
                    </FieldGroup>
                    <FieldGroup>
                        <Label required>{t('Symbol')}</Label>
                        <StyledTextInput 
                            placeholder={t('e.g. TOK')} 
                            value={symbol} 
                            onUserInput={(val) => {
                                setSymbol(val)
                                setFormError({...formError, symbol: null})
                            }}
                        />
                        {formError.symbol && (<StyledErrorLabel>{formError.symbol}</StyledErrorLabel>)}
                    </FieldGroup>

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
                                setDescription(val)
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
                                onUserInput={(val) => setSlug(val)} 
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
                                onUserInput={(val) => setSite(val)} 
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
                                onUserInput={(val) => setDiscord(val)} 
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
                                onUserInput={(val) => setInstagram(val)} 
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
                                onUserInput={(val) => setTwitter(val)} 
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
                                onUserInput={(val) => setTelegram(val)} 
                            />
                        </InputGroupWithPrefix>
                    </FieldGroup>

                    <Flex>
                        <Button
                            disabled={pendingTx}
                            onClick={handleCreate}
                        >
                            {pendingTx ? (<Dots>{t('Processing')}</Dots>) : t('Create')}
                        </Button>
                    </Flex>
                </Flex>
            </Flex>
        </StyledPageBody>
        </>
    )
}

export default CreateCollection