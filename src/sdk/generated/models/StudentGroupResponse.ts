/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StudentMember } from './StudentMember';
export type StudentGroupResponse = {
  id: string;
  classroom_id: string;
  institution_id: string;
  name: string;
  description: (string | null);
  is_active: boolean;
  student_count?: number;
  students?: Array<StudentMember>;
  created_at: string;
};

