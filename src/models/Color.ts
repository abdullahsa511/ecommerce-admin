/**
 * @fileoverview Color model interface for managing color data
 */

export interface IColorData {
    color_id?: string | null;
    name?: string;
    hex_code?: string;
    rgb_code?: string;
    description?: string;
    date_added?: string;
    date_updated?: string;
}

export default class Color implements IColorData {
    color_id: string | null;
    name: string;
    hex_code: string;
    rgb_code: string;
    description: string;
    date_added: string;
    date_updated: string;

    constructor(data: Partial<IColorData> = {}) {
        this.color_id = data?.color_id ?? null;
        this.name = data?.name ?? '';
        this.hex_code = data?.hex_code ?? '';
        this.rgb_code = data?.rgb_code ?? '';
        this.description = data?.description ?? '';
        this.date_added = data?.date_added ?? new Date().toISOString();
        this.date_updated = data?.date_updated ?? new Date().toISOString();
    }

    static fromJSON(data: Partial<IColorData>): Color {
        return new Color(data);
    }
}
