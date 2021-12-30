import React from 'react'
import { TokenPairImage, ImageProps } from '@pancakeswap/uikit'
import { cronosTokens, mainnetTokens } from 'config/constants/tokens'

const CakeVaultTokenPairImage: React.FC<Omit<ImageProps, 'src'>> = (props) => {
  const primaryTokenSrc = `/images/tokens/${cronosTokens.crow.address}.svg`

  return <TokenPairImage primarySrc={primaryTokenSrc} secondarySrc="/images/tokens/autorenew.svg" {...props} />
}

export default CakeVaultTokenPairImage
