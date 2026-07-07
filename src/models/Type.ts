export interface ITypeData {
  type_id?: number | null;
  type?: string;
  sort_order?: string;
}

export default class Type implements ITypeData {
  type_id: number | null;
  type: string | undefined;
  sort_order: string;

  constructor(data: Partial<ITypeData> = {}) {
    this.type_id = data.type_id ?? null;
    this.type = data.type ?? undefined;
    this.sort_order = data.sort_order ?? "0";
  }

  static fromDBRow(row: any): Type {
    return new Type({
      type_id: row.type_id ?? null,
      type: row.type ?? undefined,
      sort_order: row.sort_order ?? 0,
    });
  }
}
