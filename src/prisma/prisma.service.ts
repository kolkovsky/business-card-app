import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { AppConfigService } from '../config/app-config.service';

/**
 * Thin data-access gateway. Query events are always emitted so that
 * the number of SQL statements per request can be observed (LOG_SQL=true)
 * and asserted in tests (N+1 guard).
 */
@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, 'query'>
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(config: AppConfigService) {
    super({
      datasourceUrl: config.databaseUrl,
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ],
    });

    if (config.logSql) {
      this.$on('query', (event) => {
        this.logger.log(
          `${event.query} -- ${event.params} (${event.duration}ms)`,
        );
      });
    }
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
