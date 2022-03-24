import React, { useState } from 'react'
import styled from 'styled-components'
import { Text, Flex, } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import useInterval from 'hooks/useInterval'
import { Auction } from '../../hooks/types'

const AuctionCountDown = styled(Flex)`
  align-items: flex-end;
`

const Item = styled(Text)`
  width: 40px;
  height: 40px;
  font-size: 14px;
  background: #92c8f0;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
  :not(:last-child) {
    margin-right: 8px;
  }
`

const AuctionTimer: React.FC<{ auction: Auction }> = ({ auction }) => {
  const { t } = useTranslation()
  const target = auction.startedAt + auction.duration
  const [day, setDay] = useState('')
  const [hour, setHour] = useState('')
  const [min, setMin] = useState('')
  const [sec, setSec] = useState('')

  useInterval(() => {
    const now = Math.floor(new Date().getTime() / 1000);
    const diffTime = target - now;
    if (diffTime > 0) {
      const duration = diffTime;
      const days = Math.floor(duration / 86400);
      const hours = Math.floor((duration % 86400) / 3600);
      const minutes = Math.floor((duration % 3600) / 60);
      const seconds = duration % 60;
      const dayS = days < 10 ? `0${days}`:`${days}`;
      const hourS = hours < 10 ? `0${hours}`:`${hours}`;
      const minS = minutes < 10 ? `0${minutes}`:`${minutes}`;
      const secS = seconds < 10 ? `0${seconds}`:`${seconds}`;

      setDay(dayS)
      setHour(hourS)
      setMin(minS)
      setSec(secS)
    } else {
      setDay('00')
      setHour('00')
      setMin('00')
      setSec('00')
    }
  }, 1000)
  
  return (
    <Flex alignItems="center">
      <AuctionCountDown>
        <Item>
          {day}
        </Item>
        <Item>
          {hour}
        </Item>
        <Item>
          {min}
        </Item>
        <Item>
          {sec}
        </Item>
      </AuctionCountDown>
    </Flex>
  )
}

export default AuctionTimer
