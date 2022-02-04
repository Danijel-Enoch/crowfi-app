import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'contexts/Localization'
import { escapeRegExp } from 'lodash'
import { Text, Flex,  Message, Progress, Button, Heading, Skeleton, Checkbox } from '@pancakeswap/uikit'
import Dots from 'components/Loader/Dots'
import { StyledInputLabel, StyledTextarea } from 'components/Launchpad/StyledControls'
import RadioWithText from 'components/Launchpad/CheckboxWithText'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { useToken } from 'hooks/Tokens'
import useInterval from 'hooks/useInterval'
import useToast from 'hooks/useToast'
import { useTokenBalance } from 'state/wallet/hooks'
import { BIG_TEN } from 'utils/bigNumber'
import { BigNumber} from 'bignumber.js'
import SaleTimer from './SaleTimer'
import { PublicSaleData } from '../../types'
import { useSaleWhitelist, useSaleWhitelistEnabled } from '../../hooks/useWhitelistSale'

interface SaleWhitelistSectionProps {
    sale: PublicSaleData
    account: string
}

const SaleWhitelistSection: React.FC<SaleWhitelistSectionProps> = ({account, sale}) => {

    const { t } = useTranslation()
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
            </Flex>
        </>
    )
}

export default SaleWhitelistSection