import { SuiJsonRpcClient, getJsonRpcFullnodeUrl } from '@mysten/sui/jsonRpc';
import { SuiGraphQLClient } from '@mysten/sui/graphql';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { LiquifySDK } from '../liquify-sdk/src/index.ts';

// Liquify Protocol v3.2 (Testnet - Withdrawal Enabled)
const PACKAGE_ID = "0x545339e529e2794de1cc60cca025f0b2baa909c867df5a4f60bad7077f727e8d";
const HUB_ID = "0x3f6c71d6520109936743aab219787696696ebfbabbe018a59a841dae70ae5248";
const BALANCES_TABLE_ID = "0x8d644e8d5a81993eb811ea55c88a47abf96a2eab1f5e46c15b8fe9a9627c93cd";
const MERCHANT_CAP_ID = "0x0e5b4fc6ed9e7c7179cf467e0f978feb8a4ce84f9aec7e9d20038e08f59da82e";

const SUBSCRIPTION_TYPE = `${PACKAGE_ID}::suipay::SubscriptionPermission`;

// Configuration
const REFRESH_INTERVAL_MS = 30000;
const MNEMONIC = "ginger unable beyond track air modify bridge plug arrive hello proof analyst";

const keypair = Ed25519Keypair.deriveKeypair(MNEMONIC);

// Use JSON-RPC for execution (Signing)
const rpcClient = new SuiJsonRpcClient({ 
    url: getJsonRpcFullnodeUrl('testnet'),
    network: 'testnet' 
});

// Setup SDK
const sdk = new LiquifySDK(rpcClient, {
  packageId: PACKAGE_ID,
  hubId: HUB_ID,
  balancesTableId: BALANCES_TABLE_ID
});

// Use GraphQL for Global Scanning (Vision)
const gqlClient = new SuiGraphQLClient({
    url: 'https://graphql.testnet.sui.io/graphql'
});

const FETCH_SUBS_QUERY = `
  query GetGlobalSubscriptions($type: String!) {
    objects(filter: { type: $type }) {
      nodes {
        address
        asMoveObject {
          contents {
            json
          }
        }
      }
    }
  }
`;

async function runKeeper() {
    console.log(`🚀 Liquify Keeper (SDK Powered) started.`);
    console.log(`🤖 Identity: ${keypair.toSuiAddress()}`);
    console.log(`🔑 Capability: ${MERCHANT_CAP_ID.slice(0, 10)}...`);

    while (true) {
        try {
            console.log(`🔍 [${new Date().toLocaleTimeString()}] Scanning global contracts via GraphQL...`);
            
            const result = await gqlClient.query({
                query: FETCH_SUBS_QUERY,
                variables: { type: SUBSCRIPTION_TYPE }
            });

            const permissions = result.data?.objects?.nodes || [];
            
            if (permissions.length === 0) {
                console.log("ℹ️ No active subscription permissions found on-chain.");
            }

            for (const node of permissions) {
                const fields = node.asMoveObject?.contents?.json as any;
                if (!fields) continue;

                // Match merchant identity
                if (fields.merchant !== keypair.toSuiAddress() && fields.merchant !== "0x624433c5ffd0ccd63b1a54a12f7360bcd95cef6c5efff33ac7ede0903454feed") {
                    continue;
                }

                const lastPull = Number(fields.last_pull_timestamp_ms);
                const period = Number(fields.period_ms);
                const now = Date.now();
                const objectId = node.address;

                if (now >= lastPull + period) {
                    console.log(`💰 [ACTION] Triggering SDK pull_payment for user ${fields.user.slice(0, 10)}...`);
                    
                    // USE SDK TO BUILD TX
                    const tx = sdk.buildPullPaymentTx(objectId, MERCHANT_CAP_ID);

                    const executeResult = await rpcClient.signAndExecuteTransaction({
                        signer: keypair,
                        transaction: tx,
                    });

                    console.log(`✅ Success! Payment collected. Tx: ${executeResult.digest}`);
                } else {
                    const timeLeftSec = Math.round((lastPull + period - now) / 1000);
                    console.log(`⏳ [WAIT] Permit ${objectId.slice(0, 6)}... (${timeLeftSec}s remaining)`);
                }
            }
        } catch (error) {
            console.error("❌ Keeper error:", error);
        }

        await new Promise(resolve => setTimeout(resolve, REFRESH_INTERVAL_MS));
    }
}

runKeeper();
