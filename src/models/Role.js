export default class Role {
    constructor(data) {
        this.role_id = data?.role_id ?? null;
        this.name = data?.name ?? '';
        this.display_name = data?.display_name ?? '';
        this.permissions = data?.permissions ?? "create, read, update, delete";
    }

    static fromJSON(data) {
        return new Role(data);
    }
}