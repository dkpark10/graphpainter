const BUILD_TARGET = process.env.BUILD_TARGET || 'web';

export const sizes = {
  WIDTH: BUILD_TARGET === 'extension' ? 372 : 542,
  HEIGHT: BUILD_TARGET === 'extension' ? 372 : 542,
  nodeRadius: BUILD_TARGET === 'extension' ? 14 : 16,
  fontSize: BUILD_TARGET === 'extension' ? 10 : 12,
};
