import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { ChevronRightIcon, Flex, Button, Text } from '@pancakeswap/uikit'
import truncateHash from 'utils/truncateHash'
import { NFTResponse } from '../../hooks/types'


const RowButton = styled(Button)`
  margin: 4px 0px;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: ${({theme}) => theme.radii.default};
`

const RowWrapper = styled(Flex).attrs({alignItems:'center', justifyContent:'start'})`
  flex: 1;
  background: ${({ theme }) => theme.colors.backgroundAlt2};

  ${({ theme }) => theme.mediaQueries.md} {
  }
`

const ThumbnailWrapper = styled.div`
  display:flex;
  align-items:center;
  justify-content:center;
  margin-right: 12px;
  > img {
    max-height: 60px;
    max-width: unset;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    > img {
      height: 60px;
    }
  }
`

interface NFTGradeRowProps {
    nft: NFTResponse
    selectable?: boolean
    onSelect: () => void
  }

const NFTRow: React.FC<NFTGradeRowProps> = ({ nft, selectable, onSelect }) => {
    return (
        <Flex flexDirection="column">
            <RowButton variant='text' style={{height: 'auto'}} onClick={() => {
            if (selectable) {
                onSelect()
            }
            }}>
                <RowWrapper>
                    <ThumbnailWrapper>
                        <img src={nft.thumbnail} alt={nft.name}/>
                    </ThumbnailWrapper>
                    <Flex flexDirection="column" alignItems="start" flex="1">
                        <Text fontSize="15px" fontWeight="bold" textAlign="center" color="primary">
                            {nft.name}
                        </Text>
                        <Text fontSize="12px" color="secondary" mr="8px">
                            {truncateHash(nft.contractAddress)}
                        </Text>
                        <Text fontSize="12px" color="secondary" mr="8px">
                            {nft.tokenId}
                        </Text>
                        <Text fontSize="12px" color="secondary" mr="8px">
                            {nft.balance}
                        </Text>
                    </Flex>
                    { selectable && (
                      <ChevronRightIcon />
                    )}
                </RowWrapper>
            </RowButton>
        </Flex>
    )
}

export default NFTRow;