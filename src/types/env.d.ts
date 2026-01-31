declare namespace NodeJS {
  interface ProcessEnv {
    BUILD_TARGET: 'web' | 'extension';
  }
}
