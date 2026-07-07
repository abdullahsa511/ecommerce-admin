import Subscription from "@/models/Subscription";
import FeedbackHandler from "@/utils/FeedbackHandler";
import { defineStore } from "pinia";

export interface SubscriptionState {
    subscriptions: Subscription[];
    subscribeRequests: [];
    subscription: Subscription;
    model: string;
    fb: FeedbackHandler;
}

export const useSubscriptionStore = defineStore('subscription', {
    state: (): SubscriptionState => ({
        subscriptions: [],
        subscribeRequests: [],
        subscription: new Subscription(),
        model: 'subscription',
        fb: new FeedbackHandler(),
    }),
    actions: {
        async fetchSubscriptions() { },
        async getSubscribeRequests() { },
        async getSubscriptionById(subscriptionId: number | string) { },
        async createSubscription(newScription: Partial<Subscription>): Promise<Subscription | any> {},
        async updateSubscription(subscriptionId: number | string, updatedSubscription: Partial<Subscription>): Promise<Subscription | any > { },
        async deleteSubscription(subscriptionId: number | string) { },
        async deleteSubscribeRequest(subscriptionId: number | string) { },
        async clearFilter() { },
    }
})