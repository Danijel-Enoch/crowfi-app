import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Button } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

const StyledLink = styled(Link)`
`

const StyledButton = styled(Button)`
    font-family: 'Insanibc', 'Comfortaa', sans-serif;
`


const LaunchButton: React.FC = ({ ...props }) => {
    const { t } = useTranslation()
    return (
    <StyledLink to="/swap">
        <StyledButton >{t('Launch App')}</StyledButton>
    </StyledLink>
    )
  }
  
  export default LaunchButton