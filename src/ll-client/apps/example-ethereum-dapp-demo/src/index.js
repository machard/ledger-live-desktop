"use strict";

import engine from "../../../src/web3-provider";

console.log(engine);

// todo implement a real ethereum provider
window.ethereum = engine;
