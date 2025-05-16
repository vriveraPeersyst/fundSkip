// src/clients.js
const { SigningStargateClient, GasPrice, defaultRegistryTypes } = require("@cosmjs/stargate");
const { Registry, DirectSecp256k1HdWallet }                     = require("@cosmjs/proto-signing");
const {
  cosmosProtoRegistry,
  ibcProtoRegistry,
  osmosisProtoRegistry,
} = require("@osmosis-labs/proto-codecs");
const { chains, MNEMONIC } = require("./config");

// Ensure we have a mnemonic for HD wallet
if (!MNEMONIC) throw new Error("🗝️ MNEMONIC is required in .env");

/**
 * Create a signing client for the given chain key, merging in
 * Cosmos SDK & Osmosis proto types so custom messages are encoded.
 */
async function getClient(chainKey) {
  const { rpc, prefix, gasPrice } = chains[chainKey];

  // Create an HD wallet from your BIP-39 mnemonic
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(MNEMONIC, { prefix });

  // Merge default Cosmos SDK types + IBC + Osmosis (GAMM & poolmanager)
  const registry = new Registry([
    ...defaultRegistryTypes,
    ...cosmosProtoRegistry,
    ...ibcProtoRegistry,
    ...osmosisProtoRegistry,
  ]);

  const client = await SigningStargateClient.connectWithSigner(
    rpc,
    wallet,
    {
      registry,
      prefix,
      gasPrice: GasPrice.fromString(gasPrice),
    }
  );

  const [account] = await wallet.getAccounts();
  return { client, address: account.address };
}

module.exports = { getClient };
