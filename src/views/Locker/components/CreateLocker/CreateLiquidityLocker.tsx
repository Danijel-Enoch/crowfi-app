import React, { useCallback, useState } from 'react'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { Text, Flex, Heading, Button, LinkExternal } from '@pancakeswap/uikit'
import { StyledInput, StyledAddressInput } from 'components/Launchpad/StyledControls'
import useTheme from 'hooks/useTheme'
import { usePairToken, useToken } from 'hooks/Tokens'
import { getFullDisplayBalance } from 'utils/formatBalance'
import truncateHash from 'utils/truncateHash'
import { getBscScanLink, isAddress } from 'utils'
import DateTimePikcer from 'components/Launchpad/DateTimePicker'
import RadioWithText from 'components/Launchpad/RadioWithText'
import { OwnerType } from '../../types'

const InputWrap = styled.div`
    padding: 8px 0px;
`

const CreateLiquidityLocker: React.FC = () => {

    const { t } = useTranslation()
    const { theme } = useTheme()

    const [pairAddress, setPairAddress] = useState<string>('')
    const [otherAddress, setOtherAddress] = useState<string>('')
    const [unlockDate, setUnlockDate] = useState<Date|null>(null)
    const [ownerType, setOwnerType] = useState<OwnerType>(OwnerType.ME)
    const [amount, setAmount] = useState<string|null>(null)
    const searchPair = usePairToken(pairAddress)
    const token0 = useToken(searchPair ? searchPair.token0Address : null)
    const token1 = useToken(searchPair ? searchPair.token1Address : null)

    const handleStartDateChange = (date: Date, event) => {
        setUnlockDate(date)
    }

    const onPercentClick = (percent: number) => {
        if (searchPair && searchPair.totalSupply) {
            // console.log('total supply', searchPair.totalSupply)
            if (percent === 100) {
                setAmount(getFullDisplayBalance(searchPair.totalSupply, searchPair.decimals, searchPair.decimals))
            } else {
                setAmount(getFullDisplayBalance(searchPair.totalSupply.multipliedBy(percent).div(100), searchPair.decimals, searchPair.decimals))
            }
        }
    }

    return (
        <>
            <Flex flexDirection="column">
                <Flex flexDirection="row" justifyContent="center" mt="24px">
                    <Flex flexDirection={["column", "column", "column", "row"]} maxWidth="960px" width="100%">
                        <Flex flexDirection="column" flex="1" order={[1, 1, 1, 0]}>
                            <InputWrap>
                                <StyledAddressInput 
                                    value={pairAddress} 
                                    placeholder={t('Enter Token Address')}
                                    onUserInput={(value) => setPairAddress(value)} />
                            </InputWrap>
                            { searchPair && (
                                <>
                                <Flex flexDirection="column">
                                    { token0 && (
                                    <Flex>
                                        <Text fontSize="14px" color="secondary" mr="24px">{token0.name}:</Text>
                                        <LinkExternal href={getBscScanLink(token0.address, 'address')}>{truncateHash(token0.address)}</LinkExternal>
                                    </Flex>
                                    )}
                                    { token1 && (
                                    <Flex>
                                        <Text fontSize="14px" color="secondary" mr="24px">{token1.name}:</Text>
                                        <LinkExternal href={getBscScanLink(token1.address, 'address')}>{truncateHash(token1.address)}</LinkExternal>
                                    </Flex>
                                    )}
                                    <Flex>
                                        <Text fontSize="14px" color="secondary" mr="8px">{t('LP Token Supply')}: </Text>
                                        <Text fontSize="14px" bold color="primary">{getFullDisplayBalance(searchPair.totalSupply, searchPair.decimals)}</Text>
                                    </Flex>
                                </Flex>
                                </>
                            )}
                            <InputWrap>
                                <DateTimePikcer 
                                onChange={handleStartDateChange}
                                selected={unlockDate}
                                placeholderText="Unlock time"/>
                            </InputWrap>
                            <InputWrap>
                                <StyledInput placeholder={t('Enter amount of token to lock')} value={amount}/>
                                <Flex justifyContent="space-between" mt="4px">
                                    <Button disabled={!searchPair || !searchPair.totalSupply} scale="sm" variant="tertiary" onClick={() => onPercentClick(25)}>
                                        25%
                                    </Button>
                                    <Button disabled={!searchPair || !searchPair.totalSupply} scale="sm" variant="tertiary" onClick={() => onPercentClick(50)}>
                                        50%
                                    </Button>
                                    <Button disabled={!searchPair || !searchPair.totalSupply} scale="sm" variant="tertiary" onClick={() => onPercentClick(75)}>
                                        75%
                                    </Button>
                                    <Button disabled={!searchPair || !searchPair.totalSupply} scale="sm" variant="tertiary" onClick={() => onPercentClick(100)}>
                                        MAX
                                    </Button>
                                </Flex>
                            </InputWrap>
                            <InputWrap>
                                <Flex flexDirection="column">
                                    <Text color="primary" fontSize='14px'>
                                        {t('Select Locker Owner?')}
                                    </Text>
                                    <RadioWithText
                                        onClick={() => setOwnerType(OwnerType.ME)}
                                        text={t('Myself')}
                                        checked={ownerType === OwnerType.ME}
                                    />
                                    <RadioWithText
                                        onClick={() => setOwnerType(OwnerType.OTHER)}
                                        text={t('Someone else')}
                                        checked={ownerType === OwnerType.OTHER}
                                    />
                                </Flex>
                                { ownerType === OwnerType.OTHER && (
                                    <InputWrap>
                                        <StyledAddressInput 
                                            value={otherAddress} 
                                            placeholder={t('Enter owner wallet address')}
                                            onUserInput={(value) => setOtherAddress(value)} />
                                    </InputWrap>
                                )}
                                
                            </InputWrap>

                            <Flex flexDirection="row" justifyContent="center" mt="12px">
                                <Button color="primary">
                                    {t('Create')}
                                </Button>
                            </Flex>
                        </Flex>
                        <Flex flexDirection="column" order={[0, 0, 0, 1]} margin={["0 0px 24px 0px", "0px 0px 24px 0px", "0px 0px 24px 0px", "0px 0px 0px 48px"]} maxWidth={["100%", "100%", "100%", "50%"]}>
                            <Heading color="primary" mt="8px">
                                {t('CrowFi Liquidity Locker:')}
                            </Heading>
                            <Text color="secondary" fontSize="14px" mt="8px">
                                {t('- Use the CrowFiLiquidity Locker to lock your LP tokens to show your investors proof of locked liquidity!')}
                            </Text>
                            <Text color="secondary" fontSize="14px" mt="4px">
                                {t('- Token Locker Fees: 0% amount of tokens to be locked and 0 CRO')}
                            </Text>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </>
    )
}

export default CreateLiquidityLocker