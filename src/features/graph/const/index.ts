const BUILD_TARGET = process.env.BUILD_TARGET || 'web';

export const sizes = {
  WIDTH: BUILD_TARGET === 'extension' ? 372 : 542,
  HEIGHT: BUILD_TARGET === 'extension' ? 372 : 542,
  diameter: BUILD_TARGET === 'extension' ? 16 : 18,
  linkDistance: BUILD_TARGET === 'extension' ? 54 : 82,
  getTextDx: (d: number) => (BUILD_TARGET === 'extension' ? d / 2 + d / 2 : d / 2 + d / 4),
};
