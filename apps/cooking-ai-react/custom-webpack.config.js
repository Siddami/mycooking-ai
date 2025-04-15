module.exports = (config) => {
  if (config.optimization) {
    config.optimization.runtimeChunk = false;
    config.optimization.minimize = false; // Disable minification entirely
  }
  return config;
};
