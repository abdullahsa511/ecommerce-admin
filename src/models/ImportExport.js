export default class ImportExport {
    constructor(data = {}) {
        this.user_id = data?.user_id ?? null;
        this.user_group_id = data?.user_group_id ?? 1;
        this.site_id = data?.site_id ?? 1;
        this.username = data?.username ?? '';
        this.first_name = data?.first_name ?? '';
        this.last_name = data?.last_name ?? '';
        this.password = data?.password ?? '';
        this.email = data?.email ?? '';
        this.phone_number = data?.phone_number ?? '';
        this.url = data?.url ?? 'www.google.com';
        this.display_name = data?.display_name ?? '';
        this.avatar = data?.avatar ?? '/demo/images/avatar/amyelsner.png';
        this.bio = data?.bio ?? null;
        this.subscribe = data?.subscribe ?? 0;
        this.status = data?.status ?? 1; // Assuming 1 is active
        this.token = data?.token ?? 'testtoken';
        this.created_at = data?.created_at ?? new Date().toISOString();
        this.updated_at = data?.updated_at ?? new Date().toISOString();
    }

    static fromJSON(data) {
        return new ImportExport(data);
    }
}