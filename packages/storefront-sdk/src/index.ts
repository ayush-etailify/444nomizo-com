import { StoreModule } from "./modules/store";
import { SDKConfig } from "./types";
import { ApiClient } from "./services/api-client";
import { AuthModule } from "./modules/auth";
import { CustomerModule } from "./modules/customer";

export default class EtailifyStorefrontSDK {
  private apiClient: ApiClient;

  public readonly store: StoreModule;
  public readonly auth: AuthModule;
  public readonly customer: CustomerModule;

  constructor(config: SDKConfig) {
    this.apiClient = new ApiClient(config);
    this.store = new StoreModule(this.apiClient, config);
    this.auth = new AuthModule(this.apiClient, config);
    this.customer = new CustomerModule(this.apiClient, config);
  }

  public get client() {
    return this.apiClient.instance();
  }
}

export type { SDKConfig } from "./types";
