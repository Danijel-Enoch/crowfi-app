import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { ArrowBackIcon, ArrowForwardIcon, Box, Flex, Skeleton, Text, useMatchBreakpoints, LinkExternal } from '@pancakeswap/uikit'
import { format } from 'date-fns'
import { getBscScanLink } from 'utils'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { TokenPairImage } from 'components/TokenImage'
import { DeserializedLock } from 'state/types'
import { CronosPairToken } from '../typs'

const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  align-items: center;

  padding: 0 24px;

  grid-template-columns: 20px 3fr repeat(4, 1fr);

  @media screen and (max-width: 900px) {
    grid-template-columns: 20px 2fr repeat(3, 1fr);
    & :nth-child(4) {
      display: none;
    }
  }

  @media screen and (max-width: 800px) {
    grid-template-columns: 20px 2fr repeat(2, 1fr);
    & :nth-child(6) {
      display: none;
    }
  }

  @media screen and (max-width: 670px) {
    grid-template-columns: 1fr 1fr;
    > *:first-child {
      display: none;
    }
    > *:nth-child(3) {
      display: none;
    }
  }
`
export const ClickableColumnHeader = styled(Text)`
  cursor: pointer;
`

export const TableWrapper = styled(Flex)`
  width: 100%;
  padding-top: 16px;
  flex-direction: column;
  gap: 16px;
  background-color: ${({ theme }) => theme.card.background};
  border-radius: ${({ theme }) => theme.radii.card};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
`

export const Break = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.cardBorder};
  width: 100%;
`

export const PageButtons = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.2em;
  margin-bottom: 1.2em;
`
export const Arrow = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  padding: 0 20px;
  :hover {
    cursor: pointer;
  }
`

const TableLoader: React.FC = () => {
    const loadingRow = (
        <ResponsiveGrid>
            <Skeleton/>
            <Skeleton/>
            <Skeleton/>
            <Skeleton/>
            <Skeleton/>
        </ResponsiveGrid>
    )
    return (
      <>
        {loadingRow}
        {loadingRow}
        {loadingRow}
        {loadingRow}
      </>
    )
}

const DataRow: React.FC<{ 
    pairData: CronosPairToken
    index: number
    locks?: DeserializedLock[]
}> = ({ pairData, locks, index }) => {
    const { isXs, isSm } = useMatchBreakpoints()
    const { t } = useTranslation()
    return (
        <ResponsiveGrid>
            <Flex>
                <Text>{index + 1}</Text>
            </Flex>
            <Flex alignItems="center">
                <TokenPairImage variant="inverted" primaryToken={pairData.token0} secondaryToken={pairData.token1} width={64} height={64} />
                <Text ml="8px">{pairData.name}</Text>
            </Flex>
            <Text fontWeight={400}>{format(new Date(pairData.timestamp * 1000), 'MMM. dd yyyy, hh:mm aa')}</Text>
            <Flex alignItems="center" flexWrap="wrap">
                <LinkExternal href={getBscScanLink(pairData.address, 'address')}>{t('Contract')}</LinkExternal>
                <LinkExternal href={getBscScanLink(pairData.address, 'token-holders')}>{t('LP Holders')}</LinkExternal>
            </Flex>
            <Flex alignItems="center" flexWrap="wrap">
            {locks && locks.length > 0 ? (
                <>
                {locks.map((lock) => {
                    return (
                        <LinkExternal href={`/lockers/${lock.id}`}>Lock #{lock.id}</LinkExternal>
                    )
                })}
                </>
            ) : locks ? (
                <Text fontWeight={400}>
                    {t('No Locks')}
                </Text>
            ) : (
                <Text fontWeight={400}>
                    -
                </Text>
            )}
            </Flex>
        </ResponsiveGrid>
    )
  }

const SORT_FIELD = {
    name: 'name',
    timestamp: 'timestamp'
}
const MAX_ITEMS = 10
const TokensTable:React.FC<{
    pairs: CronosPairToken[]
    lockMap: Map<string, DeserializedLock[]>
    maxItems?: number
}> = ({pairs, lockMap, maxItems = MAX_ITEMS}) => {

    const { t } = useTranslation()
    const [page, setPage] = useState(1)
    const [maxPage, setMaxPage] = useState(1)
    const [sortField, setSortField] = useState(SORT_FIELD.name)
    const [sortDirection, setSortDirection] = useState<boolean>(true)

    useEffect(() => {
      let extraPages = 1
      if (pairs) {
        if (pairs.length % maxItems === 0) {
          extraPages = 0
        }
        setMaxPage(Math.floor(pairs.length / maxItems) + extraPages)
      }
    }, [maxItems, pairs])

    const sortedTokens = useMemo(() => {
      return pairs
        ? pairs
            .sort((a, b) => {
              if (a && b) {
                return a[sortField as keyof CronosPairToken] > b[sortField as keyof CronosPairToken]
                  ? (sortDirection ? -1 : 1) * 1
                  : (sortDirection ? -1 : 1) * -1
              }
              return -1
            })
            .slice(maxItems * (page - 1), page * maxItems)
        : []
    }, [pairs, maxItems, page, sortDirection, sortField])

    const handleSort = useCallback(
        (newField: string) => {
          setSortField(newField)
          setSortDirection(sortField !== newField ? true : !sortDirection)
        },
        [sortDirection, sortField],
      )

    return (
        <TableWrapper>
            <ResponsiveGrid>
                <Text color="secondary" fontSize="12px" bold>
                    #
                </Text>
                <ClickableColumnHeader
                    color="secondary"
                    fontSize="12px"
                    bold
                    onClick={() => handleSort(SORT_FIELD.name)}
                    textTransform="uppercase"
                >
                    {t('Name')}
                </ClickableColumnHeader>
                <ClickableColumnHeader
                    color="secondary"
                    fontSize="12px"
                    bold
                    onClick={() => handleSort(SORT_FIELD.timestamp)}
                    textTransform="uppercase"
                >
                    {t('Creation Time')}
                </ClickableColumnHeader>
                <ClickableColumnHeader
                    color="secondary"
                    fontSize="12px"
                    bold
                    textTransform="uppercase"
                >
                    {t('Info')}
                </ClickableColumnHeader>
                <ClickableColumnHeader
                    color="secondary"
                    fontSize="12px"
                    bold
                    textTransform="uppercase"
                >
                    {t('Locked')}
                </ClickableColumnHeader>
            </ResponsiveGrid>
            <Break />
            { sortedTokens.length > 0 ? (
                <>
                    {sortedTokens.map((pair, i) => {
                        return (
                            <React.Fragment key={pair.address}>
                              <DataRow index={(page - 1) * MAX_ITEMS + i} pairData={pair} locks={lockMap.get(pair.address)} />
                              <Break />
                            </React.Fragment>
                        )
                    })}
                    <PageButtons>
                      <Arrow
                        onClick={() => {
                          setPage(page === 1 ? page : page - 1)
                        }}
                      >
                        <ArrowBackIcon color={page === 1 ? 'textDisabled' : 'primary'} />
                      </Arrow>
                      <Text>{t('Page %page% of %maxPage%', { page, maxPage })}</Text>
                      <Arrow
                        onClick={() => {
                          setPage(page === maxPage ? page : page + 1)
                        }}
                      >
                        <ArrowForwardIcon color={page === maxPage ? 'textDisabled' : 'primary'} />
                      </Arrow>
                    </PageButtons>
                </>
            ) : (
                <>
                <TableLoader />
                <Box/>
                </>
            )}
        </TableWrapper>
    )
}

export default TokensTable;