import React from 'react'
import { useTranslation } from 'contexts/Localization'
import { format } from 'date-fns'
import styled from 'styled-components'
import { Flex, Heading, TwitterIcon, IconButton, GithubIcon, TelegramIcon, LanguageIcon, LinkExternal, useMatchBreakpoints, Skeleton } from '@pancakeswap/uikit'
import { getBscScanLink } from 'utils'
import truncateHash from 'utils/truncateHash'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { useToken } from 'hooks/Tokens'
import useTotalSupply from 'hooks/useTotalSupply'
import { InfoRow, InfoLabel, InfoValue } from './styled'
import { PublicSaleData } from '../../types'

const LogoWrapper = styled.div`
    width: 80px;
    height: 80px;
    > img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
`

export interface SaleBaseSectionProps {
    sale: PublicSaleData
}

const SaleBaseSection: React.FC<SaleBaseSectionProps> = ({sale}) => {

    const { t } = useTranslation()
    const { isMobile } = useMatchBreakpoints()
    const token = useToken(sale.token)
    const totalSupply = useTotalSupply(token)

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
                                {token ? token.name : ''} Presale
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
                            <LinkExternal href={getBscScanLink(sale.address, 'address')} fontSize="14px" style={{wordBreak:"break-all"}}>{ isMobile ?  truncateHash(sale.address) : sale.address }</LinkExternal>
                        </Flex>
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Presale Owner')}</InfoLabel>
                        <Flex alignItems="center">
                            <LinkExternal href={getBscScanLink(sale.owner, 'address')} fontSize="14px" style={{wordBreak:"break-all"}}>{ isMobile ?  truncateHash(sale.owner) : sale.owner }</LinkExternal>
                        </Flex>
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Token Name')}</InfoLabel>
                        { token ? (
                            <InfoValue>{token.name}</InfoValue>
                        ) : (
                            <Skeleton width="60px" height="30px"/>
                        )}
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Token Symobl')}</InfoLabel>
                        { token ? (
                            <InfoValue>{token.symbol}</InfoValue>
                        ) : (
                            <Skeleton width="40px" height="30px"/>
                        )}
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Token Decimals')}</InfoLabel>
                        { token ? (
                            <InfoValue>{token.decimals}</InfoValue>
                        ) : (
                            <Skeleton width="40px" height="30px"/>
                        )}
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Token Address')}</InfoLabel>
                        <LinkExternal href={getBscScanLink(sale.token, 'address')} fontSize="14px" style={{wordBreak:"break-all"}}>{ isMobile ?  truncateHash(sale.token) : sale.token }</LinkExternal>
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Total Supply')}</InfoLabel>
                        { totalSupply ? (
                            <InfoValue>{totalSupply.toExact()} {token.symbol}</InfoValue>
                        ) : (
                            <Skeleton width="60px" height="30px"/>
                        )}
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Presale Rate')}</InfoLabel>
                        <InfoValue>1 CRO = {sale.rate.toJSON()} {token ? token.symbol : ''}</InfoValue>
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Soft Cap')}</InfoLabel>
                        <InfoValue>{getFullDisplayBalance(sale.goal)} CRO</InfoValue>
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Hard Cap')}</InfoLabel>
                        <InfoValue>{getFullDisplayBalance(sale.cap)} CRO</InfoValue>
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Unsold Tokens')}</InfoLabel>
                        <InfoValue>Burn</InfoValue>
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Presale Start Time')}</InfoLabel>
                        <InfoValue>{ format(sale.openingTime * 1000, 'yyyy/MM/dd hh:mm aa')}</InfoValue>
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Presale End Time')}</InfoLabel>
                        <InfoValue>{ format(sale.closingTime * 1000, 'yyyy/MM/dd hh:mm aa')}</InfoValue>
                    </InfoRow>
                </Flex>
            </Flex>
        </>
    )
}

export default SaleBaseSection