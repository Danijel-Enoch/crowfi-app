import React from 'react'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { Flex, Heading, TwitterIcon, IconButton, GithubIcon, TelegramIcon, LanguageIcon, LinkExternal, useMatchBreakpoints } from '@pancakeswap/uikit'
import { getBscScanLink } from 'utils'
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

const LockerBaseSection: React.FC = () => {

    const { t } = useTranslation()
    const { isMobile } = useMatchBreakpoints()
    const address = '0x852c75bd104b928BBF54e6Ab94F274B9F8Fa6536'

    return (
        <>
            <Flex flexDirection="column" width="100%">
                <Flex flexDirection="column">
                    <InfoRow mb="20px">
                        <SectionTitle>{t('Locker Info')}</SectionTitle>
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Token Name')}</InfoLabel>
                        <InfoValue>CrowFi Token</InfoValue>
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Token Symobl')}</InfoLabel>
                        <InfoValue>CROW</InfoValue>
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Token Supply')}</InfoLabel>
                        <InfoValue>10000927768.707496731568030234</InfoValue>
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Token Address')}</InfoLabel>
                        <Flex alignItems="center">
                            <LinkExternal href={getBscScanLink(address, 'address')} fontSize="14px" style={{wordBreak:"break-all"}}>{ isMobile ?  truncateHash(address) : address }</LinkExternal>
                        </Flex>
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Locker Owner')}</InfoLabel>
                        <Flex alignItems="center">
                            <LinkExternal href={getBscScanLink(address, 'address')} fontSize="14px" style={{wordBreak:"break-all"}}>{ isMobile ?  truncateHash(address) : address }</LinkExternal>
                        </Flex>
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Token in Locker')}</InfoLabel>
                        <InfoValue>9965</InfoValue>
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Withdrawable Amount')}</InfoLabel>
                        <InfoValue>9965</InfoValue>
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Lock Date')}</InfoLabel>
                        <InfoValue>2022/01/08 05:00:00 UTC</InfoValue>
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Unlock Date')}</InfoLabel>
                        <InfoValue>2022/02/03 05:00:00 UTC</InfoValue>
                    </InfoRow>
                </Flex>
            </Flex>
        </>
    )
}

export default LockerBaseSection