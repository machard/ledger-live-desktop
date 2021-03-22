import * as CacheSubprovider from 'web3-provider-engine/subproviders/cache.js';
import * as FixtureSubprovider from 'web3-provider-engine/subproviders/fixture.js';
import * as FilterSubprovider from 'web3-provider-engine/subproviders/filters.js';
import * as VmSubprovider from 'web3-provider-engine/subproviders/vm.js';
import * as NonceSubprovider from 'web3-provider-engine/subproviders/nonce-tracker.js';
import * as ProviderEngine  from 'web3-provider-engine';
import * as RpcSubprovider  from 'web3-provider-engine/subproviders/rpc';
import * as HookedWalletSubprovider from 'web3-provider-engine/subproviders/hooked-wallet';

import makeLedgerlive from "../client/index";
import Transport from "../client/transport";

const transport = new Transport();
const ledgerlive = makeLedgerlive(transport);
transport.connect();

var engine = new ProviderEngine();

// static results
engine.addProvider(new FixtureSubprovider({
  web3_clientVersion: 'ProviderEngine/v0.0.0/javascript',
  net_listening: true,
  eth_hashrate: '0x00',
  eth_mining: false,
  eth_syncing: true,
}))

// cache layer
engine.addProvider(new CacheSubprovider())

// filters
engine.addProvider(new FilterSubprovider())

// pending nonce
engine.addProvider(new NonceSubprovider())

// vm
engine.addProvider(new VmSubprovider())

// id mgmt
engine.addProvider(new HookedWalletSubprovider({
  getAccounts: async (cb) => {
    const res = await ledgerlive("/v0.0.1/account", { method: "GET" } );
    const account = await res.json();
    cb(null, [account.freshAddress]);
  },
  processTransaction: async (tx, cb) => {
    console.log(tx);
    cb("not implemented");
  },
}));

engine.addProvider({
  handleRequest: async (payload, next, end) => {
    console.log("payload", payload);
    switch(payload.method) {
      case "eth_requestAccounts":
        const res = await ledgerlive("/v0.0.1/account", { method: "GET" } );
        const account = await res.json();
        end(null, [account.freshAddress]);
        break;
      case "net_version":
      case "eth_chainId":
        end(null, 1);
        break;
      default:
        next();
        break;
    }
  },
  setEngine: (_) => _,
});

// data source
engine.addProvider(new RpcSubprovider({
  rpcUrl: "https://mainnet.infura.io/v3/c5f470b29f9946feb13a80a8a4f8faf4",
}));

engine.start();

engine.enable = () => {
  return Promise.resolve();
};

engine.send = (payload, cb) => {
  console.log(payload, cb);
  if (cb) {
    engine.sendAsync({ method: payload }, callback);
  } else {
    return new Promise((resolve, reject) => {
      engine.sendAsync({ method: payload }, (err, response) => {
        if (err) {
          return reject(err);
        }
        resolve(response);
      })
    });
  }
};

export default engine;