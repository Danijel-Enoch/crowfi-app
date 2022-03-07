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
import { useSaleAirdropEnabled } from '../../hooks/useSaleAirdropEnabled'

const InputWrap = styled.div`
    padding: 8px 4px;
`
const Line = styled.div`
  width: 100%;
  height: 1px;
  margin: 8px 0px;
  background-color : ${({ theme }) => theme.colors.cardBorder};
`

interface SaleAirdropSectionProps {
    sale: PublicSaleData
    account: string
    onReloadSale?: () => void
}

const SaleAirdropSection: React.FC<SaleAirdropSectionProps> = ({account, sale, 
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
    const { onEnableAirdrop } = useSaleAirdropEnabled(sale.address)
    const [airdropEnabled, seteAirdropEnabled] = useState(sale.whitelistEnabled)
    const {
        targetRef: airdropTooltipTargetRef,
        tooltip: airdropTooltipElement,
        tooltipVisible: airdropTooltipVisible,
      } = useTooltip(
      <>
      <ul>
      <li>If enabled, tokens will be airdropped to the investors once the owner finalize this presale.</li>
      <li>Also refunds will be airdropped if the owner cancel this presale.</li>
      <li>Otherwise, if disabled, the investors need to claim tokens/refunds after the presale is closed</li>
      </ul>
      </>, {
        placement: 'bottom',
      })

    const handleToggleWhitelist = useCallback(async () => {
        try {
            setEnabling(true)
            const receipt = await onEnableAirdrop(airdropEnabled)
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
    }, [toastError, toastSuccess, t, onEnableAirdrop, onReloadSale, airdropEnabled])

    return (
        <>
            <Flex flexDirection="column" width="100%">

                <InputWrap>
                    <Flex justifyContent="center" alignItems="center">
                        <Text color="primary">
                            {t('Airdrop Tokens:')}
                        </Text>
                        <span ref={airdropTooltipTargetRef}>
                            <HelpIcon color="textSubtle" width="20px" ml="6px" mt="4px" />
                        </span>
                        { airdropTooltipVisible && airdropTooltipElement}
                    </Flex>
                    <Flex justifyContent="center">
                        <Flex mr="24px">
                            <RadioWithText
                                checked={airdropEnabled}
                                onClick={() => seteAirdropEnabled(true)}
                                text={t('Enable')}
                                />
                        </Flex>
                        <Flex>
                            <RadioWithText
                                checked={!airdropEnabled}
                                onClick={() => seteAirdropEnabled(false)}
                                text={t('Disable')}
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
                {sale.airdropEnabled ? (
                    <Text fontSize="16px" mt="16px" mb="4px" textAlign="center">
                    {t("Airdop feature is enabled.")}
                    </Text>
                ) : (
                    <Text fontSize="16px" mt="16px" mb="4px" textAlign="center">
                    {t("Airdop feature is disabled.")}
                    </Text>
                )}
                
            </Flex>
        </>
    )
}

export default SaleAirdropSection