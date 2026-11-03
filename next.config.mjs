/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["localhost", "supabase.co", "images.unsplash.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async rewrites() {
    // Jika NEXT_PUBLIC_API_URL diarahkan ke local Go server pada port 8080 saat dev
    const targetUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
    // Jika URL adalah URL absolut lokal (seperti http://localhost:8080/api), kita bisa buat proxy
    if (targetUrl.startsWith("http://localhost:8080")) {
      return [
        {
          source: "/api/:path*",
          destination: "http://localhost:8080/api/:path*",
        },
      ];
    }
    return [];
  },
};

export default nextConfig;

