import { useEffect } from 'react'
import { connectorLocalStorageKey, ConnectorNames } from '@pancakeswap/uikit'
import useAuth from 'hooks/useAuth'

const _cdcListener = async () =>
  new Promise<void>((resolve) =>
    Object.defineProperty(window, 'desktopWallet', {
      get() {
        return this.cdc
      },
      set(cdc) {
        this.cdc = cdc

        resolve()
      },
    }),
  )

const useEagerConnect = () => {
  const { login } = useAuth()

  useEffect(() => {
    const connectorId = window.localStorage.getItem(connectorLocalStorageKey) as ConnectorNames

    if (connectorId) {
      const isConnectCDC = connectorId === ConnectorNames.CDC
      const isCDCDefined = Reflect.has(window, 'desktopWallet')

      // Currently BSC extension doesn't always inject in time.
      // We must check to see if it exists, and if not, wait for it before proceeding.
      if (isConnectCDC && !isCDCDefined) {
        _cdcListener().then(() => login(connectorId))

        return
      }

      login(connectorId)
    } else if (Reflect.has(window, 'desktopWallet')) {
      login(ConnectorNames.CDC)
    }
  }, [login])
}

export default useEagerConnect
