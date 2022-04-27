import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Flex } from '@pancakeswap/uikit'
import Container from 'components/Layout/Container'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { NFTAsset } from '../../hooks/types'

const Wrapper = styled.div`
    border-radius: ${({ theme }) => theme.radii.default};
    background: rgba(255, 255, 255, 0.2);
    padding: 12px 0px;
`


interface ImportBannerProps {
    asset?: NFTAsset
    account?: string
    onSell?: () => void
}

const ImportBanner: React.FC<ImportBannerProps> = ({asset, account, onSell}) => {

    const { t } = useTranslation()

    return (
        <Wrapper>
        <Container>
            <Flex justifyContent="end">
                {/* <Button mr="12px" onClick={onPresentAirdopNFTModal}>
                    {t('Airdrop')}
                </Button> */}
                <Button as={Link} to={`/nft/import/${asset.contractAddress}/${asset.tokenId}`}>
                    {t('Import NFT')}
                </Button>
            </Flex>
        </Container>
        </Wrapper>
    )
}

export default ImportBanner