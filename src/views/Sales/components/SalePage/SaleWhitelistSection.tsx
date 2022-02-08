import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { escapeRegExp } from 'lodash'
import { Text, Flex,  Message, Progress, Button, useTooltip, HelpIcon } from '@pancakeswap/uikit'
import Dots from 'components/Loader/Dots'
import { StyledInputLabel, StyledTextarea } from 'components/Launchpad/StyledControls'
import RadioWithText from 'components/Launchpad/CheckboxWithText'
import useToast from 'hooks/useToast'
import { PublicSaleData } from '../../types'
import { useSaleWhitelist, useSaleWhitelistEnabled } from '../../hooks/useWhitelistSale'

const InputWrap = styled.div`
    padding: 8px 4px;
`
const Line = styled.div`
  width: 100%;
  height: 1px;
  margin: 8px 0px;
  background-color : ${({ theme }) => theme.colors.cardBorder};
`

interface SaleWhitelistSectionProps {
    sale: PublicSaleData
    account: string
    onReloadSale?: () => void
}

const SaleWhitelistSection: React.FC<SaleWhitelistSectionProps> = ({account, sale, 
    onReloadSale}) => {

    const { t } = useTranslation()
    const [enabling, setEnabling] = useState(false)
    const [adding, setAdding] = useState(false)
    const [removing, setRemoving] = useState(false)
    const { toastError, toastSuccess } = useToast()
    const [addressListText, setAddressListText] = useState('')
    const addressListReg = RegExp(`^(0x[0-9a-fA-F]{40}\\n)*(0x[0-9a-fA-F]{40})$`)

    const isAddressListValid: boolean = useMemo(() => {
        return addressListText.length > 0 &&  addressListReg.test(escapeRegExp(addressListText))
    }, [addressListReg, addressListText])
    const { onEnableWhitelist} = useSaleWhitelistEnabled(sale.address)
    const { onAddWhitelist, onRemoveWhitelist } = useSaleWhitelist(sale.address)
    const [whitelistEnabled, setWhitelistEnabled] = useState(sale.whitelistEnabled)
    const {
        targetRef: whitelistTargetRef,
        tooltip: whitelistTooltipElement,
        tooltipVisible: whitelistTooltipVisible,
      } = useTooltip("In a private sale, only whitelisted investors can contribute.", {
        placement: 'bottom',
      })

    const handleToggleWhitelist = useCallback(async () => {
        try {
            setEnabling(true)
            const receipt = await onEnableWhitelist(whitelistEnabled)
            onReloadSale()
            toastSuccess(
            `${t('Success')}!`
            )
        } catch (e) {
            console.log('e', e)
            toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))

        } finally {
            setEnabling(false)
        }
    }, [toastError, toastSuccess, t, onEnableWhitelist, onReloadSale, whitelistEnabled])


    const handleAddWhitelist = useCallback(async () => {
        try {
            setAdding(true)
            const addresses = addressListText.split("\n")
            const receipt = await onAddWhitelist(addresses)
            toastSuccess(
            `${t('Success')}!`,
            t('%count% addresses have been added to the whitelist', {count: addresses.length}),
            )
        } catch (e) {
            console.log('e', e)
            toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))

        } finally {
            setAdding(false)
        }
    }, [toastError, toastSuccess, t, onAddWhitelist, addressListText])

    const handleRemoveWhitelist = useCallback(async () => {
        try {
            setRemoving(true)
            const addresses = addressListText.split("\n")
            const receipt = await onRemoveWhitelist(addresses)
            toastSuccess(
            `${t('Success')}!`,
            t('%count% addresses have been removed from the whitelist', {count: addresses.length}),
            )
        } catch (e) {
            console.log('e', e)
            toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))

        } finally {
            setRemoving(false)
        }
    }, [toastError, toastSuccess, t, onRemoveWhitelist, addressListText])

    return (
        <>
            <Flex flexDirection="column" width="100%">

                <InputWrap>
                    <Flex justifyContent="center" alignItems="center">
                        <Text color="primary">
                            {t('Sale type:')}
                        </Text>
                        <span ref={whitelistTargetRef}>
                            <HelpIcon color="textSubtle" width="20px" ml="6px" mt="4px" />
                        </span>
                        { whitelistTooltipVisible && whitelistTooltipElement}
                    </Flex>
                    <Flex justifyContent="center">
                        <Flex mr="24px">
                            <RadioWithText
                                checked={!whitelistEnabled}
                                onClick={() => setWhitelistEnabled(false)}
                                text={t('Public')}
                                />
                        </Flex>
                        <Flex>
                            <RadioWithText
                                checked={whitelistEnabled}
                                onClick={() => setWhitelistEnabled(true)}
                                text={t('Private')}
                                />
                        </Flex>
                    </Flex>
                </InputWrap>

                <Flex justifyContent="center">
                    <Button
                    width="200px"
                    disabled={enabling || removing || adding} 
                    onClick={() => handleToggleWhitelist()}>
                        { enabling ? (<Dots>{t('Saving')}</Dots>) : t('Save')}
                    </Button>
                </Flex>
                {sale.whitelistEnabled ? (
                    <>
                    <Flex margin="16px 0px">
                        <Line />
                    </Flex>
                    <Text fontSize="16px" mb="4px" textAlign="center">
                    {t("Whitelist feature is enabled.")}
                    </Text>

                    <Text fontSize="14px" mb="16px" textAlign="center">
                    {t("Please provide the wallet addresses you want to add or remove in whitelist.")}
                    </Text>

                    <StyledTextarea
                        hasError={addressListText.length > 0 && !isAddressListValid}
                        value={addressListText}
                        placeholder={t('Address List')}
                        onUserInput={(val) => setAddressListText(val)}
                    />
                    <StyledInputLabel>
                        {t('Ex. 0x533C503d97C93B4ac1c6AE8D034c91A72FdF145F 0x888D2F717Dc256617441F989591822dc8D376748 0xe728546A7583a43c7fB56315B27953217B36fA1D')}
                    </StyledInputLabel>
                    <StyledInputLabel>
                        {t('For best results we recommend you do a maximum of 500 Addresses at a time!')}
                    </StyledInputLabel>
                    <Flex>
                        <Flex flex="1" pr="4px">
                            <Button  width="100%"
                            disabled={removing || adding || addressListText.length === 0 || !isAddressListValid} 
                            onClick={() => handleAddWhitelist()}>
                                { adding ? (<Dots>{t('Adding')}</Dots>) : t('Add')}
                            </Button>
                        </Flex>
                        <Flex flex="1" pl="4px">
                            <Button width="100%"
                            disabled={removing || adding || addressListText.length === 0 || !isAddressListValid} 
                            onClick={() => handleRemoveWhitelist()}>
                                { removing ? (<Dots>{t('Removing')}</Dots>) : t('Remove')}
                            </Button>
                        </Flex>
                    </Flex>
                    </>
                ) : (
                    <Text fontSize="16px" mt="16px" mb="4px" textAlign="center">
                    {t("Whitelist feature is disabled.")}
                    </Text>
                )}
                
            </Flex>
        </>
    )
}

export default SaleWhitelistSection