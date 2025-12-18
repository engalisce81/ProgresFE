import { Environment } from '@abp/ng.core';

const baseUrl = 'https://progres-fe-production.up.railway.app';

export const environment = {
  production: true,
  application: {
    baseUrl,
    name: 'Tadriscom',
    logoUrl: 'https://i.postimg.cc/G24yXvg7/Tadriscom.jpg',
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
