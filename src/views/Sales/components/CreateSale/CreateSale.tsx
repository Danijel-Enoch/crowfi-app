import React, { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { Text, Flex, Box, Input, Heading, Button, Radio, useModal } from '@pancakeswap/uikit'
import { Token } from '@pancakeswap/sdk'
import Select from 'components/Select/Select'
import { StyledInput, StyledInputStyles, StyledIntegerInput, StyledInputLabel, StyledAddressInput, StyledNumericalInput } from 'components/Launchpad/StyledControls'
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

interface CreateProps {
    onDisagree: () => void
}

const CreateSale: React.FC<CreateProps> = ({onDisagree}) => {

    const { t } = useTranslation()
    const { theme } = useTheme()
    const history = useHistory()
    const [ agreed, setAgreed ] = useState<boolean>(false)
    const [ presentedDesclaimer, setPresentedDesclaimer ] = useState<boolean>(false)
    const [ rate, setRate ] = useState<string>('')
    const [ softCap, setSoftCap ] = useState<string>('')
    const [ hardCap, setHardCap ] = useState<string>('')
    const [ contributionLimit, setContributionLimit ] = useState<string>('')
    const [ lpPercent, setLpPercent ] = useState<string>('')
    const [ swapRate, setSwapRate ] = useState<string>('')
    const [startDate, setStartDate] = useState<Date|null>(null)
    const [endDate, setEndDate] = useState<Date|null>(null)
    const [lockDate, setLockDate] = useState<Date|null>(null)

    const [tokenAddress, setTokenAddress] = useState<string>('')
    const searchToken: Token = useToken(tokenAddress)
    const {balance} = useTokenBalance(searchToken ? searchToken.address : null)

    const [onPresentDesclaimer] = useModal(
        <DesclaimerModal onAgree={() => {
            setAgreed(true)
        }} onCancel={onDisagree}/>,
        false,
        false
    )

    useEffect(() => {
        if (!agreed && !presentedDesclaimer) {
            setPresentedDesclaimer(true)
            onPresentDesclaimer()
        }
        
    }, [agreed, presentedDesclaimer, onPresentDesclaimer])

    const handleStartDateChange = (date: Date, event) => {
        setStartDate(date)
    }

    const handleEndDateChange = (date: Date, event) => {
        setEndDate(date)
    }

    const handleLockDateChange = (date: Date, event) => {
        setLockDate(date)
    }

    return (
        <>
            <Flex flexDirection="column">
                <Flex flexDirection="row" justifyContent="center" mt="24px">
                    <Flex flexDirection={["column", "column", "column", "row"]} maxWidth="960px" width="100%">
                        <Flex flexDirection="column" flex="1" order={[1, 1, 1, 0]}>
                            <InputWrap>
                                <StyledAddressInput 
                                    value={tokenAddress} 
                                    placeholder={t('Token Address')}
                                    onUserInput={(value) => setTokenAddress(value)} />
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
                                <StyledNumericalInput placeholder={t('Presale Rate, ex. 0.5 CRO')} value={rate} onUserInput={(value) => setRate(value)}/>
                                <StyledInputLabel>
                                    {t('Enter your presale price in CRO: (If I pay 1 CRO, how many tokens do I get?)')}
                                </StyledInputLabel>
                            </InputWrap>
                            <InputWrap>
                                <Flex>
                                    <StyledNumericalInput placeholder={t('Soft Cap ex.50')} style={{marginRight: "4px"}} value={softCap} onUserInput={(value) => setSoftCap(value)}/>
                                    <StyledNumericalInput placeholder={t('Hard Cap ex.100')} style={{marginLeft: "4px"}} value={hardCap} onUserInput={(value) => setHardCap(value)}/>
                                </Flex>
                                <StyledInputLabel>
                                    {t('Enter your desired softcap and hardcap: [soft,hard] (For a small or near 0 soft cap set your softcap to 0.001)')}
                                </StyledInputLabel>
                                
                            </InputWrap>
                            <InputWrap>
                                <StyledIntegerInput placeholder={t('Contribution Limits')} value={contributionLimit} onUserInput={(value) => setContributionLimit(value)} />
                                <StyledInputLabel>
                                    {t('Enter the maximum amounts each wallet can contribute: (max)')}
                                </StyledInputLabel>
                            </InputWrap>
                            <InputWrap>
                                <StyledIntegerInput placeholder={t('CrowFi Swap Liquidity, ex. 60')} value={lpPercent} onUserInput={(value) => setLpPercent(value)}/>
                                <StyledInputLabel>
                                    {t('Enter the percentage of raised funds that should be allocated to Liquidity on CrowFi Swap (Min 51%)')}
                                </StyledInputLabel>
                            </InputWrap>
                            <InputWrap>
                                <StyledNumericalInput placeholder={t('CrowFi Swap Rate ex.400')} value={swapRate} onUserInput={(value) => setSwapRate(value)} />
                                <StyledInputLabel>
                                    {t('Enter CrowFi Swap listing price in CRO: (If I buy 1 CRO worth on CrowFi Swap how many tokens do I get?)')}
                                </StyledInputLabel>
                            </InputWrap>
                            <InputWrap>
                                <DateTimePikcer 
                                onChange={handleStartDateChange}
                                selected={startDate}
                                placeholderText="Presale Start Time"/>
                            </InputWrap>
                            <InputWrap>
                                <DateTimePikcer 
                                onChange={handleEndDateChange}
                                selected={endDate}
                                placeholderText="Presale End Time"/>
                            </InputWrap>
                            <InputWrap>
                                <DateTimePikcer 
                                onChange={handleLockDateChange}
                                selected={lockDate}
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
                                {t('This process is entirely decentralized, we cannot be held responsible for incorrect entry of information or be held liable for anything related to your use of our platform.')}
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