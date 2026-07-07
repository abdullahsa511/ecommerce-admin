export default class RegionGroup {
    constructor(data = {}) {
        this.region_group_id = data?.region_group_id ?? null;
        this.name = data?.name ?? '';
        this.content = data?.content ?? '';
        this.created_at = data?.created_at ?? '';
    }

    static fromJSON(json) {
        return new RegionGroup(json);
    }
} 