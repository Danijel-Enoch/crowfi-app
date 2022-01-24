import React from 'react'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { Flex, Heading, TwitterIcon, IconButton, GithubIcon, TelegramIcon, LanguageIcon, LinkExternal, useMatchBreakpoints } from '@pancakeswap/uikit'
import { getBscScanLink } from 'utils'
import truncateHash from 'utils/truncateHash'
import { InfoRow, InfoLabel, InfoValue } from './styled'

const LogoWrapper = styled.div`
    width: 80px;
    height: 80px;
    > img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
`

const SaleBaseSection: React.FC = () => {

    const { t } = useTranslation()
    const { isMobile } = useMatchBreakpoints()
    const address = '0x852c75bd104b928BBF54e6Ab94F274B9F8Fa6536'

    return (
        <>
            <Flex flexDirection="column" width="100%">
                <Flex justifyContent="space-between">
                    <Flex alignItems="center">
                        <LogoWrapper>
                            <img src='/logo.png' alt={t('Crow Logo')} />
                        </LogoWrapper>
                        <Flex flexDirection="column">
                            <Heading>
                                VitCoin Presale
                            </Heading>
                            <Flex flexDirection="row">
                                <IconButton variant="text" scale="sm" disabled mr="8px">
                                    <LanguageIcon width="12px" />
                                </IconButton>
                                <IconButton variant="text" scale="sm" disabled mr="8px">
                                    <GithubIcon width="12px" />
                                </IconButton>
                                <IconButton variant="text" scale="sm" disabled mr="8px">
                                    <TwitterIcon width="12px" />
                                </IconButton>
                                <IconButton variant="text" scale="sm" disabled mr="8px">
                                    <TelegramIcon width="12px" />
                                </IconButton>
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>
                <Flex flexDirection="column">
                    <InfoRow>
                        <InfoLabel>{t('Presale Address')}</InfoLabel>
                        <Flex alignItems="center">
                            <LinkExternal href={getBscScanLink(address, 'address')} fontSize="14px" style={{wordBreak:"break-all"}}>{ isMobile ?  truncateHash(address) : address }</LinkExternal>
                        </Flex>
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Token Name')}</InfoLabel>
                        <InfoValue>VitCoin</InfoValue>
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Token Symobl')}</InfoLabel>
                        <InfoValue>VTC</InfoValue>
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Token Decimals')}</InfoLabel>
                        <InfoValue>18</InfoValue>
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Token Address')}</InfoLabel>
                        <LinkExternal href={getBscScanLink(address, 'address')} fontSize="14px" style={{wordBreak:"break-all"}}>{ isMobile ?  truncateHash(address) : address }</LinkExternal>
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Total Supply')}</InfoLabel>
                        <InfoValue>21,000.00 VTC</InfoValue>
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Tokens for Presale')}</InfoLabel>
                        <InfoValue>12,500.00 VTC</InfoValue>
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Tokens for Liquidity')}</InfoLabel>
                        <InfoValue>6,900.00 VTC</InfoValue>
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Presale Rate')}</InfoLabel>
                        <InfoValue>1 CRO = 625.00 VTC</InfoValue>
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Listing Rate')}</InfoLabel>
                        <InfoValue>1 CRO = 575.00 VTC</InfoValue>
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Initial Market Cap(estimate)')}</InfoLabel>
                        <InfoValue>$12,686</InfoValue>
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Soft Cap')}</InfoLabel>
                        <InfoValue>10 CRO</InfoValue>
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Hard Cap')}</InfoLabel>
                        <InfoValue>20 CRO</InfoValue>
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Unsold Tokens')}</InfoLabel>
                        <InfoValue>Burn</InfoValue>
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Presale Start Time')}</InfoLabel>
                        <InfoValue>2022/01/22 18:00</InfoValue>
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Presale End Time')}</InfoLabel>
                        <InfoValue>2022/01/22 18:00</InfoValue>
                    </InfoRow>
                </Flex>
            </Flex>
        </>
    )
}

export default SaleBaseSection