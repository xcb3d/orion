module suipay::suipay {
    use sui::balance::{Self, Balance};
    use sui::coin::{Self, Coin};
    use sui::clock::{Self, Clock};
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::table::{Self, Table};
    use sui::event;

    /// Error codes
    const EInsufficientBalance: u64 = 0;
    const ENotDueYet: u64 = 1;
    const ENotAuthorized: u64 = 2;

    /// --- Objects ---

    /// The global Hub for the SuiPay protocol
    public struct SuiPayHub has key {
        id: UID,
        balances: Table<address, Balance<sui::sui::SUI>>,
    }

    /// The Merchant Capability - granting master control over their subscriptions.
    /// The merchant address owns this.
    public struct MerchantCap has key, store {
        id: UID,
        merchant: address,
    }

    /// The Keeper Capability - a sub-key delegated to a bot.
    /// The bot address (or merchant) owns this.
    public struct KeeperCap has key, store {
        id: UID,
        merchant: address,
    }

    /// The Shared Subscription Permission.
    /// Now anyone (with a Cap) can pass this into pull_payment.
    public struct SubscriptionPermission has key {
        id: UID,
        user: address,
        merchant: address,
        amount_per_period: u64,
        period_ms: u64,
        last_pull_timestamp_ms: u64,
    }

    /// --- Events ---
    
    public struct SubscriptionCreated has copy, drop {
        permission_id: ID,
        user: address,
        merchant: address,
    }

    /// --- Initialization ---

    fun init(ctx: &mut TxContext) {
        transfer::share_object(SuiPayHub {
            id: object::new(ctx),
            balances: table::new(ctx),
        });
    }

    /// Merchants can register to get their master Capability
    public fun register_merchant(ctx: &mut TxContext) {
        let merchant = tx_context::sender(ctx);
        transfer::transfer(MerchantCap {
            id: object::new(ctx),
            merchant,
        }, merchant);
    }

    /// Issuing a delegated key for a bot
    public fun issue_keeper_cap(
        _cap: &MerchantCap, 
        bot_address: address, 
        ctx: &mut TxContext
    ) {
        transfer::transfer(KeeperCap {
            id: object::new(ctx),
            merchant: _cap.merchant,
        }, bot_address);
    }

    // --- User Actions ---

    public fun deposit(hub: &mut SuiPayHub, coin: Coin<sui::sui::SUI>, ctx: &mut TxContext) {
        let user = tx_context::sender(ctx);
        let balance = coin::into_balance(coin);

        if (table::contains(&hub.balances, user)) {
            let user_balance = table::borrow_mut(&mut hub.balances, user);
            balance::join(user_balance, balance);
        } else {
            table::add(&mut hub.balances, user, balance);
        };
    }

    public fun subscribe(
        hub: &SuiPayHub,
        merchant: address,
        amount_per_period: u64,
        period_ms: u64,
        ctx: &mut TxContext
    ) {
        let user = tx_context::sender(ctx);
        // 1. Check if user has sufficient initial balance in Hub
        assert!(get_vault_balance(hub, user) >= amount_per_period, EInsufficientBalance);

        let id = object::new(ctx);
        let permission_id = object::uid_to_inner(&id);

        let permission = SubscriptionPermission {
            id,
            user,
            merchant,
            amount_per_period,
            period_ms,
            last_pull_timestamp_ms: 0,
        };

        transfer::share_object(permission);

        event::emit(SubscriptionCreated {
            permission_id,
            user,
            merchant,
        });
    }

    public fun withdraw(hub: &mut SuiPayHub, amount: u64, ctx: &mut TxContext) {
        let user = tx_context::sender(ctx);
        let user_balance = table::borrow_mut(&mut hub.balances, user);
        assert!(balance::value(user_balance) >= amount, EInsufficientBalance);

        let withdrawn_coin = coin::from_balance(balance::split(user_balance, amount), ctx);
        transfer::public_transfer(withdrawn_coin, user);
    }

    // --- Merchant / Automation Actions ---

    /// Automated pull using a KeeperCap (Bot key)
    public fun pull_payment_with_keeper(
        hub: &mut SuiPayHub,
        permission: &mut SubscriptionPermission,
        keeper_cap: &KeeperCap,
        clock: &Clock,
        ctx: &mut TxContext
    ) : Coin<sui::sui::SUI> {
        // Verify authorization
        assert!(keeper_cap.merchant == permission.merchant, ENotAuthorized);
        
        execute_pull(hub, permission, clock, ctx)
    }

    /// Merchant direct pull using their master MerchantCap
    public fun pull_payment_with_merchant(
        hub: &mut SuiPayHub,
        permission: &mut SubscriptionPermission,
        merchant_cap: &MerchantCap,
        clock: &Clock,
        ctx: &mut TxContext
    ) : Coin<sui::sui::SUI> {
        assert!(merchant_cap.merchant == permission.merchant, ENotAuthorized);
        
        execute_pull(hub, permission, clock, ctx)
    }

    /// Internal logic to avoid duplication
    fun execute_pull(
        hub: &mut SuiPayHub,
        permission: &mut SubscriptionPermission,
        clock: &Clock,
        ctx: &mut TxContext
    ) : Coin<sui::sui::SUI> {
        let now = clock::timestamp_ms(clock);
        assert!(now >= (permission.last_pull_timestamp_ms + permission.period_ms), ENotDueYet);
        
        let user_balance = table::borrow_mut(&mut hub.balances, permission.user);
        assert!(balance::value(user_balance) >= permission.amount_per_period, EInsufficientBalance);

        permission.last_pull_timestamp_ms = now;
        coin::from_balance(balance::split(user_balance, permission.amount_per_period), ctx)
    }

    // --- Getters ---

    public fun get_vault_balance(hub: &SuiPayHub, user: address): u64 {
        if (table::contains(&hub.balances, user)) {
            balance::value(table::borrow(&hub.balances, user))
        } else {
            0
        }
    }
}
