export class ShippingStatusFilter {
    constructor() {
        this.name = '';
    }

    apply(shippingStatuses) {
        return shippingStatuses.filter(shippingStatus => {
            let matches = true;

            if (this.name) {
                matches = matches && shippingStatus.name.toLowerCase().includes(this.name.toLowerCase());
            }

            return matches;
        });
    }
} 