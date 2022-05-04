import { Flex, LogoIcon, Text } from '@pancakeswap/uikit'
import ReactMarkdown from 'components/ReactMarkdown'
import { useTranslation } from 'contexts/Localization'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { NFTMeta, NFTAttribute, NFTTrait } from '../../hooks/types'
import TextTrait from '../../components/TextTrait'
import NumberTrait from '../../components/NumberTrait'

const Wrapper = styled(Flex).attrs({flexDirection: "column"})`
    width:100%;
    border: 2px dashed rgb(204, 204, 204);
    border-radius: 12px;
    padding: 16px;
`

const ImageWrapper = styled.div<{width?: string, height?: string}>`
    width: 120px;
    height: 80px;
    display: flex;
    justify-content:center;
    align-items:center;

    position: relative;
`
const Placeholder = styled.div<{width?: string, height?: string}>`
    width: 120px;
    height: 80px;
    display: flex;
    justify-content:center;
    align-items:center;

    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
`

const Image = styled.img<{width?: string, height?: string, borderRadius?: string}>`
    display: flex;
    object-fit: cover;
    width: 120px;
    height: 80px;
`

const LabelDesc = styled(Text)`
  font-size: 12px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.secondary};
`

const FieldGroup = styled(Flex).attrs({flexDirection:"column"})`
    padding: 12px 0px;
`

const Label = styled(Text)<{required?: boolean}>`
    font-size: 12px;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.primary};

    ${({ required }) =>
    required &&
        `
        &:after {    
            content: " *";
            color: rgb(235, 87, 87);
        }
    `}
`

interface NFTPreviewProps {
    meta?: NFTMeta
}

const NFTMetaPreview: React.FC<NFTPreviewProps> = ({meta}) => {

    const { t } = useTranslation()

    const numberTraits = useMemo(() => {
        if (!meta?.attributes) {
            return []
        }

        return meta?.attributes?.filter((attr) => {
            return typeof attr.value === 'number'
        }).map((attr) => {
            return {
                ...attr
            }
        })
    }, [meta])

    const textTraits = useMemo(() => {
        if (!meta?.attributes) {
            return []
        }

        return meta?.attributes?.filter((attr) => {
            return typeof attr.value !== 'number'
        }).map((attr) => {
            return {
                ...attr
            }
        })
    }, [meta])

    return (
        <Wrapper>
            <Flex alignItems="start">
                <ImageWrapper>
                    <Placeholder >
                        <LogoIcon width="80" opacity="0.3"/>
                    </Placeholder>
                    <Image src={meta?.image}/>
                </ImageWrapper>

                <Flex flexDirection="column" ml="12px">
                    <Flex flexDirection="column" mb="8px">
                        <Label>
                            {t('Name:')}
                        </Label>
                        <Text fontSize="14px">
                            {meta?.name}
                        </Text>
                    </Flex>
                    <Flex flexDirection="column">
                        <Label>
                            {t('Type:')}
                        </Label>
                        <Text fontSize="14px">
                            {meta?.properties?.type}
                        </Text>
                    </Flex>
                </Flex>
            </Flex>
            <Flex flexDirection="column" mt="12px">
                <Label>
                    {t('Description:')}
                </Label>
                <ReactMarkdown>
                    {meta?.description}
                </ReactMarkdown>
            </Flex>

            <FieldGroup>
                <Flex justifyContent="space-between" alignItems="center" mb="8px">
                    <Flex flexDirection="column">
                        <Label>{t('Properties')}</Label>
                        <LabelDesc>
                            {t("Textual traits that show up as rectangles")}
                        </LabelDesc>
                    </Flex>
                </Flex>
                <Flex justifyContent="start" flexWrap="wrap">
                    {textTraits.map((trait) => {
                        return (
                            <Flex marginRight="8px" marginBottom="4px" key={trait.id}>
                                <TextTrait trait={trait}/>
                            </Flex>
                        )
                    })}
                </Flex>
            </FieldGroup>

            <FieldGroup>
                <Flex justifyContent="space-between" alignItems="center" mb="8px">
                    <Flex flexDirection="column">
                        <Label>{t('Stats')}</Label>
                        <LabelDesc>
                            {t("Numerical traits that show as numbers")}
                        </LabelDesc>
                    </Flex>
                </Flex>
                <Flex justifyContent="start" flexWrap="wrap">
                    {numberTraits.map((trait) => {
                        return (
                            <Flex marginRight="8px" marginBottom="4px" key={trait.id}>
                                <NumberTrait trait={trait}/>
                            </Flex>
                        )
                    })}
                </Flex>
            </FieldGroup>
        </Wrapper>
    )
}

export default NFTMetaPreview