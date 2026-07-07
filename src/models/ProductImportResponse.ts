import { FileModel } from "./Media";

interface IProduct {
    km_item_id: number;
    product_type_id: number;
    class_id: number;
    company_id: number;
    admin_id: number;
    model: string;
    description: string;
    specifications: string;
    warranty_period: string;
    product_code: string;
    factory_code: string;
    sku: string;
    isbn: string;
    barcode: string;
    track_stock: number;
    requires_shipping: number;
    subtract_stock: number;
    status: number;
    is_featured: number;
    active: number;
    archive: number;
    stock_quantity: number;
    stock_status_id: number;
    lead_days: number;
    melbourne_lead_days: number;
    safety_stock: number;
    qty_alert: number;
    min_order_quantity: number;
    views: number;
    sort_order: number;
    weight: number;
    length: number;
    carton_width: number;
    carton_depth: number;
    carton_height: number;
    project_price_discount: number;
    material: string;
    template: string;
    video_link: string;
    image: string;
    specifications_image: string;
    banner_image: string;
    image_thumb: string;
    main_image_one: string;
    main_image_two: string;
    feature_image_one: string;
    feature_image_two: string;
    feature_image_three: string;
    main_image_one_title: string;
    main_image_one_description: string;
    main_image_two_title: string;
    main_image_two_description: string;
    feature_description: string;
    feature_image_one_title: string;
    feature_image_one_description: string;
    feature_image_two_title: string;
    feature_image_two_description: string;
    feature_image_three_title: string;
    feature_image_three_description: string;
    [key: string]: any; // For additional product fields
}

export class Product implements IProduct {
    km_item_id: number;
    product_type_id: number;
    class_id: number;
    company_id: number;
    admin_id: number;
    model: string;
    description: string;
    specifications: string;
    warranty_period: string;
    product_code: string;
    factory_code: string;
    sku: string;
    isbn: string;
    barcode: string;
    track_stock: number;
    requires_shipping: number;
    subtract_stock: number;
    status: number;
    is_featured: number;
    active: number;
    archive: number;
    stock_quantity: number;
    stock_status_id: number;
    lead_days: number;
    melbourne_lead_days: number;
    safety_stock: number;
    qty_alert: number;
    min_order_quantity: number;
    views: number;
    sort_order: number;
    weight: number;
    length: number;
    carton_width: number;
    carton_depth: number;
    carton_height: number;
    project_price_discount: number;
    material: string;
    template: string;
    video_link: string;
    image: string;
    specifications_image: string;
    banner_image: string;
    image_thumb: string;
    main_image_one: string;
    main_image_two: string;
    feature_image_one: string;
    feature_image_two: string;
    feature_image_three: string;
    main_image_one_title: string;
    main_image_one_description: string;
    main_image_two_title: string;
    main_image_two_description: string;
    feature_description: string;
    feature_image_one_title: string;
    feature_image_one_description: string;
    feature_image_two_title: string;
    feature_image_two_description: string;
    feature_image_three_title: string;
    feature_image_three_description: string;

    constructor(data: Partial<IProduct> = {}) {
        this.km_item_id = data.km_item_id ?? 0;
        this.product_type_id = data.product_type_id ?? 0;
        this.class_id = data.class_id ?? 0;
        this.company_id = data.company_id ?? 0;
        this.admin_id = data.admin_id ?? 0;
        this.model = data.model ?? '';
        this.description = data.description ?? '';
        this.specifications = data.specifications ?? '';
        this.warranty_period = data.warranty_period ?? '';
        this.product_code = data.product_code ?? '';
        this.factory_code = data.factory_code ?? '';
        this.sku = data.sku ?? '';
        this.isbn = data.isbn ?? '';
        this.barcode = data.barcode ?? '';
        this.track_stock = data.track_stock ?? 0;
        this.requires_shipping = data.requires_shipping ?? 0;
        this.subtract_stock = data.subtract_stock ?? 0;
        this.status = data.status ?? 0;
        this.is_featured = data.is_featured ?? 0;
        this.active = data.active ?? 0;
        this.archive = data.archive ?? 0;
        this.stock_quantity = data.stock_quantity ?? 0;
        this.stock_status_id = data.stock_status_id ?? 0;
        this.lead_days = data.lead_days ?? 0;
        this.melbourne_lead_days = data.melbourne_lead_days ?? 0;
        this.safety_stock = data.safety_stock ?? 0;
        this.qty_alert = data.qty_alert ?? 0;
        this.min_order_quantity = data.min_order_quantity ?? 0;
        this.views = data.views ?? 0;
        this.sort_order = data.sort_order ?? 0;
        this.weight = data.weight ?? 0;
        this.length = data.length ?? 0;
        this.carton_width = data.carton_width ?? 0;
        this.carton_depth = data.carton_depth ?? 0;
        this.carton_height = data.carton_height ?? 0;
        this.project_price_discount = data.project_price_discount ?? 0;
        this.material = data.material ?? '';
        this.template = data.template ?? '';
        this.video_link = data.video_link ?? '';
        this.image = data.image ? this.parseImage(data.image) : '';
        this.specifications_image = data.specifications_image ? this.parseImage(data.specifications_image) : '';
        this.banner_image = data.banner_image ? this.parseImage(data.banner_image) : '';
        this.image_thumb = data.image_thumb ? this.parseImage(data.image_thumb) : '';
        this.main_image_one = data.main_image_one ? this.parseImage(data.main_image_one) : '';
        this.main_image_two = data.main_image_two ? this.parseImage(data.main_image_two) : '';
        this.feature_image_one = data.feature_image_one ? this.parseImage(data.feature_image_one) : '';
        this.feature_image_two = data.feature_image_two ? this.parseImage(data.feature_image_two) : '';
        this.feature_image_three = data.feature_image_three ? this.parseImage(data.feature_image_three) : '';
        this.main_image_one_title = data.main_image_one_title ?? '';
        this.main_image_one_description = data.main_image_one_description ?? '';
        this.main_image_two_title = data.main_image_two_title ?? '';
        this.main_image_two_description = data.main_image_two_description ?? '';
        this.feature_description = data.feature_description ?? '';
        this.feature_image_one_title = data.feature_image_one_title ?? '';
        this.feature_image_one_description = data.feature_image_one_description ?? '';
        this.feature_image_two_title = data.feature_image_two_title ?? '';
        this.feature_image_two_description = data.feature_image_two_description ?? '';
        this.feature_image_three_title = data.feature_image_three_title ?? '';
        this.feature_image_three_description = data.feature_image_three_description ?? '';
    }

    parseImage(image: string|any[]): string {
        if(typeof image === 'string'){
            return JSON.parse(image).map((img: any) => new FileModel(img))[0]?.objectURL ?? '';
        }
        return image.map((img: any) => new FileModel(img))[0]?.objectURL ?? image[0]?.objectURL ?? '';
    }
}

interface ProductImportSummary {
    success_rate: string;
    products_processed: number;
    content_records_created: number;
    category_relationships: number;
    errors: number;
    [key: string]: any; // For additional summary fields
}

interface IProductImportResponse {
    success: boolean;
    total_records: number;
    valid_records: number;
    invalid_records: number;
    updated_records: number;
    products: {
        inserted_count: number;
        valid_data: {
            [key: string]: Product; // Product codes as keys (e.g., "kove", "cortex")
        };
    };
    updated_data: Product[];
    summary: ProductImportSummary;
}

export default class ProductImportResponse implements IProductImportResponse {
    success: boolean;
    total_records: number;
    valid_records: number;
    invalid_records: number;
    updated_records: number;
    products: {
        inserted_count: number;
        valid_data: {
            [key: number]: Product;
        };
    };
    updated_data: Product[];
    summary: ProductImportSummary;

    constructor(data: Partial<IProductImportResponse> = {}) {
        this.success = data.success ?? false;
        this.total_records = data.total_records ?? 0;
        this.valid_records = data.valid_records ?? 0;
        this.invalid_records = data.invalid_records ?? 0;
        this.updated_records = data.updated_records ?? 0;
        if(data.products && data.products.valid_data){
            const validProducts:any[] = [];
            const productsData = data.products;
            let i = 0;
            Object.keys(productsData.valid_data).forEach(key => {
                validProducts.push(new Product(productsData.valid_data[key]));
                i++;
            });
            this.products = {
                inserted_count: productsData.inserted_count,
                valid_data: validProducts
            };
        } else {
            this.products = data.products ?? { inserted_count: 0, valid_data: {} };
        }
        this.updated_data = data.updated_data ?? [];
        this.summary = data.summary ?? {
            success_rate: '',
            products_processed: 0,
            content_records_created: 0,
            category_relationships: 0,
            errors: 0
        };
    }
}

