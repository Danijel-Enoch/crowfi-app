import React, { useCallback, useMemo, useState } from 'react'
import { Button, CloseIcon, Flex, IconButton, Text} from "@pancakeswap/uikit";
import { NFTAttribute } from 'views/NftMarket/hooks/types';
import { StyledTextInput } from 'components/Launchpad/StyledControls';
import { useTranslation } from 'contexts/Localization';

interface TextTraitRowProps {
    trait: NFTAttribute
    reference?: any
    setType: (type: string, reference?: any) => void
    setValue: (val: string, reference?: any) => void
    removeTrait: (reference?: any) => void
}

const TextTraitRow: React.FC<TextTraitRowProps> = ({trait, reference, setType, setValue, removeTrait}) => {

    const { t } = useTranslation()

    return (
        <Flex margin="4px 0px">
            <Flex flex="1"  mr="8px">
                <StyledTextInput
                    placeholder={t('Type')}
                    value={trait.trait_type}
                    onUserInput={(val) => setType(val, reference)}
                />
            </Flex>
            <Flex flex="1">
                <StyledTextInput 
                    placeholder={t('Name')}
                    value={trait.value}
                    onUserInput={(val) => setValue(val, reference)}
                />
            </Flex>
            <IconButton variant="text" onClick={() => removeTrait(reference)}>
              <CloseIcon />
            </IconButton>
        </Flex>
    )
}

export default TextTraitRow;