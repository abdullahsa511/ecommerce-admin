/**
 * @fileoverview Fabric model interface for managing fabric data
 */

export interface IFabricData {
    fabric_id?: string | null;
    name?: string;
    material_type?: string;
    texture?: string;
    description?: string;
    preview_image?: any[];
    date_added?: string;
    date_updated?: string;
}

export default class Fabric implements IFabricData {
    fabric_id: string | null;
    name: string;
    material_type: string;
    texture: string;
    description: string;
    preview_image: any[];
    date_added: string;
    date_updated: string;

    constructor(data: Partial<IFabricData> = {}) {
        this.fabric_id = data?.fabric_id ?? null;
        this.name = data?.name ?? '';
        this.material_type = data?.material_type ?? '';
        this.texture = data?.texture ?? '';
        this.description = data?.description ?? '';
        this.preview_image = data?.preview_image ?? [];
        this.date_added = data?.date_added ?? new Date().toISOString();
        this.date_updated = data?.date_updated ?? new Date().toISOString();
    }

    static fromJSON(data: Partial<IFabricData>): Fabric {
        return new Fabric(data);
    }
}
