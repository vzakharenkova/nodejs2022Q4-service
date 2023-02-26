import * as dotenv from 'dotenv';
import { Injectable, Scope, ConsoleLogger, LogLevel } from '@nestjs/common';

import { createWriteStream } from 'fs';
import { mkdir, access, stat } from 'fs/promises';

dotenv.config();

const BIT_IN_KB = 1024;
const LOGGER_LEVELS = ['error', 'warn', 'log', 'verbose', 'debug'];

@Injectable({ scope: Scope.TRANSIENT })
export class CustomLoggerService extends ConsoleLogger {
  currentLogFile: { name: string };

  currentErrorFile: { name: string };

  logger_level: LogLevel;

  constructor() {
    super();

    this.currentLogFile = { name: this.generateFileName('access') };
    this.currentErrorFile = { name: this.generateFileName('error') };
    this.logger_level = LOGGER_LEVELS.includes(process.env.LOGGER_LEVEL)
      ? (process.env.LOGGER_LEVEL as LogLevel)
      : ('log' as LogLevel);

    super.setLogLevels([this.logger_level]);
  }

  async customLog(msg: string) {
    this.log(msg);

    await this.writeLogs('access', msg);
  }

  async customError(msg: string) {
    this.error(msg);

    await this.writeLogs('error', msg);
  }

  private generateFileName(type: 'access' | 'error') {
    return '/logs/' + type + Date.now() + '.log';
  }

  private async writeLogs(type: 'access' | 'error', msg: string) {
    const currFile = type === 'access' ? this.currentLogFile.name : this.currentErrorFile.name;

    access(__dirname + '/logs').catch(() => mkdir(__dirname + '/logs'));

    stat(__dirname + currFile)
      .then((value) => {
        if (value.size / BIT_IN_KB >= Number(process.env.LOGGER_SIZE) || 10) {
          type === 'access'
            ? (this.currentLogFile.name = this.generateFileName('access'))
            : (this.currentErrorFile.name = this.generateFileName('error'));
        }
      })
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .catch(() => {})
      .then(() => {
        const stream = createWriteStream(__dirname + currFile, { flags: 'a' });
        stream.write(msg + '\n');
      });
  }
}
