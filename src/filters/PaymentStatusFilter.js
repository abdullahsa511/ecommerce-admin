export class PaymentStatusFilter {
    constructor() {
        this.name = '';
    }

    apply(paymentStatuses) {
        return paymentStatuses.filter(paymentStatus => {
            let matches = true;

            if (this.name) {
                matches = matches && paymentStatus.name.toLowerCase().includes(this.name.toLowerCase());
            }

            return matches;
        });
    }
} 