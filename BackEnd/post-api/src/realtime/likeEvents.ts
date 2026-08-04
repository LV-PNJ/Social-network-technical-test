export type LikeRealtimeEvent = {
  type: 'post.like.updated';
  eventId: string;
  postId: string;
  likedBy: string[];
  likeCount: number;
  actorUserId: string;
  action: 'like' | 'unlike';
  correlationId?: string;
  at: string;
};
