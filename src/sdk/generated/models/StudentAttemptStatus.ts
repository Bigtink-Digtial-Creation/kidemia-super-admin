/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type StudentAttemptStatus = {
  student_id: string;
  student_name: string;
  student_code: (string | null);
  classroom_name: (string | null);
  status: string;
  attempt_count: number;
  best_score: (number | null);
  best_percentage: (number | null);
  passed: (boolean | null);
  grade: (string | null);
  started_at: (string | null);
  submitted_at: (string | null);
  time_spent_seconds: (number | null);
  assigned_via: string;
};

