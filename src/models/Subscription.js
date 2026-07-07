export default class Subscription{
    constructor(data){
        this.subscription_id = data?.subscription_id ?? null;
        this.user = data?.user ?? null;
        this.email = data?.email ?? null;
        this.reason = data?.reason ?? null;
        this.status = data?.status ?? null;
        this.action = data?.action ?? null;
        this.date_ordered = data?.date_ordered ?? null;
        this.date_added = data?.date_added ?? null;
        this.created_at = data?.created_at ?? null;
        this.date_updated = data?.date_updated ?? null;
    }

    static fromJSON(json){
        return new Subscription(json);
    }
}