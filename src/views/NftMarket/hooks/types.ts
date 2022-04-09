import BigNumber from "bignumber.js";
import { NFTAssetType, NFTContractType } from "state/types";

export enum NFTFilterStatus {
  BUY_NOW = "buy_now",
  ON_AUCTION = "on_auction",
  MINTED = "minted",
  HAS_OFFER = "has_offer"
}

export enum NFTActivityType {
  MINT = 0,
  AUCTION = 1,
  AUCTION_CANCELED = 2,
  AUCTION_TAKED = 3,
  AUCTION_TAKED_BACK = 4,
  LISTING = 5,
  LISTING_CANCELED = 6,
  LISTING_DONE = 7,
  BID = 8,
  TRANSFER = 9
}

export enum NFTAssetRegistrationStatus {
  UNKNOWN = 0,
  REGISTERED = 1,
  NOT_REGISTERED = 2
}

/* eslint-disable camelcase */
export interface NFTAttribute {
  id?: any
  trait_type: string
  value: any
  displayName?: string
  max_value?: any
}
export interface NFTTrait {
  trait_type: string
  value: any
  max_value?: any
}

export interface UserResponse {
  name?: string
  address?: string
  createdAt?: string
  portfolio?: string
  banner?: string
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
    chainId?: number
    contract?: string
    contractType?: NFTContractType
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
    id?:any
    trait_type: string
    value: string|number
    max_value?: string|number
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

export interface NFTAsset {
  chainId: number
  contractAddress?: string
  contractType?: NFTContractType
  tokenId?: string
  tokenUri?: string
  mediaType?: string
}

export interface NFTResponse extends NFTAsset {
  id?: number
  name?: string
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
  rows: NFTResponse[]
  count: number
}

export interface NFTAPIResponse {
  nft: NFTResponse
  balance?: NFTBalanceResponse
}

export interface NFTBalanceResponse {
  balance?: number
  owners: number
  total: number
  owner?: UserResponse
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

export interface ActivityResponse {
  id: number
  type: NFTActivityType
  eth: boolean
  price?: number
  priceRaw?: number
  amount?: number
  creationTime: number
  txId: string
  from?: UserResponse
  to?: UserResponse
}

export interface ActivitiesAPIResponse {
  rows: ActivityResponse[]
  count: number
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