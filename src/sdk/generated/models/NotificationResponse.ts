/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type NotificationResponse = {
  id: string;
  notification_type: string;
  title: string;
  message: string;
  post_id?: (string | null);
  reply_id?: (string | null);
  triggering_user_id?: (string | null);
  is_read: boolean;
  created_at: string;
  read_at?: (string | null);
};

