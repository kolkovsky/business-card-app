import { Module } from '@nestjs/common';
import { ExperienceModule } from '../experience/experience.module';
import { LinksModule } from '../links/links.module';
import { ProjectsModule } from '../projects/projects.module';
import { SkillsModule } from '../skills/skills.module';
import { LoadersFactory } from './loaders.factory';

@Module({
  imports: [LinksModule, SkillsModule, ExperienceModule, ProjectsModule],
  providers: [LoadersFactory],
  exports: [LoadersFactory],
})
export class DataLoaderModule {}
