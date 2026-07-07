import { mediaUrl } from '@/utils/mediaUrl';

export const MODEL_FORMATS = ['GSM', 'DWG', 'MAX', 'SKP', 'RFA', 'ZIP'];

export class FileModel {
  constructor(data = {}) {
    this.id = data?.id ?? null;
    this.media_id = data?.media_id ?? null;
    this.project_image_id = data?.project_image_id ?? null;
    this.post_image_id = data?.post_image_id ?? null;
    this.product_image_id = data?.product_image_id ?? null;
    this.product_id = data?.product_id ?? null;
    this.project_section_images_id = data.project_section_images_id ?? null;
    this.image = data?.image ?? data.objectURL ?? '';
    this.name = data?.name ?? '';
    this.description = data?.description ?? '';
    this.size = data?.size ?? '0';
    this.type = data?.type ?? '';
    this.objectURL = data?.objectURL ? mediaUrl(data.objectURL) : '';
    this.feature_image_thumb = data?.feature_image_thumb ?? [];
    this.file = data?.file;
    this.status = data?.status ?? { name: 'Pending', severity: 'warning' };
    this.created_at = data?.created_at ?? '';
    this.format = this.setFormat();
    this.formats = MODEL_FORMATS;
    this.data_type = data?.data_type ?? null;
  }

  setFormat() {
    const isModel =
      this.data_type === 'model' || this.data_type === 'models';

    if (!isModel) {
      return this.format??null;
    }

    const rawName = this.name || this.file?.name || '';
    const lastDot = rawName.lastIndexOf('.');
    const ext =
      lastDot !== -1 && lastDot < rawName.length - 1
        ? rawName.slice(lastDot + 1).toUpperCase()
        : '';

    if (ext && MODEL_FORMATS.includes(ext)) {
      this.format = ext;
      return this.format;
    }

    const nameUpper = rawName.toUpperCase();
    for (const fmt of MODEL_FORMATS) {
      if (nameUpper.includes(fmt)) {
        this.format = fmt;
        return this.format;
      }
    }

    return this.format;
  }
}
