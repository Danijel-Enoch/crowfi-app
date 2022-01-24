import React, { useState } from 'react'
import { useTranslation } from 'contexts/Localization'
import { Text, Flex,  Message, Progress, Button } from '@pancakeswap/uikit'
import { StyledNumericalInput } from 'components/Launchpad/StyledControls'
import UnlockTimer from './UnlockTimer'


const LockerActionSection: React.FC = () => {

    const { t } = useTranslation()
    const [value, setValue] = useState('')
    const endTime = 1648043235

    const onPercentClick = (percent: number) => {
        console.log(percent)
    }

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
                <UnlockTimer endTime={endTime} />
                <Flex flexDirection="column" mt="8px">
                    <Progress primaryStep={70} />
                    <Flex justifyContent="space-between">
                        <Text fontSize="12px">
                            8000 CROW
                        </Text>
                        <Text fontSize="12px">
                            9965 CROW
                        </Text>
                    </Flex>
                </Flex>
                <Text fontSize="14px" fontStyle="bold" mt="8px">
                    {t('Amount (max: %amount% %currency%)', {amount: 1965, currency:'CROW'})}
                </Text>
                <Flex flexDirection="column">
                    <StyledNumericalInput
                        value={value}
                        onUserInput={(val) => setValue(val)} />
                    <Flex justifyContent="space-between" mt="4px" flexWrap="wrap">
                        <Button mb="4px" scale="sm" variant="tertiary" onClick={() => onPercentClick(25)}>
                            25%
                        </Button>
                        <Button mb="4px" scale="sm" variant="tertiary" onClick={() => onPercentClick(50)}>
                            50%
                        </Button>
                        <Button mb="4px" scale="sm" variant="tertiary" onClick={() => onPercentClick(75)}>
                            75%
                        </Button>
                        <Button mb="4px" scale="sm" variant="tertiary" onClick={() => onPercentClick(100)}>
                            MAX
                        </Button>
                    </Flex>
                </Flex>
                <Flex justifyContent="center" mt="16px">
                    <Button scale="sm" >{t('Withdraw')}</Button>
                </Flex>
            </Flex>
        </>
    )
}

export default LockerActionSection