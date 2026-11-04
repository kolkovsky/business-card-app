import { NotFoundException } from '@nestjs/common';
import type { Profile } from '@prisma/client';
import { ProfileRepository } from './profile.repository';
import { ProfileService } from './profile.service';

describe('ProfileService', () => {
  const profile = { id: 1, slug: 'owner' } as Profile;
  let repository: jest.Mocked<
    Pick<ProfileRepository, 'findBySlug' | 'findPrimary'>
  >;
  let service: ProfileService;

  beforeEach(() => {
    repository = {
      findBySlug: jest.fn(),
      findPrimary: jest.fn(),
    };
    service = new ProfileService(repository as unknown as ProfileRepository);
  });

  it('returns the primary profile when slug is omitted', async () => {
    repository.findPrimary.mockResolvedValue(profile);

    await expect(service.getProfile()).resolves.toBe(profile);
    expect(repository.findBySlug).not.toHaveBeenCalled();
  });

  it('looks the profile up by slug', async () => {
    repository.findBySlug.mockResolvedValue(profile);

    await expect(service.getProfile('owner')).resolves.toBe(profile);
    expect(repository.findBySlug).toHaveBeenCalledWith('owner');
    expect(repository.findPrimary).not.toHaveBeenCalled();
  });

  it('throws NotFoundException for an unknown slug', async () => {
    repository.findBySlug.mockResolvedValue(null);

    await expect(service.getProfile('ghost')).rejects.toThrow(
      new NotFoundException('Profile "ghost" not found'),
    );
  });

  it('throws NotFoundException when the database is empty', async () => {
    repository.findPrimary.mockResolvedValue(null);

    await expect(service.getProfile()).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
