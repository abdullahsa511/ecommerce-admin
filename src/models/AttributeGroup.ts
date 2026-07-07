export interface IAttributeGroupData {
    attribute_group_id ?: number | null;
    sort_order?:  string |null;
    name?: string | null;
    id?: number | null;
    content: {
        name: string;
        language_id: number | null;
        attribute_group_id : number | null;
    };
}

export default class AttributeGroup implements IAttributeGroupData {
    attribute_group_id ?: number | null;
    sort_order?:  string |null;
    name?: string | null;
    content: {
        name: string;
        language_id: number | null;
        attribute_group_id : number | null;
    };
    constructor(data: Partial<IAttributeGroupData> = {}) {
        this.attribute_group_id = data.attribute_group_id ?? data.id ?? null;
        this.sort_order = data.sort_order ?? "0";
        this.content = {
            name: data.content?.name ?? data.name ?? '',
            language_id: data.content?.language_id ?? 1,
            attribute_group_id: data.content?.attribute_group_id ?? this.attribute_group_id,
        };
    }

    static fromDBRow(row: any): AttributeGroup {
        return new AttributeGroup({
            attribute_group_id: row.attribute_group_id,
            sort_order: row.sort_order ?? 0,
            content: row.content ?? { name: '', language_id: 1, attribute_group_id: row.attribute_group_id },
        });
    }
}
