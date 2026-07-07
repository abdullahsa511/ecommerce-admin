export default class ProductReviewFilter {
    constructor() {
        this.review = null;
    }

    matches(productReview) {
        if (this.review && !productReview.review.toLowerCase().includes(this.review.toLowerCase())) {
            return false;
        }
        return true;
    }
} 