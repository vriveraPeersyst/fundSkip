// src/clients.js
const { SigningStargateClient, GasPrice, defaultRegistryTypes } = require("@cosmjs/stargate");
const { Registry, DirectSecp256k1Wallet }                       = require("@cosmjs/proto-signing");
const {
  cosmosProtoRegistry,
  ibcProtoRegistry,
  osmosisProtoRegistry,
} = require("@osmosis-labs/proto-codecs");
const { chains, PRIVATE_KEY } = require("./config");

if (!PRIVATE_KEY) throw new Error("🔑 PRIVATE_KEY is required in .env");

function hexToBytes(hex) {
  return Uint8Array.from(Buffer.from(hex.replace(/^0x/, ""), "hex"));
}

/**
 * Create a signing client for the given chain key, merging in
 * Cosmos SDK & Osmosis proto types so custom messages are encoded.
 */
async function getClient(chainKey) {
  const { rpc, prefix, gasPrice } = chains[chainKey];
  const keyBytes = hexToBytes(PRIVATE_KEY);
  const wallet   = await DirectSecp256k1Wallet.fromKey(keyBytes, prefix);

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
