
export interface ISubscription {
    subscription_id: number | null;
    user: string;
    reason: string;
    status:string;
    action:string;
    date_ordered: string;
    date_added:string;
    date_updated:string
}

export default class Subscription implements ISubscription{
    subscription_id: number | null;
    user: string;
    reason: string;
    status:string;
    action:string;
    date_ordered: string;
    date_added:string;
    date_updated:string;

    constructor(data:Partial<ISubscription> = {}){
        this.subscription_id = data.subscription_id ?? null;
        this.user = data.user ?? "0";
        this.reason = data.reason ?? "";
        this.status = data.status ?? "";
        this.action = data.action ?? "";
        this.date_ordered = data.date_ordered ?? "";
        this.date_added = data.date_added ?? "";
        this.date_updated = data.date_updated ?? "";
    }

    static fromJSON(data: Partial<ISubscription>): Subscription{
        return new Subscription(data);
    }
}