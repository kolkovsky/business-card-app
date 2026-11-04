import { Injectable } from '@nestjs/common';
import type { Profile } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  findBySlug(slug: string): Promise<Profile | null> {
    return this.prisma.profile.findUnique({ where: { slug } });
  }

  /** The first created profile is the card owner. */
  findPrimary(): Promise<Profile | null> {
    return this.prisma.profile.findFirst({ orderBy: { id: 'asc' } });
  }
}
