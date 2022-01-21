import React, { useCallback, useMemo, useState, lazy } from 'react'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { Text, Flex, Heading, Button, useModal } from '@pancakeswap/uikit'
import { JSBI, Token, TokenAmount } from '@pancakeswap/sdk'
import {StyledAddressInput, StyledTextarea, StyledInputLabel} from 'components/Launchpad/StyledControls'
import ConnectWalletButton from 'components/ConnectWalletButton'
import Loading from 'components/Loading'
import Dots from 'components/Loader/Dots'
import useTheme from 'hooks/useTheme'
import { useToken } from 'hooks/Tokens'
import useTokenBalance from 'hooks/useTokenBalance'
import useToast from 'hooks/useToast'
import { escapeRegExp } from 'utils'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { getAirdropperAddress } from 'utils/addressHelpers'
import BigNumber from 'bignumber.js'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { useAirdropTokeen } from 'views/Airdropper/hooks/useAirdrop'
import { BIG_TEN } from 'utils/bigNumber'
import ConfirmAirdropModal from './ConfirmAirdropModal'

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
    const { account } = useWeb3React()
    const { toastError, toastSuccess } = useToast()
    const [pendingTx, setPendingTx] = useState(false)
    const [tokenAddress, setTokenAddress] = useState<string>('')
    const [airdropText, setAirdropText] = useState<string>('')
    const [errorMessage, setErrorMessage] = useState<string|undefined>(undefined)

    const [txHash, setTxHash] = useState<string|undefined>(undefined)
    const [receipts, setReceipts] = useState(null)
    const [amounts, setAmounts] = useState(null)
    const [totalAirdropAmount, setTotalAirdropAmount] = useState(0)

    const searchToken: Token = useToken(tokenAddress)
    const {balance} = useTokenBalance(searchToken ? searchToken.address : null)
    const {onAirdropToken} = useAirdropTokeen()

    const airdropTextReg = RegExp(`^(0x[0-9a-fA-F]{40},\\d+\\n)*(0x[0-9a-fA-F]{40},\\d+)$`)

    const isAirdopInputValid: boolean = useMemo(() => {
        return airdropText.length > 0 &&  airdropTextReg.test(escapeRegExp(airdropText))
    }, [airdropTextReg, airdropText])

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

    const tokensAirdroppingNumber = searchToken ? new BigNumber(tokensAirdropping, searchToken.decimals) : undefined
    
    const [approval, approveCallback] = useApproveCallback(searchToken ? new TokenAmount(searchToken, JSBI.BigInt(tokensAirdropping)) : undefined, getAirdropperAddress())

    const handleAirdrop = useCallback(async () => {
        try {
            setPendingTx(true)
            const pairs = airdropText.split("\n").map((line) => {
                const elems = line.split(",");
                return {receipt: elems[0], amount: new BigNumber(parseInt(elems.length > 1 ? elems[1] : '0')).multipliedBy(BIG_TEN.pow(searchToken.decimals)).toString()}
            }).reduce((accum, pair) => {
                return {
                    receipts: [...accum.receipts, pair.receipt],
                    amounts: [...accum.amounts, pair.amount]
                }
            }, {receipts: [], amounts: []})

            const hash = await onAirdropToken(searchToken.address, pairs.receipts, pairs.amounts)
            setTxHash(hash)
        } catch (e) {
            setErrorMessage(t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
          console.error(e)
        } finally {
          setPendingTx(false)
        }
      }, [onAirdropToken, t, airdropText, searchToken])

    const [onPresentConfirmModal] = useModal(
        <ConfirmAirdropModal
            token={searchToken}
            receipts={receipts}
            amounts={amounts}
            onConfirm={handleAirdrop}
            txHash={txHash}
            attemptingTxn={pendingTx}
        />,
        true,
        true,
        'confirmAirdopModal'
    )

    const showConfirm = useCallback(async() => {
        setErrorMessage(undefined)
        const pairs = airdropText.split("\n").map((line) => {
            const elems = line.split(",");
            return {receipt: elems[0], amount: new BigNumber(parseInt(elems.length > 1 ? elems[1] : '0')).multipliedBy(BIG_TEN.pow(searchToken.decimals)).toString()}
        }).reduce((accum, pair) => {
            return {
                receipts: [...accum.receipts, pair.receipt],
                amounts: [...accum.amounts, pair.amount]
            }
        }, {receipts: [], amounts: []})
        setReceipts(pairs.receipts)
        setAmounts(pairs.amounts)

        onPresentConfirmModal()
    }, [airdropText, onPresentConfirmModal, searchToken])

    const renderApprovalOrCreateButton = () => {
        return approval === ApprovalState.APPROVED ? (
          <Button
            disabled={pendingTx || !tokensAirdroppingNumber || !tokensAirdroppingNumber.isFinite() || tokensAirdroppingNumber.eq(0) || tokensAirdroppingNumber.gt(balance)}
            onClick={showConfirm}
            width="100%"
          >
            {pendingTx ? (<Dots>{t('Processing...')}</Dots>)  : t('Create')}
          </Button>
        ) : (
          <Button mt="8px" width="100%" disabled={approval === ApprovalState.PENDING || approval === ApprovalState.UNKNOWN} onClick={approveCallback}>
            {approval === ApprovalState.PENDING ? t('Approving') : t('Approve')}
          </Button>
        )
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
                            {!account ? <ConnectWalletButton mt="8px" width="100%" /> : renderApprovalOrCreateButton()}
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