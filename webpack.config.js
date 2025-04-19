const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: ['@ui-kitten/components']
      }
    },
    argv
  );
  
  // Customize the config before returning it
  config.devServer = {
    ...config.devServer,
    host: '0.0.0.0',
    port: 12000,
    allowedHosts: 'all',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    },
    client: {
      webSocketURL: {
        hostname: '0.0.0.0',
        port: 12000,
      },
    },
    webSocketServer: {
      options: {
        host: '0.0.0.0',
        port: 12000,
      },
    },
  };

  return config;
};