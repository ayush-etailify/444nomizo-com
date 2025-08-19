import { AuthModule } from "./modules/auth";
import { CustomerModule } from "./modules/customer";
import { StoreModule } from "./modules/store";
import { SDKConfig } from "./types";
import { ApiClient } from "./utils/api-client";

export class EtailifyStorefrontSDK {
  private apiClient: ApiClient;

  public readonly store: StoreModule;
  public readonly auth: AuthModule;
  public readonly customer: CustomerModule;

  constructor(config: SDKConfig) {
    this.apiClient = new ApiClient(config);

    // Initialize modules
    this.store = new StoreModule(this.apiClient);
    this.auth = new AuthModule(this.apiClient);
    this.customer = new CustomerModule(this.apiClient);
  }

  public get client() {
    return this.apiClient.instance();
  }
}
