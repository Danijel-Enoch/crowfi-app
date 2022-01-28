import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'contexts/Localization'
import { Text, Flex,  Breadcrumbs, ChevronRightIcon, Button } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { StyledNumericalInput, StyledURLInput, StyledTextInput, StyledInputLabel, StyledTextarea } from 'components/Launchpad/StyledControls'
import Dots from 'components/Loader/Dots'
import useToast from 'hooks/useToast'
import { PublicSaleData } from '../../types'
import { useUpdateSaleMeta } from '../../hooks/useBuySale'
import { getSaleMeta } from '../../hooks/getSales'

const StyledSection = styled(Flex)`
    filter: ${({ theme }) => theme.card.dropShadow};
    border-radius: ${({ theme }) => theme.radii.default};
    background: white;
    z-index: 1;
    padding: 16px 8px;
    margin: 8px;
`

const Fields = styled(Flex)`
    flex-direction: row;
    flex-wrap: wrap;
    padding 0px 8px;
`
const InputWrap = styled.div`
    padding: 8px;
    width: 100%;
    ${({ theme }) => theme.mediaQueries.md} {
        width: 50%;
    }
`

const InputWrapFull = styled.div`
    padding: 8px;
    width: 100%;
`

const TextButton = styled(Button)`
    box-shadow: unset;
    padding: unset;
    line-height: unset;
    height: unset;
`

export interface SaleEditMetaSectionProps {
    account?: string
    address?: string
    sale: PublicSaleData
    onBack?: () => void
    onUpdatedMeta?: () => void
}

const SaleEditMetaSection: React.FC<SaleEditMetaSectionProps> = ({
    sale,
    address,
    account,
    onBack,
    onUpdatedMeta,
}) => {

    const { t } = useTranslation()
    const { toastError, toastSuccess } = useToast()
    const [value, setValue] = useState('')
    const [text, setText] = useState('')
    const [pendingTx, setPendingTx] = useState(false)
    const urlReg = RegExp('^(http|https)\\://(www.)?[a-zA-Z0-9@:%._\\+~#?&//=]{1,256}.[a-z]{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)$')
    const imgReg = RegExp('^(http|https)\\://(www.)?[a-zA-Z0-9@:%._\\+~#?&//=]{2,256}.[a-z]{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)(png|jpeg|gif|jpg)$')
    const [logo, setLogo] = useState(sale.logo ? sale.logo : '')
    const [website, setWebsite] = useState(sale.meta ? sale.meta.website : '')
    const [twitter, setTwitter] = useState(sale.meta ? sale.meta.twitter : '')
    const [facebook, setFacebook] = useState(sale.meta ? sale.meta.facebook : '')
    const [telegram, setTelegram] = useState(sale.meta ? sale.meta.telegram : '')
    const [instagram, setInstagram] = useState(sale.meta ? sale.meta.instagram : '')
    const [github, setGithub] = useState(sale.meta ? sale.meta.github : '')
    const [discord, setDiscord] = useState(sale.meta ? sale.meta.discord : '')
    const [reddit, setReddit] = useState(sale.meta ? sale.meta.reddit : '')
    const [description, setDescription] = useState(sale.meta ? sale.meta.description : '')

    const [loaded, setLoaded] = useState(false)

    const { onUpdateMeta } = useUpdateSaleMeta(sale.address)

    const tranformInput = (input?: string) => {
        if (!input) return ''
        return input.trim()
    }

    useEffect(() =>  {
        const fetchMeta = async() =>{
            const meta = await getSaleMeta(sale.address)
            setLogo(meta.logo)
            setWebsite(meta.website)
            setTwitter(meta.twitter)
            setFacebook(meta.facebook)
            setTelegram(meta.telegram)
            setInstagram(meta.instagram)
            setGithub(meta.github)
            setDiscord(meta.discord)
            setReddit(meta.reddit)
            setDescription(meta.description)
        }

        if (!loaded) {
            fetchMeta()
        }
    }, [loaded, sale])

    const handleUpdate = useCallback( async () => {
        
        try {
            setPendingTx(true)
            const receipt = await onUpdateMeta(
                tranformInput(logo),
                tranformInput(website),
                tranformInput(facebook),
                tranformInput(twitter),
                tranformInput(instagram),
                tranformInput(telegram),
                tranformInput(github),
                tranformInput(discord),
                tranformInput(reddit),
                tranformInput(description)
            )
            onUpdatedMeta()
            toastSuccess(
            `${t('Done')}!`,
            t('The data have been updated successfully'),
            )
        } catch (e) {
            toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))

        } finally {
            setPendingTx(false)
        }


    }, [onUpdateMeta, toastError, toastSuccess, t, onUpdatedMeta, logo, website, twitter, facebook, instagram, telegram, github, discord, reddit, description])

    return (
        <>
            <Flex style={{padding: "24px 16px 12px 16px"}}>
                <Breadcrumbs mb="32px" separator={<ChevronRightIcon color="white" width="24px" />}>
                <Link to="/presale">
                    <Text color="white">{t('Presale')}</Text>
                </Link>
                <TextButton onClick={onBack}>
                    <Text color="white">{address}</Text>
                </TextButton>
                <Flex>
                    <Text mr="8px" color="rgba(255, 255, 255, 0.6)">{t('Edit Meta')}</Text>
                </Flex>
                </Breadcrumbs>
            </Flex>
            <Flex flexDirection="row" flexWrap="wrap" style={{padding: "0px 8px 32px 0px"}}>
                <Flex flexDirection="column" flex={[1, 1, 1, 3]} width={['100%', '100%', '66%', '66%']}>
                    <StyledSection>
                    <Fields flexDirection="column" width="100%">
                        <InputWrap>
                            <StyledURLInput
                                errorReg={imgReg}
                                value={logo} 
                                placeholder={t('Logo')}
                                onUserInput={(val) => setLogo(val)} />
                            <StyledInputLabel>
                                {t('Logo Link: (URL must end with a supported image extension png, jpg, jpeg or gif))')}
                            </StyledInputLabel>
                        </InputWrap>
                        <InputWrap>
                            <StyledURLInput
                                errorReg={urlReg}
                                value={website} 
                                placeholder={t('Website')}
                                onUserInput={(val) => setWebsite(val)} />
                            <StyledInputLabel>
                                {t('Website ex: https://...')}
                            </StyledInputLabel>
                        </InputWrap>
                        <InputWrap>
                            <StyledURLInput
                                errorReg={urlReg}
                                value={facebook} 
                                placeholder={t('Facebook')}
                                onUserInput={(val) => setFacebook(val)} />
                            <StyledInputLabel>
                                {t('Facebook ex: https://facebook.com/...')}
                            </StyledInputLabel>
                        </InputWrap>
                        <InputWrap>
                            <StyledURLInput
                                errorReg={urlReg}
                                value={twitter} 
                                placeholder={t('Twitter')}
                                onUserInput={(val) => setTwitter(val)} />
                            <StyledInputLabel>
                                {t('Twitter ex: https://twitter.com/...')}
                            </StyledInputLabel>
                        </InputWrap>
                        <InputWrap>
                            <StyledURLInput
                                errorReg={urlReg}
                                value={telegram} 
                                placeholder={t('Telegram')}
                                onUserInput={(val) => setTelegram(val)} />
                            <StyledInputLabel>
                                {t('Telegram ex: https://t.me/...')}
                            </StyledInputLabel>
                        </InputWrap>
                        <InputWrap>
                            <StyledURLInput
                                errorReg={urlReg}
                                value={instagram} 
                                placeholder={t('Instagram')}
                                onUserInput={(val) => setInstagram(val)} />
                            <StyledInputLabel>
                                {t('Instagram ex: https://instagram.com/...')}
                            </StyledInputLabel>
                        </InputWrap>
                        <InputWrap>
                            <StyledURLInput
                                errorReg={urlReg}
                                value={github} 
                                placeholder={t('Github')}
                                onUserInput={(val) => setGithub(val)} />
                            <StyledInputLabel>
                                {t('Github ex: https://github.com/...')}
                            </StyledInputLabel>
                        </InputWrap>
                        <InputWrap>
                            <StyledURLInput
                                errorReg={urlReg}
                                value={discord} 
                                placeholder={t('Discord')}
                                onUserInput={(val) => setDiscord(val)} />
                            <StyledInputLabel>
                                {t('Discord ex: https://discord.me/...')}
                            </StyledInputLabel>
                        </InputWrap>
                        <InputWrapFull>
                            <StyledURLInput
                                errorReg={urlReg}
                                value={reddit} 
                                placeholder={t('Reddit')}
                                onUserInput={(val) => setReddit(val)} />
                            <StyledInputLabel>
                                {t('Reddit ex: https://reddit.me/...')}
                            </StyledInputLabel>
                        </InputWrapFull>
                        <InputWrapFull>
                            <StyledTextarea
                                value={description} 
                                placeholder={t('Description')}
                                onUserInput={(val) => setDescription(val)}
                                maxLength={512} />
                            <StyledInputLabel>
                                {t('Project description. Maximum characters allowed is 512')}
                            </StyledInputLabel>
                        </InputWrapFull>
                        <Flex justifyContent="center" mt="8px" padding="8px">
                            <Button 
                                disabled={pendingTx}
                                onClick={handleUpdate}
                                >
                                {pendingTx ? (<Dots>{t('Updating')}</Dots>) : t('Update')}
                            </Button>
                        </Flex>
                    </Fields>
                </StyledSection>
            </Flex>
        </Flex>
            
        </>
    )
}

export default SaleEditMetaSection