import React, { useState } from 'react'
import styled from 'styled-components'
import { differenceInSeconds } from 'date-fns'
import { Text, Flex } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import useInterval from 'hooks/useInterval'
import { SALE_FINALIZE_DEADLINE } from 'config/constants'

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

const SaleTimer: React.FC<{ startTime: number, endTime: number }> = ({ startTime, endTime}) => {
  const { t } = useTranslation()
  const [days, setDays] = useState('')
  const [hours, setHours] = useState('')
  const [minutes, setMinutes] = useState('')
  const [seconds, setSeconds] = useState('')
  const [text, setText] = useState('')

  useInterval(() => {
    const now = Math.floor(new Date().getTime() / 1000);
    if (now > endTime + SALE_FINALIZE_DEADLINE) {
      setDays('')
      setHours('')
      setMinutes('')
      setSeconds('')
      setText('Expired')
      return;
    }

    let diffTime = 0;

    if (startTime > now) {
      diffTime = startTime - now;
      setText(`${t('Presale starts in')} :`)
    } else if (endTime > now) {
      diffTime = endTime - now;
      setText(`${t('Presale ends in')} :`)
    } else if (endTime + SALE_FINALIZE_DEADLINE > now) {
      diffTime = endTime + SALE_FINALIZE_DEADLINE - now;
      setText(`${t('Needs to be finalized')}`)
    }

    
    
    if (diffTime > 0) {
      const duration = diffTime;
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
      <Text bold>{text}</Text>
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
