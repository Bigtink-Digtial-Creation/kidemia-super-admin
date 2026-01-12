/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PostResponse } from '../models/PostResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ForumFeedService {
  /**
   * Get Personalized Feed
   * Get personalized feed based on user's interests and activity
   *
   * This feed is algorithmically generated based on:
   * - Posts from users you follow
   * - Posts in your subjects
   * - Posts matching your interests
   * - Trending content in your areas
   * - Recent activity
   *
   * **Requires authentication**
   * @param page
   * @param pageSize
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getPersonalizedFeedApiV1FeedPersonalizedGet(
    page: number = 1,
    pageSize: number = 20,
  ): CancelablePromise<Record<string, any>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/feed/personalized',
      query: {
        'page': page,
        'page_size': pageSize,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Discover Feed
   * Get discovery feed with various filter options
   *
   * **Feed Types:**
   * - **all**: All recent posts (default)
   * - **trending**: Trending posts in the last 7 days
   * - **unanswered**: Unanswered questions only
   * - **popular**: Most popular posts in the last 30 days
   * - **following**: Posts from users you follow (requires auth)
   * - **subjects**: Posts in your enrolled subjects (requires auth)
   *
   * **Public feed types** (all, trending, unanswered, popular) don't require authentication.
   * **Personal feed types** (following, subjects) require authentication.
   * @param feedType
   * @param page
   * @param pageSize
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getDiscoverFeedApiV1FeedDiscoverGet(
    feedType: string = 'all',
    page: number = 1,
    pageSize: number = 20,
  ): CancelablePromise<Record<string, any>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/feed/discover',
      query: {
        'feed_type': feedType,
        'page': page,
        'page_size': pageSize,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Subject Feed
   * Get all posts for a specific subject
   *
   * This shows all posts tagged with or categorized under the given subject.
   * Posts are sorted by most recent activity.
   *
   * **Use this for:** Subject-specific discussion pages
   * @param subjectId
   * @param page
   * @param pageSize
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getSubjectFeedApiV1FeedSubjectSubjectIdGet(
    subjectId: string,
    page: number = 1,
    pageSize: number = 20,
  ): CancelablePromise<Record<string, any>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/feed/subject/{subject_id}',
      path: {
        'subject_id': subjectId,
      },
      query: {
        'page': page,
        'page_size': pageSize,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Tag Feed
   * Get all posts with a specific tag
   *
   * This shows all posts tagged with the given tag.
   * Posts are sorted by most recent activity.
   *
   * **Use this for:** Tag-specific browsing, topic exploration
   * @param tagId
   * @param page
   * @param pageSize
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getTagFeedApiV1FeedTagTagIdGet(
    tagId: string,
    page: number = 1,
    pageSize: number = 20,
  ): CancelablePromise<Record<string, any>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/feed/tag/{tag_id}',
      path: {
        'tag_id': tagId,
      },
      query: {
        'page': page,
        'page_size': pageSize,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get User Activity Feed
   * Get a user's posts and activity
   *
   * This shows all posts created by a specific user.
   * Posts are sorted by creation date (newest first).
   *
   * **Use this for:** User profile pages, viewing someone's contributions
   * @param userId
   * @param page
   * @param pageSize
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getUserActivityFeedApiV1FeedUserUserIdGet(
    userId: string,
    page: number = 1,
    pageSize: number = 20,
  ): CancelablePromise<Record<string, any>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/feed/user/{user_id}',
      path: {
        'user_id': userId,
      },
      query: {
        'page': page,
        'page_size': pageSize,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Recommended Posts
   * Get recommended posts based on your interests
   *
   * Uses collaborative filtering to recommend posts:
   * - Finds users with similar interaction patterns
   * - Recommends posts those users interacted with
   * - Falls back to trending posts for new users
   *
   * **Use this for:**
   * - "Recommended for you" section
   * - Sidebar suggestions
   * - Homepage widgets
   *
   * **Requires authentication**
   * @param limit
   * @returns PostResponse Successful Response
   * @throws ApiError
   */
  public static getRecommendedPostsApiV1FeedRecommendedGet(
    limit: number = 10,
  ): CancelablePromise<Array<PostResponse>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/feed/recommended',
      query: {
        'limit': limit,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Questions For You
   * Get unanswered questions that match your expertise
   *
   * This feed shows questions where you could help:
   * - Questions in subjects you've answered before
   * - Questions with tags you're familiar with
   * - Recent questions with no or few replies
   *
   * **Use this for:**
   * - Encouraging users to help others
   * - Gamification ("Help a student!")
   * - Building reputation through expertise
   *
   * **Requires authentication**
   * @param page
   * @param pageSize
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getQuestionsForYouApiV1FeedQuestionsForYouGet(
    page: number = 1,
    pageSize: number = 20,
  ): CancelablePromise<Record<string, any>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/feed/questions-for-you',
      query: {
        'page': page,
        'page_size': pageSize,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Home Feed
   * Get comprehensive home feed with multiple sections
   *
   * Returns a curated home feed containing:
   * - Personalized posts (if authenticated)
   * - Trending posts
   * - Unanswered questions
   * - Recommended posts (if authenticated)
   *
   * **Use this for:** Main forum homepage
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getHomeFeedApiV1FeedHomeGet(): CancelablePromise<Record<string, any>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/feed/home',
    });
  }
  /**
   * Get Latest Activity
   * Get the latest activity across the entire forum
   *
   * Shows the most recent posts and replies across all categories.
   * Useful for a global activity feed or "What's happening now" section.
   * @param limit
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getLatestActivityApiV1FeedLatestActivityGet(
    limit: number = 20,
  ): CancelablePromise<Record<string, any>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/feed/latest-activity',
      query: {
        'limit': limit,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get My Complete Feed
   * Get your complete personalized feed
   *
   * This is the main feed for authenticated users, combining:
   * - Personalized recommendations
   * - Posts from followed users
   * - Subject-specific content
   * - Trending content
   *
   * **Requires authentication**
   * **Use this for:** Main feed page after login
   * @param page
   * @param pageSize
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getMyCompleteFeedApiV1FeedMyFeedGet(
    page: number = 1,
    pageSize: number = 20,
  ): CancelablePromise<Record<string, any>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/feed/my-feed',
      query: {
        'page': page,
        'page_size': pageSize,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
