import { useEffect, useState } from "react";

const TOKEN_ADDRESS = "EQAtwo6qMNwtr0iTA9eKVZ32cuACFJ0VKd78GrBWOe83-X1P";
const API_URL = `https://api.dexscreener.com/latest/dex/tokens/${TOKEN_ADDRESS}`;
const CACHE_KEY = "secret-token-market-v1";
const REFRESH_MS = 120_000;

type Pair = {
  chainId?: string;
  baseToken?: { address?: string; name?: string; symbol?: string };
  priceUsd?: string;
  priceChange?: { h24?: number };
  liquidity?: { usd?: number };
  url?: string;
};

export type TokenMarket = {
  priceUsd: number | null;
  change24h: number | null;
  liquidityUsd: number | null;
  tokenName: string;
  pairUrl: string | null;
  updatedAt: number | null;
};

const EMPTY: TokenMarket = {
  priceUsd: null,
  change24h: null,
  liquidityUsd: null,
  tokenName: "Token",
  pairUrl: null,
  updatedAt: null,
};

function cached(): TokenMarket {
  try {
    const stored = localStorage.getItem(CACHE_KEY);
    return stored ? { ...EMPTY, ...JSON.parse(stored) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

export function useTokenMarket() {
  const [market, setMarket] = useState<TokenMarket>(EMPTY);

  useEffect(() => {
    let alive = true;
    setMarket(cached());

    const refresh = async () => {
      try {
        const response = await fetch(API_URL, { headers: { Accept: "application/json" } });
        if (!response.ok) return;
        const data = (await response.json()) as { pairs?: Pair[] | null };
        const pair = (data.pairs ?? [])
          .filter(
            (item) =>
              item.baseToken?.address?.toLowerCase() === TOKEN_ADDRESS.toLowerCase() &&
              Number(item.priceUsd) > 0,
          )
          .sort((a, b) => Number(b.liquidity?.usd ?? 0) - Number(a.liquidity?.usd ?? 0))[0];
        if (!pair) return;
        const next: TokenMarket = {
          priceUsd: Number(pair.priceUsd),
          change24h: Number.isFinite(Number(pair.priceChange?.h24))
            ? Number(pair.priceChange?.h24)
            : null,
          liquidityUsd: Number.isFinite(Number(pair.liquidity?.usd))
            ? Number(pair.liquidity?.usd)
            : null,
          tokenName: pair.baseToken?.symbol || pair.baseToken?.name || "Token",
          pairUrl: pair.url || null,
          updatedAt: Date.now(),
        };
        if (!alive) return;
        setMarket(next);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(next));
        } catch {
          /* ignore unavailable storage */
        }
      } catch {
        // Keep the last successfully cached value; never substitute a fabricated quote.
      }
    };

    void refresh();
    const timer = window.setInterval(() => void refresh(), REFRESH_MS);
    return () => {
      alive = false;
      window.clearInterval(timer);
    };
  }, []);

  return market;
}
