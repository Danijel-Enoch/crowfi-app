import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { ethers } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { Heading, Flex, Image, Text, Spinner } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import Page from 'components/Layout/Page'
import tokens from 'config/constants/tokens'
import useTokenBalance from 'hooks/useTokenBalance'

import { usePrivateSales, usePollPrivateSalesPublicData, usePollPrivateSalesWithUserData } from 'state/privatesales/hooks'
import PrivateSaleRow from './components/PrivateSaleRow'

const PrivateSales: React.FC = () => {
    const { t } = useTranslation()
    const { data: privateSales, userDataLoaded } = usePrivateSales()
    const { balance: usdcBalance, fetchStatus: usdcFetchStatus } = useTokenBalance(tokens.usdc.address)
    const { account } = useWeb3React()
    const hasData = privateSales.filter((sale) => sale.startDate).length > 0

    usePollPrivateSalesPublicData();
    usePollPrivateSalesWithUserData();
    return (
        <>
            <Page>
                { hasData ?
                (
                    <Flex flexDirection="column">
                        {privateSales.filter((sale) => sale.startDate).map((sale) => (
                            <PrivateSaleRow
                            sale={sale}
                            account={account}
                            usdcBalance={usdcBalance}
                            usdcFetchStatus={usdcFetchStatus}
                            />
                        ))}
                    </Flex>
                )
                :
                (
                    <Flex justifyContent="center" alignItems="center" height="100%">
                        <Spinner />
                    </Flex>
                )
                }
                
                
            </Page>
        </>
    )
}

export default PrivateSales