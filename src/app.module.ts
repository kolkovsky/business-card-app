import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RequestLoggerMiddleware } from './common/request-logger.middleware';
import { AppConfigModule } from './config/config.module';
import { ExperienceModule } from './experience/experience.module';
import { AppGraphQLModule } from './graphql/graphql.module';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    AppConfigModule,
    PrismaModule,
    HealthModule,
    AppGraphQLModule,
    ProfileModule,
    ExperienceModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    // Health checks fire every few seconds and would drown out real traffic
    consumer
      .apply(RequestLoggerMiddleware)
      .exclude('health')
      .forRoutes('{*splat}');
  }
}
