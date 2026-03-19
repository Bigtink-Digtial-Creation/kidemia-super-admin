/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type InstitutionAdminDetail = {
  id: string;
  name: string;
  code: string;
  city: (string | null);
  state: (string | null);
  country: (string | null);
  tier: string;
  is_public: boolean;
  is_verified: boolean;
  total_students: number;
  total_teachers?: number;
  owner_email: (string | null);
  created_at: string;
  description: (string | null);
  motto: (string | null);
  email: (string | null);
  phone: (string | null);
  website: (string | null);
  address: (string | null);
  logo_url: (string | null);
  max_students: (number | null);
  total_classrooms?: number;
  total_assessments: number;
  established_date: (string | null);
};

