import type { AuthResponseDto, UserRecordDto } from '../models/auth.dto';
import type { AuthSessionEntity, UserEntity } from '../models/auth.entity';
import type { AuthSessionViewModel, UserViewModel } from '../models/auth.viewmodel';

const PB_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:8090';

export class AuthMapper {
  // ─── DTO → Entity ───────────────────────────────────────────────────────────

  static recordToEntity(dto: UserRecordDto): UserEntity {
    return {
      id: dto.id,
      email: dto.email,
      name: dto.name,
      avatar: dto.avatar,
      emailVisibility: dto.emailVisibility,
      verified: dto.verified,
      createdAt: new Date(dto.created),
      updatedAt: new Date(dto.updated),
    };
  }

  static authResponseToEntity(dto: AuthResponseDto): AuthSessionEntity {
    return {
      token: dto.token,
      user: AuthMapper.recordToEntity(dto.record),
    };
  }

  // ─── Entity → ViewModel ─────────────────────────────────────────────────────

  static userToViewModel(entity: UserEntity): UserViewModel {
    const avatarUrl = entity.avatar
      ? `${PB_URL}/api/files/${entity.id}/${entity.avatar}`
      : null;

    return {
      id: entity.id,
      email: entity.email,
      displayName: entity.name || entity.email,
      avatarUrl,
      isVerified: entity.verified,
    };
  }

  static sessionToViewModel(entity: AuthSessionEntity): AuthSessionViewModel {
    return {
      token: entity.token,
      user: AuthMapper.userToViewModel(entity.user),
    };
  }
}
