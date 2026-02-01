/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AssessmentAnalyticsResponse } from '../models/AssessmentAnalyticsResponse';
import type { DashboardResponse } from '../models/DashboardResponse';
import type { FinancialOverviewResponse } from '../models/FinancialOverviewResponse';
import type { QuestionQualityResponse } from '../models/QuestionQualityResponse';
import type { ReportGenerationRequest } from '../models/ReportGenerationRequest';
import type { StudentPerformanceResponse } from '../models/StudentPerformanceResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AnalyticsService {
  /**
   * Get Admin Dashboard
   * Get comprehensive admin dashboard analytics
   * @returns DashboardResponse Successful Response
   * @throws ApiError
   */
  public static getAdminDashboardApiV1AnalyticsReportAdminGet(): CancelablePromise<DashboardResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/analytics/report/admin',
    });
  }
  /**
   * Get Student Dashboard
   * Get enhanced student-specific dashboard analytics with topic-level data
   * @param studentId
   * @returns StudentPerformanceResponse Successful Response
   * @throws ApiError
   */
  public static getStudentDashboardApiV1AnalyticsReportStudentStudentIdGet(
    studentId: string,
  ): CancelablePromise<StudentPerformanceResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/analytics/report/student/{student_id}',
      path: {
        'student_id': studentId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Student Topic Analytics
   * Get detailed topic-level analytics for a student
   * @param studentId
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getStudentTopicAnalyticsApiV1AnalyticsStudentsStudentIdTopicsGet(
    studentId: string,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/analytics/students/{student_id}/topics',
      path: {
        'student_id': studentId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Topic Trend
   * Get performance trend for a specific topic
   * @param studentId
   * @param topicId
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getTopicTrendApiV1AnalyticsStudentsStudentIdTopicsTopicIdTrendGet(
    studentId: string,
    topicId: string,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/analytics/students/{student_id}/topics/{topic_id}/trend',
      path: {
        'student_id': studentId,
        'topic_id': topicId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Student Study Plan
   * Get personalized study plan for student
   * @param studentId
   * @param durationDays
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getStudentStudyPlanApiV1AnalyticsStudentsStudentIdStudyPlanGet(
    studentId: string,
    durationDays: number = 14,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/analytics/students/{student_id}/study-plan',
      path: {
        'student_id': studentId,
      },
      query: {
        'duration_days': durationDays,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Generate Report
   * Generate comprehensive report for export
   *
   * Supports formats: PDF, Excel, CSV, JSON
   * Returns downloadable file or JSON data
   * @param requestBody
   * @returns any Successful Response
   * @throws ApiError
   */
  public static generateReportApiV1AnalyticsReportsGeneratePost(
    requestBody: ReportGenerationRequest,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/analytics/reports/generate',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Download Csv Report
   * Quick download CSV report
   * @param reportType
   * @param entityId
   * @returns any Successful Response
   * @throws ApiError
   */
  public static downloadCsvReportApiV1AnalyticsReportsDownloadCsvReportTypeGet(
    reportType: string,
    entityId?: (string | null),
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/analytics/reports/download/csv/{report_type}',
      path: {
        'report_type': reportType,
      },
      query: {
        'entity_id': entityId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Download Excel Report
   * Quick download Excel report
   * @param reportType
   * @param entityId
   * @returns any Successful Response
   * @throws ApiError
   */
  public static downloadExcelReportApiV1AnalyticsReportsDownloadExcelReportTypeGet(
    reportType: string,
    entityId?: (string | null),
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/analytics/reports/download/excel/{report_type}',
      path: {
        'report_type': reportType,
      },
      query: {
        'entity_id': entityId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Download Pdf Report
   * Quick download PDF report
   * @param reportType
   * @param entityId
   * @returns any Successful Response
   * @throws ApiError
   */
  public static downloadPdfReportApiV1AnalyticsReportsDownloadPdfReportTypeGet(
    reportType: string,
    entityId?: (string | null),
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/analytics/reports/download/pdf/{report_type}',
      path: {
        'report_type': reportType,
      },
      query: {
        'entity_id': entityId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Guardian Dashboard
   * Get guardian dashboard showing all wards' performance
   * @param guardianId
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getGuardianDashboardApiV1AnalyticsReportGuardianGuardianIdGet(
    guardianId: string,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/analytics/report/guardian/{guardian_id}',
      path: {
        'guardian_id': guardianId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Institution Dashboard
   * Get institution-specific analytics
   * @param institutionId
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getInstitutionDashboardApiV1AnalyticsReportInstitutionInstitutionIdGet(
    institutionId: string,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/analytics/report/institution/{institution_id}',
      path: {
        'institution_id': institutionId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Assessment Analytics
   * Get detailed analytics for a specific assessment
   * @param assessmentId
   * @returns AssessmentAnalyticsResponse Successful Response
   * @throws ApiError
   */
  public static getAssessmentAnalyticsApiV1AnalyticsAssessmentsAssessmentIdGet(
    assessmentId: string,
  ): CancelablePromise<AssessmentAnalyticsResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/analytics/assessments/{assessment_id}',
      path: {
        'assessment_id': assessmentId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Category Comparison
   * Compare performance across assessment categories
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getCategoryComparisonApiV1AnalyticsAssessmentsCategoryComparisonGet(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/analytics/assessments/category/comparison',
    });
  }
  /**
   * Get Top Assessments
   * Get top performing assessments by average score
   * @param limit
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getTopAssessmentsApiV1AnalyticsAssessmentsTopPerformingGet(
    limit: number = 10,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/analytics/assessments/top-performing',
      query: {
        'limit': limit,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Difficult Assessments
   * Get assessments with lowest pass rates
   * @param limit
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getDifficultAssessmentsApiV1AnalyticsAssessmentsMostDifficultGet(
    limit: number = 10,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/analytics/assessments/most-difficult',
      query: {
        'limit': limit,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Question Quality Report
   * Analyze question quality and difficulty accuracy
   * @returns QuestionQualityResponse Successful Response
   * @throws ApiError
   */
  public static getQuestionQualityReportApiV1AnalyticsQuestionsQualityReportGet(): CancelablePromise<QuestionQualityResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/analytics/questions/quality-report',
    });
  }
  /**
   * Get Most Missed Questions
   * Get questions with lowest success rates
   * @param limit
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getMostMissedQuestionsApiV1AnalyticsQuestionsMostMissedGet(
    limit: number = 20,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/analytics/questions/most-missed',
      query: {
        'limit': limit,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Financial Overview
   * Get comprehensive financial analytics
   * @param period
   * @returns FinancialOverviewResponse Successful Response
   * @throws ApiError
   */
  public static getFinancialOverviewApiV1AnalyticsFinancialOverviewGet(
    period: string = 'monthly',
  ): CancelablePromise<FinancialOverviewResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/analytics/financial/overview',
      query: {
        'period': period,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Revenue Trend
   * Get revenue trend over specified period
   * @param days
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getRevenueTrendApiV1AnalyticsFinancialRevenueTrendGet(
    days: number = 30,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/analytics/financial/revenue-trend',
      query: {
        'days': days,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Subscription Analytics
   * Get subscription-related metrics
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getSubscriptionAnalyticsApiV1AnalyticsFinancialSubscriptionsGet(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/analytics/financial/subscriptions',
    });
  }
  /**
   * Get Engagement Overview
   * Get platform-wide engagement metrics
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getEngagementOverviewApiV1AnalyticsEngagementOverviewGet(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/analytics/engagement/overview',
    });
  }
  /**
   * Get User Growth
   * Get user registration trends
   * @param days
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getUserGrowthApiV1AnalyticsEngagementUserGrowthGet(
    days: number = 30,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/analytics/engagement/user-growth',
      query: {
        'days': days,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Student Performance
   * Get comprehensive performance summary for a student
   * @param studentId
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getStudentPerformanceApiV1AnalyticsStudentsStudentIdPerformanceGet(
    studentId: string,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/analytics/students/{student_id}/performance',
      path: {
        'student_id': studentId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Student Subject Performance
   * Get student performance breakdown by subject
   * @param studentId
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getStudentSubjectPerformanceApiV1AnalyticsStudentsStudentIdSubjectPerformanceGet(
    studentId: string,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/analytics/students/{student_id}/subject-performance',
      path: {
        'student_id': studentId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Student Progress
   * Get student's score progression over time
   * @param studentId
   * @param days
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getStudentProgressApiV1AnalyticsStudentsStudentIdProgressGet(
    studentId: string,
    days: number = 30,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/analytics/students/{student_id}/progress',
      path: {
        'student_id': studentId,
      },
      query: {
        'days': days,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Performance Prediction
   * Predict student's future performance based on trends
   * @param studentId
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getPerformancePredictionApiV1AnalyticsStudentsStudentIdPredictionGet(
    studentId: string,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/analytics/students/{student_id}/prediction',
      path: {
        'student_id': studentId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Realtime Activity
   * Get recent platform activities for real-time monitoring
   * @param limit
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getRealtimeActivityApiV1AnalyticsRealtimeActivityGet(
    limit: number = 20,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/analytics/realtime/activity',
      query: {
        'limit': limit,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Platform Overview
   * Get high-level platform statistics
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getPlatformOverviewApiV1AnalyticsOverviewGet(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/analytics/overview',
    });
  }
}
