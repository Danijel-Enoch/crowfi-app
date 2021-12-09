import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { ethers } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { Heading, Flex, Image, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import Page from 'components/Layout/Page'
import PageHeader from 'components/PageHeader'

import { usePrivateSales, usePollPrivateSalesPublicData, usePollPrivateSalesWithUserData } from 'state/privatesales/hooks'
import PrivateSaleRow from './components/PrivateSaleRow'

const PrivateSales: React.FC = () => {
    const { t } = useTranslation()
    const { data: privateSales, userDataLoaded } = usePrivateSales()
    const { account } = useWeb3React()

    usePollPrivateSalesPublicData();
    usePollPrivateSalesWithUserData();
    return (
        <>
            <Page>
                {/* <PageHeader>
                    <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
                        <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
                            <Heading as="h1" scale="xxl" color="secondary" mb="24px">
                            {t('Private Sales')}
                            </Heading>
                            <Heading scale="md" color="text">
                            {t('Join the CrowFi Private Sales and get tokens at a cheaper price.')}
                            </Heading>
                            <Heading scale="md" color="text">
                            {t('High APR, low risk.')}
                            </Heading>
                        </Flex>
                    </Flex>
                </PageHeader> */}
                <Flex flexDirection="column">
                    {privateSales.filter((sale) => sale.startDate).map((sale) => (
                        <PrivateSaleRow
                        sale={sale}
                        account={account}
                        />
                    ))}
                </Flex>
            </Page>
        </>
    )
}

export default PrivateSales