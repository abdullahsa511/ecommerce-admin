import ReturnReason from '../models/ReturnReason';

export default class ReturnReasonFilter {
    constructor() {
        this.name = '';
    }

    matches(returnReason) {
        if (!(returnReason instanceof ReturnReason)) {
            return false;
        }

        if (this.name && !returnReason.name.toLowerCase().includes(this.name.toLowerCase())) {
            return false;
        }

        return true;
    }
} 