export default class Product {
    constructor({
        product_id,
        thumbnail,
        name,
        price,
        stock,
        date_added,
        date_updated
    } = {}) {
        this.product_id = product_id || null;
        this.thumbnail = thumbnail || '';
        this.name = name || '';
        this.price = price || 0;
        this.stock = stock || 0;
        this.date_added = date_added || '';
        this.date_updated = date_updated || '';
    }

    static fromJSON(json) {
        return new Product({
            product_id: json.product_id,
            thumbnail: json.thumbnail,
            name: json.name,
            price: json.price,
            stock: json.stock,
            date_added: json.date_added,
            date_updated: json.date_updated
        });
    }
} 