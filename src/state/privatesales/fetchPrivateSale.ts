import { SerializedPrivateSale } from 'state/types'
import fetchPublicPrivateSaleData from './fetchPublicPrivateSaleData'

const fetchPrivateSale = async (sale: SerializedPrivateSale): Promise<SerializedPrivateSale> => {
  const salePublicData = await fetchPublicPrivateSaleData(sale)

  return { ...sale, ...salePublicData }
}

export default fetchPrivateSale
