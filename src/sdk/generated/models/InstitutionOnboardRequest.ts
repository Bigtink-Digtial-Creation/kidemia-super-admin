/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Full payload for manually onboarding one institution.
 * The admin fills this form in the system dashboard.
 */
export type InstitutionOnboardRequest = {
  name: string;
  code: string;
  description?: (string | null);
  motto?: (string | null);
  established_date?: (string | null);
  email?: (string | null);
  phone?: (string | null);
  website?: (string | null);
  address?: (string | null);
  city?: (string | null);
  state?: (string | null);
  country?: string;
  logo_url?: (string | null);
  banner_url?: (string | null);
  color_primary?: (string | null);
  color_secondary?: (string | null);
  owner_email: string;
  owner_first_name: string;
  owner_last_name: string;
  owner_phone?: (string | null);
  tier?: string;
  max_students?: (number | null);
  is_verified?: boolean;
  is_public?: boolean;
  send_welcome_email?: boolean;
};

