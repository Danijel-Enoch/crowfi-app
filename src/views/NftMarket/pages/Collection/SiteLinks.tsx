
import React from 'react'
import { DiscordIcon, Flex, IconButton, InstagramIcon, LanguageIcon, TelegramIcon, TwitterIcon } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { NFTCollection } from '../../hooks/types'


const StyledIconButton = styled(IconButton).attrs({target:'_blank'})`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 32px;
    background: ${({ theme }) => theme.colors.backgroundAlt2};
    border-radius: 12px;
    margin-right: 8px;
`

interface SiteLinksProps {
    collection: NFTCollection
}

const SiteLinks: React.FC<SiteLinksProps> = ({collection}) => {

    const iconWidth="20px"

    return (
        <Flex justifyContent="center">
            { collection.site && collection.site.length > 0 && (
                <StyledIconButton variant="primary" scale="sm" as="a" href={collection.site}>
                    <LanguageIcon width={iconWidth} color="primary" />
                </StyledIconButton>
            )}
            { collection.discord && collection.discord.length > 0 && (
                <StyledIconButton variant="primary" scale="sm" as="a" href={collection.discord}>
                    <DiscordIcon width={iconWidth} color="primary" />
                </StyledIconButton>
            )}
            { collection.instagram && collection.instagram.length > 0 && (
                <StyledIconButton variant="primary" scale="sm" as="a" href={collection.instagram}>
                    <InstagramIcon width={iconWidth} color="primary" />
                </StyledIconButton>
            )}
            { collection.twitter && collection.twitter.length > 0 && (
                <StyledIconButton variant="primary" scale="sm" as="a" href={collection.twitter}>
                    <TwitterIcon width={iconWidth} color="primary" />
                </StyledIconButton>
            )}
            { collection.telegram && collection.telegram.length > 0 && (
                <StyledIconButton variant="primary" scale="sm" as="a" href={collection.telegram}>
                    <TelegramIcon width={iconWidth} color="primary" />
                </StyledIconButton>
            )}
        </Flex>
    )
}

export default SiteLinks 