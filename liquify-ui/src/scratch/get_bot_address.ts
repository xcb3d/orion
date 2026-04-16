import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

const MNEMONIC = "ginger unable beyond track air modify bridge plug arrive hello proof analyst";
const keypair = Ed25519Keypair.deriveKeypair(MNEMONIC);
console.log(keypair.toSuiAddress());
