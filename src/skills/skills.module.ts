import { Module } from '@nestjs/common';
import { SkillsRepository } from './skills.repository';
import { SkillsService } from './skills.service';

@Module({
  providers: [SkillsRepository, SkillsService],
  exports: [SkillsService],
})
export class SkillsModule {}
