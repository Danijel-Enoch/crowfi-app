import { AbstractConnectorArguments, ConnectorUpdate } from '@web3-react/types'
import { AbstractConnector } from '@web3-react/abstract-connector'
import warning from 'tiny-warning'
import { InjectedConnector } from '@web3-react/injected-connector'


export class NoCDCProviderError extends Error {
    public constructor() {
      super();
      this.name = this.constructor.name;
      this.message = "No Cronos provider was found.";
    }
  }

export class CronosConnector extends InjectedConnector {

    public async getChainId(): Promise<string | number> {
        if (!window.ethereum) {
            throw new NoCDCProviderError();
        }

        if (!(window.ethereum as any).isDesktopWallet) {
            throw new NoCDCProviderError();
        }
        
        return super.getChainId()
    }

    public async getAccount(): Promise<string> {
        if (!window.ethereum) {
            throw new NoCDCProviderError();
        }

        if (!(window.ethereum as any).isDesktopWallet) {
            throw new NoCDCProviderError();
        }
        
        return super.getAccount()
    }

    public async activate(): Promise<ConnectorUpdate> {
        if (!window.ethereum) {
            throw new NoCDCProviderError();
        }

        if (!(window.ethereum as any).isDesktopWallet) {
            throw new NoCDCProviderError();
        }

        return super.activate();
    }

    public async isAuthorized(): Promise<boolean> {
        if (!window.ethereum) {
            return false
        }

        if (!(window.ethereum as any).isDesktopWallet) {
            return false
        }

        return super.isAuthorized()
    }
}
