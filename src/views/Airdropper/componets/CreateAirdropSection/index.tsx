import React, { useCallback, useMemo, useState, lazy } from 'react'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { Text, Flex, Box, Input, Heading, Button } from '@pancakeswap/uikit'
import { Token } from '@pancakeswap/sdk'
import {StyledAddressInput, StyledTextarea, StyledInputLabel} from 'components/Launchpad/StyledControls'
import useTheme from 'hooks/useTheme'
import { useToken } from 'hooks/Tokens'
import useTokenBalance from 'hooks/useTokenBalance'
import useToast from 'hooks/useToast'
import { escapeRegExp } from 'utils'
import { getFullDisplayBalance } from 'utils/formatBalance'
import Dots from 'components/Loader/Dots'
import Loading from 'components/Loading'

const EasyMde = lazy(() => import('components/EasyMde'))
const InputWrap = styled.div`
    position: relative;
    padding: 8px 0px;
`

const InputLoadingWrapper = styled(Loading)`
    position: absolute;
    right: 12px;
    top: calc(50% - 12px);
    display: flex;
    justify-content: center;
    align-items: center;
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

const CreateAirdopSection: React.FC = () => {

    const { t } = useTranslation()
    const { theme } = useTheme()
    const { toastError } = useToast()
    const [pendingTx, setPendingTx] = useState(false)
    const [tokenAddress, setTokenAddress] = useState<string>('')
    const [airdropText, setAirdropText] = useState<string>('')

    const searchToken: Token = useToken(tokenAddress)
    const {balance} = useTokenBalance(searchToken ? searchToken.address : null)

    const airdropTextReg = RegExp(`^(0x[0-9a-fA-F]{40},\\d+\\n)*(0x[0-9a-fA-F]{40},\\d+)$`)

    const isAirdopInputValid: boolean = useMemo(() => {
        return airdropText.length > 0 &&  airdropTextReg.test(escapeRegExp(airdropText))
    }, [airdropTextReg, airdropText])

    const isInputInvalid: boolean = useMemo(() => {

        return !searchToken || !isAirdopInputValid || !balance

    }, [searchToken, isAirdopInputValid, balance])

    const tokensAirdropping: number = useMemo(() => {
        if (isAirdopInputValid) {
            return airdropText.split("\n").map((line) => {
                const num = line.length > 1 ? line.split(",")[1] : '0'
                return parseInt(num)
            }).reduce((accum, number) => {
                return accum + number
            })
        }
        return 0
    }, [isAirdopInputValid, airdropText])

    const handleEasyMdeChange = (value: string) => {
        setAirdropText(value)
    }

    const options = useMemo(() => {
        return {
          hideIcons:['guide', 'fullscreen', 'preview', 'side-by-side', 'image'],
        }
      }, [])

    return (
        <>
            <Flex flexDirection="column">
                <Flex flexDirection="row" justifyContent="center" mt="24px">
                    <Flex flexDirection={["column", "column", "column", "row"]} maxWidth="960px" width="100%">
                        <Flex flexDirection="column" flex="1" order={[1, 1, 1, 0]}>
                            <InputWrap>
                                <StyledAddressInput 
                                    value={tokenAddress} 
                                    placeholder={t('Enter Token Address')}
                                    onUserInput={(val) => setTokenAddress(val)} />
                                <InputLoadingWrapper style={{display: tokenAddress.length > 0 && !searchToken ? 'flex' : 'none'}}>
                                    <Loading/>
                                </InputLoadingWrapper>
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
                                <StyledTextarea
                                    hasError={airdropText.length > 0 && !isAirdopInputValid}
                                    value={airdropText}
                                    placeholder={t('Distribution List')}
                                    onUserInput={(val) => setAirdropText(val)}
                                />
                                <StyledInputLabel>
                                    {t('Ex. 0x533C503d97C93B4ac1c6AE8D034c91A72FdF145F,1000 0x888D2F717Dc256617441F989591822dc8D376748,600 0xe728546A7583a43c7fB56315B27953217B36fA1D,1000')}
                                </StyledInputLabel>
                                <StyledInputLabel>
                                    {t('For best results we recommend you do a maximum of 500 Addresses at a time!')}
                                </StyledInputLabel>
                            </InputWrap>

                            <Flex justifyContent="center" mt="12px" mb="12px">
                                <Text textAlign="center" color="secondary" fontSize='14px'>
                                    {t('Total tokens being airdropped')}:
                                </Text>
                                <Text textAlign="center" color="primary" ml="12px">
                                    {tokensAirdropping}
                                </Text>
                            </Flex>

                            <Flex flexDirection="row" justifyContent="center" mt="12px">
                                <Button color="primary" disabled={pendingTx || isInputInvalid}>
                                    {t('Create')}
                                </Button>
                            </Flex>
                        </Flex>
                        <Flex flexDirection="column" order={[0, 0, 0, 1]} margin={["0 0px 24px 0px", "0px 0px 24px 0px", "0px 0px 24px 0px", "0px 0px 0px 48px"]} maxWidth={["100%", "100%", "100%", "50%"]}>
                            <Heading color="primary" mt="8px">
                                {t('Airdrop Instructions:')}
                            </Heading>
                            <StyledList>
                                <li>{t('Airdrop tokens to as many users as desired')}</li>
                                <li>{t('If you are running a sale make sure tokens are not airdropped until after!')}</li>
                                <li>{t('Enter your token address first')}</li>
                                <li>{t('Enter a list of users to airdrop followed by amount (comma separated)')}</li>
                            </StyledList>

                            {/* <Text fontSize='12px' color="primary" mt="24px">{t('Deploy fee')}: </Text> */}
                        </Flex>
                        
                    </Flex>
                </Flex>
            </Flex>
        </>
    )
}

export default CreateAirdopSection