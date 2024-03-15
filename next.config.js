/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "node.deso.org",
      },
      {
        protocol: "https",
        hostname: "images.bitclout.com",
      },
      {
        protocol: "https",
        hostname: "images.deso.org",
      },
      {
        protocol: "https",
        hostname: "nftz.mypinata.cloud",
      },
    ],
  },
};

module.exports = nextConfig;
