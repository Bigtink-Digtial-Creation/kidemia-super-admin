/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CategoryConfigBase } from './CategoryConfigBase';
export type StudentResponse = {
  created_at: string;
  updated_at: string;
  id: string;
  category_id?: (string | null);
  institution_id?: (string | null);
  guardian_id?: (string | null);
  guardian_email?: (string | null);
  target_exam_date?: (string | null);
  preparation_level?: (string | null);
  is_active?: (boolean | null);
  is_suspended?: (boolean | null);
  user_id: string;
  student_code?: (string | null);
  registration_date: string;
  category?: (CategoryConfigBase | null);
};

