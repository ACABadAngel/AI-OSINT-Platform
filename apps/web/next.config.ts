import type { NextConfig } from "next";
const config: NextConfig = {
  agentRules: false,
  transpilePackages: ["@scope/contracts"],
};
export default config;
