import { useCallback } from 'react'
import { callWithEstimateGas } from 'utils/calls'
import { useNFTFactoryContract, useNFT1155FactoryContract } from 'hooks/useContract'
import { useWeb3React } from '@web3-react/core'
import getGasPrice from 'utils/getGasPrice'
import { useProfileTokenData } from 'state/profile/hooks'
import useWeb3Provider from 'hooks/useActiveWeb3React'
import { API_PROFILE } from 'config/constants/endpoints'
import { NFTContractType } from 'state/types'

export const useCreateNFTTokenContract = () => {
  const tokenFactory = useNFT1155FactoryContract()

  const handleCreateTokenContract = useCallback(
    async (tokenName, symbol, baseUri) => {
      const gasPrice = getGasPrice()
      // const tx = await callWithEstimateGas(tokenFactory, 'create', [tokenName, symbol], { gasPrice})
      const tx = await callWithEstimateGas(tokenFactory, 'create', [baseUri], { gasPrice})
      const receipt = await tx.wait()
      if (receipt.status === 1) {
        /* eslint-disable dot-notation */
        const ev = Array.from(receipt["events"]).filter((v) =>  {
          return v["event"] === "TokenCreated"
        });

        if (ev.length > 0) {
          const resArgs = ev[0]["args"];

          return resArgs['token'];
        }
        /* eslint-enable dot-notation */
      }
      return null
    },
    [tokenFactory],
  )

  return { onCreateTokenContract: handleCreateTokenContract }
}

export const useRegisterCollection = () => {
  const [tokenData] = useProfileTokenData()
  const { chainId } = useWeb3Provider()
  const {account} = useWeb3React()
  const handleRegisterCollection = useCallback(async(
    contractAddress: string,
    contractType: NFTContractType,
    name: string,
    symbol: string,
    slug: string,
    description?: string, 
    site?: string, 
    discord?: string, 
    instagram?: string, 
    medium?: string, 
    twitter?: string, 
    telegram?: string,
    logo?: File,
    featuredImage?: File,
    banner?: File) => {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('symbol', symbol)
      formData.append('slug', slug)
      if (description && description.length > 0) formData.append('description', description)
      formData.append('creator', account.toLowerCase())
      if (contractAddress) formData.append('contract', contractAddress.toLowerCase())
      formData.append('contractType', contractType.toString())
      formData.append('chainId', `${chainId}`)
      if (site && site.length > 0) formData.append('site', site)
      if (discord && discord.length > 0) formData.append('discord', `https://discord.gg/${discord}`)
      if (instagram && instagram.length > 0) formData.append('instagram', `https://instagram.com/${instagram}`)
      if (medium && medium.length > 0) formData.append('medium', medium)
      if (twitter && twitter.length > 0) formData.append('twitter', `https://twitter.com/${twitter}`)
      if (telegram && telegram.length > 0) formData.append('telegram', `https://t.me/${telegram}`)
      if (logo) formData.append('logo', logo, logo.name)
      if (featuredImage) formData.append('featuredImage', featuredImage, featuredImage.name)
      if (banner) formData.append('bannerImage', banner, banner.name)
      const response = await fetch(`${API_PROFILE}/collections`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenData.accessToken}`
        },
        body: formData,
      })

      if (response.ok) {
          const data = await response.json()
          return data?.collection
      }

      const error = await response.json()
      throw new Error(error?.message)
      
  }, [tokenData, account, chainId])

  return { onRegisterCollection: handleRegisterCollection }
}

