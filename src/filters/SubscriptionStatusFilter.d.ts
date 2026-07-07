export interface SubscriptionStatus {
    subscription_status_id?: number;
    name: string;
    // add other fields if necessary
}

export default class SubscriptionStatusFilter {
    name: string;

    constructor() {
        this.name = '';
    }

    apply(subscriptionStatuses: SubscriptionStatus[]): SubscriptionStatus[] {
        return subscriptionStatuses.filter((subscriptionStatus) => {
            let matches = true;

            if (this.name) {
                matches =
                    matches &&
                    subscriptionStatus.name
                        .toLowerCase()
                        .includes(this.name.toLowerCase());
            }

            return matches;
        });
    }
}