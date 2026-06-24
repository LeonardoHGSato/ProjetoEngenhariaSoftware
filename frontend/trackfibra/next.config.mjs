/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  // Gera um servidor standalone enxuto, usado pela imagem Docker do frontend.
  output: "standalone",
};

export default nextConfig;
