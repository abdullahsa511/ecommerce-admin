export default class ProductQuestionFilter {
    constructor() {
        this.question = null;
    }

    matches(productQuestion) {
        if (this.question && !productQuestion.question.toLowerCase().includes(this.question.toLowerCase())) {
            return false;
        }
        return true;
    }
} 