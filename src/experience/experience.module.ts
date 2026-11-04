import { Module } from '@nestjs/common';
import { ExperienceRepository } from './experience.repository';
import { ExperienceResolver } from './experience.resolver';
import { ExperienceService } from './experience.service';

@Module({
  providers: [ExperienceRepository, ExperienceService, ExperienceResolver],
  exports: [ExperienceService],
})
export class ExperienceModule {}
