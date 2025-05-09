
<!-- README.md -->

# ibc-xrp-pools

A simple toolkit to create and seed OSMO/XRP liquidity pools on the Osmosis testnet.

## Repository Structure

```

.
├── generate-report.sh        # auto-generate a repo report
├── ibc-xrp-pools             # core package for pool creation/joining
│   ├── .env.example
│   ├── package.json
│   └── src
│       ├── clients.js
│       ├── config.js
│       ├── index.js
│       └── pools.js
└── repo\_report.txt           # output of generate-report.sh

````

## Setup

1. **Clone the repo**  
   ```bash
   git clone <your-repo-url>
   cd <your-repo>
````

2. **Generate a report (optional)**

   ```bash
   ./generate-report.sh
   # → writes repo_report.txt
   ```

3. **Configure environment**

   ```bash
   cp ibc-xrp-pools/.env.example ibc-xrp-pools/.env
   # Edit ibc-xrp-pools/.env and set your PRIVATE_KEY for Osmosis testnet
   ```

4. **Install dependencies**

   ```bash
   cd ibc-xrp-pools
   npm install
   ```

## Usage

All pool actions are exposed via a yargs-based CLI in `src/index.js`.

* **Create & seed a pool**

  ```bash
  # from the ibc-xrp-pools folder
  node src/index.js create-osmo
  ```

  This will:

  1. Create an OSMO/XRP pool (50/50 by dollar-value)
  2. Pay the 100 OSMO pool-creation fee on testnet
  3. Seed it with your configured amounts (e.g. 979 166.67 OSMO & 100 000 XRP)

## Scripts

You can also add NPM scripts in `ibc-xrp-pools/package.json`, for example:

```json
{
  "scripts": {
    "create-osmo": "node src/index.js create-osmo",
    "report":    "../generate-report.sh"
  }
}
```

## Notes

* Make sure your wallet has enough testnet OSMO for both the 100 OSMO creation fee **and** the liquidity deposit plus a bit extra for gas.
* The testnet XRP denom is an IBC hash, e.g.

  ```
  ibc/24F3F83587084430E25E268A143565FEF5C84AE2308F2657BC46D1F227D2AF65
  ```
* You can re-run `create-osmo` multiple times to spin up new pools of the same pair (each incurs the 100 OSMO fee).

---

Enjoy building on Osmosis!
