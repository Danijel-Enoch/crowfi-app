import React from 'react'
import { Flex } from '@pancakeswap/uikit'
import CreateTokenLocker from './CreateTokenLocker'


export enum ViewMode {
    TOKEN = 'TOKEN',
    LIQUIDITY = 'LIQUIDITY',
}

const CreateLocker: React.FC = () => {

    return (
        <>

            <Flex flexDirection="column" flex="1"margin={["12px", "12px", "12px", "24px"]}>

                <CreateTokenLocker/>
                
            </Flex>
        </>
    )
}

export default CreateLocker