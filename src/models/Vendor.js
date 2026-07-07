import { FileModel } from './Media';

const normalizeVendorImages = (value) => {
    if (!value) {
        return [];
    }

    if (Array.isArray(value)) {
        return value.map((file) => (file instanceof FileModel ? file : new FileModel(file)));
    }

    if (typeof value === 'string') {
        const trimmed = value.trim();

        if (!trimmed) {
            return [];
        }

        try {
            const parsed = JSON.parse(trimmed);
            return normalizeVendorImages(parsed);
        } catch (error) {
            const fallbackObject = {
                objectURL: trimmed,
                image: trimmed,
                name: trimmed.split('/').pop() ?? trimmed
            };

            return [new FileModel(fallbackObject)];
        }
    }

    if (typeof value === 'object') {
        return [value instanceof FileModel ? value : new FileModel(value)];
    }

    return [];
};

export default class Vendor {
    constructor(data = {}) {
        this.vendor_id = data.vendor_id ?? 0;
        this.admin_id = data.admin_id ?? 0;
        this.vendor_code = data.vendor_code ?? '';
        this.name = data.name ?? '';
        this.slug = data.slug ?? '';
        this.image = normalizeVendorImages(data.image ?? data.thumbnail);
        this.sort_order = data.sort_order ?? 0;
        this.created_at = data.created_at ?? '';
        this.updated_at = data.updated_at ?? '';
        this.deleted_at = data.deleted_at ?? null;
    }

    static fromJSON(json = {}) {
        return new Vendor(json);
    }
}