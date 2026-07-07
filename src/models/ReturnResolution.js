export default class ReturnResolution {
    constructor(data) {
        this.return_resolution_id = data?.return_resolution_id ?? null;
        this.name = data?.name ?? '';
        this.language_id = data?.language_id ?? 1;
    }

    static fromJSON(json) {
        return new ReturnResolution(json);
    }
} 