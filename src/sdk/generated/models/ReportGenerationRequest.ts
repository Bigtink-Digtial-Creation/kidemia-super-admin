/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ExportFormat } from './ExportFormat';
import type { ReportType } from './ReportType';
export type ReportGenerationRequest = {
  report_type: ReportType;
  entity_id?: (string | null);
  start_date?: (string | null);
  end_date?: (string | null);
  format?: ExportFormat;
  /**
   * Include chart data in report
   */
  include_charts?: boolean;
  /**
   * Additional filters
   */
  filters?: (Record<string, any> | null);
};

