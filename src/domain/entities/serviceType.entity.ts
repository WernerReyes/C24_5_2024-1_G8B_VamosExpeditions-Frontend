import type { ServiceEntity } from "./service.entity";

export interface ServiceTypeEntity {
  readonly id: number;
  readonly name: string;
  readonly description?: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
  readonly services?: ServiceEntity[];
}
