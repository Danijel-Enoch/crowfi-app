import React from 'react'
import { Flex } from '@pancakeswap/uikit'
import { Redirect } from 'react-router-dom'
import styled from 'styled-components'
import { useProfileLoggedIn} from 'state/profile/hooks'
import { ProfileLoginStatus } from 'state/types'
import AuthGuard from '../Auth'

const Profile: React.FC = () => {
    const {loginStatus, profileAddress} = useProfileLoggedIn()

    if (loginStatus !== ProfileLoginStatus.LOGGEDIN) {
        return <AuthGuard/>
    }

    return <Redirect to={`/nft/profile/${profileAddress}`}/>
}

export default Profile