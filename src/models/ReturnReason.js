export default class ReturnReason {
    constructor(data) {
        this.return_reason_id = data?.return_reason_id ?? null;
        this.name = data?.name ?? '';
        this.language_id = data?.language_id ?? 1;
    }

    static fromJSON(json) {
        return new ReturnReason(json);
    }
} 