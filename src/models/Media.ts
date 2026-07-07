import { mediaUrl } from '@/utils/mediaUrl';

export const MODEL_FORMATS = ['GSM', 'DWG', 'MAX', 'SKP', 'RFA', 'ZIP'];
export interface IFileModel {
    id: number | null;
    media_id: number | null;
    project_image_id: number | null;
    post_image_id: number | null;
    product_image_id: number | null;
    design_resource_id: number | null;
    design_resource_document_id: number | null;
    product_certificate_id: number | null;
    product_id: number | null;
    project_section_images_id: number|null;
    image: string;
    mobile_banner: string;
    feature_image_thumb: IFileModel[];
    name: string;
    description: string;
    size: string;
    type: string;
    objectURL: string;
    file?: File;
    status: object;
    created_at: string;
    format: string | null;
    formats: string[];
  }
  
  export class FileModel implements IFileModel {
    id: number | null;
    media_id: number | null;
    project_image_id: number | null;
    post_image_id: number | null;
    product_image_id: number | null;
    product_certificate_id: number | null;
    design_resource_id: number | null;
    design_resource_document_id: number | null;
    product_id: number | null;
    project_section_images_id: number|null;
    image: string;
    mobile_banner: string;
    feature_image_thumb: IFileModel[];
    name: string;
    description: string;
    size: string;
    type: string;
    objectURL: string;
    file?: File;
    status: object;
    created_at: string;
    format: string | null;
    formats: string[];
    constructor(data: Partial<IFileModel> = {}) {
      this.media_id = data?.media_id ?? null;
      this.project_image_id = data?.project_image_id ?? null;
      this.post_image_id = data?.post_image_id ?? null;
      this.product_image_id = data?.product_image_id ?? null;
      this.product_certificate_id = data?.product_certificate_id ?? null;
      this.design_resource_id = data?.design_resource_id ?? null;
      this.design_resource_document_id = data?.design_resource_document_id ?? null;
      this.product_id = data?.product_id ?? null;
      this.project_section_images_id = data.project_section_images_id??null;
      this.id = data?.id ?? this.project_image_id ?? this.post_image_id ?? this.product_image_id ?? this.product_certificate_id ?? this.design_resource_document_id ?? this.product_id ?? this.project_section_images_id ?? this.media_id ?? null;
      this.image = data?.image ?? data.objectURL ?? '';
      this.mobile_banner = data?.mobile_banner ?? '';
      this.name = data?.name ?? '';
      this.description = data?.description ?? '';
      this.size = data?.size ?? "0";
      this.type = data?.type ?? '';
      this.objectURL = data?.objectURL ? mediaUrl(data.objectURL) : '';
      this.feature_image_thumb = data?.feature_image_thumb ?? [];
      this.file = data?.file;
      this.status = data?.status ?? {name: 'Pending', severity: 'warning'};
      this.created_at = data?.created_at ?? '';
      this.format = data?.format ?? null;
      this.formats = MODEL_FORMATS;
    }
  }