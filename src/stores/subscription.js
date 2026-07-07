import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import Subscription from '@/models/Subscription';
import SubscriptionFilter from '@/filters/SubscriptionFilter';
import FeedbackHandler from '@/utils/FeedbackHandler';
import SubscriptionService from '@/service/SubscriptionService';

export const useSubscriptionStore = defineStore('subscription', () => {
    const server = import.meta.env.VITE_API_BASE_URL;
    const webServer = import.meta.env.VITE_STATIC_BASE_URL;

    const subscriptions = ref([]);
    const subscribeRequests = ref([]);
    const subscription = ref(new Subscription());
    const filter = ref(new SubscriptionFilter());
    const fb = ref(new FeedbackHandler());
    const model = 'subscription';

    const filteredSubscriptions = computed(() => {
        return subscriptions.value.filter(subscription => {
            if (filter.value.global.value) {
                const searchStr = filter.value.global.value.toLowerCase();
                return (
                    subscription.subscription_id.toString().toLowerCase().includes(searchStr) ||
                    subscription.user.toLowerCase().includes(searchStr) ||
                    subscription.reason.toLowerCase().includes(searchStr) ||
                    subscription.status.toLowerCase().includes(searchStr) ||
                    subscription.action.toLowerCase().includes(searchStr)
                );
            }
            return true;
        });
    });

    const resetform = () => {
        subscription.value = new Subscription();
    }
    const fetchSubscriptions = async () => {
        // fb.value.clearError(model);
        // fb.value.removeSuccess(model);
        // fb.value.startLoading(model);
        fb.value.startLoading(model + ".list");
        try {            
            const response = await SubscriptionService.fetchSubscriptions();
            subscriptions.value = response.map(subs => new Subscription(subs));
            fb.value.showSuccess(model + '.list');
        } catch (err) {
            console.error('Failed to fetch subscriptions:', err);
            fb.value.setError(err, model + ".list");
        } finally {
            fb.value.finishLoading(model + ".list");
        }
    }
    const getSubscribeRequests = async () => {
        fb.value.clearError(model + '.subscribe-requests');
        fb.value.removeSuccess(model + '.subscribe-requests');
        fb.value.startLoading(model + '.subscribe-requests');
        try {
            const response = await SubscriptionService.getSubscribeRequests();
            subscribeRequests.value = response.map(subs => new Subscription(subs));
            fb.value.showSuccess(model + '.subscribe-requests');
            return subscribeRequests.value;
        }
        catch (err) {
            console.error('Failed to fetch subscribe requests:', err);
            fb.value.setError(err, model + '.subscribe-requests');
        } finally {
            fb.value.finishLoading(model + '.subscribe-requests');
        }
    }

    const getSubscriptionById = async (id) => {
        fb.value.clearError(model + '.update');
        fb.value.removeSuccess(model + '.update');
        fb.value.startLoading(model + '.update');
        try {
            const response = await SubscriptionService.getSubscriptionById(id);
            subscription.value = new Subscription(response);
            fb.value.showSuccess(model + '.update');
            return subscription.value;
        } catch (err) {
            console.error('Error updating subscription:', err);
            fb.value.setError(err, model + '.update');
            throw err;
        } finally {
            fb.value.finishLoading(model + '.update');
        }
    }

    const createSubscription = async (newSubscription) => {
        fb.value.clearError(model + '.create');
        fb.value.removeSuccess(model + '.create');
        fb.value.startLoading(model + '.create');
        try {
            const response = await SubscriptionService.createSubscription(newSubscription);
            const subs = new Subscription(response);
            subscription.value = subs;
            fb.value.showSuccess(model + '.create');
            return subscription.value;
        } catch (err) {
            fb.value.setError(err, model + '.create');
            throw err;
        } finally {
            fb.value.finishLoading(model + '.create');
        }
    };

    const updateSubscription = async (subscriptionId, updatedsubscription) => {
        fb.value.clearError(model+ '.update.' + subscriptionId);
        fb.value.removeSuccess(model+ '.update.' + subscriptionId);
        fb.value.startLoading(model+ '.update.' + subscriptionId);
        try {
          const response = await SubscriptionService.updateSubscription(subscriptionId, updatedsubscription);
          const updatedSubs = new Subscription(response);
          const index = Subscription.value.findIndex((s) => s.subscription_id === subscriptionId);
          if (index !== -1) {
            subscription.value[index] = updatedSubs;
          }
          subscription.value = updatedSubs;
          fb.value.showSuccess('Subscription updated successfully');
          return updatedSubs;
        } catch (err) {
          fb.value.setError(err, model+ '.update.' + subscriptionId);
          throw err;
        } finally {
          fb.value.finishLoading(model+ '.update.' + subscriptionId);
        }
    }

    const deleteSubscription = async (id) => {
        fb.value.clearError(model + '.delete.'+id);
        fb.value.removeSuccess(model + '.delete.'+id);
        fb.value.startLoading(model + '.delete.'+id);
        try {
            await SubscriptionService.deleteSubscription(id);
            subscription.value = subscription.value.filter(s => s.subscription_id !== id);
            fb.value.showSuccess(model + '.delete.'+id);
        } catch (err) {
            fb.value.setError(err, model + '.delete.'+id);
        } finally {
            fb.value.finishLoading(model + '.delete.'+id);
        }
    };
    const deleteSubscribeRequest = async (id) => {
        fb.value.clearError(model + '.delete.'+id);
        fb.value.removeSuccess(model + '.delete.'+id);
        fb.value.startLoading(model + '.delete.'+id);
        try {
            await SubscriptionService.deleteSubscription(id);
            subscribeRequests.value = subscribeRequests.value.filter(s => s.subscription_id !== id);
            fb.value.showSuccess(model + '.delete.'+id);
        } catch (err) {
            fb.value.setError(err, model + '.delete.'+id);
        } finally {
            fb.value.finishLoading(model + '.delete.'+id);
        }
    };
   
    function clearFilter() {
        filter.value = new SubscriptionFilter();
    }

    return {
        subscriptions,
        subscription,
        subscribeRequests,
        filter,
        filteredSubscriptions,
        fb,
        resetform,
        fetchSubscriptions,
        getSubscribeRequests,
        getSubscriptionById,
        createSubscription,
        updateSubscription,
        deleteSubscription,
        deleteSubscribeRequest,
        clearFilter
    };
}); 