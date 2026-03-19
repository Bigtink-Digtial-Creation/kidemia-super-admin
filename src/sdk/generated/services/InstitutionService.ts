/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AssignAssessmentRequest } from '../models/AssignAssessmentRequest';
import type { Body_bulk_upload_students_api_v1_institution_students_bulk_upload_post } from '../models/Body_bulk_upload_students_api_v1_institution_students_bulk_upload_post';
import type { BulkMoveStudentsRequest } from '../models/BulkMoveStudentsRequest';
import type { BulkOnboardResult } from '../models/BulkOnboardResult';
import type { BulkReportCardRequest } from '../models/BulkReportCardRequest';
import type { ClassroomAnalytics } from '../models/ClassroomAnalytics';
import type { ClassroomComparison } from '../models/ClassroomComparison';
import type { ClassroomCreate } from '../models/ClassroomCreate';
import type { ClassroomResponse } from '../models/ClassroomResponse';
import type { ClassroomUpdate } from '../models/ClassroomUpdate';
import type { InstitutionAnalytics } from '../models/InstitutionAnalytics';
import type { InstitutionAssessmentCreate } from '../models/InstitutionAssessmentCreate';
import type { InstitutionAssessmentResponse } from '../models/InstitutionAssessmentResponse';
import type { InstitutionDashboardStats } from '../models/InstitutionDashboardStats';
import type { InstitutionProfileResponse } from '../models/InstitutionProfileResponse';
import type { InstitutionUpdateRequest } from '../models/InstitutionUpdateRequest';
import type { LinkStudent } from '../models/LinkStudent';
import type { MoveStudentRequest } from '../models/MoveStudentRequest';
import type { RegisterRequest } from '../models/RegisterRequest';
import type { ScoreSnapshot } from '../models/ScoreSnapshot';
import type { StudentGroupCreate } from '../models/StudentGroupCreate';
import type { StudentGroupResponse } from '../models/StudentGroupResponse';
import type { StudentGroupUpdate } from '../models/StudentGroupUpdate';
import type { StudentWithClassroomResponse } from '../models/StudentWithClassroomResponse';
import type { TeacherInviteRequest } from '../models/TeacherInviteRequest';
import type { TeacherResponse } from '../models/TeacherResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class InstitutionService {
  /**
   * Get Dashboard
   * @returns InstitutionDashboardStats Successful Response
   * @throws ApiError
   */
  public static getDashboardApiV1InstitutionDashboardGet(): CancelablePromise<InstitutionDashboardStats> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/institution/dashboard',
    });
  }
  /**
   * Get Detailed Students
   * Returns students including their Classroom details (Name, Level, Section).
   * @param skip
   * @param limit
   * @returns StudentWithClassroomResponse Successful Response
   * @throws ApiError
   */
  public static getDetailedStudentsApiV1InstitutionStudentsDetailedGet(
    skip?: number,
    limit: number = 100,
  ): CancelablePromise<Array<StudentWithClassroomResponse>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/institution/students-detailed',
      query: {
        'skip': skip,
        'limit': limit,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Classroom Students
   * @param classroomId
   * @param skip
   * @param limit
   * @returns StudentWithClassroomResponse Successful Response
   * @throws ApiError
   */
  public static getClassroomStudentsApiV1InstitutionClassroomsClassroomIdStudentsGet(
    classroomId: string,
    skip?: number,
    limit: number = 100,
  ): CancelablePromise<Array<StudentWithClassroomResponse>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/institution/classrooms/{classroom_id}/students',
      path: {
        'classroom_id': classroomId,
      },
      query: {
        'skip': skip,
        'limit': limit,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Remove Student From Institution
   * @param institutionId
   * @param studentId
   * @returns void
   * @throws ApiError
   */
  public static removeStudentFromInstitutionApiV1InstitutionInstitutionIdStudentsStudentIdDelete(
    institutionId: string,
    studentId: string,
  ): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/v1/institution/{institution_id}/students/{student_id}',
      path: {
        'institution_id': institutionId,
        'student_id': studentId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * List Classrooms
   * @returns ClassroomResponse Successful Response
   * @throws ApiError
   */
  public static listClassroomsApiV1InstitutionClassroomsGet(): CancelablePromise<Array<ClassroomResponse>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/institution/classrooms',
    });
  }
  /**
   * Create Classroom
   * @param requestBody
   * @returns ClassroomResponse Successful Response
   * @throws ApiError
   */
  public static createClassroomApiV1InstitutionClassroomsPost(
    requestBody: ClassroomCreate,
  ): CancelablePromise<ClassroomResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/institution/classrooms',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Update Classroom
   * @param classroomId
   * @param requestBody
   * @returns ClassroomResponse Successful Response
   * @throws ApiError
   */
  public static updateClassroomApiV1InstitutionClassroomsClassroomIdPatch(
    classroomId: string,
    requestBody: ClassroomUpdate,
  ): CancelablePromise<ClassroomResponse> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/v1/institution/classrooms/{classroom_id}',
      path: {
        'classroom_id': classroomId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Move Student To Classroom
   * @param requestBody
   * @returns any Successful Response
   * @throws ApiError
   */
  public static moveStudentToClassroomApiV1InstitutionClassroomsMoveStudentPost(
    requestBody: MoveStudentRequest,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/institution/classrooms/move-student',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Bulk Move Students
   * @param requestBody
   * @returns any Successful Response
   * @throws ApiError
   */
  public static bulkMoveStudentsApiV1InstitutionClassroomsBulkMoveStudentsPost(
    requestBody: BulkMoveStudentsRequest,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/institution/classrooms/bulk-move-students',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Lookup Student
   * @param q Email or student code
   * @returns any Successful Response
   * @throws ApiError
   */
  public static lookupStudentApiV1InstitutionInstitutionIdStudentsLookupGet(
    q: string,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/institution/{institution_id}/students/lookup',
      query: {
        'q': q,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Link Student
   * @param requestBody
   * @returns any Successful Response
   * @throws ApiError
   */
  public static linkStudentApiV1InstitutionInstitutionIdStudentsLinkPost(
    requestBody: LinkStudent,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/institution/{institution_id}/students/link',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Add Single Student
   * @param institutionId
   * @param requestBody
   * @param sendInvite
   * @returns any Successful Response
   * @throws ApiError
   */
  public static addSingleStudentApiV1InstitutionInstitutionIdStudentsPost(
    institutionId: string,
    requestBody: RegisterRequest,
    sendInvite: boolean = true,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/institution/{institution_id}/students',
      path: {
        'institution_id': institutionId,
      },
      query: {
        'send_invite': sendInvite,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Bulk Upload Students
   * Upload a CSV to onboard multiple students at once.
   * @param formData
   * @param sendInvite
   * @returns BulkOnboardResult Successful Response
   * @throws ApiError
   */
  public static bulkUploadStudentsApiV1InstitutionStudentsBulkUploadPost(
    formData: Body_bulk_upload_students_api_v1_institution_students_bulk_upload_post,
    sendInvite: boolean = true,
  ): CancelablePromise<BulkOnboardResult> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/institution/students/bulk-upload',
      query: {
        'send_invite': sendInvite,
      },
      formData: formData,
      mediaType: 'multipart/form-data',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Create Student Group
   * @param classroomId
   * @param requestBody
   * @returns StudentGroupResponse Successful Response
   * @throws ApiError
   */
  public static createStudentGroupApiV1InstitutionClassroomsClassroomIdGroupsPost(
    classroomId: string,
    requestBody: StudentGroupCreate,
  ): CancelablePromise<StudentGroupResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/institution/classrooms/{classroom_id}/groups',
      path: {
        'classroom_id': classroomId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * List Student Groups
   * @param classroomId
   * @returns StudentGroupResponse Successful Response
   * @throws ApiError
   */
  public static listStudentGroupsApiV1InstitutionClassroomsClassroomIdGroupsGet(
    classroomId: string,
  ): CancelablePromise<Array<StudentGroupResponse>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/institution/classrooms/{classroom_id}/groups',
      path: {
        'classroom_id': classroomId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * List All Groups
   * All groups across the institution — used by AssignAssessmentModal.
   * @returns StudentGroupResponse Successful Response
   * @throws ApiError
   */
  public static listAllGroupsApiV1InstitutionGroupsGet(): CancelablePromise<Array<StudentGroupResponse>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/institution/groups',
    });
  }
  /**
   * Update Student Group
   * @param groupId
   * @param requestBody
   * @returns any Successful Response
   * @throws ApiError
   */
  public static updateStudentGroupApiV1InstitutionGroupsGroupIdPatch(
    groupId: string,
    requestBody: StudentGroupUpdate,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/v1/institution/groups/{group_id}',
      path: {
        'group_id': groupId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Invite Teacher
   * @param requestBody
   * @returns TeacherResponse Successful Response
   * @throws ApiError
   */
  public static inviteTeacherApiV1InstitutionTeachersInvitePost(
    requestBody: TeacherInviteRequest,
  ): CancelablePromise<TeacherResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/institution/teachers/invite',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * List Teachers
   * @returns TeacherResponse Successful Response
   * @throws ApiError
   */
  public static listTeachersApiV1InstitutionTeachersGet(): CancelablePromise<Array<TeacherResponse>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/institution/teachers',
    });
  }
  /**
   * Suspend Teacher
   * @param teacherId
   * @param suspend
   * @returns any Successful Response
   * @throws ApiError
   */
  public static suspendTeacherApiV1InstitutionTeachersTeacherIdSuspendPatch(
    teacherId: string,
    suspend: boolean,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/v1/institution/teachers/{teacher_id}/suspend',
      path: {
        'teacher_id': teacherId,
      },
      query: {
        'suspend': suspend,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Assign Teacher To Classroom
   * @param teacherId
   * @param classroomId
   * @param subject
   * @param isClassTeacher
   * @returns any Successful Response
   * @throws ApiError
   */
  public static assignTeacherToClassroomApiV1InstitutionTeachersTeacherIdAssignPatch(
    teacherId: string,
    classroomId: string,
    subject: (string | null),
    isClassTeacher: boolean = false,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/v1/institution/teachers/{teacher_id}/assign',
      path: {
        'teacher_id': teacherId,
      },
      query: {
        'classroom_id': classroomId,
        'subject': subject,
        'is_class_teacher': isClassTeacher,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Create Institution Assessment
   * @param requestBody
   * @returns InstitutionAssessmentResponse Successful Response
   * @throws ApiError
   */
  public static createInstitutionAssessmentApiV1InstitutionAssessmentsPost(
    requestBody: InstitutionAssessmentCreate,
  ): CancelablePromise<InstitutionAssessmentResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/institution/assessments',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * List Institution Assessments
   * @param skip
   * @param limit
   * @returns InstitutionAssessmentResponse Successful Response
   * @throws ApiError
   */
  public static listInstitutionAssessmentsApiV1InstitutionAssessmentsGet(
    skip?: number,
    limit: number = 50,
  ): CancelablePromise<Array<InstitutionAssessmentResponse>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/institution/assessments',
      query: {
        'skip': skip,
        'limit': limit,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Assessment Stat
   * @param assessementId
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getAssessmentStatApiV1InstitutionAssessmentsStatsGet(
    assessementId: string = '952b4c12-8fd5-45f6-8c32-612cdd374515',
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/institution/assessments/stats',
      query: {
        'assessement_id': assessementId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Assign Assessment
   * Assign an assessment to a classroom, a student group, or individual students.
   * Scope is determined by which IDs are provided in the body.
   * @param requestBody
   * @returns any Successful Response
   * @throws ApiError
   */
  public static assignAssessmentApiV1InstitutionAssessmentsAssignPost(
    requestBody: AssignAssessmentRequest,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/institution/assessments/assign',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Institution Analytics
   * Full institution-wide analytics — classrooms, groups, trends.
   * @returns InstitutionAnalytics Successful Response
   * @throws ApiError
   */
  public static getInstitutionAnalyticsApiV1InstitutionAnalyticsGet(): CancelablePromise<InstitutionAnalytics> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/institution/analytics',
    });
  }
  /**
   * Get Classroom Analytics
   * Per-classroom analytics with student leaderboard and question difficulty.
   * @param classroomId
   * @returns ClassroomAnalytics Successful Response
   * @throws ApiError
   */
  public static getClassroomAnalyticsApiV1InstitutionAnalyticsClassroomsClassroomIdGet(
    classroomId: string,
  ): CancelablePromise<ClassroomAnalytics> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/institution/analytics/classrooms/{classroom_id}',
      path: {
        'classroom_id': classroomId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Score Trend
   * Monthly avg score trend for the institution — used by overview charts.
   * @returns ScoreSnapshot Successful Response
   * @throws ApiError
   */
  public static getScoreTrendApiV1InstitutionAnalyticsOverviewScoreTrendGet(): CancelablePromise<Array<ScoreSnapshot>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/institution/analytics/overview/score-trend',
    });
  }
  /**
   * Get Classroom Performance Overview
   * Per-classroom avg scores — used by overview Class vs Class chart.
   * @returns ClassroomComparison Successful Response
   * @throws ApiError
   */
  public static getClassroomPerformanceOverviewApiV1InstitutionAnalyticsOverviewClassroomPerformanceGet(): CancelablePromise<Array<ClassroomComparison>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/institution/analytics/overview/classroom-performance',
    });
  }
  /**
   * Get Student Report Card
   * @param studentId
   * @param format
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getStudentReportCardApiV1InstitutionStudentsStudentIdReportCardGet(
    studentId: string,
    format: string = 'json',
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/institution/students/{student_id}/report-card',
      path: {
        'student_id': studentId,
      },
      query: {
        'format': format,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Generate Bulk Report Cards
   * @param requestBody
   * @param format
   * @returns any Successful Response
   * @throws ApiError
   */
  public static generateBulkReportCardsApiV1InstitutionReportCardsBulkPost(
    requestBody: BulkReportCardRequest,
    format: string = 'json',
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/institution/report-cards/bulk',
      query: {
        'format': format,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Institution Profile
   * @returns InstitutionProfileResponse Successful Response
   * @throws ApiError
   */
  public static getInstitutionProfileApiV1InstitutionProfileGet(): CancelablePromise<InstitutionProfileResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/institution/profile',
    });
  }
  /**
   * Update Institution Profile
   * @param requestBody
   * @returns InstitutionProfileResponse Successful Response
   * @throws ApiError
   */
  public static updateInstitutionProfileApiV1InstitutionProfilePatch(
    requestBody: InstitutionUpdateRequest,
  ): CancelablePromise<InstitutionProfileResponse> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/v1/institution/profile',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Institution Assignments
   * Returns all assessments assigned to this student via their institution
   * (classroom, group, or individual assignments).
   * @param status
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getInstitutionAssignmentsApiV1InstitutionMyAssignmentsInstitutionGet(
    status?: (string | null),
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/institution/my-assignments/institution',
      query: {
        'status': status,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
