import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { Button, Modal, Heading, Flex, Text, InjectedModalProps, ModalHeader, ModalTitle, ModalCloseButton, ModalContainer, ModalBody, ModalBackButton } from '@pancakeswap/uikit'
import useToast from 'hooks/useToast'
import { ApprovalState, useNFTApproveCallback } from 'hooks/useNFTApproveCallback'
import { useTranslation } from 'contexts/Localization'
import { ModalActions } from 'components/Modal'
import { StyledIntegerInput } from 'components/Launchpad/StyledControls'
import Dots from 'components/Loader/Dots'
import Select from 'components/Select/Select'
import Loading from 'components/Loading'
import { getNFTBundleAddress } from 'utils/addressHelpers'
import { Bundle, NFTAsset, NFTResponse } from '../../hooks/types'
import NFTInfoSection from '../SellNFTModal/NFTInfoSection'
import { useGetBundles } from '../../hooks/useBundle'
import { useGetNFTBalance } from '../../hooks/useGetNFT'
import { useAddNftToBundle } from '../../hooks/useCreateBundle'

const StyledModalContainer = styled(ModalContainer)`
  max-width: 420px;
  width: 100%;
`
const StyledModalBody = styled(ModalBody)`
  padding: 24px;
  overflow-y: scroll;
  max-height: calc(min(80vh, 400px));
`

interface AddToBundleModalProps {
    nft: NFTAsset|NFTResponse
    account: string
    balance: number
    onGoPath: (path) => void
}

const AddToBundleModal: React.FC<InjectedModalProps & AddToBundleModalProps> = ({nft, balance, account, onGoPath, onDismiss}) => {

    const { t } = useTranslation()
    const { toastError, toastSuccess } = useToast()
    const [pendingTx, setPendingTx] = useState(false)
    const [added, setAdded] = useState(false)
    const [approval, approveCallback]  = useNFTApproveCallback(nft.contractAddress , getNFTBundleAddress())
    const [maxAmount, setMaxAmount] = useState(balance)
    const [maxAmountLoading, setMaxAmountLoading] = useState(false)
    const [bundleOptions, setBundleOptions] = useState([])
    const [selectedBundle, setSelectedBundle] = useState<Bundle>(null)
    const [bundleLoading, setBundleLoading] = useState(false)
    const [amount, setAmount] = useState('1')
    const {onGetBundles} = useGetBundles()
    const {onGetNFTBalance} = useGetNFTBalance()
    const {onAddNftToBundle} = useAddNftToBundle()

    const isInputValid = useMemo(() => {
      return maxAmount && parseInt(amount) > 0 && parseInt(amount) <= maxAmount && !!selectedBundle && !maxAmountLoading && !bundleLoading
    }, [maxAmount, amount, selectedBundle, maxAmountLoading, bundleLoading])

    const loadBundles = useCallback(async () => {
        try {
            setBundleLoading(true)
            const bundles_ = await onGetBundles(account)
            setBundleOptions(bundles_.map((bundle) => {
                return {
                    label: `${bundle.meta.name} #${bundle.asset.tokenId}`,
                    value: bundle
                }
            }))
            if (bundles_.length > 0) {
                setSelectedBundle(bundles_[0])
            }
        } catch {
            setBundleOptions([])
            setSelectedBundle(null)
        } finally {
            setBundleLoading(false)
        }
    }, [account, onGetBundles])

    const loadNFTBalance = useCallback(async () => {
        try {
            setMaxAmountLoading(true)
            const maxAmount_ = await onGetNFTBalance(nft.contractAddress, nft.tokenId, nft.contractType, account)
            setMaxAmount(maxAmount_)
        } catch {
            setMaxAmount(0)
        } finally {
            setMaxAmountLoading(false)
        }
    }, [account, nft, onGetNFTBalance])

    useEffect(() => {
        if (account) {
            loadBundles()
            loadNFTBalance()
        }
    }, [account, loadBundles, loadNFTBalance])

    const handleAdd = useCallback(async () => {

        try {
            setPendingTx(true)
            await onAddNftToBundle(selectedBundle.asset.contractAddress, selectedBundle.asset.tokenId, nft.contractAddress, nft.contractType, nft.tokenId, amount)
            loadNFTBalance();
            setAdded(true)
            toastSuccess(t('Success'), t('NFT token has been added to the selected bundle.'))
        } catch (e) {
            const error = e as any
            const msg = error?.data?.message ?? error?.message ?? t('Please try again. Confirm the transaction and make sure you are paying enough gas!')
            toastError(
                t('Error'),
                msg,
            )
        } finally {
            setPendingTx(false)
        }

    }, [toastSuccess, toastError, t, amount, selectedBundle, nft, loadNFTBalance, onAddNftToBundle])

    const handleCreateBundle = () => {
        onGoPath('/nft/create-bundle')
        onDismiss()
    }

    const handleViewbundle = () => {
        onGoPath(`/nft/asset/${selectedBundle.asset.contractAddress.toLowerCase()}/${selectedBundle.asset.tokenId}`)
        onDismiss()
    }

    const renderApprovalOrSelectButton = () => {
        return added ? (
            <>
            <Button scale="md" variant="primary" onClick={handleViewbundle} width="100%">
                {t('View Bundle')}
            </Button>
            </>
        ) : account && approval === ApprovalState.APPROVED ? (
        <Button
            disabled={!isInputValid || pendingTx}
            scale="md" variant="primary" width="100%"
            onClick={handleAdd}
        >
            {pendingTx ? (<Dots>{t('Adding')}</Dots>) : t('Add')}
        </Button>
        ) : (
        <Button scale="md" variant="primary" width="100%" disabled={approval === ApprovalState.PENDING || approval === ApprovalState.UNKNOWN} onClick={approveCallback}>
            {approval === ApprovalState.PENDING ? (<Dots>{t('Approving')}</Dots>) : t('Approve')}
        </Button>
        )
    }
    return (
        <StyledModalContainer minWidth="320px">
            <ModalHeader>
                <ModalTitle>
                <Heading>{t('Sell as Bundle')}</Heading>
                </ModalTitle>
                <ModalCloseButton onDismiss={onDismiss} />
            </ModalHeader>
            
            <StyledModalBody>
                <NFTInfoSection nft={nft} available={maxAmount} availableLoading={maxAmountLoading}/>

                <Flex  margin="8px 0px" flexDirection="column">
                    <Text fontSize='14px'>
                    {t('Select a Bundle:')}
                    </Text>
                    <Flex alignItems="center">
                        <Select
                            width="auto"
                            options={bundleOptions}
                            onOptionChange={(option) => setSelectedBundle(option.value)}
                            defaultOptionIndex={0}
                            />
                        { bundleLoading && (
                            <Loading/>
                        )}
                    </Flex>

                </Flex>
                <Flex  margin="8px 0px" flexDirection="column">
                    <Text fontSize='14px'>
                    {t('Amount To Add:')}
                    </Text>
                    <StyledIntegerInput
                    value={amount}
                    onUserInput={(value) => setAmount(value)}
                    />
                </Flex>
                <ModalActions>
                    <Button scale="md" variant="secondary" onClick={onDismiss} width="100%">
                        {t('Cancel')}
                    </Button>
                    <Button scale="md" variant="secondary" onClick={handleCreateBundle} width="100%">
                        {t('New Bundle')}
                    </Button>
                    {renderApprovalOrSelectButton()}
                </ModalActions>
            </StyledModalBody>
        </StyledModalContainer>
    )
}

export default AddToBundleModal