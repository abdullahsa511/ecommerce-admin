export default class Admin {
    constructor(data = {}) {
        this.admin_id = data?.admin_id ?? null;
        this.username = data?.username ?? '';
        this.first_name = data?.first_name ?? '';
        this.last_name = data?.last_name ?? '';
        this.password = data?.password ?? '';
        this.email = data?.email ?? '';
        this.phone_number = data?.phone_number ?? '';
        this.url = data?.url ?? 'www.google.com';
        this.display_name = data?.display_name ?? '';
        this.avatar = data?.avatar ?? [];
        this.bio = data?.bio ?? null;
        this.role_id = data?.role_id ?? null;
        this.site_access = data?.site_access ?? '';
        this.status = data?.status ?? 1; // Assuming 1 is active
        this.token = data?.token ?? 'testtoken';
        this.created_at = data?.created_at ?? new Date().toISOString();
        this.updated_at = data?.updated_at ?? new Date().toISOString();
    }

    static fromJSON(data) {
        return new Admin(data);
    }
}