export interface IProductAttributeData {
    attribute_id?: number | null;
    attribute_group_id?: number | null;
    sort_order?:  string |null;
    content?: {
        name?: string;
        language_id?: number | null;
        attribute_id?: number | null;
    };
    group_content?: {
        name?: string;
        language_id?: number | null;
        attribute_group_id?: number | null;
    };
}

export default class ProductAttribute implements IProductAttributeData {
    attribute_id: number | null;
    attribute_group_id: number | null;
    sort_order:  string |null;
    content: {
        name: string;
        language_id: number | null;
        attribute_id: number | null;
    };
    group_content: {
        name: string;
        language_id: number | null;
        attribute_group_id: number | null;
    };
    constructor(data: Partial<IProductAttributeData> = {}) {
        this.attribute_id = data.attribute_id ?? null;
        this.attribute_group_id = data.attribute_group_id ?? null;
        this.sort_order = data.sort_order ?? "0";
        this.content = {
            name: data.content?.name ?? '',
            language_id: data.content?.language_id ?? 1,
            attribute_id: data.content?.attribute_id ?? this.attribute_id,
        };
        this.group_content = {
            name: data.group_content?.name ?? '',
            language_id: data.group_content?.language_id ?? 1,
            attribute_group_id: data.group_content?.attribute_group_id ?? this.attribute_group_id,
        };
    }

    static fromDBRow(row: any): ProductAttribute {
        return new ProductAttribute({
            attribute_id: row.attribute_id,
            attribute_group_id: row.attribute_group_id,
            sort_order: row.sort_order ?? 0,
            content: row.content ?? { name: '', language_id: 1, attribute_id: row.attribute_id },
            group_content: row.group_content ?? { name: '', language_id: 1, attribute_group_id: row.attribute_group_id },
        });
    }
}



// export interface IProductAttributeData {
//     attribute_id?: number | null;
//     attribute_group_id?: number | null;
//     sort_order?: number | null;
//     content?: {
//         name?: string;
//         language_id?: number | null;
//         attribute_id?: number | null;
//     };
//     group_content?: {
//         name?: string;
//         language_id?: number | null;
//         attribute_group_id?: number | null;
//     };
//     attribute_code?: string;
// }

// export default class ProductAttribute implements IProductAttributeData {
//     attribute_id: number | null;
//     attribute_group_id: number | null;
//     sort_order: number | null;
//     content: {
//         name: string;
//         language_id: number | null;
//         attribute_id: number | null;
//     };
//     group_content: {
//         name: string;
//         language_id: number | null;
//         attribute_group_id: number | null;
//     };
//     attribute_code: string;

//     constructor(data: Partial<IProductAttributeData> = {}) {
//         // console.log('Initializing ProductAttribute with data:', data);
//         this.attribute_id = data.attribute_id ?? null;
//         this.attribute_group_id = data.attribute_group_id ?? null;
//         this.sort_order = data.sort_order ?? 0;
//         this.attribute_code = data.attribute_code ?? '';

//         this.content = {
//             name: data.content?.name ?? '',
//             language_id: data.content?.language_id ?? 1,
//             attribute_id: data.content?.attribute_id ?? this.attribute_id,
//         };

//         this.group_content = {
//             name: data.group_content?.name ?? '',
//             language_id: data.group_content?.language_id ?? 1,
//             attribute_group_id: data.group_content?.attribute_group_id ?? this.attribute_group_id,
//         };
//     }

//     static fromDBRow(row: any): ProductAttribute {
//         return new ProductAttribute({
//             attribute_id: row.attribute_id,
//             attribute_group_id: row.attribute_group_id,
//             sort_order: row.sort_order ?? 0,
//             attribute_code: row.attribute_code ?? '',
//             content: row.content ?? { name: '', language_id: 1, attribute_id: row.attribute_id },
//             group_content: row.group_content ?? { name: '', language_id: 1, attribute_group_id: row.attribute_group_id },
//         });
//     }

// }