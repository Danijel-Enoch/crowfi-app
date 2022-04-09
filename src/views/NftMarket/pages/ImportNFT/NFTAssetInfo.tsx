import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Flex, FlexProps, LogoIcon, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { NFTContractTypes } from 'state/types'
import useRefresh from 'hooks/useRefresh'
import { NFTAsset } from '../../hooks/types'
import { useGetNFTBalance } from '../../hooks/useGetNFT'

const Wrapper = styled(Flex).attrs({flexDirection: "column"})`
    width:100%;
    border: 2px dashed rgb(204, 204, 204);
    border-radius: 12px;
    padding: 4px 16px;
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

interface NFTAssetInfoProps extends FlexProps{
    asset?: NFTAsset
    balance?: number
}

const NFTAssetInfo: React.FC<NFTAssetInfoProps> = ({asset, balance, ...props}) => {

    const { t } = useTranslation()

    return (
        <Flex {...props}>
            <Wrapper>
                <FieldGroup>
                    <Label>{t('NFT Type')}</Label>
                    <Text>
                        {asset ? NFTContractTypes[asset.contractType] : '-'}
                    </Text>
                </FieldGroup>
                <FieldGroup>
                    <Label>{t('Your Balance')}</Label>
                    <Text>
                        {balance}
                    </Text>
                </FieldGroup>
            </Wrapper>
        </Flex>
    )
}

export default NFTAssetInfo