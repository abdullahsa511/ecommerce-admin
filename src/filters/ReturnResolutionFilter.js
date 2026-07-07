import ReturnResolution from '../models/ReturnResolution';

export default class ReturnResolutionFilter {
    constructor() {
        this.name = '';
    }

    matches(returnResolution) {
        if (!(returnResolution instanceof ReturnResolution)) {
            return false;
        }

        if (this.name && !returnResolution.name.toLowerCase().includes(this.name.toLowerCase())) {
            return false;
        }

        return true;
    }
} 