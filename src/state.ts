export interface MarketOverview {
  symbol: string;
  markPriceUsd: number;
  indexPriceUsd: number;
  fundingRateBps: number;
  openInterestUsd: bigint;
  volume24hUsd: bigint;
}

export interface UserPositionView {
  id: string;
  symbol: string;
  isLong: boolean;
  size: number;
  entryPriceUsd: number;
  markPriceUsd: number;
  collateralUsd: number;
  leverage: number;
  marginRatioBps: number;
  liquidationPriceUsd: number;
  unrealizedPnlUsd: number;
  isLiquidatable: boolean;
}

export interface DerivativesDashboardState {
  connectedWallet: string | null;
  chainId: number;
  markets: MarketOverview[];
  positions: UserPositionView[];
}

export class DerivativesDashboardStore {
  private state: DerivativesDashboardState;

  constructor() {
    this.state = {
      connectedWallet: null,
      chainId: 31337,
      markets: [
        {
          symbol: "ETH-USD",
          markPriceUsd: 3000.0,
          indexPriceUsd: 2998.5,
          fundingRateBps: 1.0, // 0.01%
          openInterestUsd: 145_000_000n,
          volume24hUsd: 480_000_000n
        },
        {
          symbol: "BTC-USD",
          markPriceUsd: 68000.0,
          indexPriceUsd: 68020.0,
          fundingRateBps: -0.5,
          openInterestUsd: 420_000_000n,
          volume24hUsd: 1_250_000_000n
        },
        {
          symbol: "SOL-USD",
          markPriceUsd: 180.0,
          indexPriceUsd: 179.8,
          fundingRateBps: 2.0,
          openInterestUsd: 65_000_000n,
          volume24hUsd: 210_000_000n
        }
      ],
      positions: []
    };
  }

  public getState(): DerivativesDashboardState {
    return {
      ...this.state,
      markets: [...this.state.markets],
      positions: [...this.state.positions]
    };
  }

  public connectWallet(address: string): void {
    if (!address || address.length < 10) {
      throw new Error("Invalid wallet address");
    }
    this.state.connectedWallet = address;
  }

  public disconnectWallet(): void {
    this.state.connectedWallet = null;
    this.state.positions = [];
  }

  public addPosition(pos: UserPositionView): void {
    this.state.positions.push(pos);
  }

  public removePosition(id: string): void {
    this.state.positions = this.state.positions.filter(p => p.id !== id);
  }

  public updateMarketPrice(symbol: string, markPrice: number, indexPrice: number): void {
    const market = this.state.markets.find(m => m.symbol === symbol.toUpperCase());
    if (market) {
      market.markPriceUsd = markPrice;
      market.indexPriceUsd = indexPrice;
      market.fundingRateBps = ((markPrice - indexPrice) / indexPrice) * 10000;
    }
  }
}
