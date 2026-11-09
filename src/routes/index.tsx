import { createFileRoute } from "@tanstack/react-router";
import MiningPage from "@/pages/MiningPage";

export const Route = createFileRoute("/")({
  component: MiningPage,
  head: () => ({
    meta: [
      { title: "Groyper Miner - GROYP on TON" },
      {
        name: "description",
        content: "Track the GROYP token market and in-app mining balance on TON.",
      },
      { property: "og:title", content: "Groyper Miner - GROYP on TON" },
      {
        property: "og:description",
        content: "View the live GROYP quote and manage in-app mining rewards.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});
