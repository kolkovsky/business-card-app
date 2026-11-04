import { Injectable } from '@nestjs/common';
import type { Link } from '@prisma/client';
import { groupByKey } from '../common/group-by-key';
import { LinksRepository } from './links.repository';

@Injectable()
export class LinksService {
  constructor(private readonly repository: LinksRepository) {}

  /** Batch lookup: result[i] contains the links of profileIds[i]. */
  async findByProfileIds(profileIds: readonly number[]): Promise<Link[][]> {
    const links = await this.repository.findByProfileIds(profileIds);
    return groupByKey(profileIds, links, (link) => link.profileId);
  }
}
