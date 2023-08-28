/**
 * Type declarations for
 *    import config from 'butchers-market/config/environment'
 */
declare const config: {
  environment: string;
  modulePrefix: string;
  podModulePrefix: string;
  locationType: 'history' | 'hash' | 'none' | 'auto';
  rootURL: string;
  APP: Record<string, unknown>;

  // Custom properties
  api: string;
  namespace: string;
  orderOnlineUrl: string;
  showOrderOnline: boolean;
  showReCaptcha: boolean;
  uploadsDir: string;
};

export default config;
