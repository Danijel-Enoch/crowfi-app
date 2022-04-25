import React, { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Heading, Flex, Text, Button, AddIcon, useModal } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import { PageBGWrapper, StyledInput, StyledInputLabel, StyledIntegerInput, StyledText, StyledTextarea, StyledTextInput, StyledURLInput } from 'components/Launchpad/StyledControls'
import styled from 'styled-components'
import { NFTAssetType, ProfileLoginStatus } from 'state/types'
import PageHeader from 'components/PageHeader'
import Upload from 'components/Upload'
import useRefresh from 'hooks/useRefresh'
import Dots from 'components/Loader/Dots'
import useToast from 'hooks/useToast'
import { useProfileLoggedIn } from 'state/profile/hooks'
import AuthGuard from '../Auth'
import { useMintBundle } from '../../hooks/useCreateBundle'
import { NFTAsset, NFTResponse } from '../../hooks/types'
import SelectNFTModal from '../../components/SelectNFTModal'
import { useFetchUserNfts } from '../../hooks/useProfile'
import NFTItem from './NFTItem'

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

const NFTWrapper = styled(Flex)`
    flex: 1;
    width: 33%;
    max-width: 33%;
    padding: 8px;

`
/* eslint-disable camelcase */
interface Trait {
    trait_type: string
    value: any
    max_value?: any
}

interface NFTSelection {
    nft: NFTResponse
    amount: number
}

interface FormErrors {
    thumbnail?: string,
    name?: string,
    collection?: string
    externalLink?: string
    supply?: string
}

const CreateBundle: React.FC = () => {
    const urlReg = RegExp('^(http|https)\\://(www.)?[a-zA-Z0-9@:%._\\+~#?&//=]{1,256}.[a-z]{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)$')
    const history = useHistory()
    const { t } = useTranslation()
    const { account } = useWeb3React()
    const { toastError, toastSuccess } = useToast()
    const {loginStatus} = useProfileLoggedIn()
    const [pendingTx, setPendingTx] = useState(false)
    const [formError, setFormError] = useState<FormErrors>({})
    const [thumbnailFile, setThumbnailFile] = useState(null)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [selectedNFTs, setSelectedNFTs] = useState<NFTSelection[]>([])
    const [nfts, setNFTs] = useState<NFTResponse[]>([])
    const [nftsLoaded, setNFTsLoaded] = useState(false)
    const { slowRefresh } = useRefresh()

    const {onFetchNftsCollected} = useFetchUserNfts(account)
    const {onMintBundle} = useMintBundle(account)

    useEffect(() => {
        const fetchCollections = async() => {
            try {
                const asses_ = await onFetchNftsCollected()
                setNFTs(asses_)
            } catch (e) {
                setNFTs([])
            } finally {
                setNFTsLoaded(true)
            }
        }
            
        fetchCollections()
        
    }, [slowRefresh, onFetchNftsCollected])

    const handleChangeThumbnail = useCallback(async (file: File) => {
        setThumbnailFile(file)
    }, [])

    const validateInputs = useCallback(() => {
        let valid = true
        const error: FormErrors = {}

        if (!name || name.length === 0) {
            error.name = t('Name is required')
            valid = false
        }
        if (!thumbnailFile) {
            error.thumbnail = t('Thumbnail is required')
            valid = false
        }

        if (selectedNFTs.length === 0) {
            valid = false
        }

        setFormError(error)
        return valid;
    }, [t, thumbnailFile, name, selectedNFTs])

    const onSelectNFT = (nft: NFTResponse, amount: number) => {
        const newSelection = [...selectedNFTs]
        let found = false
        for (let i = 0; i < selectedNFTs.length; i ++) {
            if (selectedNFTs[i].nft.id === nft.id) {
                newSelection[i] = {
                    nft,
                    amount
                }
                found = true
                break
            }
        }
        if (!found) {
            newSelection.push({
                nft, amount
            })
        }
        
        setSelectedNFTs(newSelection)
    }

    const handleCreate = useCallback(async () => {
        if (!validateInputs()) {
            return
        }

        try {
            setPendingTx(true)
            const name_ = name
            const assetType_ = NFTAssetType.Image
            const collection_ = null
            const properties: any[] = []
            const {contractAddress, nftId, tokenUri, thumbnail} = await onMintBundle(
                selectedNFTs.map((item) => item.nft.contractAddress),
                selectedNFTs.map((item) => item.nft.contractType),
                selectedNFTs.map((item) => item.nft.tokenId),
                selectedNFTs.map((item) => item.amount),
                thumbnailFile, 
                assetType_, 
                name_, 
                thumbnailFile, 
                description,
                properties
            )
            history.push(`/nft/asset/${contractAddress}/${nftId}`)
            
        } catch (err) {
            const error = err as any
            toastError(error?.message ? error.message : JSON.stringify(err))
        } finally {
            setPendingTx(false)
        }
    }, [toastError, validateInputs, onMintBundle, history, name, thumbnailFile, description, selectedNFTs])

    const [onPresentSelectNFTModal] = useModal(
        <SelectNFTModal nfts={nfts} onConfirm={onSelectNFT} account={account}/>
    )
    
    if (loginStatus !== ProfileLoginStatus.LOGGEDIN) {
        return <AuthGuard/>
    }

    return (
        <>
        <PageBGWrapper/>
        <PageHeader>
            <Heading as="h1" scale="xl" color="white" style={{textShadow:"2px 3px rgba(255,255,255,0.2)"}}>
                {t('Create Bundle')}
            </Heading>
        </PageHeader>
        <StyledPageBody flexDirection="column" flex="1">
            <Flex flexDirection="row" justifyContent="center" margin={["12px", "12px", "12px", "24px"]}>
                <Flex flexDirection={["column", null, null, "row"]}  maxWidth="1200px" width="100%">
                    <Flex 
                        flexDirection="column"
                        flex="1" 
                        marginRight={[null, null, null, "16px"]} 
                        marginTop={["16px", null, null]}
                    >
                        <FieldGroup>
                            <Label required>{t('Thubmnail Image')}</Label>
                            <LabelDesc>
                                {t("Please provide an thumbnail image (PNG, JPG, or GIF) for this this bundle.")}
                            </LabelDesc>
                            <Flex>
                                <Upload onSelect={handleChangeThumbnail}/>
                            </Flex>
                            {formError.thumbnail && (<StyledErrorLabel>{formError.thumbnail}</StyledErrorLabel>)}
                        </FieldGroup>
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
                        <Flex>
                            <Button
                                disabled={pendingTx || selectedNFTs.length === 0}
                                onClick={handleCreate}
                            >
                                {pendingTx ? (<Dots>{t('Processing')}</Dots>) : t('Create')}
                            </Button>
                        </Flex>
                    </Flex>
                    <Flex 
                        flexDirection="column"
                        flex="1" 
                        marginRight={[null, null, null, "16px"]} 
                        marginTop={["16px", null, null]}
                    >
                        <Flex justifyContent="space-between">
                            <Text>{t('Selected NFTs')}</Text>
                            <Button variant="secondary" color="secondary" style={{padding: "0px 12px"}} onClick={onPresentSelectNFTModal}>
                                <AddIcon width="24px" color="primary"/>
                            </Button>
                        </Flex>
                        
                        <Flex flexWrap="wrap">
                            {selectedNFTs.length > 0 ? (
                                <>
                                {selectedNFTs.map((item) => {
                                    return (
                                        <NFTWrapper>
                                            <NFTItem asset={item.nft} amount={item.amount}/>
                                        </NFTWrapper>
                                    )
                                })}
                                </>
                            ): (
                                <Text>{t('No items selected')}</Text>
                            )}
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </StyledPageBody>
        </>
    )
}

export default CreateBundle