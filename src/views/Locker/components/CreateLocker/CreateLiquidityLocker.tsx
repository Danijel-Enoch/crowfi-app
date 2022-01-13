import React, { useState } from 'react'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { Text, Flex, Box, Input, Heading, Button } from '@pancakeswap/uikit'
import Select from 'components/Select/Select'
import useTheme from 'hooks/useTheme'
import { TokenType } from '../../types'

const InputWrap = styled.div`
    padding: 8px 0px;
`

const CreateLiquidityLocker: React.FC = () => {

    const { t } = useTranslation()
    const { theme } = useTheme()

    return (
        <>
            <Flex flexDirection="column">
                <Flex flexDirection="row" justifyContent="center" mt="24px">
                    <Flex flexDirection={["column", "column", "column", "row"]} maxWidth="960px" width="100%">
                        <Flex flexDirection="column" flex="1" order={[1, 1, 1, 0]}>
                            <InputWrap>
                                <Input placeholder={t('Token Name')} />
                            </InputWrap>
                            <InputWrap>
                                <Input placeholder={t('Token Symbol')} />
                            </InputWrap>
                            <InputWrap>
                                <Input placeholder={t('Token Decimal')} />
                            </InputWrap>
                            <InputWrap>
                                <Input placeholder={t('Token Total Supply')} />
                            </InputWrap>

                            <Flex flexDirection="row" justifyContent="center" mt="12px">
                                <Button color="primary">
                                    {t('Create')}
                                </Button>
                            </Flex>
                        </Flex>
                        <Flex flexDirection="column" order={[0, 0, 0, 1]} margin={["0 0px 24px 0px", "0px 0px 24px 0px", "0px 0px 24px 0px", "0px 0px 0px 48px"]} maxWidth={["100%", "100%", "100%", "50%"]}>
                            <Heading color="primary" mt="8px">
                                {t('Liquidity Generator Token Features:')}
                            </Heading>
                            <Text color="secondary" fontSize="14px" mt="8px">
                                {t('- Auto yield and liquidity generation (Safemoon Fork)')}
                            </Text>
                            <Text color="secondary" fontSize="14px" mt="4px">
                                {t('- Customize fees taken to reward holders')}
                            </Text>
                            <Text color="secondary" fontSize="14px" mt="4px">
                                {t('- Customize fees to generate liquidty')}
                            </Text>
                            <Text color="secondary" fontSize="14px" mt="4px">
                                {t('- Whitelist functions')}
                            </Text>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </>
    )
}

export default CreateLiquidityLocker