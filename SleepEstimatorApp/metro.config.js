const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const defaultAssetExts = require('metro-config/src/defaults/defaults').assetExts;

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);
const extendedAssetExts = [...defaultConfig.resolver.assetExts, 'bin'];

const customConfig = {
    transformer: {
        ...defaultConfig.transformer,
    },
    resolver: {
        assetExts: extendedAssetExts,
        sourceExts: [...defaultConfig.resolver.sourceExts, 'json', 'bin'],
    },
};

module.exports = mergeConfig(defaultConfig, customConfig);
