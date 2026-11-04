import { Injectable, NotFoundException } from '@nestjs/common';
import type { Profile } from '@prisma/client';
import { ProfileRepository } from './profile.repository';

@Injectable()
export class ProfileService {
  constructor(private readonly repository: ProfileRepository) {}

  /** Returns the profile by slug, or the primary profile when slug is omitted. */
  async getProfile(slug?: string): Promise<Profile> {
    const profile = slug
      ? await this.repository.findBySlug(slug)
      : await this.repository.findPrimary();

    if (!profile) {
      throw new NotFoundException(
        slug ? `Profile "${slug}" not found` : 'Profile not found',
      );
    }
    return profile;
  }
}
