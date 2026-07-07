export default class MessageFilter {
    constructor() {
        this.message = null;
    }

    matches(message) {
        if (this.message && !message.message.toLowerCase().includes(this.message.toLowerCase())) {
            return false;
        }
        return true;
    }
} 