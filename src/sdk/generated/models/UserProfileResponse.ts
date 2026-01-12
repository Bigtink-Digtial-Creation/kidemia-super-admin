/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserProfile } from './UserProfile';
import type { UserReputationResponse } from './UserReputationResponse';
import type { UserStatsResponse } from './UserStatsResponse';
export type UserProfileResponse = {
  user: UserProfile;
  stats: UserStatsResponse;
  reputation_meta: UserReputationResponse;
};

