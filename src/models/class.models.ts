import { Entity } from './base.model';
import type { UserModel } from './user.models';

export interface ClassModel extends Entity {
  name: string;
  classCode: string;
  teachers?: UserModel[] | undefined;
  section: string;
  academicYear: string;
  enrolled?: UserModel[] | undefined;
}


export interface ClassKeepingModel extends Entity {
  teaching: string[];
  archivedTeaching: string[];
  enrolled: string[];
  archivedEnrolled: string[];
}
