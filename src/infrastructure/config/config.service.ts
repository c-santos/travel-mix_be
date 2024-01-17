require('dotenv').config();

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  public getValue(key: string, throwOnMissing = true): string {
    const value =
      process.env.NODE_ENV === 'LOCAL'
        ? this.env[key]
        : JSON.parse(this.env.ENV)[key];
    if (!value && throwOnMissing)
      console.log(`config error - missing env.${key}`);
    return value;
  }
}

const configService = new ConfigService(process.env);

export { configService };
