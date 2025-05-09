// src/index.js
const yargs            = require("yargs");
const { chains }       = require("./config");
const { createPool, joinPool } = require("./pools");

async function main() {
  yargs
    .command(
      "create-osmo",
      "Create and seed an Osmosis XRP pool with 100,000 XRP and 979,166.67 OSMO (50/50 by value)",
      () => {},
      async () => {
        const osmoAmount = "979166670000"; // 979,166.67 OSMO in uosmo (string)
        const xrpAmount = "100000000000000000000000"; // 100,000 XRP in base units (string)
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