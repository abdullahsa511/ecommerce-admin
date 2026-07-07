import { FileModel, IFileModel } from "./Media.ts";
import { mediaUrl, resolveMediaImage } from '@/utils/mediaUrl';
// DEFINE MODEL IMAGES
const FILE_FORMAT_IMAGES = {
    'GSM': mediaUrl('/media/design-resource/icons/gsm.png'),
    'DWG': mediaUrl('/media/design-resource/icons/dwg.png'),
    'MAX': mediaUrl('/media/design-resource/icons/max.png'),
    'SKP': mediaUrl('/media/design-resource/icons/skp.png'),
    'RFA': mediaUrl('/media/design-resource/icons/rfa.png'),
    'ZIP': mediaUrl('/media/design-resource/icons/zip.png'),
}

export const MODEL_FORMATS = ['GSM', 'DWG', 'MAX', 'SKP', 'RFA', 'ZIP'];

export interface IDesignResourceDocument {
    id: string | null;
    size: number | null;
    name: string | null;
    format: string | null;
    formats: string[];
    media_id: number | null;
    description: string | null;
    url: string | null;
    design_resource_id: number | null;
    design_resource_document_id: number | null;
    objectURL: string | null;
    status: {name: string, severity: string} | null;
    type: string | null;
    sort_order: number | null;
    resource_type: string | null;
    loading: boolean;
    file: File | null;
    isEditing: boolean;
    created_at: string | null;
}

export class DesignResourceDocument implements IDesignResourceDocument {
    name: string | null;
    format: string | null;
    formats: string[];
    media_id: number | null;
    description: string | null;
    url: string | null;
    design_resource_id: number | null;
    design_resource_document_id: number | null;
    objectURL: string | null;
    status: {name: string, severity: string} | null;
    type: string | null;
    sort_order: number | null;
    loading: boolean;
    resource_type: string | null;
    file: File | null;
    id: string | null;
    size: number | null;
    isEditing: boolean;
    created_at: string | null;
    constructor(data: Partial<IDesignResourceDocument> = {}) {
        this.id = data?.id ?? null;
        this.size = data?.size ?? null;
        this.file = data?.file ?? null;
        this.name = data?.name ?? null;
        this.format = data?.format ?? null;
        this.formats = MODEL_FORMATS;
        this.media_id = data?.media_id ?? null;
        this.description = data?.description ?? null;
        this.url = data?.url ?? null;
        this.design_resource_id = data?.design_resource_id ?? null;
        this.design_resource_document_id = data?.design_resource_document_id ?? null;
        this.objectURL = null;
        this.resource_type = data?.resource_type ?? null;
        let url = data?.url ?? data?.objectURL ?? null;
        this.isEditing = false;
        this.created_at = data?.created_at ?? null;

        if (this.resource_type === 'models') {
            switch (data.format?.toUpperCase() ?? '') {
                case 'GSM':
                    this.objectURL = FILE_FORMAT_IMAGES['GSM'];
                    break;
                case 'DWG':
                    this.objectURL = FILE_FORMAT_IMAGES['DWG'];
                    break;
                case 'MAX':
                    this.objectURL = FILE_FORMAT_IMAGES['MAX'];
                    break;
                case 'SKP':
                    this.objectURL = FILE_FORMAT_IMAGES['SKP'];
                    break;
                case 'RFA':
                    this.objectURL = FILE_FORMAT_IMAGES['RFA'];
                    break;
                default:
                    this.objectURL = FILE_FORMAT_IMAGES['ZIP'];
                    break;
            }
        }else{
            this.objectURL = url ? resolveMediaImage(url) : null;
        }
        this.status = data?.status ?? {name: 'Uploaded', severity: 'success'};
        this.type = data?.format?.toLowerCase() ?? null;
        this.sort_order = data?.sort_order ?? null;
        // loader status for delete record
        this.loading = false;
    }
}

export interface IDesignResource {
    design_resource_id: number | null;
    title: string | null;
    description: string | null;
    media_id: number | null;
    grade: string | null;
    image: string | null;
    image_url_file: IFileModel[] | null;
    image_thumb_url_file: IFileModel[] | null;
    image_url: string | null;
    image_thumb_url: string | IFileModel | IFileModel[] | null;
    img: IFileModel[] | null;
    img2: IFileModel[] | null;
    image_alt: string | null;
    link_text: string | null;
    type: string | null;
    is_featured: boolean | null;
    slug: string | null;
    brand: string | null;
    resource_type: string | null;
    hex_value: string | null;
    // document_file: IFileModel | null;
    design_resource_documents: IDesignResourceDocument[] | [];
    files: IFileModel[] | [];
    sort_order: number | null;
}

export default class DesignResource implements IDesignResource {
    design_resource_id: number | null;
    title: string | null;
    description: string | null;
    media_id: number | null;
    grade: string | null;
    image: string | null;
    image_url_file: IFileModel[] | null;
    image_thumb_url_file: IFileModel[] | null;
    image_url: string | null;
    image_thumb_url: string | IFileModel | IFileModel[] | null;
    img: IFileModel[] | null;
    img2: IFileModel[] | null;
    image_alt: string | null;
    link_text: string | null;
    type: string | null;
    is_featured: boolean | null;
    slug: string | null;
    brand: string | null;
    resource_type: string | null;
    hex_value: string | null;
    // document_file: IFileModel | null;
    design_resource_documents: IDesignResourceDocument[] | [];
    files: IFileModel[] | [];
    sort_order: number | null;
    constructor(data: Partial<IDesignResource> = {}) {
        this.design_resource_id = data?.design_resource_id ?? null;
        this.title = data?.title ?? null;
        this.description = data?.description ?? null;
        this.media_id = data?.media_id ?? null;
        this.grade = data?.grade ?? null;
        this.image = data?.image?.includes('http') ? data?.image : data?.image?.startsWith('/') ? resolveMediaImage(data.image) : null;
        this.image_thumb_url_file = data?.image_thumb_url_file ? Array.isArray(data.image_thumb_url_file) ? data.image_thumb_url_file.map((file: any) => new FileModel(file)) : [new FileModel(data.image_thumb_url_file)] : null;
        this.image_url_file = data?.image_url_file ? Array.isArray(data.image_url_file) ? data.image_url_file.map((file: any) => new FileModel(file)) : [new FileModel(data.image_url_file)] : null;
        this.image_url = data?.image_url ?? null;
        const imageThumbUrl = data?.image_thumb_url;
        if (imageThumbUrl) {
            if (typeof imageThumbUrl === 'string') {
                this.image_thumb_url = mediaUrl(imageThumbUrl);
            } else {
                const thumbFiles = Array.isArray(imageThumbUrl) ? imageThumbUrl : [imageThumbUrl];
                if (!this.image_thumb_url_file) {
                    this.image_thumb_url_file = thumbFiles.map((file: any) => new FileModel(file));
                }
                this.image_thumb_url = resolveMediaImage(imageThumbUrl) || null;
            }
        } else {
            this.image_thumb_url = null;
        }
        this.img = data?.img ? Array.isArray(data.img) ? data.img.map((file: any) => new FileModel(file)) : [new FileModel(data.img)] : null;
        this.img2 = data?.img2 ? Array.isArray(data.img2) ? data.img2.map((file: any) => new FileModel(file)) : [new FileModel(data.img2)] : null;
        this.image_alt = data?.image_alt ?? null;
        this.link_text = data?.link_text ?? null;
        this.type = data?.type ?? null;
        this.is_featured = data?.is_featured ?? null;
        this.slug = data?.slug ?? null;
        this.brand = data?.brand ?? null;
        this.resource_type = data?.resource_type ?? null;
        this.hex_value = data?.hex_value ?? null;
        // this.document_file = data?.document_file ?? null;
        this.design_resource_documents = data?.design_resource_documents?.filter(document => document.design_resource_document_id !== null) ?? [];
        this.design_resource_documents = this.design_resource_documents.map(document => {
            document.resource_type = this.resource_type;
            return new DesignResourceDocument(document);
        });

        try {
            let files = data?.files;
            if (typeof files === 'string') {
                files = JSON.parse(files);
            }
            this.files = Array.isArray(files) ? files.map((file: any) => new FileModel(file)) : [];
        } catch (error) {
            console.warn('Error parsing files data:', error);
            this.files = [];
        }
        this.sort_order = data?.sort_order ?? null;
    }

    static fromJSON(json: Partial<IDesignResource>): DesignResource {
        return new DesignResource(json);
    }
} 
