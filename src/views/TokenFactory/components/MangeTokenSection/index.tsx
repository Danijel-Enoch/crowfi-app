import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { Flex, Box} from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import FlexLayout from 'components/Layout/Flex'
import Select from 'components/Select/Select'
import useTheme from 'hooks/useTheme'
import { useAppDispatch } from 'state'
import { fetchTokenFactoryUserDataAsync } from 'state/tokenFactory'
import { useMyTokens } from 'state/tokenFactory/hooks'
import { TokenType } from 'state/types'
import ManageTokenCard from './MangeTokenCard'

const InputWrap = styled.div`
    padding: 8px 0px;
`


const ManageTokenSection: React.FC = () => {

    const { t } = useTranslation()
    const { theme } = useTheme()
    const { account } = useWeb3React()
    const myTokens = useMyTokens()
    const dispatch = useAppDispatch()
    const [tokenType, seteTokenType] = useState(TokenType.STANDARD)

    useEffect(() => {
        if (account) {
            dispatch(fetchTokenFactoryUserDataAsync({account}))
        }
    }, [account, dispatch])

    const currentTokens = useMemo(() => {
        if (!account || !myTokens) 
            return []
        return myTokens.filter((token) => token.type === tokenType)
    }, [account, myTokens, tokenType])

    const tokenTypes = [
        { label: t('Standard Token'), value: TokenType.STANDARD },
        { label: t('Liquidity Generator Token'), value: TokenType.LIQUIDITY },
    ]

    const handleTokenTypeChange = (option) =>  {
        seteTokenType(option.value)
    }

    return (
        <>
            <Flex flexDirection="column">
                <Flex flexDirection="row" justifyContent="center" alignItems="center" mb="24px">
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
                <FlexLayout>
                    { currentTokens.map((token) => (
                        <ManageTokenCard
                            key={token.address}
                            tokenData={token}
                            account={account}
                        />
                    ))}
                    
                </FlexLayout>
            </Flex>
        </>
    )
}

export default ManageTokenSection