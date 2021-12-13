import { Address } from '../types'

export enum CollectionKey {
  CROWFI = 'crowfi',
  SQUAD = 'crowfiSquad',
}

export type Collection = {
  name: string
  description?: string
  slug: string
  address: Address
}

export type Collections = {
  [key in CollectionKey]: Collection
}
