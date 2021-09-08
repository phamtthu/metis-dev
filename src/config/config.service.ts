import { Injectable } from '@nestjs/common';

import { ConfigData } from './config.interface';

require('dotenv').config();

@Injectable()
export class ConfigService {
  private config: ConfigData;

  public loadConfig() {

    this.config = this.getDefaultConfig(process.env);
  }

    private getDefaultConfig(env: NodeJS.ProcessEnv): ConfigData {
        return {
            mongo: env.MONGO_DB || 'mongodb://admin:a123456@localhost:27017/skyconnect?retryWrites=true&w=majority',
            smsAPIKey: env.SMS_API_KEY || '',
            deltaLatLngRadiusSearch: parseFloat(env.RADIUS_SEARCH_CONNECT) * parseFloat(env.ONE_METER_TO_RADIAN) || 0.0,
        };
    }
    public get(): Readonly<ConfigData> {
        return this.config;
    }
}
