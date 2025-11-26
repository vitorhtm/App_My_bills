const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Adicionar suporte para arquivos .wasm (WebAssembly)
// Remove 'wasm' de sourceExts se estiver lá e adiciona em assetExts
config.resolver.sourceExts = config.resolver.sourceExts.filter(ext => ext !== 'wasm');
if (!config.resolver.assetExts.includes('wasm')) {
  config.resolver.assetExts.push('wasm');
}

module.exports = config;

