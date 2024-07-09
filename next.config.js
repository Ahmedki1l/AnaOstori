/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      'd1kl0al24gb71i.cloudfront.net',
      'images.unsplash.com',
      'anaostori-dev.s3.amazonaws.com',
      'lh3.googleusercontent.com',
      'phase2anaostori.s3.eu-central-1.amazonaws.com',
      'anaostori-dev.s3.eu-central-1.amazonaws.com'
    ],
  },

  //PROD CONFIG
   env: {
     API_BASE_URL: "https://fxhu44o7ua.execute-api.eu-central-1.amazonaws.com",
     NEXT_PUBLIC_API_BASE_URL: "https://fxhu44o7ua.execute-api.eu-central-1.amazonaws.com",
     NEXT_PUBLIC_APPLE_MERCHENT_ID: "merchant.com.anaostori"
   },


  //DEV CONFIG
 // env: {
    // API_BASE_URL: "https://yts36bs5s8.execute-api.eu-central-1.amazonaws.com",
   // NEXT_PUBLIC_API_BASE_URL: "https://yts36bs5s8.execute-api.eu-central-1.amazonaws.com",
   // NEXT_PUBLIC_APPLE_MERCHENT_ID: "merchant.com.anaostori"
//  },
  async headers() {
    return [
      {
        source: '/.well-known/apple-app-site-association',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
