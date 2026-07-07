import ReturnStatus from '../models/ReturnStatus';

export default class ReturnStatusFilter {
    constructor() {
        this.name = '';
    }

    matches(returnStatus) {
        if (!(returnStatus instanceof ReturnStatus)) {
            return false;
        }

        if (this.name && !returnStatus.name.toLowerCase().includes(this.name.toLowerCase())) {
            return false;
        }

        return true;
    }
} 