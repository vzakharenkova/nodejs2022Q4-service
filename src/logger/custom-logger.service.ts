import { Injectable, Scope, ConsoleLogger } from '@nestjs/common';

import { createWriteStream, WriteStream } from 'fs';
import { stat } from 'fs/promises';

@Injectable({ scope: Scope.TRANSIENT })
export class CustomLoggerService extends ConsoleLogger {
  currentLogFile = { name: this.generateFileName('access') };

  currentErrorFile = { name: this.generateFileName('error') };

  async customLog(msg: string) {
    this.log(msg);

    await this.writeLogs('access', msg);
  }

  async customError(msg: string) {
    this.error(msg);

    await this.writeLogs('error', msg);
  }

  private generateFileName(type: 'access' | 'error') {
    return '/' + type + new Date().toISOString() + '.log';
  }

  private async writeLogs(type: 'access' | 'error', msg: string) {
    const currFile = type === 'access' ? this.currentLogFile : this.currentErrorFile;

    await stat(__dirname + currFile)
      .then((value) => {
        if (value.size >= 1000) {
          console.log(value.size);
          type === 'access'
            ? (this.currentLogFile.name = this.generateFileName('access'))
            : (this.currentErrorFile.name = this.generateFileName('error'));
        }
      })
      .catch(() => {});

    const stream = createWriteStream(__dirname + currFile.name, { flags: 'a' });
    stream.write(msg + '\n');
  }
}
