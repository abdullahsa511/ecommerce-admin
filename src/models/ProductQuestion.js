/**
 * @fileoverview ProductQuestion model class for managing product questions
 */

/**
 * ProductQuestion Model
 * Represents a product question in the system
 */
export default class ProductQuestion {
    constructor(data) {
        this.product_question_id = data?.product_question_id ?? null;
        this.product_id = data?.product_id ?? null;
        this.user_id = data?.user_id ?? 1;
        this.author = data?.author ?? "";
        this.content = data?.content ?? "";
        this.status = data?.status ?? 0;
        this.question_count = data?.question_count ?? 0;
        this.parent_id = data?.parent_id ?? null;
        this.created_at = data?.created_at ?? new Date().toISOString();
        this.updated_at = data?.updated_at ?? new Date().toISOString();
    }
} 