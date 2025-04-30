import type { UserEntity } from './user.entity';

export interface NotificationMessageEntity {
    id: number;
    from_user: number;
    to_user: number;
    message: string;
    is_read: boolean;
    created_at: string;
    user?: UserEntity;
}