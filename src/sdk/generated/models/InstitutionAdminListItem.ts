/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type InstitutionAdminListItem = {
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
};

