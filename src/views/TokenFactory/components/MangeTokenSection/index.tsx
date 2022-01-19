import React, { useState } from 'react'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { Flex, Box} from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import FlexLayout from 'components/Layout/Flex'
import Select from 'components/Select/Select'
import useTheme from 'hooks/useTheme'
import ManageTokenCard from './MangeTokenCard'
import { TokenType } from '../../types'

const InputWrap = styled.div`
    padding: 8px 0px;
`


const ManageTokenSection: React.FC = () => {

    const { t } = useTranslation()
    const { theme } = useTheme()
    const [tokenType, seteTokenType] = useState(TokenType.STANDARD)

    const tokenTypes = [
        { label: t('Standard Token'), value: TokenType.STANDARD },
        { label: t('Liquidity Generator Token'), value: TokenType.LIQUIDITY },
    ]

    const handleTokenTypeChange = (option) =>  {
        seteTokenType(option.value)
    }

    const tokens = [
        {
            id: '1',
            name: 'Crow-Fi Token',
            symbol: 'CROW',
            decimals: 18,
            address: '0x852c75bd104b928BBF54e6Ab94F274B9F8Fa6536',
            totalSupply: new BigNumber('1000000000000000000000'),
            type: TokenType.STANDARD
        },
        {
            id: '2',
            name: 'Crow-Fi Token',
            symbol: 'CROW',
            decimals: 18,
            address: '0x852c75bd104b928BBF54e6Ab94F274B9F8Fa6536',
            totalSupply: new BigNumber('1000000000000000000000'),
            type: TokenType.STANDARD
        },
        {
            id: '3',
            name: 'Crow-Fi Token',
            symbol: 'CROW',
            decimals: 18,
            address: '0x852c75bd104b928BBF54e6Ab94F274B9F8Fa6536',
            totalSupply: new BigNumber('1000000000000000000000'),
            type: TokenType.STANDARD
        },
        {
            id: '4',
            name: 'Crow-Fi Token',
            symbol: 'CROW',
            decimals: 18,
            address: '0x852c75bd104b928BBF54e6Ab94F274B9F8Fa6536',
            totalSupply: new BigNumber('1000000000000000000000'),
            type: TokenType.STANDARD
        },
        {
            id: '5',
            name: 'Crow-Fi Token',
            symbol: 'CROW',
            decimals: 18,
            address: '0x852c75bd104b928BBF54e6Ab94F274B9F8Fa6536',
            totalSupply: new BigNumber('1000000000000000000000'),
            type: TokenType.STANDARD
        }
    ]

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
                    { tokens.map((token) => (
                        <ManageTokenCard
                            key={token.id}
                            name={token.name}
                            symbol={token.symbol}
                            address={token.address}
                            decimals={token.decimals}
                            totalSupply={token.totalSupply}
                            type={token.type}
                        />
                    ))}
                    
                </FlexLayout>
            </Flex>
        </>
    )
}

export default ManageTokenSection