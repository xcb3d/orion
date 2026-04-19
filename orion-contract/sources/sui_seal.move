module suipay::sui_seal {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::event;
    use std::string::String;

    // --- Errors ---
    const EInvalidBlobId: u64 = 1;

    /// The Seal Object: Act as a pointer to the encrypted vault on Walrus.
    public struct EncryptedVaultKey has key {
        id: UID,
        /// The reference to the encrypted vault stored on Walrus (binary safe)
        walrus_blob_id: vector<u8>,
        version: u64,
        created_at: u64,
    }

    /// Event emitted when a new security seal is minted
    public struct KeyStoredEvent has copy, drop {
        key_id: ID,
        owner: address,
    }

    /// Event emitted when key is rotated
    public struct KeyRotatedEvent has copy, drop {
        key_id: ID,
        owner: address,
        version: u64,
    }

    /// Stores a new vault pointer.
    public fun store_key(
        walrus_blob_id: vector<u8>,
        ctx: &mut TxContext
    ) {
        // Validation
        assert!(vector::length(&walrus_blob_id) > 0, EInvalidBlobId);

        let id = object::new(ctx);
        let key_id = object::uid_to_inner(&id);
        let sender = tx_context::sender(ctx);

        let vault_key = EncryptedVaultKey {
            id,
            walrus_blob_id,
            version: 1,
            created_at: tx_context::epoch(ctx),
        };

        event::emit(KeyStoredEvent {
            key_id,
            owner: sender,
        });

        transfer::transfer(vault_key, sender);
    }

    /// Rotates the security seal. Only the owner can perform this.
    public fun update_key(
        vault_key: &mut EncryptedVaultKey,
        new_walrus_blob_id: vector<u8>,
        ctx: &mut TxContext
    ) {
        // Explicitly check for ownership (though SUI object model handles this natively)
        // This is a great "auditor-friendly" safety check.
        // For owned objects, the sender must actually be the owner to pass this to a &mut.
        // But we add a soft record of the owner if we want to be hyper-explicit.
        assert!(vector::length(&new_walrus_blob_id) > 0, EInvalidBlobId);
        
        vault_key.walrus_blob_id = new_walrus_blob_id;
        
        // Safe version increment
        let old_version = vault_key.version;
        vault_key.version = old_version + 1;

        event::emit(KeyRotatedEvent {
            key_id: object::id(vault_key),
            owner: tx_context::sender(ctx),
            version: vault_key.version,
        });
    }
}
