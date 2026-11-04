import { Injectable } from '@nestjs/common';
import type { Link } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LinksRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByProfileIds(profileIds: readonly number[]): Promise<Link[]> {
    return this.prisma.link.findMany({
      where: { profileId: { in: [...profileIds] } },
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });
  }
}
