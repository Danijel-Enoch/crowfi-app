import React, { useState } from 'react'
import { useTranslation } from 'contexts/Localization'
import { Text, Flex,  Message, Progress, Button } from '@pancakeswap/uikit'
import { StyledNumericalInput } from 'components/Launchpad/StyledControls'
import SaleTimer from './SaleTimer'


const SaleActionSection: React.FC = () => {

    const { t } = useTranslation()
    const [value, setValue] = useState('')
    const endTime = 1648043235

    return (
        <>
            <Flex flexDirection="column" width="100%">
                <Message variant="warning" mb="24px">
                    <Text>
                    {t(
                        "Make sure the website is crowfi.app!",
                    )}
                    </Text>
                </Message>
                <SaleTimer endTime={endTime} />
                <Flex flexDirection="column" mt="8px">
                    <Progress primaryStep={70} />
                    <Flex justifyContent="space-between">
                        <Text fontSize="12px">
                            15 BNB
                        </Text>
                        <Text fontSize="12px">
                            20 BNB
                        </Text>
                    </Flex>
                </Flex>
                <Text fontSize="14px" fontStyle="bold" mt="8px">
                    {t('Amount (max: %amount% %currency%)', {amount: 2, currency:'BNB'})}
                </Text>
                <Flex position="relative">
                    <StyledNumericalInput
                        value={value}
                        onUserInput={(val) => setValue(val)} />
                    <Button scale="xs" style={{position: 'absolute', right: '12px', top: '10px'}}>{t('MAX')}</Button>
                </Flex>
                <Flex justifyContent="center" mt="8px">
                    <Button scale="sm" >{t('Buy')}</Button>
                </Flex>
            </Flex>
        </>
    )
}

export default SaleActionSection