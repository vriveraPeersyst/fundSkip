// src/pools.js
const { getClient } = require("./clients");
const { osmosis } = require("@osmosis-labs/proto-codecs");

// ——— Protobuf Messages ———
const { MsgCreateBalancerPool } = osmosis.gamm.poolmodels.balancer.v1beta1;
const { MsgJoinPool }           = osmosis.poolmanager.v1beta1;

/**
 * Create a new liquidity pool and provide initial liquidity to it.
 */
async function createPool(chainKey, tokenA, tokenB, amounts) {
  const { client, address } = await getClient(chainKey);

  // Pool parameters: swapFee (0.3%), exitFee (0%)
  const params = {
    swapFee: "0.003000000000000000",
    exitFee: "0.000000000000000000",
  };

  // Use passed-in amounts for token denominations
  const assets = [
    { token: { denom: tokenA, amount: amounts[0] }, weight: "100" },
    { token: { denom: tokenB, amount: amounts[1] }, weight: "100" },
  ];

  // Construct and broadcast the pool creation message
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

  // Extract the new pool ID from the transaction logs
  if (!tx.logs) throw new Error(`No logs found in tx: ${tx.rawLog}`);
  const attr = tx.logs
    .flatMap(log => log.events)
    .flatMap(evt => evt.attributes)
    .find(a => a.key === "pool_id");
  if (!attr) throw new Error("pool_id not found in create tx logs");
  const poolId = Number(attr.value);

  console.log(`[${chainKey}] created pool #${poolId} → ${tx.transactionHash}`);
  return { poolId };
}

/**
 * Add liquidity to a specified pool.
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
