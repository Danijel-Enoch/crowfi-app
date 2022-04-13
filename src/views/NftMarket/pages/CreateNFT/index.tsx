import React, { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Heading, Flex, Text, Button, AddIcon, useModal } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { escapeRegExp } from 'lodash'
import { useTranslation } from 'contexts/Localization'
import { PageBGWrapper, StyledInput, StyledInputLabel, StyledIntegerInput, StyledText, StyledTextarea, StyledTextInput, StyledURLInput } from 'components/Launchpad/StyledControls'
import styled from 'styled-components'
import { NFTAssetType, ProfileLoginStatus } from 'state/types'
import Select from 'components/Select/Select'
import PageHeader from 'components/PageHeader'
import Upload from 'components/Upload'
import useRefresh from 'hooks/useRefresh'
import Dots from 'components/Loader/Dots'
import useToast from 'hooks/useToast'
import { useProfileLoggedIn } from 'state/profile/hooks'
import AuthGuard from '../Auth'
import { NFTAttribute, NFTCollection, NFTTrait } from '../../hooks/types'
import { getCollectionsWithQueryParams } from '../../hooks/useCollections'
import { useMintNFT, useRegisterNFT } from '../../hooks/useCreateNFT'
import TextTraitModal from '../../components/TraitModal/TextTraitModal'
import TextTrait from '../../components/TextTrait'
import NumberTraitModal from '../../components/TraitModal/NumberTraitModal'
import NumberTrait from '../../components/NumberTrait'
import NoCollectionModal from '../../components/NoCollectionModal'

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
/* eslint-disable camelcase */
interface Trait {
    trait_type: string
    value: any
    max_value?: any
}

interface FormErrors {
    media?: string
    preview?: string,
    name?: string,
    collection?: string
    externalLink?: string
    supply?: string
}

const CreateNFT: React.FC = () => {
    const urlReg = RegExp('^(http|https)\\://(www.)?[a-zA-Z0-9@:%._\\+~#?&//=]{1,256}.[a-z]{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)$')
    const history = useHistory()
    const { t } = useTranslation()
    const { account } = useWeb3React()
    const { toastError, toastSuccess } = useToast()
    const {loginStatus} = useProfileLoggedIn()
    const [pendingTx, setPendingTx] = useState(false)
    const [formError, setFormError] = useState<FormErrors>({})
    const [assetType, setAssetType] = useState(NFTAssetType.Image)
    const [supply, setSupply] = useState('1')
    const [assetFile, setAssetFile] = useState(null)
    const [previewFile, setPreviewFile] = useState(null)
    const [name, setName] = useState('')
    const [externalLink, setExternalLink] = useState('')
    const [description, setDescription] = useState('')
    const [collection, setCollection] = useState<NFTCollection>(null)
    const [collectionOptions, setCollectionOptions] = useState([])
    const [collectionsLoaded, setCollectionsLoaded] = useState(false)
    const [noCollectionModalPresented, setNoCollectionModalPresented] = useState(false)
    const [textTraits, setTextTraits] = useState<NFTAttribute[]>([])
    const [numberTraits, setNumberTraits] = useState<NFTAttribute[]>([])
    const { slowRefresh } = useRefresh()

    const {onMintNFT} = useMintNFT(account)
    const {onRegisterNFT} = useRegisterNFT()

    const [onPresentNoCollectionModal] = useModal(
        <NoCollectionModal onAgree={() => {
            history.push('/nft/create-collection')
        }}/>
    )

    useEffect(() => {
        if (noCollectionModalPresented || !collectionsLoaded || collectionOptions.length > 0) {
            return
        }

        setNoCollectionModalPresented(true)

        onPresentNoCollectionModal()

    }, [onPresentNoCollectionModal, collectionsLoaded, noCollectionModalPresented, collectionOptions])

    useEffect(() => {
        const fetchCollections = async() => {
            try {
                const collections_ = await getCollectionsWithQueryParams({creator: account.toLowerCase()})
                const collectionOptions_ = collections_.filter((item) => !!item.contract).map((item, index) => {
                    return {
                        label: item.name,
                        value: item
                    }
                })
                setCollectionOptions(collectionOptions_)
                setCollection(collectionOptions_.length > 0 ? collectionOptions_[0].value : null)
            } catch {
                setCollectionOptions([])
            } finally {
                setCollectionsLoaded(true)
            }
        }

        if (account) {
            fetchCollections()
        }
        
    }, [account, slowRefresh])

    const handleChangeMedia = useCallback(async (file: File) => {
        setAssetFile(file)
        if (file.type.includes('image')) {
            setAssetType(NFTAssetType.Image)
        } else if (file.type.includes('video')) {
            setAssetType(NFTAssetType.Video)
        } else {
            setAssetType(NFTAssetType.Audio)
        }
    }, [])

    const handleChangePreview = useCallback(async (file: File) => {
        setPreviewFile(file)
    }, [])

    const validateInputs = useCallback(() => {
        let valid = true
        const error: FormErrors = {}

        if (!name || name.length === 0) {
            error.name = t('Name is required')
            valid = false
        }
        
        if (externalLink && externalLink.length > 0 && urlReg.test(escapeRegExp(externalLink))) {
            error.externalLink = t('External link is invalid')
            valid = false
        }

        if (!collection) {
            error.collection = t('Collection is required')
            valid = false
        }

        if (assetType === NFTAssetType.Image) {
            if (!assetFile) {
                error.media = t('Image is required')
                valid = false
            }
        } else if (assetType === NFTAssetType.Video) {
            if (!previewFile) {
                error.media = t('Preview is required')
                valid = false
            }
            if (!assetFile) {
                error.media = t('Video is required')
                valid = false
            }
        } else {
            if (!previewFile) {
                error.media = t('Preview is required')
                valid = false
            }
            if (!assetFile) {
                error.media = t('Audio is required')
                valid = false
            }
        }

        if (!parseInt(supply)) {
            error.supply = t('Supply is invalid')
            valid = false
        }

        setFormError(error)
        return valid;
    }, [t, assetFile, previewFile, name, externalLink, assetType, collection, urlReg, supply])

    const handleCreate = useCallback(async () => {
        if (!validateInputs()) {
            return
        }

        try {
            setPendingTx(true)
            const name_ = name
            const assetType_ = assetType
            const collection_ = collection
            const supply_ = supply
            const properties: any[] = [
                ...textTraits.map((item) => {
                    return {
                        trait_type: item.trait_type,
                        value: item.value
                    }
                }),
                ...numberTraits.map((item) => {
                    const res: NFTTrait = {
                        trait_type: item.trait_type,
                        value: item.value * 1
                    }
                    if (item.max_value && item.max_value.length > 0) {
                        res.max_value = item.max_value * 1
                    }
                    return res
                })
            ]
            const {nftId, tokenUri, thumbnail} = await onMintNFT(
                collection_.contract, 
                parseInt(supply_),
                assetFile, 
                assetType_, 
                name_, 
                previewFile, 
                externalLink, 
                description,
                properties
            )
            const nft = await onRegisterNFT(
                name_, 
                collection_.id,
                collection_.contract,
                collection_.contractType,
                nftId,
                tokenUri,
                thumbnail,
                assetType_,
                parseInt(supply_),
                properties
            )
            history.push(`/nft/asset/${collection_.contract}/${nftId}`)
            
        } catch (err) {
            const error = err as any
            toastError(error?.message ? error.message : JSON.stringify(err))
        } finally {
            setPendingTx(false)
        }
    }, [toastError, validateInputs, onMintNFT, onRegisterNFT, collection, history, assetFile, assetType, name, previewFile, externalLink, description, supply, numberTraits, textTraits])

    const handleSaveTextTraits = async (traits) => {
        setTextTraits(traits)
    }

    const handleSaveNumberTraits = async (traits) => {
        setNumberTraits(traits)
    }

    const [onPresentTextTraitModal] = useModal(
        <TextTraitModal attributes={textTraits} onComplete={handleSaveTextTraits}/>
    )

    const [onPresentNumberTraitModal] = useModal(
        <NumberTraitModal attributes={numberTraits} onComplete={handleSaveNumberTraits}/>
    )
    
    if (loginStatus !== ProfileLoginStatus.LOGGEDIN) {
        return <AuthGuard/>
    }

    return (
        <>
        <PageBGWrapper/>
        <PageHeader>
            <Heading as="h1" scale="xl" color="white" style={{textShadow:"2px 3px rgba(255,255,255,0.2)"}}>
                {t('Create New Item')}
            </Heading>
        </PageHeader>
        <StyledPageBody flexDirection="column" flex="1">
            <Flex flexDirection="row" justifyContent="center" margin={["12px", "12px", "12px", "24px"]}>
                <Flex flexDirection="column" maxWidth="960px" width="100%">
                    <FieldGroup>
                        <Label required>{t('Image, Video, Audio')}</Label>
                        <LabelDesc>
                            {t("File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV, OGG. Max size: 100 MB")}
                        </LabelDesc>
                        <Flex>
                            <Upload onSelect={handleChangeMedia}/>
                        </Flex>
                            {formError.media && (<StyledErrorLabel>{formError.media}</StyledErrorLabel>)}
                    </FieldGroup>
                    { assetType !== NFTAssetType.Image && (
                        <FieldGroup>
                            <Label required>{t('Preview Image')}</Label>
                            <LabelDesc>
                                {t("Because you’ve included multimedia, you’ll need to provide an image (PNG, JPG, or GIF) for the card display of your item.")}
                            </LabelDesc>
                            <Flex>
                                <Upload onSelect={handleChangePreview}/>
                            </Flex>
                            {formError.preview && (<StyledErrorLabel>{formError.preview}</StyledErrorLabel>)}
                        </FieldGroup>
                    )}
                    <FieldGroup>
                        <Label required>{t('Name')}</Label>
                        <StyledTextInput 
                            placeholder={t('Item name')} 
                            value={name}
                            onUserInput={(val) => setName(val)}
                        />
                        {formError.name && (<StyledErrorLabel>{formError.name}</StyledErrorLabel>)}
                    </FieldGroup>
                    <FieldGroup>
                        <Label>{t('External link')}</Label>
                        <LabelDesc>
                            {t("We will include a link to this URL on this item's detail page, so that users can click to learn more about it. You are welcome to link to your own webpage with more details.")}
                        </LabelDesc>
                        <StyledURLInput 
                            placeholder={t('https://yoursite.io/item/123')} 
                            value={externalLink}
                            onUserInput={(val) => setExternalLink(val)}
                        />
                        {formError.externalLink && (<StyledErrorLabel>{formError.externalLink}</StyledErrorLabel>)}
                    </FieldGroup>

                    <FieldGroup>
                        <Label>{t('Description')}</Label>
                        <LabelDesc>
                            {t("The description will be included on the item's detail page underneath its image. Markdown syntax is supported.")}
                        </LabelDesc>
                        <StyledTextarea
                            value={description}
                            placeholder={t('Provide a detailed description of your item.')}
                            onUserInput={(val) => setDescription(val)}
                        />
                    </FieldGroup>

                    <FieldGroup>
                        <Label>{t('Collection')}</Label>
                        <LabelDesc>
                            {t("This is the collection where your item will appear. ")}
                        </LabelDesc>
                        <Select
                            width="auto"
                            options={collectionOptions}
                            onOptionChange={(option) => setCollection(option.value)}
                            defaultOptionIndex={0}
                            />
                        {formError.collection && (<StyledErrorLabel>{formError.collection}</StyledErrorLabel>)}
                    </FieldGroup>

                    <FieldGroup>
                        <Label>{t('Supply')}</Label>
                        <LabelDesc>
                            {t("The number of items that can be minted.")}
                        </LabelDesc>
                        <StyledIntegerInput
                            width="auto"
                            value={supply}
                            onUserInput={(val) => setSupply(val)}
                            />
                        {formError.supply && (<StyledErrorLabel>{formError.supply}</StyledErrorLabel>)}
                    </FieldGroup>

                    <FieldGroup>
                        <Flex justifyContent="space-between" alignItems="center" mb="8px">
                            <Flex flexDirection="column">
                                <Label>{t('Properties')}</Label>
                                <LabelDesc>
                                    {t("Textual traits that show up as rectangles")}
                                </LabelDesc>
                            </Flex>

                            <Button variant="secondary" color="secondary" style={{padding: "0px 12px"}} onClick={onPresentTextTraitModal}>
                                <AddIcon width="24px" color="primary"/>
                            </Button>
                        </Flex>
                        <Flex justifyContent="start" flexWrap="wrap">
                            {textTraits.map((trait) => {
                                return (
                                    <Flex marginRight="8px" marginBottom="4px" key={trait.id}>
                                        <TextTrait trait={trait}/>
                                    </Flex>
                                )
                            })}
                        </Flex>
                    </FieldGroup>

                    <FieldGroup>
                        <Flex justifyContent="space-between" alignItems="center" mb="8px">
                            <Flex flexDirection="column">
                                <Label>{t('Stats')}</Label>
                                <LabelDesc>
                                    {t("Numerical traits that show as numbers")}
                                </LabelDesc>
                            </Flex>

                            <Button variant="secondary" color="secondary" style={{padding: "0px 12px"}} onClick={onPresentNumberTraitModal}>
                                <AddIcon width="24px" color="primary"/>
                            </Button>
                        </Flex>
                        <Flex justifyContent="start" flexWrap="wrap">
                            {numberTraits.map((trait) => {
                                return (
                                    <Flex marginRight="8px" marginBottom="4px" key={trait.id}>
                                        <NumberTrait trait={trait}/>
                                    </Flex>
                                )
                            })}
                        </Flex>
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

export default CreateNFT