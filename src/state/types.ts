import { ThunkAction } from 'redux-thunk'
import { AnyAction } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import {
  CampaignType,
  SerializedFarmConfig,
  LotteryStatus,
  LotteryTicket,
  DeserializedPoolConfig,
  SerializedPoolConfig,
  TranslatableText,
  DeserializedFarmConfig,
  SerializedPrivateSaleConfig,
  DeserializedPrivateSaleConfig
} from 'config/constants/types'

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, State, unknown, AnyAction>

export interface BigNumberToJson {
  type: 'BigNumber'
  hex: string
}

export type SerializedBigNumber = string

export enum NFTAssetType {
  Image = 'image',
  Video = 'video',
  Audio = 'audio'
}

export enum NFTContractType {
  ERC721 = 0,
  ERC1155 = 1
}

export enum ProfileLoginStatus {
  NOT_CONNECTED,
  NOT_LOGGEDIN,
  EXPIRED,
  LOGGEDIN,
}

export interface ProfileAccessTokenData {
  accessToken: string
  expiresAt: number
}

interface SerializedPrivateSaleUserData {
  quoteAllowance: string
  tempAllowance: string
  purchasedBalance: string
  claimedBalance: string
  claimableBalance: string
  whitelisted: boolean
}

export interface DeserializedPrivateSaleUserData {
  quoteAllowance: BigNumber
  tempAllowance: BigNumber
  purchasedBalance: BigNumber
  claimedBalance: BigNumber
  claimableBalance: BigNumber
  whitelisted: boolean
}

export interface SerializedPrivateSale extends SerializedPrivateSaleConfig {
  userData?: SerializedPrivateSaleUserData

  startBlock?: SerializedBigNumber
  endBlock?: SerializedBigNumber
  claimStartBlock?: SerializedBigNumber
  claimEndBlock?: SerializedBigNumber
  whitelistEnabled: boolean
}

export interface DeserializedPrivateSale extends DeserializedPrivateSaleConfig {
  userData?: DeserializedPrivateSaleUserData

  startBlock?: BigNumber
  endBlock?: BigNumber
  claimStartBlock?: BigNumber
  claimEndBlock?: BigNumber
  whitelistEnabled: boolean
}

interface SerializedFarmUserData {
  allowance: string
  tokenBalance: string
  stakedBalance: string
  earnings: string
}

export interface DeserializedFarmUserData {
  allowance: BigNumber
  tokenBalance: BigNumber
  stakedBalance: BigNumber
  earnings: BigNumber
}

export interface SerializedFarm extends SerializedFarmConfig {
  tokenPriceBusd?: string
  quoteTokenPriceBusd?: string
  tokenAmountTotal?: SerializedBigNumber
  lpTotalInQuoteToken?: SerializedBigNumber
  lpTotalSupply?: SerializedBigNumber
  tokenPriceVsQuote?: SerializedBigNumber
  poolWeight?: SerializedBigNumber
  harvestInterval?: SerializedBigNumber
  crowPerBlock?: SerializedBigNumber
  userData?: SerializedFarmUserData
}

export interface DeserializedFarm extends DeserializedFarmConfig {
  tokenPriceBusd?: string
  quoteTokenPriceBusd?: string
  tokenAmountTotal?: BigNumber
  lpTotalInQuoteToken?: BigNumber
  lpTotalSupply?: BigNumber
  tokenPriceVsQuote?: BigNumber
  poolWeight?: BigNumber
  harvestInterval?: BigNumber
  crowPerBlock?: BigNumber
  userData?: DeserializedFarmUserData
}

interface CorePoolProps {
  startBlock?: number
  endBlock?: number
  apr?: number
  stakingTokenPrice?: number
  earningTokenPrice?: number
  isAutoVault?: boolean
}

export interface DeserializedPool extends DeserializedPoolConfig, CorePoolProps {
  totalStaked?: BigNumber
  stakingLimit?: BigNumber
  userData?: {
    allowance: BigNumber
    stakingTokenBalance: BigNumber
    stakedBalance: BigNumber
    pendingReward: BigNumber
  }
}

export interface SerializedPool extends SerializedPoolConfig, CorePoolProps {
  totalStaked?: SerializedBigNumber
  stakingLimit?: SerializedBigNumber
  userData?: {
    allowance: SerializedBigNumber
    stakingTokenBalance: SerializedBigNumber
    stakedBalance: SerializedBigNumber
    pendingReward: SerializedBigNumber
  }
}

// Slices states


export interface SerializedLaunchpadState {
  userDataLoaded: boolean

  totalSaleCount?: number
  fee?: SerializedBigNumber

  userSaleCount?: number
}

export interface DeserializedLaunchpadState {
  userDataLoaded: boolean

  totalSaleCount?: number
  fee?: BigNumber

  userSaleCount?: number
}

export enum LockType {
  NORMAL = "NORMAL",
  LIQUIDITY = "LIQUIDITY",
  UNKNOWN = "UNKNOWN"
}

export interface SerializedLock {
  type: LockType
  id: string
  tokenAddress: string
  owner: string
  amount: SerializedBigNumber
  lockDate: number
  unlockDate: number
}

export interface DeserializedLock {
  type: LockType
  id: string
  tokenAddress: string
  owner: string
  amount: BigNumber
  lockDate: number
  unlockDate: number
}

export interface SerializedLockerUserData {
  normalLockCount: number
  lpLockCount: number

  normalLocks?: SerializedLock[]
  lpLocks?: SerializedLock[]
}

export interface DeserializedLockerUserData {
  normalLockCount: number
  lpLockCount: number

  normalLocks?: DeserializedLock[]
  lpLocks?: DeserializedLock[]
}

export interface SerializedLockerState {
  userDataLoaded: boolean

  toalLockCount?: number
  totalTokenLockedCount?: number
  fee?: SerializedBigNumber

  userData?: SerializedLockerUserData
}

export interface DeserializedLockerState {
  userDataLoaded: boolean

  toalLockCount: number
  totalTokenLockedCount: number
  fee: BigNumber

  userData?: DeserializedLockerUserData
}

export enum TokenType {
  STANDARD = "STANDARD",
  LIQUIDITY = "LIQUIDITY"
}

export interface SerializedTokenData {
  type: number
  address: string
  name: string
  symbol: string
  decimals: number
  totalSupply: SerializedBigNumber
  taxFee?: SerializedBigNumber
  lpFee?: SerializedBigNumber
}

export interface DeserializedTokenData {
  type: TokenType
  address: string
  name: string
  symbol: string
  decimals: number
  totalSupply: BigNumber
  taxFee?: BigNumber
  lpFee?: BigNumber
}

export interface SerializedTokenFactoryState {
  userDataLoaded: boolean

  deployFee?: SerializedBigNumber
  lpDeployFee?: SerializedBigNumber
  totalTokens?: SerializedBigNumber

  userTokens?: SerializedTokenData[]
}

export interface DeserializedTokenFactoryState {
  userDataLoaded: boolean

  deployFee?: BigNumber
  lpDeployFee?: BigNumber
  totalTokens?: BigNumber
  
  userTokens?: DeserializedTokenData[]
}

export interface SerializedPrivateSalesState {
  data: SerializedPrivateSale[]
  loadArchivedData: boolean
  userDataLoaded: boolean
}

export interface DeserializedPrivateSalesState {
  data: DeserializedPrivateSale[]
  loadArchivedData: boolean
  userDataLoaded: boolean
}

export interface SerializedFarmsState {
  data: SerializedFarm[]
  loadArchivedFarmsData: boolean
  userDataLoaded: boolean
}

export interface DeserializedFarmsState {
  data: DeserializedFarm[]
  loadArchivedFarmsData: boolean
  userDataLoaded: boolean
}

export interface VaultFees {
  performanceFee: number
  callFee: number
  withdrawalFee: number
  withdrawalFeePeriod: number
}

export interface VaultUser {
  isLoading: boolean
  userShares: string
  cakeAtLastUserAction: string
  lastDepositedTime: string
  lastUserActionTime: string
}
export interface CakeVault {
  totalShares?: string
  pricePerFullShare?: string
  totalCakeInVault?: string
  estimatedCakeBountyReward?: string
  totalPendingCakeHarvest?: string
  fees?: VaultFees
  userData?: VaultUser
}

export interface PoolsState {
  data: SerializedPool[]
  cakeVault: CakeVault
  userDataLoaded: boolean
}



// Block

export interface BlockState {
  currentBlock: number
  initialBlock: number
}

// Predictions

export enum BetPosition {
  BULL = 'Bull',
  BEAR = 'Bear',
  HOUSE = 'House',
}

export interface Round {
  id: string
  epoch: number
  position: BetPosition
  failed: boolean
  startAt: number
  startBlock: number
  startHash: string
  lockAt: number
  lockBlock: number
  lockHash: string
  lockPrice: number
  lockRoundId: string
  closeAt: number
  closeBlock: number
  closeHash: string
  closePrice: number
  closeRoundId: string
  totalBets: number
  totalAmount: number
  bullBets: number
  bullAmount: number
  bearBets: number
  bearAmount: number
  bets?: Bet[]
}

export interface Market {
  paused: boolean
  epoch: number
}

export interface Bet {
  id?: string
  hash?: string
  amount: number
  position: BetPosition
  claimed: boolean
  claimedAt: number
  claimedBlock: number
  claimedHash: string
  claimedBNB: number
  claimedNetBNB: number
  createdAt: number
  updatedAt: number
  user?: PredictionUser
  round?: Round
}

export interface PredictionUser {
  id: string
  createdAt: number
  updatedAt: number
  block: number
  totalBets: number
  totalBetsBull: number
  totalBetsBear: number
  totalBNB: number
  totalBNBBull: number
  totalBNBBear: number
  totalBetsClaimed: number
  totalBNBClaimed: number
  winRate: number
  averageBNB: number
  netBNB: number
  bets?: Bet[]
}

export enum HistoryFilter {
  ALL = 'all',
  COLLECTED = 'collected',
  UNCOLLECTED = 'uncollected',
}

export interface LedgerData {
  [key: string]: {
    [key: string]: ReduxNodeLedger
  }
}

export interface RoundData {
  [key: string]: ReduxNodeRound
}

export interface ReduxNodeLedger {
  position: BetPosition
  amount: BigNumberToJson
  claimed: boolean
}

export interface NodeLedger {
  position: BetPosition
  amount: ethers.BigNumber
  claimed: boolean
}

export interface ReduxNodeRound {
  epoch: number
  startTimestamp: number | null
  lockTimestamp: number | null
  closeTimestamp: number | null
  lockPrice: BigNumberToJson | null
  closePrice: BigNumberToJson | null
  totalAmount: BigNumberToJson
  bullAmount: BigNumberToJson
  bearAmount: BigNumberToJson
  rewardBaseCalAmount: BigNumberToJson
  rewardAmount: BigNumberToJson
  oracleCalled: boolean
  lockOracleId: string
  closeOracleId: string
}

export interface NodeRound {
  epoch: number
  startTimestamp: number | null
  lockTimestamp: number | null
  closeTimestamp: number | null
  lockPrice: ethers.BigNumber | null
  closePrice: ethers.BigNumber | null
  totalAmount: ethers.BigNumber
  bullAmount: ethers.BigNumber
  bearAmount: ethers.BigNumber
  rewardBaseCalAmount: ethers.BigNumber
  rewardAmount: ethers.BigNumber
  oracleCalled: boolean
  closeOracleId: string
  lockOracleId: string
}

export enum LeaderboardLoadingState {
  INITIAL,
  LOADING,
  IDLE,
}

export type LeaderboardFilterTimePeriod = '1d' | '7d' | '1m' | 'all'

export interface LeaderboardFilter {
  address?: string
  orderBy?: string
  timePeriod?: LeaderboardFilterTimePeriod
}

// Voting

/* eslint-disable camelcase */
/**
 * @see https://hub.snapshot.page/graphql
 */
export interface VoteWhere {
  id?: string
  id_in?: string[]
  voter?: string
  voter_in?: string[]
  proposal?: string
  proposal_in?: string[]
}

export enum SnapshotCommand {
  PROPOSAL = 'proposal',
  VOTE = 'vote',
}

export enum ProposalType {
  ALL = 'all',
  CORE = 'core',
  COMMUNITY = 'community',
}

export enum ProposalState {
  ACTIVE = 'active',
  PENDING = 'pending',
  CLOSED = 'closed',
}

export interface Space {
  id: string
  name: string
}

export interface Proposal {
  author: string
  body: string
  choices: string[]
  end: number
  id: string
  snapshot: string
  space: Space
  start: number
  state: ProposalState
  title: string
}

export interface Vote {
  id: string
  voter: string
  created: number
  space: Space
  proposal: {
    choices: Proposal['choices']
  }
  choice: number
  metadata?: {
    votingPower: string
    verificationHash: string
  }
  _inValid?: boolean
}

export enum VotingStateLoadingStatus {
  INITIAL = 'initial',
  IDLE = 'idle',
  LOADING = 'loading',
  ERROR = 'error',
}

export interface VotingState {
  proposalLoadingStatus: VotingStateLoadingStatus
  proposals: {
    [key: string]: Proposal
  }
  voteLoadingStatus: VotingStateLoadingStatus
  votes: {
    [key: string]: Vote[]
  }
}

export interface LotteryRoundUserTickets {
  isLoading?: boolean
  tickets?: LotteryTicket[]
}

interface LotteryRoundGenerics {
  isLoading?: boolean
  lotteryId: string
  status: LotteryStatus
  startTime: string
  endTime: string
  treasuryFee: string
  firstTicketId: string
  lastTicketId: string
  finalNumber: number
}

export interface LotteryRound extends LotteryRoundGenerics {
  userTickets?: LotteryRoundUserTickets
  priceTicketInCake: BigNumber
  discountDivisor: BigNumber
  amountCollectedInCake: BigNumber
  cakePerBracket: string[]
  countWinnersPerBracket: string[]
  rewardsBreakdown: string[]
}

export interface LotteryResponse extends LotteryRoundGenerics {
  priceTicketInCake: SerializedBigNumber
  discountDivisor: SerializedBigNumber
  amountCollectedInCake: SerializedBigNumber
  cakePerBracket: SerializedBigNumber[]
  countWinnersPerBracket: SerializedBigNumber[]
  rewardsBreakdown: SerializedBigNumber[]
}

export interface LotteryState {
  currentLotteryId: string
  maxNumberTicketsPerBuyOrClaim: string
  isTransitioning: boolean
  currentRound: LotteryResponse & { userTickets?: LotteryRoundUserTickets }
  lotteriesData?: LotteryRoundGraphEntity[]
  userLotteryData?: LotteryUserGraphEntity
}

export interface LotteryRoundGraphEntity {
  id: string
  totalUsers: string
  totalTickets: string
  winningTickets: string
  status: LotteryStatus
  finalNumber: string
  startTime: string
  endTime: string
  ticketPrice: SerializedBigNumber
}

export interface LotteryUserGraphEntity {
  account: string
  totalCake: string
  totalTickets: string
  rounds: UserRound[]
}

export interface UserRound {
  claimed: boolean
  lotteryId: string
  status: LotteryStatus
  endTime: string
  totalTickets: string
  tickets?: LotteryTicket[]
}

export type UserTicketsResponse = [ethers.BigNumber[], number[], boolean[]]

// Global state

export interface State {
  block: BlockState
  farms: SerializedFarmsState
  privatesales: SerializedPrivateSalesState
  pools: PoolsState
  tokenFactory: SerializedTokenFactoryState
  locker: SerializedLockerState
  launchpad: SerializedLaunchpadState
  voting: VotingState
  lottery: LotteryState
}
