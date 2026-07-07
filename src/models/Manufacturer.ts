import { IFileModel } from "./Media.ts";

export interface IManufacturer {
    admin_id: number;
    manufacturer_id: number;
    manufacturer_code: string;
    image: IFileModel[];
    name: string;
    slug: string;
    sort_order: number;
}

export default class Manufacturer implements IManufacturer {
    admin_id: number;
    manufacturer_id: number;
    manufacturer_code: string;
    image: IFileModel[];
    name: string;
    slug: string;
    sort_order: number;
    constructor(data: Partial<IManufacturer> = {}) {
        this.admin_id = data.admin_id ?? 0;
        this.manufacturer_id = data.manufacturer_id ?? 0;
        this.manufacturer_code = data.manufacturer_code ?? '';
        this.image = data.image ?? [];
        this.name = data.name ?? '';
        this.slug = data.slug ?? '';
        this.sort_order = data.sort_order ?? 0;
    }
} 