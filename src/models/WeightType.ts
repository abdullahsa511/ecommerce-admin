export interface IWeightTypeData {
    weight_type_id?: number | null;
    value?: number | null;
    weightTypeContent?: string | null;
    name?: string | null;
    unit?: string | null;
}

export default class WeightType implements IWeightTypeData {
    weight_type_id?: number | null;
    value?: number | null;
    weightTypeContent?: string | null;
    name?: string | null;
    unit?: string | null;
    constructor(data: Partial<IWeightTypeData> = {}) {
        this.weight_type_id = data.weight_type_id ?? null;
        this.value = data.value ?? 0;
        this.weightTypeContent = data.weightTypeContent ?? null;
        this.name = data.name ?? null;
        this.unit = data.unit ?? null;
    }
    static fromJSON(json: any): WeightType {
        return new WeightType({
            weight_type_id: json.weight_type_id,
            value: json.value,
            weightTypeContent: json.weightTypeContent,
            name: json.name,
            unit: json.unit,
        });
    }
}