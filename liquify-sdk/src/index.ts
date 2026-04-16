import { Transaction } from '@mysten/sui/transactions';
import { SuiJsonRpcClient } from '@mysten/sui/jsonRpc';

export interface LiquifyConfig {
  packageId: string;
  hubId: string;
  balancesTableId: string;
}

export class LiquifySDK {
  constructor(
    private client: SuiJsonRpcClient,
    public config: LiquifyConfig
  ) {}

  /**
   * Fetch the actual SUI balance stored in the Hub for a specific user
   */
  async fetchVaultBalance(userAddress: string): Promise<number> {
    try {
      const response = await this.client.getDynamicFieldObject({
        parentId: this.config.balancesTableId,
        name: {
          type: 'address',
          value: userAddress,
        },
      });

      if (response.data?.content?.dataType === 'moveObject') {
        const fields = (response.data.content as any).fields;
        return Number(fields.value) / 1000000000;
      }
      return 0;
    } catch (e) {
      return 0;
    }
  }

  /**
   * Build a transaction to deposit SUI into the Smart Vault
   */
  buildDepositTx(amount: number): Transaction {
    const tx = new Transaction();
    const amountMist = BigInt(Math.floor(amount * 1000000000));
    const [coin] = tx.splitCoins(tx.gas, [amountMist]);

    tx.moveCall({
      target: `${this.config.packageId}::suipay::deposit`,
      arguments: [tx.object(this.config.hubId), coin],
    });

    return tx;
  }

  /**
   * Build a transaction to withdraw SUI from the Smart Vault
   */
  buildWithdrawTx(amount: number): Transaction {
    const tx = new Transaction();
    const amountMist = BigInt(Math.floor(amount * 1000000000));

    tx.moveCall({
      target: `${this.config.packageId}::suipay::withdraw`,
      arguments: [tx.object(this.config.hubId), tx.pure.u64(amountMist)],
    });

    return tx;
  }

  /**
   * Build a transaction to create a subscription
   */
  buildSubscribeTx(
    merchant: string,
    amountPerPeriod: number,
    periodMs: number = 30 * 24 * 60 * 60 * 1000 // Default 30 days
  ): Transaction {
    const tx = new Transaction();
    const amountMist = BigInt(Math.floor(amountPerPeriod * 1000000000));

    tx.moveCall({
      target: `${this.config.packageId}::suipay::subscribe`,
      arguments: [
        tx.object(this.config.hubId),
        tx.pure.address(merchant),
        tx.pure.u64(amountMist),
        tx.pure.u64(BigInt(periodMs)),
      ],
    });

    return tx;
  }

  /**
   * Build a transaction to execute a pull payment (Used by Keeper/Merchant)
   */
  buildPullPaymentTx(
    permissionId: string,
    merchantCapId: string
  ): Transaction {
    const tx = new Transaction();
    const CLOCK_ID = "0x6";

    tx.moveCall({
      target: `${this.config.packageId}::suipay::pull_payment_with_merchant`,
      arguments: [
        tx.object(this.config.hubId),
        tx.object(permissionId),
        tx.object(merchantCapId),
        tx.object(CLOCK_ID)
      ],
    });

    return tx;
  }

  /**
   * Build a transaction to register as a merchant and get a MerchantCap
   */
  buildRegisterMerchantTx(): Transaction {
    const tx = new Transaction();

    tx.moveCall({
      target: `${this.config.packageId}::suipay::register_merchant`,
      arguments: [],
    });

    return tx;
  }

  /**
   * Build a transaction to issue a KeeperCap for a bot
   */
  buildIssueKeeperCapTx(merchantCapId: string, botAddress: string): Transaction {
    const tx = new Transaction();

    tx.moveCall({
      target: `${this.config.packageId}::suipay::issue_keeper_cap`,
      arguments: [tx.object(merchantCapId), tx.pure.address(botAddress)],
    });

    return tx;
  }
}
