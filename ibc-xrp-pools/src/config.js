require("dotenv").config();

const chains = {
  xrplevm: {
    rpc:         "https://xrp-testnet-rpc.polkachu.com:443",
    prefix:      "ethm",
    chainId:     "xrplevm_1449000-1",
    nativeDenom: "axrp",
    gasPrice:    "0.0025uaxrp",
    xrpDenom:    "axrp",
    otherDenoms: {
      atom: "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9",
      osmo: "ibc/13B2C536BB057AC79D5616B8EA1B9540EC1F2170718CAFF6F0083C966FFFED0B",
      usdc: "ibc/B27B5CC721C3CB27B4B61BE8BEF3ECFCC3F6D9D4ED0DA8AC8634A534C54DD527",
      elys: "ibc/BEF2B244808B680CEAD43DC4E1A965B99989E15F6F192C945C8837BD632E381D"
    },
  },
  provider: {
    rpc:         "https://rpc.provider-sentry-01.ics-testnet.polypore.xyz",
    prefix:      "cosmos",
    chainId:     "provider",
    nativeDenom: "uatom",
    gasPrice:    "0.0025uatom",
    xrpDenom:    "ibc/68D1062C8B0F11B913FD9285553A7529C3C26D0C49FB64D135E255D9742F6A01"
  },
  osmo: {
    rpc:         "https://rpc.osmotest5.osmosis.zone/",
    prefix:      "osmo",
    chainId:     "osmo-test-5",
    nativeDenom: "uosmo",
    gasPrice:    "0.0025uosmo",
    xrpDenom:    "ibc/24F3F83587084430E25E268A143565FEF5C84AE2308F2657BC46D1F227D2AF65"
  },
  elys: {
    rpc:         "https://rpc.testnet.elys.network",
    prefix:      "elys",
    chainId:     "elysicstestnet-1",
    nativeDenom: "uelys",
    gasPrice:    "0.0025uelys",
    xrpDenom:    "ibc/E925EC46A2F4B84815DB7218ADF272989DADD18372C779F68DB31A6BC4F91B7D"
  },
};

module.exports = {
  chains,
  PRIVATE_KEY: process.env.PRIVATE_KEY,
};