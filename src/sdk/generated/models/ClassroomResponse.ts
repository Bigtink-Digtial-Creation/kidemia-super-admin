/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TeacherRead } from './TeacherRead';
export type ClassroomResponse = {
  id: string;
  institution_id: string;
  name: string;
  code: (string | null);
  level: (string | null);
  section: (string | null);
  academic_year: (string | null);
  capacity: (number | null);
  is_active: boolean;
  student_count?: number;
  class_teacher_id: (string | null);
  class_teacher: (TeacherRead | null);
  created_at: string;
};

