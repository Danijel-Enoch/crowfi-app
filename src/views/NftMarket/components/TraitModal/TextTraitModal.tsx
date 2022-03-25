import React, { useCallback, useMemo, useState } from 'react'
import { InjectedModalProps, Heading, Button, Flex, Text, ModalContainer, ModalHeader, ModalTitle, ModalCloseButton, ModalBody } from "@pancakeswap/uikit";
import styled from "styled-components";
import { useTranslation } from 'contexts/Localization';
import { ModalActions } from 'components/Modal'
import { NFTAttribute } from 'views/NftMarket/hooks/types';
import TextTraitRow from './TextTraitRow';

const StyledModalContainer = styled(ModalContainer)`
  max-width: 420px;
  width: 100%;
`

const StyledModalBody = styled(ModalBody)`
  padding: 24px;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`
interface TraitModalProps {
    attributes?: NFTAttribute[]
    onComplete: (traits: NFTAttribute[]) => void
}
const TextTraitModal: React.FC<InjectedModalProps & TraitModalProps> = ({ attributes, onDismiss, onComplete }) => {
    const { t } = useTranslation()

    const [traits, setTraits] = useState<NFTAttribute[]>(attributes?.length > 0 ? attributes : [{
        trait_type: '',
        value: ''
    }])

    const handleAddMore = () => {
        const newTrait = {
            trait_type: '',
            value: ''
        }
        setTraits([...traits, newTrait])
    }

    const handleChangeType = (val, index) =>  {
        traits[index].trait_type = val
        setTraits([...traits])
    }

    const handleChangeValue = (val, index) =>  {
        traits[index].value = val
        setTraits([...traits])
    }

    const handleRemoveTrait = (index) => {
        traits.splice(index, 1)
        if (traits.length === 0) {
            setTraits([{
                trait_type: '',
                value: ''
            }])
        } else {
            setTraits([...traits])
        }
    }

    const handleSave = async () => {
        const result = traits.filter((trait) => trait.trait_type.length > 0 && trait.value.length > 0)
        onComplete(result)
        onDismiss()
    }

    return (
        <StyledModalContainer minWidth="320px">
            <ModalHeader>
                <ModalTitle>
                    <Heading>{t('Add Properties')}</Heading>
                </ModalTitle>
                <ModalCloseButton onDismiss={onDismiss} />
            </ModalHeader>
            <StyledModalBody>

                <Flex flexDirection="column">
                    <Text mb="8px">{t("Properties show up underneath your item, are clickable, and can be filtered in your sidebar")}</Text>
                    <Flex flexDirection="column">
                        {
                            traits.map((trait, index) => {
                                return (
                                <TextTraitRow
                                    key={trait.id}
                                    trait={trait}
                                    reference={index}
                                    setType={handleChangeType}
                                    setValue={handleChangeValue}
                                    removeTrait={handleRemoveTrait}
                                />
                                )
                            })
                        }
                    </Flex>
                    <Flex>
                        <Button scale="md" variant="secondary" onClick={handleAddMore}>
                            {t('Add More')}
                        </Button>
                    </Flex>
                </Flex>

                <ModalActions>
                    <Button scale="md" variant="primary" onClick={handleSave} width="100%">
                        {t('Save')}
                    </Button>
                </ModalActions>
            </StyledModalBody>
        </StyledModalContainer>
    )
}

export default TextTraitModal