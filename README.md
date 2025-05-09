# ibc-xrp-pools

A toolkit for **creating** and **seeding** OSMO/XRP liquidity pools on the Osmosis **testnet** via a simple CLI and scriptable interface.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Prerequisites](#prerequisites)
4. [Getting Started](#getting-started)

   * [Clone the Repository](#clone-the-repository)
   * [Generate a Repo Report (Optional)](#generate-a-repo-report-optional)
   * [Environment Configuration](#environment-configuration)
   * [Install Dependencies](#install-dependencies)
5. [Configuration Details](#configuration-details)

   * [.env Variables](#env-variables)
   * [Chain Definitions](#chain-definitions)
6. [Usage](#usage)

   * [Create & Seed an OSMO/XRP Pool](#create--seed-an-osmoxrp-pool)
   * [Customizing Liquidity Parameters](#customizing-liquidity-parameters)
   * [Adding More Liquidity Later](#adding-more-liquidity-later)
7. [Scripts & Shortcuts](#scripts--shortcuts)
8. [Testing & Troubleshooting](#testing--troubleshooting)
9. [Repository Structure](#repository-structure)
10. [Contributing](#contributing)
11. [License](#license)

---

## Project Overview

This repository provides a straightforward way to spin up **balanced** OSMO/XRP liquidity pools on the Osmosis **testnet** (chain ID: `osmo-test-5`). The CLI leverages CosmJS and Osmosis proto codecs to:

* **Create** a new Balancer-style pool with customizable weights and fees.
* **Seed** the pool with initial liquidity in a single transaction.
* **Join** (add) liquidity to an existing pool later.

Ideal for developers building cross-chain or DeFi integrations who need programmatic control over pool creation.

## Features

* Permissionless pool creation and liquidity provision.
* Configurable swap and exit fees.
* Uses standard `MsgCreateBalancerPool` and `MsgJoinPool` messages under the hood.
* Easy CLI wrapper via [Yargs](https://github.com/yargs/yargs).
* Detailed repo reporting script (`generate-report.sh`).

## Prerequisites

* **Node.js** v14+ and **npm** (or Yarn)
* An Osmosis testnet wallet with:

  * **≥100 OSMO** (for pool creation fee)
  * **Desired XRP** bridged via IBC (denom: `ibc/24F3F83587084430E25E268A143565FEF5C84AE2308F2657BC46D1F227D2AF65`)
* **Keplr** or another keystore supporting `DirectSecp256k1Wallet` for signing.
* Access to testnet faucets:

  * Osmosis Faucet: `/faucet/osmo` (100 OSMO/day)
  * XRPL EVM Faucet: for testnet XRP

## Getting Started

### Clone the Repository

```bash
git clone <your-repo-url>
cd <your-repo-directory>
```

### Generate a Repo Report (Optional)

```bash
./generate-report.sh
# → outputs repo_report.txt
```

### Environment Configuration

Copy the example env file and populate your private key:

```bash
cp ibc-xrp-pools/.env.example ibc-xrp-pools/.env
# Edit ibc-xrp-pools/.env and set PRIVATE_KEY
```

### Install Dependencies

```bash
cd ibc-xrp-pools
npm install
# or `yarn install`
```

## Configuration Details

### .env Variables

|   Variable   | Description                                            |
| :----------: | :----------------------------------------------------- |
| PRIVATE\_KEY | 64‑character hex‑encoded secp256k1 private key (no 0x) |

### Chain Definitions (`src/config.js`)

* **osmo**: Osmosis testnet (`osmo-test-5`), `foo` OSMO denom: `uosmo`, swap fee gas price: `0.0025uosmo`.
* **xrplevm**: XRPL EVM testnet chain, denom: `axrp`.
* Additional chains available for multi-chain use (ATOM, ELYS, etc.).

Tokens bridged from XRPL EVM appear on Osmosis testnet under an IBC hash:

```
ibc/24F3F83587084430E25E268A143565FEF5C84AE2308F2657BC46D1F227D2AF65
```

## Usage

The CLI exposes a single command for OSMO/XRP:

### Create & Seed an OSMO/XRP Pool

```bash
# From within ibc-xrp-pools
node src/index.js create-osmo
```

What happens:

1. **MsgCreateBalancerPool** is broadcast with:

   * `poolParams`: swapFee = 0.3%, exitFee = 0%
   * `poolAssets`: your configured token amounts & weights
2. **100 OSMO** pool creation fee is deducted automatically.
3. **MsgJoinPool** is broadcast to add the initial deposit (in one step!).

Once complete, the console logs your new pool ID and transaction hash.

### Customizing Liquidity Parameters

By default, `create-osmo` uses:

```js
const osmoAmount = "979166670000";   // 979,166.67 OSMO (uosmo)
const xrpAmount  = "100000000000000000000000"; // 100,000 XRP (axrp)
```

To modify:

1. Open `src/index.js`.
2. Update `osmoAmount` and `xrpAmount` to desired base‑unit strings.
3. Optionally adjust weights in `src/pools.js` (default weight: 100/100).

### Adding More Liquidity Later

Use the `joinPool` function directly or extend the CLI:

```js
await joinPool(
  "osmo", poolId, shareOutAmount,
  [
    { denom: "uosmo", amount: newOsmoAmount },
    { denom: "ibc/...axrp", amount: newXrpAmount }
  ]
);
```

No additional governance or approvals are required.

## Scripts & Shortcuts

Add these to `ibc-xrp-pools/package.json` for convenience:

```json
"scripts": {
  "create-osmo": "node src/index.js create-osmo",
  "report":    "../generate-report.sh"
}
```

Then:

```bash
npm run create-osmo
npm run report
```

## Testing & Troubleshooting

* **Insufficient funds** errors mean you need more testnet OSMO or XRP.
* Use `osmosisd query bank balances <your-address> --chain-id osmo-test-5` to check balances.
* For IBC transfers, ensure you have completed the channel handshake and funds arrived.
* Check transactions via the Osmosis testnet explorer.

## Repository Structure

```
.
├── .gitignore
├── README.md
├── generate-report.sh       # Repo report automation
├── ibc-xrp-pools            # Main package
│   ├── .env.example
│   ├── package.json
│   └── src                  # Source modules
│       ├── clients.js       # Signing client setup
│       ├── config.js        # Chain & denom configs
│       ├── index.js         # CLI entrypoint
│       └── pools.js         # createPool & joinPool logic
└── repo_report.txt          # Generated report output
```

## Contributing

1. Fork the repo.
2. Create a feature branch (`git checkout -b feature/...`).
3. Commit your changes.
4. Open a Pull Request.

Please follow standard semantic commit messages and ensure tests (if added) pass.

## License

MIT © \[Your Name]
