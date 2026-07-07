export default class Model {
    constructor(data = {}) {
        this.model_id = data.model_id || null;
        this.name = data.name || null;
        this.type = data.type || null;
        this.class = data.class || null;
        this.created_at = data.created_at || null;
        this.table_name = data.type || null; // For backward compatibility
    }
}