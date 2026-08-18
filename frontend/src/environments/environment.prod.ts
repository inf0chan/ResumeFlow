// Frontend and API are served by the same Vercel deployment,
// so the API is always same-origin — no base URL to configure per env.
export const environment = {
  production: true,
  apiUrl: '/api',
};
