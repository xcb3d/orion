import { getJsonRpcFullnodeUrl, SuiJsonRpcClient } from '@mysten/sui/jsonRpc';
import { LiquifySDK } from '@liquify/sdk';

// Liquify Protocol v3.2 (Testnet - Withdrawal Enabled)
export const PACKAGE_ID = "0x545339e529e2794de1cc60cca025f0b2baa909c867df5a4f60bad7077f727e8d";
export const HUB_ID = "0x3f6c71d6520109936743aab219787696696ebfbabbe018a59a841dae70ae5248";
export const BALANCES_TABLE_ID = "0x8d644e8d5a81993eb811ea55c88a47abf96a2eab1f5e46c15b8fe9a9627c93cd";

export const client = new SuiJsonRpcClient({ 
    url: getJsonRpcFullnodeUrl('testnet'),
    network: 'testnet'
});

export const sdk = new LiquifySDK(client, {
  packageId: PACKAGE_ID,
  hubId: HUB_ID,
  balancesTableId: BALANCES_TABLE_ID
});
