import React, { useCallback, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Heading, Flex, Text, Button, AddIcon, useModal, CheckmarkIcon } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { escapeRegExp } from 'lodash'
import { useTranslation } from 'contexts/Localization'
import { PageBGWrapper, StyledAddressInput, StyledInput, StyledInputLabel, StyledIntegerInput, StyledText, StyledTextarea, StyledTextInput, StyledURLInput } from 'components/Launchpad/StyledControls'
import styled from 'styled-components'
import { NFTAssetType, ProfileLoginStatus } from 'state/types'
import Select from 'components/Select/Select'
import PageHeader from 'components/PageHeader'
import useRefresh from 'hooks/useRefresh'
import Dots from 'components/Loader/Dots'
import InputGroupWithPrefix from 'components/Input/InputGroupWithPrefix'
import Loading from 'components/Loading'
import useToast from 'hooks/useToast'
import { useProfileLoggedIn } from 'state/profile/hooks'
import { isAddress } from 'utils'
import AuthGuard from '../Auth'
import { NFTAsset, NFTCollection, NFTMeta, NFTTrait } from '../../hooks/types'
import { getCollectionsWithQueryParams } from '../../hooks/useCollections'
import { useRegisterNFT } from '../../hooks/useCreateNFT'
import { useGetNFT, useGetNFTBalance } from '../../hooks/useGetNFT'
import NFTMetaPreview from './NFTMetaPreview'
import NFTAssetInfo from './NFTAssetInfo'
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
    contractAddress?: string
    tokenId?: string
    collection?: string
}

const ImportNFT: React.FC = () => {
    const urlReg = RegExp('^(http|https)\\://(www.)?[a-zA-Z0-9@:%._\\+~#?&//=]{1,256}.[a-z]{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)$')

    const { address: paramAddress, assetId: paramTokenId } = useParams<{ address?: string, assetId?: string }>()
    const history = useHistory()
    const { t } = useTranslation()
    const { account } = useWeb3React()
    const { toastError, toastSuccess } = useToast()
    const {loginStatus} = useProfileLoggedIn()
    const [pendingTx, setPendingTx] = useState(false)
    const [formError, setFormError] = useState<FormErrors>({})
    const [assetLoading, setAssetLoading] = useState(0)
    const [asset, setAsset] = useState<NFTAsset>(null)
    const [meta, setMeta] = useState<NFTMeta>(null)
    const [balance, setBalance] = useState(0)
    const [contractAddress, setContractAddress] = useState(paramAddress)
    const [tokenId, setTokenId] = useState(paramTokenId)
    const validAddress = isAddress(contractAddress)
    const [collection, setCollection] = useState<NFTCollection>(null)
    const [collectionsLoaded, setCollectionsLoaded] = useState(false)
    const [noCollectionModalPresented, setNoCollectionModalPresented] = useState(false)
    const [collectionOptions, setCollectionOptions] = useState([])
    const { slowRefresh } = useRefresh()

    const {onGetNFTBalance} = useGetNFTBalance()
    const {onGetNFT} = useGetNFT()
    const {onRegisterNFT} = useRegisterNFT()

    const [onPresentNoCollectionModal] = useModal(
        <NoCollectionModal 
        title={t('Import NFT')}
        onAgree={() => {
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
        const fetchNFTMeta = async() => {
            try {
                setAssetLoading((currentLoading) => {
                    return currentLoading + 1
                })
                const {asset: asset_, meta: meta_} = await onGetNFT(validAddress as string, tokenId)
                setAsset(asset_)
                setMeta(meta_)
            } catch {
                setAsset(null)
                setMeta(null)
            } finally {
                setAssetLoading((currentLoading) => {
                    return currentLoading - 1
                })
            }
            
        }

        if (validAddress && tokenId && tokenId.length > 0) {
            fetchNFTMeta()
        }
    }, [validAddress, tokenId, onGetNFT])



    useEffect(() => {

        const fetchNftBalnace = async () => {
            try {
                const balance_ = await onGetNFTBalance(asset.contractAddress, asset.tokenId, asset.contractType, account)
                setBalance(balance_)
            } catch {
                setBalance(0)
            }
        }

        if (account && asset) {
            fetchNftBalnace()
        }
        
    }, [account, slowRefresh, onGetNFTBalance, asset])

    useEffect(() => {
        const fetchCollections = async() => {
            try {
                const collections_ = await getCollectionsWithQueryParams({creator: account.toLowerCase()})
                const collectionOptions_ = collections_.map((item, index) => {
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


    const assetLoadingIcon = () => {
        if (assetLoading > 0) {
            return (
            <Loading/>
            )
        }

        if (meta && asset) {
            return (
                <CheckmarkIcon width="18x" height="18px" color="primary"/>
            )
        }
        return undefined
    }

    const validateInputs = useCallback(() => {
        let valid = true
        const error: FormErrors = {}

        if (!tokenId || tokenId.length === 0) {
            error.tokenId = t('Token ID is required')
            valid = false
        }

        if (!contractAddress || contractAddress.length === 0) {
            error.contractAddress = t('Contract address is required')
            valid = false
        } else if(!validAddress) {
            error.contractAddress = t('Contract address is invalid')
            valid = false
        }

        if (valid && !asset || !meta) {
            error.contractAddress = t('Contract address is invalid')
            error.tokenId = t('Token ID is invalid')
        }

        if (!collection) {
            error.collection = t('Collection is required')
            valid = false
        }

        if (balance < 0) {
            valid = false
            error.contractAddress = t('Balance is zero')
        }

        setFormError(error)
        return valid;
    }, [t, tokenId, validAddress, contractAddress,asset, meta, balance, collection])

    const handleImport = useCallback(async () => {
        if (!validateInputs()) {
            return
        }

        try {
            setPendingTx(true)
            const nft = await onRegisterNFT(
                meta.name, 
                collection.id,
                asset.contractAddress,
                asset.contractType,
                asset.tokenId,
                asset.tokenUri,
                meta.image,
                meta.properties?.type ?? NFTAssetType.Image,
                balance,
                meta.attributes
            )
            history.push(`/nft/asset/${asset.contractAddress}/${asset.tokenId}`)
            
        } catch (err) {
            const error = err as any
            toastError(error?.message ? error.message : JSON.stringify(err))
        } finally {
            setPendingTx(false)
        }
    }, [toastError, validateInputs, onRegisterNFT, collection, history, asset, meta, balance])
    
    if (loginStatus !== ProfileLoginStatus.LOGGEDIN) {
        return <AuthGuard/>
    }

    return (
        <>
        <PageBGWrapper/>
        <PageHeader>
            <Heading as="h1" scale="xl" color="white" style={{textShadow:"2px 3px rgba(255,255,255,0.2)"}}>
                {t('Import NFT')}
            </Heading>
        </PageHeader>
        <StyledPageBody flexDirection="column" flex="1">
            <Flex flexDirection="row" justifyContent="center" margin={["12px", "12px", "12px", "24px"]}>
                <Flex flexDirection={["column", null, null, "row"]} maxWidth="1200px" width="100%">
                    <Flex 
                        flexDirection="column"
                        flex="1" 
                        marginRight={[null, null, null, "16px"]} 
                        marginTop={["16px", null, null]}
                    >
                        <NFTAssetInfo asset={asset} balance={balance} mb="8px"/>
                        <NFTMetaPreview meta={meta}/>
                    </Flex>
                    <Flex flex="1" flexDirection="column">
                        <FieldGroup>
                            <Label required>{t('Contract Address')}</Label>
                            <InputGroupWithPrefix
                                endIcon={assetLoadingIcon()}
                                >
                                <StyledAddressInput 
                                    placeholder={t('Contract Address')} 
                                    value={contractAddress}
                                    onUserInput={(val) => setContractAddress(val)}
                                />
                            </InputGroupWithPrefix>
                            {formError.contractAddress && (<StyledErrorLabel>{formError.contractAddress}</StyledErrorLabel>)}
                        </FieldGroup>
                        <FieldGroup>
                            <Label required>{t('Token ID')}</Label>
                            <InputGroupWithPrefix
                                endIcon={assetLoadingIcon()}
                                >
                                <StyledIntegerInput 
                                    placeholder={t('Token ID')} 
                                    value={tokenId}
                                    onUserInput={(val) => setTokenId(val)}
                                />
                            </InputGroupWithPrefix>
                            {formError.tokenId && (<StyledErrorLabel>{formError.tokenId}</StyledErrorLabel>)}
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

                        <Flex>
                            <Button
                                disabled={pendingTx || assetLoading > 0}
                                onClick={handleImport}
                            >
                                {pendingTx ? (<Dots>{t('Processing')}</Dots>) : t('Import')}
                            </Button>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </StyledPageBody>
        </>
    )
}

export default ImportNFT