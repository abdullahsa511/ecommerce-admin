export default class CommentFilter {
    constructor() {
        this.comment = null;
    }

    matches(comment) {
        if (this.comment && !comment.comment.toLowerCase().includes(this.comment.toLowerCase())) {
            return false;
        }
        return true;
    }
} 