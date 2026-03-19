/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClassroomMinimal } from './ClassroomMinimal';
export type TeacherResponse = {
  id: string;
  user_id: string;
  institution_id: string;
  teacher_code: (string | null);
  full_name?: (string | null);
  email?: (string | null);
  specialization?: (string | null);
  is_active: boolean;
  is_suspended: boolean;
  joined_date?: (string | null);
  taught_classes_count?: number;
  taught_classrooms?: Array<ClassroomMinimal>;
  homeroom_class?: (ClassroomMinimal | null);
};

