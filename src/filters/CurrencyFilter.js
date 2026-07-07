export class CurrencyFilter {
    constructor() {
        this.symbol = null;
        this.code = null;
        this.name = null;
        this.value = null;
        this.status = null;
    }

    matches(currency) {
        if (!currency) return false;

        if (this.symbol && !currency.symbol.toLowerCase().includes(this.symbol.toLowerCase())) {
            return false;
        }

        if (this.code && !currency.code.toLowerCase().includes(this.code.toLowerCase())) {
            return false;
        }

        if (this.name && !currency.name.toLowerCase().includes(this.name.toLowerCase())) {
            return false;
        }

        if (this.value && !currency.value.toString().includes(this.value.toString())) {
            return false;
        }

        if (this.status && !currency.status.toLowerCase().includes(this.status.toLowerCase())) {
            return false;
        }

        return true;
    }
} 