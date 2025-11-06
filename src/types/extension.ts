/**
 * Extension-wide type definitions
 */

export interface AnimeData {
  title: string;
  episode?: number;
  seasonNumber?: number;
}

export interface RedditThread {
  id: string;
  title: string;
  subreddit: string;
  upvotes: number;
  comments: number;
  url: string;
  createdAt: number;
}

export interface RedditAuthToken {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  grantedAt: number;
}

export interface MessagePayload {
  action: string;
  payload?: unknown;
}
