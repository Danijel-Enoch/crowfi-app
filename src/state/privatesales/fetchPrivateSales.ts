import { SerializedPrivateSaleConfig } from 'config/constants/types'
import fetchPrivateSale from './fetchPrivateSale'

const fetchPrivateSales = async (salesToFetch: SerializedPrivateSaleConfig[]) => {
  const data = await Promise.all(
    salesToFetch.map(async (saleConfig) => {
      const sale = await fetchPrivateSale(saleConfig)
      const serializedSale = { ...sale }
      return serializedSale
    }),
  )
  return data
}

export default fetchPrivateSales
