/**
 * @fileoverview ProductQuestion model class for managing product questions
 */

/**
 * ProductQuestion Model
 * Represents a product question in the system
 */
export default class ProductReview {
    constructor(data) {
        this.product_review_id = data?.product_review_id ?? null;
        this.product_id = data?.product_id ?? null;
        this.user_id = data?.user_id ?? 1;
        this.author = data?.author ?? "";
        this.content = data?.content ?? "";
        this.rating = data?.rating ?? 0;
        this.status = data?.status ?? 0;
        this.review_count = data?.review_count ?? 0;
        this.parent_id = data?.parent_id ?? null;
        this.created_at = data?.created_at ?? new Date().toISOString();
        this.updated_at = data?.updated_at ?? new Date().toISOString();
    }
} 