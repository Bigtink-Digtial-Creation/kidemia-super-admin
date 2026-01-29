/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request to add a ward via email
 */
export type AddWardRequest = {
  /**
   * Email of the student to add as ward
   */
  ward_email: string;
  /**
   * Relationship to ward (parent, guardian, etc.)
   */
  relationship_type?: (string | null);
};

