/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BookmarkCreate } from '../models/BookmarkCreate';
import type { BookmarkResponse } from '../models/BookmarkResponse';
import type { ForumStats } from '../models/ForumStats';
import type { NotificationResponse } from '../models/NotificationResponse';
import type { PopularTag } from '../models/PopularTag';
import type { PostCreate } from '../models/PostCreate';
import type { PostDetailResponse } from '../models/PostDetailResponse';
import type { PostListResponse } from '../models/PostListResponse';
import type { PostResponse } from '../models/PostResponse';
import type { PostStatus } from '../models/PostStatus';
import type { PostType } from '../models/PostType';
import type { PostUpdate } from '../models/PostUpdate';
import type { ReactionCreate } from '../models/ReactionCreate';
import type { ReplyCreate } from '../models/ReplyCreate';
import type { ReplyResponse } from '../models/ReplyResponse';
import type { ReplyUpdate } from '../models/ReplyUpdate';
import type { ReputationResponse } from '../models/ReputationResponse';
import type { TagCreate } from '../models/TagCreate';
import type { TagResponse } from '../models/TagResponse';
import type { TrendingPost } from '../models/TrendingPost';
import type { UserProfileResponse } from '../models/UserProfileResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CommunityService {
  /**
   * Create Post
   * Create a new forum post
   *
   * - **title**: Post title (5-500 characters)
   * - **content**: Post content (10-10000 characters)
   * - **post_type**: Type of post (question, discussion, study_group, resource_share, announcement)
   * - **subject_id**: Optional subject ID
   * - **exam_target**: Optional exam target
   * - **tag_names**: List of tag names (max 5)
   * @param requestBody
   * @returns PostResponse Successful Response
   * @throws ApiError
   */
  public static createPostApiV1ForumPostsPost(
    requestBody: PostCreate,
  ): CancelablePromise<PostResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/forum/posts',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Posts
   * Get filtered and paginated posts
   *
   * **Filters:**
   * - **post_type**: Filter by post type
   * - **status**: Filter by status (active, closed, archived, flagged)
   * - **subject_id**: Filter by subject
   * - **exam target**: Filter by exam target
   * - **tag_id**: Filter by tag
   * - **author_id**: Filter by author
   * - **is_answered**: Filter by answered status (for questions)
   * - **search**: Search in title and content
   *
   * **Sorting:**
   * - **recent**: Most recently active posts (default)
   * - **popular**: Most upvoted posts
   * - **trending**: Most viewed posts
   * - **unanswered**: Unanswered questions only
   *
   * **Pagination:**
   * - **page**: Page number (starts at 1)
   * - **page_size**: Number of posts per page (1-100)
   * @param postType
   * @param status
   * @param subjectId
   * @param examTarget
   * @param tagId
   * @param authorId
   * @param isAnswered
   * @param search
   * @param sortBy
   * @param page
   * @param pageSize
   * @returns PostListResponse Successful Response
   * @throws ApiError
   */
  public static getPostsApiV1ForumPostsGet(
    postType?: (PostType | null),
    status?: (PostStatus | null),
    subjectId?: (string | null),
    examTarget?: (string | null),
    tagId?: (string | null),
    authorId?: (string | null),
    isAnswered?: (boolean | null),
    search?: (string | null),
    sortBy: string = 'recent',
    page: number = 1,
    pageSize: number = 20,
  ): CancelablePromise<PostListResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/forum/posts',
      query: {
        'post_type': postType,
        'status': status,
        'subject_id': subjectId,
        'exam_target': examTarget,
        'tag_id': tagId,
        'author_id': authorId,
        'is_answered': isAnswered,
        'search': search,
        'sort_by': sortBy,
        'page': page,
        'page_size': pageSize,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Post
   * Get a single post with all replies
   *
   * This endpoint increments the view count for the post.
   * @param postId
   * @returns PostDetailResponse Successful Response
   * @throws ApiError
   */
  public static getPostApiV1ForumPostsPostIdGet(
    postId: string,
  ): CancelablePromise<PostDetailResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/forum/posts/{post_id}',
      path: {
        'post_id': postId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Update Post
   * Update a post
   *
   * Only the post author can update their post.
   * @param postId
   * @param requestBody
   * @returns PostResponse Successful Response
   * @throws ApiError
   */
  public static updatePostApiV1ForumPostsPostIdPatch(
    postId: string,
    requestBody: PostUpdate,
  ): CancelablePromise<PostResponse> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/v1/forum/posts/{post_id}',
      path: {
        'post_id': postId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Delete Post
   * Delete a post
   *
   * Only the post author can delete their post.
   * This will also delete all associated replies and reactions.
   * @param postId
   * @returns any Successful Response
   * @throws ApiError
   */
  public static deletePostApiV1ForumPostsPostIdDelete(
    postId: string,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/v1/forum/posts/{post_id}',
      path: {
        'post_id': postId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Create Reply
   * Create a reply to a post
   *
   * - **content**: Reply content (1-5000 characters)
   * - **parent_reply_id**: Optional parent reply ID for threading
   * @param postId
   * @param requestBody
   * @returns ReplyResponse Successful Response
   * @throws ApiError
   */
  public static createReplyApiV1ForumPostsPostIdRepliesPost(
    postId: string,
    requestBody: ReplyCreate,
  ): CancelablePromise<ReplyResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/forum/posts/{post_id}/replies',
      path: {
        'post_id': postId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Update Reply
   * Update a reply
   *
   * Only the reply author can update their reply.
   * @param replyId
   * @param requestBody
   * @returns ReplyResponse Successful Response
   * @throws ApiError
   */
  public static updateReplyApiV1ForumRepliesReplyIdPatch(
    replyId: string,
    requestBody: ReplyUpdate,
  ): CancelablePromise<ReplyResponse> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/v1/forum/replies/{reply_id}',
      path: {
        'reply_id': replyId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Delete Reply
   * Delete a reply
   *
   * Only the reply author can delete their reply.
   * @param replyId
   * @returns any Successful Response
   * @throws ApiError
   */
  public static deleteReplyApiV1ForumRepliesReplyIdDelete(
    replyId: string,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/v1/forum/replies/{reply_id}',
      path: {
        'reply_id': replyId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Accept Answer
   * Mark a reply as the accepted answer
   *
   * Only the post author can accept answers.
   * This awards reputation points to the reply author.
   * @param postId
   * @param replyId
   * @returns ReplyResponse Successful Response
   * @throws ApiError
   */
  public static acceptAnswerApiV1ForumPostsPostIdRepliesReplyIdAcceptPost(
    postId: string,
    replyId: string,
  ): CancelablePromise<ReplyResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/forum/posts/{post_id}/replies/{reply_id}/accept',
      path: {
        'post_id': postId,
        'reply_id': replyId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Toggle Post Reaction
   * Toggle reaction on a post
   *
   * - **reaction_type**: Type of reaction (like, helpful, insightful, celebrate)
   *
   * If the user has already reacted, this will remove the reaction.
   * Otherwise, it will add the reaction.
   * @param postId
   * @param requestBody
   * @returns any Successful Response
   * @throws ApiError
   */
  public static togglePostReactionApiV1ForumPostsPostIdReactionsPost(
    postId: string,
    requestBody: ReactionCreate,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/forum/posts/{post_id}/reactions',
      path: {
        'post_id': postId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Toggle Reply Reaction
   * Toggle reaction on a reply
   *
   * - **reaction_type**: Type of reaction (like, helpful, insightful, celebrate)
   *
   * If the user has already reacted, this will remove the reaction.
   * Otherwise, it will add the reaction.
   * @param replyId
   * @param requestBody
   * @returns any Successful Response
   * @throws ApiError
   */
  public static toggleReplyReactionApiV1ForumRepliesReplyIdReactionsPost(
    replyId: string,
    requestBody: ReactionCreate,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/forum/replies/{reply_id}/reactions',
      path: {
        'reply_id': replyId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Toggle Bookmark
   * Toggle bookmark on a post
   *
   * - **notes**: Optional notes about the bookmark
   *
   * If the post is already bookmarked, this will remove the bookmark.
   * Otherwise, it will add the bookmark.
   * @param postId
   * @param requestBody
   * @returns any Successful Response
   * @throws ApiError
   */
  public static toggleBookmarkApiV1ForumPostsPostIdBookmarkPost(
    postId: string,
    requestBody?: (BookmarkCreate | null),
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/forum/posts/{post_id}/bookmark',
      path: {
        'post_id': postId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get My Bookmarks
   * Get all bookmarks for the current user
   * @returns BookmarkResponse Successful Response
   * @throws ApiError
   */
  public static getMyBookmarksApiV1ForumBookmarksGet(): CancelablePromise<Array<BookmarkResponse>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/forum/bookmarks',
    });
  }
  /**
   * Toggle Follow Post
   * Toggle follow status on a post
   *
   * Following a post means you'll receive notifications when:
   * - Someone replies to the post
   * - The post is updated
   * - An answer is accepted
   *
   * If already following, this will unfollow.
   * Otherwise, it will follow the post.
   * @param postId
   * @returns any Successful Response
   * @throws ApiError
   */
  public static toggleFollowPostApiV1ForumPostsPostIdFollowPost(
    postId: string,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/forum/posts/{post_id}/follow',
      path: {
        'post_id': postId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get All Tags
   * Get all forum tags ordered by usage count
   * @returns TagResponse Successful Response
   * @throws ApiError
   */
  public static getAllTagsApiV1ForumTagsGet(): CancelablePromise<Array<TagResponse>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/forum/tags',
    });
  }
  /**
   * Create Tag
   * Create a new tag
   *
   * - **name**: Tag name (1-50 characters, unique)
   * - **description**: Optional tag description (max 200 characters)
   * - **color**: Hex color code (default: #3B82F6)
   * @param requestBody
   * @returns TagResponse Successful Response
   * @throws ApiError
   */
  public static createTagApiV1ForumTagsPost(
    requestBody: TagCreate,
  ): CancelablePromise<TagResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/forum/tags',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get My Notifications
   * Get notifications for the current user
   *
   * - **unread_only**: If true, only return unread notifications
   * @param unreadOnly
   * @returns NotificationResponse Successful Response
   * @throws ApiError
   */
  public static getMyNotificationsApiV1ForumNotificationsGet(
    unreadOnly: boolean = false,
  ): CancelablePromise<Array<NotificationResponse>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/forum/notifications',
      query: {
        'unread_only': unreadOnly,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Mark Notification Read
   * Mark a notification as read
   * @param notificationId
   * @returns any Successful Response
   * @throws ApiError
   */
  public static markNotificationReadApiV1ForumNotificationsNotificationIdReadPatch(
    notificationId: string,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/v1/forum/notifications/{notification_id}/read',
      path: {
        'notification_id': notificationId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Mark All Notifications Read
   * Mark all notifications as read
   * @returns any Successful Response
   * @throws ApiError
   */
  public static markAllNotificationsReadApiV1ForumNotificationsReadAllPost(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/forum/notifications/read-all',
    });
  }
  /**
   * Get Forum Statistics
   * Get overall forum statistics
   *
   * Returns counts for:
   * - Total posts
   * - Total replies
   * - Active discussions (last 7 days)
   * - Answered questions
   * @returns ForumStats Successful Response
   * @throws ApiError
   */
  public static getForumStatisticsApiV1ForumStatsGet(): CancelablePromise<ForumStats> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/forum/stats',
    });
  }
  /**
   * Get Trending Posts
   * Get trending posts
   *
   * Trending is calculated based on a combination of:
   * - View count
   * - Reply count (weighted 3x)
   * - Upvote count (weighted 5x)
   *
   * Only includes posts from the last 7 days.
   * @param limit
   * @returns TrendingPost Successful Response
   * @throws ApiError
   */
  public static getTrendingPostsApiV1ForumTrendingGet(
    limit: number = 10,
  ): CancelablePromise<Array<TrendingPost>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/forum/trending',
      query: {
        'limit': limit,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Popular Tags
   * Get most popular tags by usage count
   * @param limit
   * @returns PopularTag Successful Response
   * @throws ApiError
   */
  public static getPopularTagsApiV1ForumTagsPopularGet(
    limit: number = 20,
  ): CancelablePromise<Array<PopularTag>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/forum/tags/popular',
      query: {
        'limit': limit,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get User Reputation
   * Get reputation and achievements for a user
   *
   * Returns:
   * - Total reputation points
   * - Activity counts (posts, replies, accepted answers)
   * - Badges and achievements
   * @param userId
   * @returns ReputationResponse Successful Response
   * @throws ApiError
   */
  public static getUserReputationApiV1ForumUsersUserIdReputationGet(
    userId: string,
  ): CancelablePromise<ReputationResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/forum/users/{user_id}/reputation',
      path: {
        'user_id': userId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get My Reputation
   * Get reputation and achievements for the current user
   * @returns ReputationResponse Successful Response
   * @throws ApiError
   */
  public static getMyReputationApiV1ForumMyReputationGet(): CancelablePromise<ReputationResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/forum/my-reputation',
    });
  }
  /**
   * Get User Profile
   * @param userId
   * @returns UserProfileResponse Successful Response
   * @throws ApiError
   */
  public static getUserProfileApiV1ForumUsersUserIdProfileGet(
    userId: string,
  ): CancelablePromise<UserProfileResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/forum/users/{user_id}/profile',
      path: {
        'user_id': userId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Toggle Follow User
   * Follow or unfollow a user
   * @param userId
   * @returns any Successful Response
   * @throws ApiError
   */
  public static toggleFollowUserApiV1ForumUsersUserIdFollowPost(
    userId: string,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/forum/users/{user_id}/follow',
      path: {
        'user_id': userId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Get Following
   * Get list of users current user is following
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getFollowingApiV1ForumFollowingGet(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/forum/following',
    });
  }
  /**
   * Get User Followers
   * Get user's followers
   * @param userId
   * @returns any Successful Response
   * @throws ApiError
   */
  public static getUserFollowersApiV1ForumUsersUserIdFollowersGet(
    userId: string,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/forum/users/{user_id}/followers',
      path: {
        'user_id': userId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
