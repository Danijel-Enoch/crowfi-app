import React from 'react'
import { Button, Flex, useModal } from '@pancakeswap/uikit'
import Container from 'components/Layout/Container'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { NFTResponse } from '../../hooks/types'
import SellNFTModal from '../../components/SellNFTModal'
import TransferNFTModal from '../../components/TransferNFTModal'

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

    const [onPresentSellNFTModal] = useModal(
      <SellNFTModal nft={nft} account={account} onComplete={onSell} available={balance}/>
    )

    const [onPresentTransferNFTModal] = useModal(
      <TransferNFTModal nft={nft} account={account} onComplete={onSell} available={balance}/>
    )

    return (
        <Wrapper>
        <Container>
            <Flex justifyContent="end">
                <Button mr="12px" onClick={onPresentTransferNFTModal}>
                    {t('Transfer')}
                </Button>
                <Button onClick={onPresentSellNFTModal}>
                    {t('Sell')}
                </Button>
            </Flex>
        </Container>
        </Wrapper>
    )
}

export default OwnerBanner