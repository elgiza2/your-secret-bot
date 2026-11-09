import { GRAM_ICON, NOVA_ICON } from "@/lib/currency-icons";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  ExternalLink,
  Radio,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Progress } from "@/components/ui/progress";
import SpotlightHero from "@/components/hero/SpotlightHero";
import MiningBoosters from "@/components/MiningBoosters";
import { useTokenMarket } from "@/hooks/use-token-market";

const TON_ICON = GRAM_ICON;
const USDT_ICON = "/images/usdt.png";
const DYOR_URL = "https://dyor.io/token/EQAtwo6qMNwtr0iTA9eKVZ32cuACFJ0VKd78GrBWOe83-X1P";

const formatPrice = (price: number | null) => {
  if (!price || !Number.isFinite(price)) return "Price unavailable";
  return price < 0.01
    ? `$${price.toLocaleString("en-US", { maximumSignificantDigits: 5 })}`
    : `$${price.toLocaleString("en-US", { maximumFractionDigits: 4 })}`;
};

const MiningPage = () => {
  const { user, startMining, getMiningTimeLeft, getMiningProgress, miningError } = useApp();
  const [timeLeft, setTimeLeft] = useState("00:00:00");
  const [progress, setProgress] = useState(0);
  const market = useTokenMarket();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getMiningTimeLeft());
      setProgress(getMiningProgress());
    }, 1000);
    return () => clearInterval(interval);
  }, [getMiningTimeLeft, getMiningProgress]);

  return (
    <SpotlightHero title="TOKEN MINER" center>
      <div className="mining-page flex w-full flex-col px-5 pb-28 pt-2">
        <motion.div
          className="mining-balance-card nv-card p-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center justify-center gap-2">
            <img
              src={NOVA_ICON}
              alt="Token"
              className="h-8 w-8 shrink-0 rounded-full object-cover ring-2 ring-white/15"
            />
            <div className="text-left">
              <p className="nv-eyebrow">YOUR TOKEN BALANCE</p>
              <p className="text-[10px] text-white/55">Mining account</p>
            </div>
          </div>
          <p className="hero-title mt-3 text-center text-[52px] font-bold leading-none tracking-tight">
            {user.siriBalance.toLocaleString("en-US", { maximumFractionDigits: 2 })}
          </p>
          <button
            onClick={user.isMining ? undefined : startMining}
            disabled={user.isMining}
            className={`mining-cta nv-pill mt-6 w-full ${user.isMining ? "mining-active" : ""}`}
          >
            <span className="inline-flex items-center justify-center gap-2">
              {user.isMining ? (
                <>
                  <Radio className="h-4 w-4 animate-pulse" /> Mining · {timeLeft}
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> Start Mining
                </>
              )}
            </span>
          </button>
          {miningError && (
            <p role="alert" className="mt-3 text-center text-sm text-destructive">
              {miningError}
            </p>
          )}
          {user.isMining && (
            <div className="mt-4">
              <Progress value={progress} className="h-1.5 bg-white/15" />
              <p className="mt-2 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">
                {progress.toFixed(0)}% session complete
              </p>
            </div>
          )}
          <div className="mt-5 flex items-center justify-center gap-1.5 text-[10px] text-white/50">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" /> Rewards are credited to your
            in-app balance
          </div>
        </motion.div>

        <motion.a
          href={market.pairUrl || DYOR_URL}
          target="_blank"
          rel="noreferrer"
          className="market-card mt-3 block rounded-2xl p-4"
          aria-label="View token market information"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04, duration: 0.4 }}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="nv-eyebrow">LIVE TOKEN MARKET</p>
              <p className="mt-1 text-xl font-bold tracking-tight text-white">
                {formatPrice(market.priceUsd)}
              </p>
              <p className="mt-1 text-[10px] text-white/45">
                {market.updatedAt
                  ? `Updated ${new Date(market.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                  : "Live quote when market data is available"}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              {market.change24h !== null && (
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${market.change24h >= 0 ? "bg-emerald-400/10 text-emerald-300" : "bg-rose-400/10 text-rose-300"}`}
                >
                  {market.change24h >= 0 ? (
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  ) : (
                    <ArrowDownRight className="h-3.5 w-3.5" />
                  )}
                  {Math.abs(market.change24h).toFixed(2)}%
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-cyan-200">
                DYOR <ExternalLink className="h-3 w-3" />
              </span>
            </div>
          </div>
          {market.liquidityUsd !== null && market.liquidityUsd > 0 && (
            <div className="mt-3 flex justify-between border-t border-white/10 pt-2 text-[10px] text-white/50">
              <span>Liquidity</span>
              <span>
                ${market.liquidityUsd.toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </span>
            </div>
          )}
        </motion.a>

        <motion.div
          className="mt-3 grid grid-cols-2 gap-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {[
            { label: "Gram", value: user.tonBalance, icon: TON_ICON, tone: "gram-balance" },
            { label: "USDT", value: user.usdtBalance, icon: USDT_ICON, tone: "usdt-balance" },
          ].map((s) => (
            <div
              key={s.label}
              className={`mining-secondary-card nv-card flex items-center gap-3 p-4 ${s.tone}`}
            >
              <img
                src={s.icon}
                alt={s.label}
                className="h-9 w-9 shrink-0 rounded-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="min-w-0">
                <p className="nv-eyebrow">{s.label}</p>
                <p className="nv-stat-num truncate">
                  {Number(s.value || 0).toLocaleString("en-US", { maximumFractionDigits: 4 })}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
        <MiningBoosters />
      </div>
    </SpotlightHero>
  );
};

export default MiningPage;
