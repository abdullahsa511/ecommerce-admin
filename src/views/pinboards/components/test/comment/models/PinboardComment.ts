export interface PinboardCommentPhoto {
  comment_photo_id?: number;
  objectURL?: string;
  download_url?: string;
  extension?: string;
}

export interface PinboardCommentRecord {
  comment_id?: number;
  uuid?: string;
  user_id?: number;
  email?: string;
  author?: string;
  user_name?: string;
  content?: string;
  created_at?: string;
  updated_at?: string;
  votes?: number;
  liked?: boolean;
  is_reply?: number;
  parent_id?: number | null;
  commentPhoto?: PinboardCommentPhoto[];
  replay?: PinboardCommentRecord[];
  reply?: PinboardCommentRecord[];
}

export interface PinboardCommentContext {
  modelId: string | number;
  modelUuid: string;
  modelRef: string;
  modelType: string;
  title?: string;
}

export function getCommentReplies(comment: PinboardCommentRecord): PinboardCommentRecord[] {
  if (!comment) return [];
  if (Array.isArray(comment.replay)) return comment.replay;
  if (Array.isArray(comment.reply)) return comment.reply;
  return [];
}

export function isParentComment(comment: PinboardCommentRecord): boolean {
  if (!comment) return false;
  return comment.parent_id === null || comment.parent_id === undefined || Number(comment.parent_id) === 0;
}
