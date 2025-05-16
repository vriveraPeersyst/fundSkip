// src/index.js
const yargs            = require("yargs");
const { chains }       = require("./config");
const { createPool, joinPool } = require("./pools");
const { getClient }    = require("./clients");

async function main() {
  yargs
        .command(
      "show-address",
      "Print your Osmosis testnet wallet address",
      () => {},
      async () => {
        const { address } = await getClient("osmo");
        console.log(address);
      }
    )
    .command(
      "create-osmo",
      "Create and seed an Osmosis XRP pool with 1 XRP and 5 OSMO (50/50 by value)",
      () => {},
      async () => {
        const osmoAmount = "90000000000";           // 90,000 OSMO = 90,000 × 10^6 uosmo
        const xrpAmount  = "8900000000000000000000"; // 8,900 XRP = 8,900 × 10^18 base units
        const { poolId } = await createPool(
          "osmo",
          chains.osmo.nativeDenom,
          chains.osmo.xrpDenom,
          [osmoAmount, xrpAmount]
        );
        await joinPool("osmo", poolId, osmoAmount, [
          { denom: chains.osmo.nativeDenom, amount: osmoAmount },
          { denom: chains.osmo.xrpDenom, amount: xrpAmount }
        ]);
      }
    )
    .demandCommand()
    .help()
    .argv;
}

main().catch(console.error);