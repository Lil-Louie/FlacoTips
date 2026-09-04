import type { NextConfig } from "next";

module.exports = {
  allowedDevOrigins: ['10.0.0.90'],
}

const nextConfig: NextConfig = {
  reactCompiler: true,
};

export default nextConfig;
