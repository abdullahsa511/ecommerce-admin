/**
 * @fileoverview Comment model class for managing comments
 */

/**
 * Comment Model
 * Represents a comment in the system
 */
export default class Comment {
    constructor(data) {
        this.post_id = data?.post_id??14;
        this.user_id = data?.user_id??1;
        this.email = data?.email??null;
        this.url = data?.url??null;
        this.ip = data?.ip??"100.100.100.100";
        this.content = data?.content??"";
        this.status = data?.status ?? 0;
        this.votes = data?.votes ?? 0;
        this.type = data?.type ?? 'comment';
        this.parent_id = data?.parent_id ?? null;
        this.created_at = data?.created_at??new Date().toISOString();
        this.updated_at = data?.updated_at??new Date().toISOString();
    }
} 