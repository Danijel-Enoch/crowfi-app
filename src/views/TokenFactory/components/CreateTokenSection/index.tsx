import React, { useState } from 'react'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { Text, Flex, Box, Input, Heading, Button } from '@pancakeswap/uikit'
import Select from 'components/Select/Select'
import {StyledInput} from 'components/Launchpad/StyledControls'
import useTheme from 'hooks/useTheme'
import { TokenType } from '../../types'


const InputWrap = styled.div`
    padding: 8px 0px;
`

const StyledList = styled.ul`
    margin-top: 16px;
    color: ${({ theme }) => theme.colors.secondary};
    list-style: none;
    font-size: 14px;
    line-height: 1.2;
    > li {
        margin-top: 8px;
        position: relative;
        padding-left: 16px;
        ::before {
            content: '-';
            position: absolute;
            left: 0;
        }
    }
`

const CreateTokenSection: React.FC = () => {

    const { t } = useTranslation()
    const { theme } = useTheme()
    const [tokenType, seteTokenType] = useState(TokenType.STANDARD)

    const tokenTypes = [
        { label: t('Standard Token'), value: TokenType.STANDARD },
        { label: t('Liquidity Generator Token'), value: TokenType.LIQUIDITY },
    ]

    const handleTokenTypeChange = (option) =>  {
        console.log('option', option.value)
        seteTokenType(option.value)
    }

    return (
        <>
            <Flex flexDirection="column">
                <Flex flexDirection="row" justifyContent="center" alignItems="center">
                    <Box minWidth="min(320px, 100%)">
                        <Select
                            textColor={theme.colors.primary}
                            width="auto"
                            options={tokenTypes}
                            onOptionChange={handleTokenTypeChange}
                            defaultOptionIndex={0}
                            />
                    </Box>
                </Flex>
                <Flex flexDirection="row" justifyContent="center" mt="24px">
                    <Flex flexDirection={["column", "column", "column", "row"]} maxWidth="960px" width="100%">
                        <Flex flexDirection="column" flex="1" order={[1, 1, 1, 0]}>
                            <InputWrap>
                                <StyledInput placeholder={t('Token Name')} />
                            </InputWrap>
                            <InputWrap>
                                <StyledInput placeholder={t('Token Symbol')} />
                            </InputWrap>
                            <InputWrap>
                                <StyledInput placeholder={t('Token Decimal')} />
                            </InputWrap>
                            <InputWrap>
                                <StyledInput placeholder={t('Token Total Supply')} />
                            </InputWrap>
                            { tokenType === TokenType.LIQUIDITY && (
                                <>
                                <InputWrap>
                                    <StyledInput placeholder={t('Transaction Fee in % to generate yield')} />
                                </InputWrap>
                                <InputWrap>
                                    <StyledInput placeholder={t('Transaction Fee in 5 to generate Liquidity ')} />
                                </InputWrap>
                                </>
                            )}

                            <Flex flexDirection="row" justifyContent="center" mt="12px">
                                <Button color="primary">
                                    {t('Create')}
                                </Button>
                            </Flex>
                        </Flex>
                        <Flex flexDirection="column" order={[0, 0, 0, 1]} margin={["0 0px 24px 0px", "0px 0px 24px 0px", "0px 0px 24px 0px", "0px 0px 0px 48px"]} maxWidth={["100%", "100%", "100%", "50%"]}>
                            {
                                tokenType === TokenType.STANDARD ? (
                                    <>
                                    <Heading color="primary" mt="8px">
                                        {t('Standard Token Features:')}
                                    </Heading>
                                    <StyledList>
                                        <li>{t('Basic token with all standard features')}</li>
                                        <li>{t('Perfect for utility based projects such as charting tools')}</li>
                                    </StyledList>
                                    </>
                                ) : (
                                    <>
                                    <Heading color="primary" mt="8px">
                                        {t('Liquidity Generator Token Features:')}
                                    </Heading>

                                    <StyledList>
                                        <li>{t('Auto yield and liquidity generation (Safemoon Fork)')}</li>
                                        <li>{t('Customize fees taken to reward holders')}</li>
                                        <li>{t('Customize fees to generate liquidty')}</li>
                                        <li>{t('Whitelist functions')}</li>
                                    </StyledList>
                                    </>
                                )
                            }
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </>
    )
}

export default CreateTokenSection