import React, { useCallback, useMemo, useState } from 'react'
import { Button, CloseIcon, Flex, IconButton, Text} from "@pancakeswap/uikit";
import styled from "styled-components";
import { NFTAttribute } from 'views/NftMarket/hooks/types';
import { StyledIntegerInput, StyledNumericalInput, StyledTextInput } from 'components/Launchpad/StyledControls';
import { useTranslation } from 'contexts/Localization';

interface NumberTraitRowProps {
    hasError?: boolean
    trait: NFTAttribute
    reference?: any
    setType: (type: string, reference?: any) => void
    setValue: (val: string, reference?: any) => void
    setMaxValue: (val: string, reference?: any) => void
    removeTrait: (reference?: any) => void
}

const NumberTraitRow: React.FC<NumberTraitRowProps> = ({hasError, trait, reference, setType, setValue, setMaxValue, removeTrait}) => {

    const { t } = useTranslation()

    return (
        <Flex margin="4px 0px">
            <Flex flex="1"  mr="8px">
                <StyledTextInput
                    error={hasError}
                    placeholder={t('Type')}
                    value={trait.trait_type}
                    onUserInput={(val) => setType(val, reference)}
                />
            </Flex>
            <Flex flex="1"  mr="8px">
                <StyledNumericalInput 
                    error={hasError}
                    placeholder={t('Value')}
                    value={trait.value}
                    onUserInput={(val) => setValue(val, reference)}
                />
            </Flex>
            <Flex flex="1">
                <StyledNumericalInput 
                    error={hasError}
                    placeholder={t('Max')}
                    value={trait.max_value}
                    onUserInput={(val) => setMaxValue(val, reference)}
                />
            </Flex>
            <IconButton variant="text" onClick={() => removeTrait(reference)}>
              <CloseIcon />
            </IconButton>
        </Flex>
    )
}

export default NumberTraitRow;