export interface PartnerEntity {
  readonly id: number;
  readonly name: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  readonly isDeleted?: boolean;
  readonly deletedAt?: Date;
  readonly deleteReason?: string;
}
