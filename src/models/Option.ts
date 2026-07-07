export interface IOptionContent {
  option_id?: number | null;
  language_id?: number | null;
  name?: string;
  language_name?: string| null;
  language_code?: string | null;
}

export interface IOptionData {
  option_id?: number | null;
  type_id?: number | null;
  type?: null;
  sort_order?: null;
  content?: IOptionContent;
}

export default class Option implements IOptionData {
  option_id: number | null;
  type_id: number | null;
  type:  null;
  sort_order: null;
  content: {
    name: string;
    option_id: number | null;
    language_id: number | null;
    language_name?: string| null;
    language_code?: string | null;
  };

  constructor(data: Partial<IOptionData> = {}) {
    // console.log('Option constructor data:', data);

    this.option_id = data.option_id ?? null;
    this.type_id = data.type_id ?? null;
    this.type = data.type ?? null;
    this.sort_order = data.sort_order ?? null;

    this.content = {
      name: data.content?.name ?? '',
      option_id: data.content?.option_id ?? this.option_id,
      language_id: data.content?.language_id ?? 1,
      language_name: data.content?.language_name ?? null,
      language_code: data.content?.language_code ?? null,
    };
  }

  static fromDBRow(row: any): Option {
    const parseMaybe = (obj: any) => {
      if (typeof obj === 'string') {
        try {
          return JSON.parse(obj);
        } catch {
          return {};
        }
      }
      return obj ?? {};
    };

    const content = parseMaybe(row.content);

    return new Option({
      option_id: row.option_id ?? null,
      type_id: row.type_id ?? null,
      type: row.type ?? null,
      sort_order: row.sort_order ?? null,
      content,
    });
  }

  /**
   * Get localized name
   */
  // getName(langId: number = 1): string {
  //   return this.content.language_id === langId ? this.content.name : '';
  // }
}
