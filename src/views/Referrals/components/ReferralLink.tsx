import React, { useState } from 'react'
import { Input, Heading, Button } from '@pancakeswap/uikit'
import { ToastContainer } from 'components/Toast'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import { BASE_URL } from 'config'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {rot13} from 'utils/encode'

const StyleInput = styled(Input)`
    margin-top: 10px;
`

const ReferralLink = () => {
    const { account } = useWeb3React()
    const [toasts, setToasts] = useState([]);

    const handleClick = (description = "") => {
        const now = Date.now();
        const randomToast = {
        id: `id-${now}`,
        title: `Copied`,
        description,
        type: "success",
        };

        setToasts((prevToasts) => [randomToast, ...prevToasts]);
    };

    const handleRemove = (id: string) => {
        setToasts((prevToasts) => prevToasts.filter((prevToast) => prevToast.id !== id));
    };

    return (
        <div>
            <Heading size="md">Your Referral Link</Heading>
            <StyleInput type="text" scale="md" value={`${BASE_URL}/?ref=${rot13(account)}`} readOnly />
            <CopyToClipboard text={`${BASE_URL}/?ref=${rot13(account)}`} onCopy={()=> {handleClick()}}>
                <Button variant="primary" mt="8px">Copy</Button>
            </CopyToClipboard>
            <ToastContainer toasts={toasts} onRemove={handleRemove} />
        </div>
    )

}

export default ReferralLink