// src/pools.js
const { getClient }   = require("./clients");
const { parseRawLog } = require("@cosmjs/stargate");
const { osmosis }     = require("@osmosis-labs/proto-codecs");

// ——— Protobuf Messages ———
// For `osmosisd tx gamm create-pool`
const { MsgCreateBalancerPool }       = osmosis.gamm.poolmodels.balancer.v1beta1;
const { PoolParams, PoolAsset }       = osmosis.gamm.v1beta1;

// For `osmosisd tx gamm join-pool`
const { MsgJoinPool }                 = osmosis.poolmanager.v1beta1;

/**
 * Create a new liquidity pool and provide initial liquidity to it.
 *
 * Equivalent CLI command:
 * ```bash
 * osmosisd tx gamm create-pool --pool-file config.json \
 *   --from WALLET_NAME --chain-id osmosis-1
 * ```
 *
 * ::: details Example config.json
 * ```json
 * {
 *   "weights":          "5ATOM,5OSMO",
 *   "initial-deposit":  "500000uatom,500000uosmo",
 *   "swap-fee":         "0.003",
 *   "exit-fee":         "0.01",
 *   "future-governor":  ""
 * }
 * ```
 * :::
 *
 * ::: warning
 * There is now a 100 OSMO fee for creating pools (paid in addition to tx fees).
 * :::
 */
async function createPool(chainKey, tokenA, tokenB, amounts) {
  const { client, address } = await getClient(chainKey);

  // Build pool parameters as a plain object
  const params = {
    swapFee: "0.003000000000000000",   // 0.3%
    exitFee: "0.000000000000000000",   // 0%
  };

  // Initial deposit as plain objects
  const assets = [
    {
      token: { denom: tokenA, amount: "979166670000" }, // 979,166.67 OSMO in uosmo
      weight: "100"
    },
    {
      token: { denom: tokenB, amount: "100000000000000000000000" }, // 100,000 XRP in base units
      weight: "100"
    },
  ];

  // Construct and broadcast the MsgCreateBalancerPool
  const msg = {
    typeUrl: "/osmosis.gamm.poolmodels.balancer.v1beta1.MsgCreateBalancerPool",
    value: {
      sender:             address,
      poolParams:         params,
      poolAssets:         assets,
      futurePoolGovernor: "",
    },
  };
  const tx = await client.signAndBroadcast(address, [msg], "auto");

  // Extract pool_id from the events
  const attr = parseRawLog(tx.rawLog)
    .flatMap(r => r.events)
    .flatMap(e => e.attributes)
    .find(a => a.key === "pool_id");
  if (!attr) throw new Error("pool_id not found in create tx log");
  const poolId = Number(attr.value);

  console.log(`[${chainKey}] created pool #${poolId} → ${tx.transactionHash}`);
  return { poolId };
}

/**
 * Add liquidity to a specified pool.
 *
 * Equivalent CLI command:
 * ```bash
 * osmosisd tx gamm join-pool \
 *   --pool-id 3 \
 *   --max-amounts-in 37753uatom,500000uosmo \
 *   --share-amount-out 1227549469722224220 \
 *   --from WALLET_NAME \
 *   --chain-id osmosis-1
 * ```
 *
 * ::: details
 * Join pool 3 with max .037753 ATOM & corresponding OSMO to receive ~1.2275 LP shares.
 * :::
 */
async function joinPool(chainKey, poolId, shareAmount, amounts) {
  const { client, address } = await getClient(chainKey);

  const msg = {
    typeUrl: "/osmosis.poolmanager.v1beta1.MsgJoinPool",
    value: {
      sender:         address,
      poolId,
      shareOutAmount: shareAmount.toString(),
      tokenInMaxs: [
        { denom: amounts[0].denom, amount: amounts[0].amount.toString() },
        { denom: amounts[1].denom, amount: amounts[1].amount.toString() },
      ],
    },
  };
  const tx = await client.signAndBroadcast(address, [msg], "auto");
  console.log(`[${chainKey}] joinPool ${poolId} → ${tx.transactionHash}`);
}

module.exports = { createPool, joinPool };
