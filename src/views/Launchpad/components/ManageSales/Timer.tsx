import React, { useState } from 'react'
import styled from 'styled-components'
import { Tag, Flex, Text } from '@pancakeswap/uikit'
import useInterval from 'hooks/useInterval'
import { useTranslation } from 'contexts/Localization'

export interface TimerProps {
    target: number
}

const Wrapper = styled(Flex)`
    flex-direction: column;
`

const MultiplierTag = styled(Tag)`
  margin-left: 4px;
`

const NumberText = styled(Text)`
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.backgroundAlt};
    border-radius: 8px;
    font-size: 16px;
    width: 40px;
    height: 40px;
    margin: 4px;
    
`
const LabelText = styled(Text)`
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.colors.secondary};
    font-size: 10px;
    border-radius: 8px;
    width: 40px;
    margin: 4px;
`

const Timer: React.FC<TimerProps> = ({ target }) => {
  const { t } = useTranslation()
  const [days, setDays] = useState('')
  const [hours, setHours] = useState('')
  const [minutes, setMinutes] = useState('')
  const [seconds, setSeconds] = useState('')
  useInterval(() => {
    if (target) {
      const target_ = target * 1000;
      const now = new Date().getTime();
      const diffTime = target_ - now;
      if (diffTime > 0) {
        const duration = Math.floor(diffTime / 1000);
        const d = Math.floor(duration / 86400);
        const h = Math.floor((duration % 86400) / 3600);
        const m = Math.floor((duration % 3600) / 60);
        const s = duration % 60;

        setDays(d < 10 ? `0${d}`:`${d}`)
        setHours(h < 10 ? `0${h}`:`${h}`)
        setMinutes(m < 10 ? `0${m}`:`${m}`)
        setSeconds(s < 10 ? `0${s}`:`${s}`)
      } else {
        setDays('')
        setHours('')
        setMinutes('')
        setSeconds('')
      }
    } else {
        setDays('')
        setHours('')
        setMinutes('')
        setSeconds('')
    }
  }, 1000)

  return (
    <Wrapper justifyContent="center" alignItems="center" mb="12px">
      <Flex alignItems="center">
        <NumberText>{days}</NumberText>
        <NumberText>{hours}</NumberText>
        <NumberText>{minutes}</NumberText>
        <NumberText>{seconds}</NumberText>
      </Flex>
      <Flex alignItems="center">
        <LabelText>{t('Days')}</LabelText>
        <LabelText>{t('Hours')}</LabelText>
        <LabelText>{t('Minutes')}</LabelText>
        <LabelText>{t('Seconds')}</LabelText>
      </Flex>
    </Wrapper>
  )
}

export default Timer
