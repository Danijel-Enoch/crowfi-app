import BigNumber from "bignumber.js";
import { NFTAssetType, NFTContractType } from "state/types";

export interface UserResponse {
  name?: string
  address?: string
}
export interface TokenResponse {
  name?: string
  symbol?: string
  decimals?: number
  chainId?: number
  address?: string
}

export interface NFTCollection {
    id: number
    creator: string
    name: string
    symbol: string
    slug?: string
    description?: string
    chainId: number
    contract: string
    contractType: NFTContractType
    logo?: string
    featuredImage?: string
    bannerImage?: string
    site?: string
    discord?: string
    instagram?: string
    medium?: string
    twitter?: string
    telegram?: string
    updatedAt?: string
    createdAt?: string
}

/* eslint-disable camelcase */
export interface NFTMetaAttribute {
    trait_type: string
    value: string|number
}

export interface NFTProperty {
    creator?: string
    type?: NFTAssetType
}

export interface NFTMeta {
    name: string,
    description?: string
    image: string,
    external_url?: string,
    animation_url?: string
    background_color?: string
    attributes?: NFTMetaAttribute[]
    properties?: NFTProperty
}

export interface NFTResponse {
  id?: number
  name?: string
  chainId: number
  contractAddress?: string
  contractType?: NFTContractType
  tokenId?: string
  tokenUri?: string
  currentPrice?: number
  lastPrice?: number
  bestOffer?: number
  thumbnail?: string
  hash?: string
  owner?: string
  supply?: number
  collection?: NFTCollection
}

export interface NFTsAPIResponse {
  nfts: NFTResponse[]
}

export interface NFTAPIResponse {
  nft: NFTResponse
  balances?: BalanceResponse[]
}

export interface BalanceResponse {
  id?: number
  amount: number
  change: number
  user?: UserResponse
}

export interface BalancesAPIResponse {
  balances: BalanceResponse[]
}

export enum AuctionStatus {
  CANCELED = 0,
  ACTIVE = 1,
  COLLECTED = 2,
  COLLECTED_BACK = 3
}

export interface AuctionResponse {
  id?: number
  chainId?: string
  auctionId?: string
  useEth?: boolean
  creationTime?: number
  endAt?: number
  startPrice?: number
  startPriceRaw?: string
  lastPrice?: number
  lastPriceRaw?: string
  status?: AuctionStatus
  txId?: string
  seller?: UserResponse
  token?: TokenResponse
  lastBidderId?: number
}

export interface AuctionsAPIResponse {
  auctions: AuctionResponse[]
}

export interface ListingResponse {
  id?: number
  chainId?: string
  listingId?: string
  useEth?: boolean
  creationTime?: number
  price?: number
  priceRaw?: string
  status?: AuctionStatus
  txId?: string
  seller?: UserResponse
  token?: TokenResponse
}

export interface ListingsAPIResponse {
  listings: AuctionResponse[]
}

export interface BidResponse {
  id: number
  bidder?: UserResponse
  previousBidder?: UserResponse
  auction?: AuctionResponse
  price: number
  priceRaw: string
  profit: number
  profitRaw: string
  creationTime: number
  bidderId?: number
}

export interface BidsAPIResponse {
  bids: BidResponse[]
}

export interface Auction {
  id: string
  nft: string
  contractType: NFTContractType
  tokenId: BigNumber
  amount: BigNumber
  payToken: string
  useEth: boolean
  seller: string
  lastBidder: string
  lastPrice: BigNumber
  raisedAmount: BigNumber
  duration: number
  startedAt: number
  isTaken: boolean
}

export interface Listing {
  id: string
  nft: string
  contractType: NFTContractType
  tokenId: BigNumber
  price: BigNumber
  amount: BigNumber
  payToken: string
  useEth: boolean
  purchaser: string
  seller: string
  isSold: boolean
}