const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const mf = require("@angular-architects/module-federation/webpack");
const path = require("path");
const share = mf.share;

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(
  path.join(__dirname, '../../tsconfig.json'),
  ['auth-lib']);

  const shared = share({
    "@angular/core": { singleton: true, strictVersion: true, requiredVersion: 'auto', includeSecondaries: {
      skip: ['@angular/core/testing']
    } }, 
    "@angular/common": { singleton: true, strictVersion: true, requiredVersion: 'auto', includeSecondaries: {
      skip: ['@angular/common/testing', '@angular/common/upgrade', '@angular/common/http/testing']
    } }, 
    "@angular/common/http": { singleton: true, strictVersion: true, requiredVersion: 'auto'}, 
    "@angular/router": { singleton: true, strictVersion: true, requiredVersion: 'auto', includeSecondaries: {
      skip: ['@angular/router/testing', '@angular/router/upgrade']
    } }/* ,
    "devextreme-angular": { singleton: true, strictVersion: true, requiredVersion: 'auto', includeSecondaries: {
      skip: ['@angular/core']
    } }, */
  });

module.exports = {
  output: {
    uniqueName: "mfe1",
    publicPath: "auto"
  },
  optimization: {
    runtimeChunk: false
  },   
  resolve: {
    alias: {
      ...sharedMappings.getAliases(),
    }
  },
  experiments: {
    outputModule: true
  },
  plugins: [
    new ModuleFederationPlugin({
        library: { type: "module" },

        // For remotes (please adjust)
        name: "mfe1",
        filename: "remoteEntry.js",
        exposes: {
            './Module': './projects/mfe1/src/app/flights/flights.module.ts',
        },        
        
        // For hosts (please adjust)
        // remotes: {
        //     "shell": "http://localhost:5000/remoteEntry.js",

        // },

        shared: {
          ...shared,
          ...sharedMappings.getDescriptors()
        }
        
    }),
    sharedMappings.getPlugin()
  ],
};

console.info('***************shared -> ', shared)