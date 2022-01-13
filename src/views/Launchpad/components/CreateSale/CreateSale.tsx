import React, { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { Text, Flex, Box, Input, Heading, Button, Radio, useModal } from '@pancakeswap/uikit'
import { Token } from '@pancakeswap/sdk'
import Select from 'components/Select/Select'
import { StyledInput, StyledInputStyles, StyledInputLabel } from 'components/Launchpad/StyledControls'
import useTheme from 'hooks/useTheme'
import { useToken } from 'hooks/Tokens'
import useTokenBalance from 'hooks/useTokenBalance'
import { isAddress } from 'utils'
import { getFullDisplayBalance } from 'utils/formatBalance'
import DateTimePikcer from 'components/Launchpad/DateTimePicker'
import RadioWithText from 'components/Launchpad/RadioWithText'
import { DatePicker } from 'components/DatePicker'
import { OwnerType, TokenType, UnlockType } from '../../types'
import DesclaimerModal from './DesclaimerModal'

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

const CreateSale: React.FC = () => {

    const { t } = useTranslation()
    const { theme } = useTheme()
    const history = useHistory()
    const [ agreed, setAgreed ] = useState<boolean>(false)
    const [ presentedDesclaimer, setPresentedDesclaimer ] = useState<boolean>(false)
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

    const [onPresentDesclaimer] = useModal(
        <DesclaimerModal onAgree={() => {
            setAgreed(true)
        }} onCancel={() => {
            history.replace('/sales')
        }}/>,
        false,
        false
    )

    useEffect(() => {
        if (!agreed && !presentedDesclaimer) {
            setPresentedDesclaimer(true)
            onPresentDesclaimer()
        }
        
    }, [agreed, presentedDesclaimer, onPresentDesclaimer])

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
                                    placeholder={t('Token Address')}
                                    onChange={handleInputAddress} />
                            </InputWrap>
                            { searchToken && (
                                <>
                                <Flex flexDirection="column">
                                    <Flex>
                                        <Text fontSize="14px" color="secondary" mr="24px">{t('Token name')}: </Text>
                                        <Text fontSize="14px" bold color="primary">{searchToken.name} </Text>
                                    </Flex>
                                    <Flex>
                                        <Text fontSize="14px" color="secondary" mr="24px">{t('Token symbol')}: </Text>
                                        <Text fontSize="14px" bold color="primary">{searchToken.symbol} </Text>
                                    </Flex>
                                    <Flex>
                                        <Text fontSize="14px" color="secondary" mr="24px">{t('Token decimals')}: </Text>
                                        <Text fontSize="14px" bold color="primary">{searchToken.decimals} </Text>
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
                                <StyledInput placeholder={t('Presale Rate, ex. 0.5 CRO')} />
                                <StyledInputLabel>
                                    {t('Enter your presale price in CRO: (If I pay 1 CRO, how many tokens do I get?)')}
                                </StyledInputLabel>
                            </InputWrap>
                            <InputWrap>
                                <Flex>
                                    <StyledInput placeholder={t('Soft Cap ex.50')} style={{marginRight: "4px"}}/>
                                    <StyledInput placeholder={t('Hard Cap ex.100')} style={{marginLeft: "4px"}}/>
                                </Flex>
                                <StyledInputLabel>
                                    {t('Enter your desired softcap and hardcap: [soft,hard] (For a small or near 0 soft cap set your softcap to 0.001)')}
                                </StyledInputLabel>
                                
                            </InputWrap>
                            <InputWrap>
                                <StyledInput placeholder={t('Contribution Limits')} />
                                <StyledInputLabel>
                                    {t('Enter the maximum amounts each wallet can contribute: (max)')}
                                </StyledInputLabel>
                            </InputWrap>
                            <InputWrap>
                                <StyledInput placeholder={t('CrowFi Swap Liquidity, ex. 60')} />
                                <StyledInputLabel>
                                    {t('Enter the percentage of raised funds that should be allocated to Liquidity on CrowFi Swap (Min 51%)')}
                                </StyledInputLabel>
                            </InputWrap>
                            <InputWrap>
                                <StyledInput placeholder={t('CrowFi Swap Rate ex.400')} />
                                <StyledInputLabel>
                                    {t('Enter CrowFi Swap listing price in CRO: (If I buy 1 CRO worth onPhoton Swaphow many tokens do I get?)')}
                                </StyledInputLabel>
                            </InputWrap>
                            <InputWrap>
                                <DateTimePikcer 
                                onChange={handleDateChange}
                                selected={startDate}
                                placeholderText="Presale Start Time"/>
                            </InputWrap>
                            <InputWrap>
                                <DateTimePikcer 
                                onChange={handleDateChange}
                                selected={startDate}
                                placeholderText="Presale End Time"/>
                            </InputWrap>
                            <InputWrap>
                                <DateTimePikcer 
                                onChange={handleDateChange}
                                selected={startDate}
                                placeholderText="Liquidity Lockup Time"/>
                            </InputWrap>

                            <Flex flexDirection="row" justifyContent="center" mt="12px">
                                <Button color="primary">
                                    {t('Create')}
                                </Button>
                            </Flex>
                        </Flex>
                        <Flex flexDirection="column" order={[0, 0, 0, 1]} margin={["0 0px 24px 0px", "0px 0px 24px 0px", "0px 0px 24px 0px", "0px 0px 0px 48px"]} maxWidth={["100%", "100%", "100%", "50%"]}>
                            <Heading color="primary" mt="8px">
                                {t('CrowFi Presale:')}
                            </Heading>
                            <StyledList>
                                <li>
                                {t('This process is entirely decentralized, we cannot be held reponsible for incorrect entry of information or be held liable for anything related to your use of our platform.')}
                                </li>
                                
                            </StyledList>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </>
    )
}

export default CreateSale