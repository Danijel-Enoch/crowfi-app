import React, { useState } from 'react'
import styled from 'styled-components'
import { differenceInSeconds } from 'date-fns'
import { Text, Flex } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import useInterval from 'hooks/useInterval'

const SaleCountDown = styled(Flex)`
  align-items: flex-end;
  margin: 0 16px 0 16px;
`

const SaleCountDownText = styled(Text)`
  font-size: 12px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.backgroundAlt2};
  border-radius: 8px;
  margin: 4px;
`

const SaleTimer: React.FC<{ endTime: number }> = ({ endTime }) => {
  const { t } = useTranslation()
  const [days, setDays] = useState('')
  const [hours, setHours] = useState('')
  const [minutes, setMinutes] = useState('')
  const [seconds, setSeconds] = useState('')

  useInterval(() => {
    const now = new Date().getTime();
    const diffTime = endTime * 1000 - now;
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
  }, 1000)
  return (
    <Flex flexDirection="column"  alignItems="center">
      <Text bold>{t('Presale Ends In')}: </Text>
      <SaleCountDown>
        <SaleCountDownText>
          {days}
        </SaleCountDownText>
        <SaleCountDownText>
          {hours}
        </SaleCountDownText>
        <SaleCountDownText>
          {minutes}
        </SaleCountDownText>
        <SaleCountDownText>
          {seconds}
        </SaleCountDownText>
      </SaleCountDown>
    </Flex>
  )
}

export default SaleTimer
