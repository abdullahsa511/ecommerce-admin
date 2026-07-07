export interface IAddress {
    description: string;
    place_id: string;
    reference: string;
    structured_formatting: {
        main_text: string;
        main_text_matched_substrings?: Array<{
            length: number;
            offset: number;
        }>;
        secondary_text: string;
    };
    matched_substrings?: Array<{
        length: number;
        offset: number;
    }>;
    terms?: Array<{
        offset: number;
        value: string;
    }>;
    types: string[];
}

export class Address implements IAddress {
    description: string;
    place_id: string;
    reference: string;
    structured_formatting: {
        main_text: string;
        main_text_matched_substrings?: Array<{
            length: number;
            offset: number;
        }>;
        secondary_text: string;
    };
    matched_substrings?: Array<{
        length: number;
        offset: number;
    }>;
    terms?: Array<{
        offset: number;
        value: string;
    }>;
    types: string[];

    constructor(data: Partial<IAddress> = {}) {
        this.description = data.description ?? '';
        this.place_id = data.place_id ?? '';
        this.reference = data.reference ?? '';
        this.structured_formatting = {
            main_text: data.structured_formatting?.main_text ?? '',
            main_text_matched_substrings: data.structured_formatting?.main_text_matched_substrings ?? [],
            secondary_text: data.structured_formatting?.secondary_text ?? ''
        };
        this.matched_substrings = data.matched_substrings ?? [];
        this.terms = data.terms ?? [];
        this.types = data.types ?? [];
    }
} 