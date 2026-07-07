export default class LengthType {
    constructor(data) {
        this.length_type_id = data?.length_type_id ?? null;
        this.value = data?.value ?? 0;
        this.lengthTypeContent = data?.lengthTypeContent ?? null;
        // Parse name and unit from lengthTypeContent if present
        if (this.lengthTypeContent) {
            try {
                const content = JSON.parse(this.lengthTypeContent);
                this.length_type_id = content.length_type_id || null;
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
        return new LengthType(json);
    }
} 
