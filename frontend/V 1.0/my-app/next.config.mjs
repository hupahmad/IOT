/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      "/": { page: "/" },
      "/Add-Button": { page: "/about" },
      // "/about": { page: "/about" },
      // "/p/hello-nextjs": { page: "/post", query: { title: "hello-nextjs" } },
      // "/p/learn-nextjs": { page: "/post", query: { title: "learn-nextjs" } },
      // "/p/deploy-nextjs": { page: "/post", query: { title: "deploy-nextjs" } },
    };
  },
};

export default nextConfig;
