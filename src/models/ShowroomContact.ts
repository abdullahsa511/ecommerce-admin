import { IFileModel } from "./Media.ts";

export interface IShowroomContact {
    showroom_contact_id: number;
    showroom_id: number|null;
    showroom_title: string;
    name: string;
    phone: string;
    email: string;
    designation: string;
    message: string;
    sort_order: number|null;
    status: number;
    image: IFileModel[];
}

export default class ShowroomContact implements IShowroomContact {
    showroom_contact_id: number;
    showroom_id: number|null;
    showroom_title: string;
    name: string;
    phone: string;
    email: string;
    designation: string;
    message: string;
    sort_order: number|null;
    status: number;
    image: IFileModel[];

    constructor(data: Partial<IShowroomContact> = {}) {
        this.showroom_contact_id = data.showroom_contact_id ?? 0;
        this.showroom_id = data.showroom_id ?? null;
        this.showroom_title = data.showroom_title ?? '';
        this.image = data.image ?? [];
        this.name = data.name ?? '';
        this.phone = data.phone ?? '';
        this.email = data.email ?? '';
        this.designation = data.designation ?? '';
        this.message = data.message ?? '';
        this.status = data.status ?? 1;
        this.sort_order = data.sort_order ?? null;
    }
} 