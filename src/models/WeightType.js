export default class WeightType {
    constructor(data) {
        this.weight_type_id = data?.weight_type_id ?? null;
        this.value = data?.value ?? 0;
        this.weightTypeContent = data?.weightTypeContent ?? null;
        // Parse name and unit from weightTypeContent if present
        if (this.weightTypeContent) {
            try {
                const content = JSON.parse(this.weightTypeContent);
                this.weight_type_id = content.weight_type_id || null;
                this.name = content.name || '';
                this.unit = content.unit || '';
            } catch {
                this.name = '';
                this.unit = '';
            }
        } else {
            this.name = '';
            this.unit = '';
        }
    }

    static fromJSON(json) {
        return new WeightType(json);
    }
} 