import React, { useCallback, useState } from 'react'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { Text, Flex, Box, Input, Heading, Button, Radio } from '@pancakeswap/uikit'
import { Token } from '@pancakeswap/sdk'
import Select from 'components/Select/Select'
import { StyledInput, StyledInputStyles } from 'components/Launchpad/StyledControls'
import useTheme from 'hooks/useTheme'
import { useToken } from 'hooks/Tokens'
import useTokenBalance from 'hooks/useTokenBalance'
import { isAddress } from 'utils'
import { getFullDisplayBalance } from 'utils/formatBalance'
import DateTimePikcer from 'components/Launchpad/DateTimePicker'
import RadioWithText from 'components/Launchpad/RadioWithText'
import { DatePicker } from 'components/DatePicker'
import { OwnerType, TokenType, UnlockType } from '../../types'

const InputWrap = styled.div`
    padding: 8px 0px;
`
const RadioGroup = styled(Flex)`
  align-items: center;
  margin-right: 16px;
  margin-top: 8px;
  cursor: pointer;
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

const CreateTokenLocker: React.FC = () => {

    const { t } = useTranslation()
    const { theme } = useTheme()
    const [unlockType, setUnlockType] = useState<UnlockType>(UnlockType.LINEAR)
    const [ownerType, setOwnerType] = useState<OwnerType>(OwnerType.ME)
    const [startDate, setStartDate] = useState<Date|null>(null)

    const [tokenAddress, setTokenAddress] = useState<string>('')
    const searchToken: Token = useToken(tokenAddress)
    const {balance} = useTokenBalance(searchToken ? searchToken.address : null)

    const handleInputAddress = useCallback((event) => {
      const input = event.target.value
      const checksummedInput = isAddress(input)
      setTokenAddress(checksummedInput || input)
    }, [])

    const handleDateChange = (date: Date, event) => {
        setStartDate(date)
        console.log('date', date)
    }

    return (
        <>
            <Flex flexDirection="column">
                <Flex flexDirection="row" justifyContent="center" mt="24px">
                    <Flex flexDirection={["column", "column", "column", "row"]} maxWidth="960px" width="100%">
                        <Flex flexDirection="column" flex="1" order={[1, 1, 1, 0]}>
                            <InputWrap>
                                <StyledInput 
                                    value={tokenAddress} 
                                    placeholder={t('Enter Token Address')}
                                    onChange={handleInputAddress} />
                            </InputWrap>
                            { searchToken && (
                                <>
                                <Flex flexDirection="column">
                                    <Flex>
                                        <Text fontSize="14px" color="secondary" mr="24px">{t('Token')}: </Text>
                                        <Text fontSize="14px" bold color="primary">{searchToken.name} </Text>
                                    </Flex>
                                    { balance && (
                                    <Flex>
                                        <Text fontSize="14px" color="secondary" mr="8px">{t('Balance')}: </Text>
                                        <Text fontSize="14px" bold color="primary">{getFullDisplayBalance(balance, searchToken.decimals)}</Text>
                                    </Flex>
                                    )}
                                </Flex>
                                </>
                            )}
                            <InputWrap>
                                <Flex flexDirection="column">
                                    <Text color="primary" fontSize='14px'>
                                        {t('Select unlock type:')}
                                    </Text>
                                    <RadioWithText
                                        onClick={() => setUnlockType(UnlockType.LINEAR)}
                                        text={t('Linear Unlock (The number of tokens will be unlocked linearly. )')}
                                        checked={unlockType === UnlockType.LINEAR}
                                    />
                                    <RadioWithText
                                        onClick={() => setUnlockType(UnlockType.FULL)}
                                        text={t('Full Unlock (All tokens will be released at unlock time.)')}
                                        checked={unlockType === UnlockType.FULL}
                                    />
                                </Flex>
                            </InputWrap>
                            { unlockType === UnlockType.LINEAR && (
                                <InputWrap>
                                    <DateTimePikcer 
                                    onChange={handleDateChange}
                                    selected={startDate}
                                    placeholderText="Unlock Start Time"/>
                                </InputWrap>
                            )}
                            
                            <InputWrap>
                                <DateTimePikcer 
                                onChange={handleDateChange}
                                selected={startDate}
                                placeholderText="Full Unlock Time"/>
                            </InputWrap>
                            <InputWrap>
                                <StyledInput placeholder={t('Enter amount of token to lock')} />
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
                                        <StyledInput placeholder={t('Enter owner wallet address')} />
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
                                {t('CrowFi Token Locker:')}
                            </Heading>
                            <StyledList>
                                <li>
                                {t('Use the CrowFi Token Locker to lock your tokens and earn greater trust within your community!')}
                                </li>
                                
                            </StyledList>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </>
    )
}

export default CreateTokenLocker