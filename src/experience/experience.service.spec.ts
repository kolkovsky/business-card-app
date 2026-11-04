import type { Achievement, Experience } from '@prisma/client';
import { ExperienceRepository } from './experience.repository';
import { ExperienceService } from './experience.service';

describe('ExperienceService', () => {
  let repository: jest.Mocked<
    Pick<
      ExperienceRepository,
      'findByProfileIds' | 'findAchievementsByExperienceIds'
    >
  >;
  let service: ExperienceService;

  beforeEach(() => {
    repository = {
      findByProfileIds: jest.fn(),
      findAchievementsByExperienceIds: jest.fn(),
    };
    service = new ExperienceService(
      repository as unknown as ExperienceRepository,
    );
  });

  it('loads experience for all profiles in one call and groups it by key order', async () => {
    const a = { id: 1, profileId: 1 } as Experience;
    const b = { id: 2, profileId: 2 } as Experience;
    repository.findByProfileIds.mockResolvedValue([a, b]);

    await expect(service.findByProfileIds([2, 1, 3])).resolves.toEqual([
      [b],
      [a],
      [],
    ]);
    expect(repository.findByProfileIds).toHaveBeenCalledTimes(1);
    expect(repository.findByProfileIds).toHaveBeenCalledWith([2, 1, 3]);
  });

  it('groups achievements by experience id', async () => {
    const first = { id: 1, experienceId: 5 } as Achievement;
    const second = { id: 2, experienceId: 5 } as Achievement;
    repository.findAchievementsByExperienceIds.mockResolvedValue([
      first,
      second,
    ]);

    await expect(
      service.findAchievementsByExperienceIds([5, 6]),
    ).resolves.toEqual([[first, second], []]);
  });

  it.each([
    [null, true],
    [new Date('2022-12-01'), false],
  ])('isCurrent(endDate=%p) -> %p', (endDate, expected) => {
    expect(service.isCurrent({ endDate })).toBe(expected);
  });
});
