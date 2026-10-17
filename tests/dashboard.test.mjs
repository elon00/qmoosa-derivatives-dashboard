import { test } from "node:test";
import assert from "node:assert/strict";
import { DerivativesDashboardStore } from "../dist/index.js";

test("1. Verify initial store markets and state integrity", () => {
  const store = new DerivativesDashboardStore();
  const state = store.getState();

  assert.equal(state.chainId, 31337);
  assert.equal(state.connectedWallet, null);
  assert.equal(state.markets.length, 3);
  assert.equal(state.markets[0].symbol, "ETH-USD");
  assert.equal(state.markets[0].markPriceUsd, 3000.0);
});

test("2. Connect wallet, update market price, and manage positions", () => {
  const store = new DerivativesDashboardStore();
  store.connectWallet("0x1111222233334444555566667777888899990000");

  let state = store.getState();
  assert.equal(state.connectedWallet, "0x1111222233334444555566667777888899990000");

  // Update ETH-USD mark price
  store.updateMarketPrice("ETH-USD", 3100.0, 3050.0);
  state = store.getState();
  const eth = state.markets.find(m => m.symbol === "ETH-USD");
  assert.equal(eth.markPriceUsd, 3100.0);

  // Add position
  store.addPosition({
    id: "POS-1",
    symbol: "ETH-USD",
    isLong: true,
    size: 1.0,
    entryPriceUsd: 3000.0,
    markPriceUsd: 3100.0,
    collateralUsd: 300.0,
    leverage: 10,
    marginRatioBps: 1290,
    liquidationPriceUsd: 2842.11,
    unrealizedPnlUsd: 100.0,
    isLiquidatable: false
  });

  state = store.getState();
  assert.equal(state.positions.length, 1);
  assert.equal(state.positions[0].unrealizedPnlUsd, 100.0);

  // Remove position
  store.removePosition("POS-1");
  state = store.getState();
  assert.equal(state.positions.length, 0);
});
