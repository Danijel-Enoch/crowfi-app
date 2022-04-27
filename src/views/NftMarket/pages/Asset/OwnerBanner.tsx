import React, { useMemo } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Button, Flex, useModal } from '@pancakeswap/uikit'
import Container from 'components/Layout/Container'
import styled from 'styled-components'
import { NFTContractType } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import { NFTResponse } from '../../hooks/types'
import SellNFTModal from '../../components/SellNFTModal'
import TransferNFTModal from '../../components/TransferNFTModal'
import AirdropNFTModal from '../../components/AirdropNFTModal'
import AddToBundleModal from '../../components/AddToBundleModal'
import UnpackModal from '../../components/UnpackModal'
import OfferNFTModal from '../../components/OfferNFTModal'

const Wrapper = styled.div`
    border-radius: ${({ theme }) => theme.radii.default};
    background: rgba(255, 255, 255, 0.2);
    padding: 12px 0px;
`


interface OwnerBannerProps {
    nft?: NFTResponse
    account?: string
    balance: number
    onSell: () => void
}

const OwnerBanner: React.FC<OwnerBannerProps> = ({nft, account, balance, onSell}) => {

    const { t } = useTranslation()
    const history = useHistory()

    const onGoPath = (path) => {
        history.push(path)
    }

    const [onPresentUnpackModal] = useModal(
      <UnpackModal bundle={nft} account={account} onGoPath={onGoPath}/>
    )

    const [onPresentAddToBundleModal] = useModal(
      <AddToBundleModal nft={nft} account={account} balance={balance} onGoPath={onGoPath}/>
    )

    const [onPresentSellNFTModal] = useModal(
      <SellNFTModal nft={nft} account={account} onComplete={onSell} available={balance}/>
    )

    const [onPresentTransferNFTModal] = useModal(
      <TransferNFTModal nft={nft} account={account} onComplete={onSell} available={balance}/>
    )

    const [onPresentOfferNFTModal] = useModal(
        <OfferNFTModal nft={nft} account={account} onComplete={onSell} available={balance}/>
    )

    const [onPresentAirdopNFTModal] = useModal(
      <AirdropNFTModal nft={nft} account={account} onComplete={onSell} available={balance}/>
    )

    return (
        <Wrapper>
        <Container>
            <Flex justifyContent="end">
                {/* <Button mr="12px" onClick={onPresentAirdopNFTModal}>
                    {t('Airdrop')}
                </Button> */}
                <Button mx="6px" onClick={onPresentTransferNFTModal}>
                    {t('Transfer')}
                </Button>
                <Button mx="6px" onClick={onPresentSellNFTModal}>
                    {t('Sell')}
                </Button>
                { nft.contractType === NFTContractType.BUNDLE ? (
                    <Button mx="6px" onClick={onPresentUnpackModal}>
                        {t('Unpack')}
                    </Button>
                ) : (
                    <Button mx="6px" onClick={onPresentAddToBundleModal}>
                        {t('Sell as Bundle')}
                    </Button>
                )}
            </Flex>
        </Container>
        </Wrapper>
    )
}

export default OwnerBanner