// Frontend and backend are served by the same Express app (see app.js),
// so the API is always same-origin — no base URL to configure per env.
export const environment = {
  production: false,
  apiUrl: '/api',
};
