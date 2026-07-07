export default class SubscriptionStatusFilter {
    constructor() {
        this.name = '';
    }

    apply(subscriptionStatuses) {
        return subscriptionStatuses.filter(subscriptionStatus => {
            let matches = true;

            if (this.name) {
                matches = matches && subscriptionStatus.name.toLowerCase().includes(this.name.toLowerCase());
            }

            return matches;
        });
    }
} 