import type { ServiceEntity } from './service.entity';

export interface ServiceTripDetailsEntity {
  id: number;
  date: Date;
  costPerson: number;
  service?: ServiceEntity;
}