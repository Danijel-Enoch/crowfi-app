import React from 'react'
import { FlexProps } from '@pancakeswap/uikit'
import { QRCode } from 'react-qrcode-logo';
import {rot13} from 'utils/encode'


interface ReferralQRCodeProps extends FlexProps {
    account: string
  }


const ReferralQRCode : React.FC<ReferralQRCodeProps> = ({ account }) => {

    const link = `${window.location.protocol}//${window.location.host}/?ref=${rot13(account)}`

    return (
        <QRCode value={link} logoImage="https://crowfi.app/logo.png"/>
    )

}

export default ReferralQRCode