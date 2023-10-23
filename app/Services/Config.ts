import EnvConfig from 'react-native-config';

export class Config {
  static getEnvironment(): string {
    return EnvConfig.ENVIRONMENT || 'development';
  }

  static isDevelopment(): boolean {
    return this.getEnvironment() === 'development';
  }

  static isProduction(): boolean {
    return this.getEnvironment() === 'production';
  }

  static enabledLoggers(): string[] {
    return (EnvConfig.ENABLED_LOGGERS || '').split(',').map(value => value.trim().toUpperCase());
  }
}
