import { IFileModel } from './Media';

export interface IRoleData {
    role_id?: number | null;
    name?: string;
    display_name?: string;
}

export class Role implements IRoleData {
    role_id: number | null;
    name: string;
    display_name: string;

    constructor(data: Partial<IRoleData> = {}) {
        this.role_id = data.role_id ?? null;
        this.name = data.name ?? '';
        this.display_name = data.display_name ?? '';
    }
}

export interface IUserRoleData {
    model_id?: number | null;
    model_type?: string;
    role_id?: number | null;
}

export class UserRole implements IUserRoleData {
    model_id: number | null;
    model_type: string;
    role_id: number | null;

    constructor(data: Partial<IUserRoleData> = {}) {
        this.model_id = data.model_id ?? null;
        this.model_type = data.model_type ?? 'user';
        this.role_id = data.role_id ?? null;
    }
}

export interface IUserData {
    user_id?: number | null;
    user_group_id?: number;
    site_id?: number;
    username?: string;
    first_name?: string;
    last_name?: string;
    password?: string;
    email?: string;
    phone_number?: string;
    url?: string;
    display_name?: string;
    avatar?: IFileModel[];
    bio?: string | null;
    subscribe?: number;
    status?: number;
    token?: string;
    created_at?: string;
    updated_at?: string;
    userRole?: IUserRoleData;
    roles?:[];
}

export default class User implements IUserData {
    user_id: number | null;
    user_group_id: number;
    site_id: number;
    username: string;
    first_name: string;
    last_name: string;
    password: string;
    email: string;
    phone_number: string;
    url: string;
    display_name: string;
    avatar: IFileModel[];
    bio: string | null;
    subscribe: number;
    status: number;
    token: string;
    created_at: string;
    updated_at: string;
    userRole: IUserRoleData;
    roles: [];

    constructor(data: Partial<IUserData> = {}) {
        // console.log('User constructor data avatar:', data.avatar);
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
        this.avatar = data?.avatar ?? [];
        this.bio = data?.bio ?? null;
        this.subscribe = data?.subscribe ?? 0;
        this.status = data?.status ?? 1; // Assuming 1 is active
        this.token = data?.token ?? 'testtoken';
        this.created_at = data?.created_at ?? new Date().toISOString();
        this.updated_at = data?.updated_at ?? new Date().toISOString();
        this.userRole = data?.userRole ?? new UserRole();
        this.roles = data?.roles ?? [];
    }

    static fromJSON(data: Partial<IUserData>): User {
        return new User(data);
    }
} 