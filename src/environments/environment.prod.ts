import { Environment } from '@abp/ng.core';

const baseUrl = 'https://progres-fe-production.up.railway.app';

export const environment = {
  production: true,
  application: {
    baseUrl,
    name: 'Progress',
    logoUrl: 'https://i.postimg.cc/1RvZJShw/Whats-App-Image-2025-09-13-at-21-54-29-e593bcc7.jpg',
  },
  oAuthConfig: {
    issuer: 'https://dev-acadmy-httpapi-production-8469.up.railway.app/',
    redirectUri: baseUrl,
    clientId: 'Acadmy_App',
    responseType: 'code',
    scope: 'offline_access Acadmy',
    requireHttps: true
  },
  apis: {
    default: {
      url: 'https://dev-acadmy-httpapi-production-8469.up.railway.app',
      rootNamespace: 'Dev.Progress',
    },
  },
} as Environment;
