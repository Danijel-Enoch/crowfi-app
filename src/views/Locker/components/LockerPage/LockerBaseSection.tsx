import React from 'react'
import { format } from 'date-fns'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { Flex, Heading, TwitterIcon, IconButton, GithubIcon, TelegramIcon, LanguageIcon, LinkExternal, useMatchBreakpoints, Skeleton } from '@pancakeswap/uikit'
import { Token } from '@pancakeswap/sdk'
import TokenAddress from 'components/TokenAddress'
import { DeserializedLock } from 'state/types'
import useTotalSupply from 'hooks/useTotalSupply'
import { getBscScanLink } from 'utils'
import { getFullDisplayBalance } from 'utils/formatBalance'
import truncateHash from 'utils/truncateHash'
import { InfoRow, InfoLabel, InfoValue, SectionTitle } from './styled'

const LogoWrapper = styled.div`
    width: 80px;
    height: 80px;
    > img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
`

export interface LockerBaseSectionProps {
    lock?: DeserializedLock
    token?: Token
}

const LockerBaseSection: React.FC<LockerBaseSectionProps> = ({token, lock}) => {

    const { t } = useTranslation()
    const { isMobile } = useMatchBreakpoints()
    const address = '0x852c75bd104b928BBF54e6Ab94F274B9F8Fa6536'
    const totalSupply = useTotalSupply(token)

    return (
        <>
            <Flex flexDirection="column" width="100%">
                <Flex flexDirection="column">
                    <InfoRow mb="20px">
                        <SectionTitle>{t('Locker Info')}</SectionTitle>
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Token Name')}</InfoLabel>
                        { token ? (
                            <InfoValue>{token ? token.name : ''}</InfoValue>
                        ) : (
                            <Skeleton width="60px" height="20px"/>
                        ) }
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Token Symobl')}</InfoLabel>
                        { token ? (
                            <InfoValue>{token ? token.symbol : ''}</InfoValue>
                        ) : (
                            <Skeleton width="60px" height="20px"/>
                        ) }
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Token Supply')}</InfoLabel>
                        { totalSupply ? (
                            <InfoValue>{totalSupply.toExact() }</InfoValue>
                        ) : (
                            <Skeleton width="60px" height="20px"/>
                        ) }
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Token Address')}</InfoLabel>
                        <Flex alignItems="center">
                            { lock ? (
                                <TokenAddress address={lock.tokenAddress} truncate={isMobile} scale="sm"/>
                            ) : (
                                <Skeleton width="60px" height="20px"/>
                            )}
                            
                        </Flex>
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Locker Owner')}</InfoLabel>
                        <Flex alignItems="center">
                            { lock ? (
                                <LinkExternal href={getBscScanLink(lock.owner, 'address')} fontSize="14px" style={{wordBreak:"break-all"}}>{ isMobile ?  truncateHash(lock.owner) : lock.owner }</LinkExternal>
                            ) : (
                                <Skeleton width="60px" height="20px"/>
                            )}
                        </Flex>
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Locked Amount')}</InfoLabel>
                        { lock && token ? (
                            <InfoValue>{getFullDisplayBalance(lock.amount, token.decimals)}</InfoValue>
                        ) : (
                            <Skeleton width="60px" height="20px"/>
                        )}
                        
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Lock Date')}</InfoLabel>
                        { lock ? (
                        <InfoValue>{format(new Date(lock.lockDate * 1000), 'MM/dd/yyyy hh:mm aa')}</InfoValue>
                        ): (
                            <Skeleton width="60px" height="20px"/>
                        )}
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Unlock Date')}</InfoLabel>
                        { lock ? (
                        <InfoValue>{format(new Date(lock.unlockDate * 1000), 'MM/dd/yyyy hh:mm aa')}</InfoValue>
                        ): (
                            <Skeleton width="60px" height="20px"/>
                        )}
                    </InfoRow>
                </Flex>
            </Flex>
        </>
    )
}

export default LockerBaseSection