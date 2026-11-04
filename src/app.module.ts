import { Module } from '@nestjs/common';
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
export class AppModule {}
