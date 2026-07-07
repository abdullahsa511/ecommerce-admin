export default class PostContent {
    constructor(data) {
        this.id = data.id;
        this.post_id = data.post_id;
        this.content = data.content;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }
    
}
