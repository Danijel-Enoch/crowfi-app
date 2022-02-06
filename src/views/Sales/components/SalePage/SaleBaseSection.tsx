import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'contexts/Localization'
import { format } from 'date-fns'
import styled from 'styled-components'
import { Flex, Text, Button, Heading, TwitterIcon, IconButton, GithubIcon, TelegramIcon, LanguageIcon, LinkExternal, useMatchBreakpoints, Skeleton, PencilIcon, RedditIcon, DiscordIcon, InstagramIcon, FacebookIcon } from '@pancakeswap/uikit'
import TokenAddress from 'components/TokenAddress'
import { getBscScanLink } from 'utils'
import { BIG_TEN } from 'utils/bigNumber'
import truncateHash from 'utils/truncateHash'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { useToken } from 'hooks/Tokens'
import useTotalSupply from 'hooks/useTotalSupply'
import { InfoRow, InfoLabel, InfoValue } from './styled'
import { PublicSaleData } from '../../types'

const LogoWrapper = styled.div`
    width: 80px;
    height: 80px;
    margin-right: 16px;
    > img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
`

const StyledIconButton = styled(IconButton)`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 32px;
    background: ${({ theme }) => theme.colors.backgroundAlt2};
    border-radius: 12px;
    margin-right: 8px;
`

export interface SaleBaseSectionProps {
    account?: string
    sale: PublicSaleData
    onEditMeta?: () => void
}

const SaleBaseSection: React.FC<SaleBaseSectionProps> = ({account, sale, onEditMeta}) => {

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
                            { sale.logo && sale.logo.length > 0 ? (
                                <img src={sale.logo} alt={t('Logo')} />
                            ) : (
                                <img src='/logo.png' alt={t('Crow Logo')} />
                            )}
                        </LogoWrapper>
                        <Flex flexDirection="column">
                            <Flex alignItems="center">
                            <Heading>
                                {token ? token.name : ''} Presale
                            </Heading>
                            { account === sale.owner && (
                            <IconButton onClick={onEditMeta} variant="text" scale="sm">
                                <PencilIcon width="16px" height="16px"/>
                            </IconButton>
                            )}
                            </Flex>
                            <Flex flexDirection="row">
                                { sale.meta && sale.meta.website && (
                                    <StyledIconButton variant="primary" scale="sm" as="a" href={sale.meta.website}>
                                        <LanguageIcon width="16px" color="primary" />
                                    </StyledIconButton>
                                )}
                                { sale.meta && sale.meta.facebook && (
                                    <StyledIconButton variant="primary" scale="sm" as="a" href={sale.meta.facebook}>
                                        <FacebookIcon width="16px" color="primary" />
                                    </StyledIconButton>
                                )}
                                { sale.meta && sale.meta.twitter && (
                                    <StyledIconButton variant="primary" scale="sm" as="a" href={sale.meta.twitter}>
                                        <TwitterIcon width="16px" color="primary" />
                                    </StyledIconButton>
                                )}
                                { sale.meta && sale.meta.instagram && (
                                    <StyledIconButton variant="primary" scale="sm" as="a" href={sale.meta.instagram}>
                                        <InstagramIcon width="16px" color="primary" />
                                    </StyledIconButton>
                                )}
                                { sale.meta && sale.meta.telegram && (
                                    <StyledIconButton variant="primary" scale="sm" as="a" href={sale.meta.telegram}>
                                        <TelegramIcon width="16px" color="primary" />
                                    </StyledIconButton>
                                )}
                                { sale.meta && sale.meta.discord && (
                                    <StyledIconButton variant="primary" scale="sm" as="a" href={sale.meta.discord}>
                                        <DiscordIcon width="16px" color="primary" />
                                    </StyledIconButton>
                                )}
                                { sale.meta && sale.meta.github && (
                                    <StyledIconButton variant="primary" scale="sm" as="a" href={sale.meta.github}>
                                        <GithubIcon width="16px" color="primary" />
                                    </StyledIconButton>
                                )}
                                { sale.meta && sale.meta.reddit && (
                                    <StyledIconButton variant="primary" scale="sm" mr="8px" as="a" href={sale.meta.reddit}>
                                        <RedditIcon width="16px" color="primary" />
                                    </StyledIconButton>
                                )}
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>
                {sale.meta && sale.meta.description && sale.meta.description.length > 0 && (
                    <Text fontSize="14px" color="rgba(0,0,0,0.7)" mt="8px" mb="8px">
                        {sale.meta.description}
                    </Text>
                )}
                
                <Flex flexDirection="column">
                    <InfoRow>
                        <InfoLabel>{t('Presale Address')}</InfoLabel>
                        <Flex alignItems="center">
                            <TokenAddress truncate={isMobile} scale="sm" address={sale.address}/>
                        </Flex>
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Presale Owner')}</InfoLabel>
                        <Flex alignItems="center">
                            <TokenAddress truncate={isMobile} scale="sm" address={sale.owner}/>
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
                            <TokenAddress truncate={isMobile} scale="sm" address={sale.token}/>
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
                        { token ? (
                            <InfoValue>1 CRO = {getFullDisplayBalance(sale.rate.multipliedBy(BIG_TEN.pow(18 - sale.rateDecimals)), token.decimals)} {token ? token.symbol : ''}</InfoValue>
                        ) : (
                            <Skeleton width="40px" height="30px"/>
                        )}
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Listing Rate')}</InfoLabel>
                        { token ? (
                            <InfoValue>1 CRO = {getFullDisplayBalance(sale.listingRate.multipliedBy(BIG_TEN.pow(18 - sale.listingRateDecimals)), token.decimals)} {token ? token.symbol : ''}</InfoValue>
                        ) : (
                            <Skeleton width="40px" height="30px"/>
                        )}
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Liquidity')}</InfoLabel>
                        <InfoValue>{sale.liquidity} %</InfoValue>
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
                        <InfoLabel>{t('Presale Start Time')}</InfoLabel>
                        <InfoValue>{ format(sale.openingTime * 1000, 'yyyy/MM/dd hh:mm aa')}</InfoValue>
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Presale End Time')}</InfoLabel>
                        <InfoValue>{ format(sale.closingTime * 1000, 'yyyy/MM/dd hh:mm aa')}</InfoValue>
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Liquidity Unlock Time')}</InfoLabel>
                        <InfoValue>{ format(sale.unlockTime * 1000, 'yyyy/MM/dd hh:mm aa')}</InfoValue>
                    </InfoRow> 
                    { sale.lockId && (
                        <InfoRow>
                            <InfoLabel>{t('Locker')}</InfoLabel>
                            <Button scale="xs" variant="text" as="a" href={`/lockers/${sale.lockId}`}>
                            {t('View Liquidity Locker')}
                            </Button>
                        </InfoRow> 
                    )}
                </Flex>
            </Flex>
        </>
    )
}

export default SaleBaseSection