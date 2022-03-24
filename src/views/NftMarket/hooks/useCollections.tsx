import { API_PROFILE } from "config/constants/endpoints"
import { useEffect, useState } from "react"
import { NFTCollection } from "./types"

export enum SlugAvailability {
  UNKNOWN,
  VALID,
  INVALID
}

export interface CollectionAPIResponse {
  collection: NFTCollection
}
export interface CollectionsAPIResponse {
  collections: NFTCollection[]
}
export const getCollectionsWithQueryParams = async (params:any): Promise<NFTCollection[]> => {
  const url = new URL(`${API_PROFILE}/collections`)
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
  const response = await fetch(url.toString())
  if (response.ok) {
    const res: CollectionsAPIResponse = await response.json()
    return res.collections
  }
  return []
}

export const getCollectionWithSlug = async (slug?: string) => {
  const response = await fetch(`${API_PROFILE}/collections/${slug}`, {
      method: 'GET'
  })
  if (response.ok) {
    const res: CollectionAPIResponse = await response.json()
    return res.collection
  }
  return undefined
}

export const useCollectionSlugAvailability = (slug?: string) => {
    const { UNKNOWN, VALID, INVALID } = SlugAvailability
    const [slugAvailability, setSlugAvailability] = useState<SlugAvailability>(UNKNOWN)
  
    useEffect(() => {
      const fetchAvailibity = async () => {
        try {
          const response = await fetch(`${API_PROFILE}/collections/slug-test`, {
              method: 'POST',
              headers: {
              'Content-Type': 'application/json',
              },
              body: JSON.stringify({
              slug
              }),
          })
          if (response.ok) {
            const data = await response.json()
            setSlugAvailability(data?.valid === true ? VALID : INVALID)
          } else {
            setSlugAvailability(INVALID)
          }
        } catch (e) {
          setSlugAvailability(INVALID)
        }
      }


      if (slug && slug.length > 0) {
        fetchAvailibity()
      } else {
        setSlugAvailability(INVALID)
      }
    }, [slug, UNKNOWN, VALID, INVALID])
  
    return slugAvailability
  }