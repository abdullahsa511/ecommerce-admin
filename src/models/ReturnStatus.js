export default class ReturnStatus {
    constructor(data) {
        this.return_status_id = data?.return_status_id ?? null;
        this.name = data?.name ?? '';
        this.language_id = data?.language_id ?? 1;
    }

    static fromJSON(json) {
        return new ReturnStatus(json);
    }
} 