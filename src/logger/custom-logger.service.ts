import { Injectable, Scope, ConsoleLogger, LogLevel } from '@nestjs/common';

import { accessSync, mkdirSync, statSync, writeFileSync } from 'fs';

const BIT_IN_KB = 1024;
const LOGGER_LEVELS = ['error', 'warn', 'log', 'verbose', 'debug'];

@Injectable({ scope: Scope.TRANSIENT })
export class CustomLoggerService extends ConsoleLogger {
  currentLogFile: { name: string };

  currentErrorFile: { name: string };

  logger_level: number;

  constructor() {
    super();

    this.currentLogFile = { name: this.generateFileName('access') };
    this.currentErrorFile = { name: this.generateFileName('error') };

    this.logger_level =
      LOGGER_LEVELS.length >= +process.env.LOGGER_LEVEL
        ? 4
        : +process.env.LOGGER_LEVEL < 0
        ? 0
        : +process.env.LOGGER_LEVEL;

    super.setLogLevels([LOGGER_LEVELS[this.logger_level] as LogLevel]);

    try {
      accessSync(__dirname + '/logs');
    } catch {
      mkdirSync(__dirname + '/logs');
    }
  }

  debug(msg: string) {
    if (this.logger_level < 4) return;

    super.debug(msg);

    this.writeLogs('access', msg);
  }

  verbose(msg: string) {
    if (this.logger_level < 3) return;

    super.verbose(msg);

    this.writeLogs('access', msg);
  }

  log(msg: string) {
    if (this.logger_level < 2) return;

    super.log(msg);

    this.writeLogs('access', msg);
  }

  warn(msg: string) {
    if (this.logger_level < 1) return;

    super.warn(msg);

    this.writeLogs('error', msg);
  }

  error(msg: string) {
    super.error(msg);

    this.writeLogs('error', msg);
  }

  private generateFileName(type: 'access' | 'error') {
    return '/logs/' + type + Date.now() + '.log';
  }

  private writeLogs(type: 'access' | 'error', msg: string) {
    const currFile = type === 'access' ? this.currentLogFile.name : this.currentErrorFile.name;

    try {
      if (
        statSync(__dirname + currFile).size / BIT_IN_KB >=
        (Number(process.env.LOGGER_SIZE) || 10)
      ) {
        type === 'access'
          ? (this.currentLogFile.name = this.generateFileName('access'))
          : (this.currentErrorFile.name = this.generateFileName('error'));
      }
    } catch {}

    writeFileSync(__dirname + currFile, msg + '\n', { flag: 'a' });
  }
}
