import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import SubscriptionPlanService from '../service/SubscriptionPlanService';
import SubscriptionPlanFilter from '../filters/SubscriptionPlanFilter';
import SubscriptionPlan from '../models/SubscriptionPlan';
import FeedbackHandler from '../utils/FeedbackHandler';


export const useSubscriptionPlanStore = defineStore('subscriptionPlan', () => {
    /**
     * @type {import('vue').Ref<SubscriptionPlan[]>}
     */
    const subscriptionPlans = ref([]);
    const newSubscriptionPlan = ref(new SubscriptionPlan());
    const filter = ref(new SubscriptionPlanFilter());
    
    /**
     * @type {import('vue').Ref<FeedbackHandler>}
     */
    const fb = ref(new FeedbackHandler());
    const model = 'subscriptionPlan';

    const resetSubscriptionPlan = () => {
        newSubscriptionPlan.value = new SubscriptionPlan();
    };

    const fetchSubscriptionPlans = async () => {
        fb.value.clearError(model + '.list');
        fb.value.removeSuccess(model + '.list');
        fb.value.startLoading(model + '.list');
        try {
            const response = await SubscriptionPlanService.getSubscriptionPlans();
            subscriptionPlans.value = response;
            fb.value.showSuccess(model + '.list');
            console.log('subscriptionPlans store:', subscriptionPlans.value);
            return subscriptionPlans.value;
        } catch (err) {
            console.error(err);
            fb.value.setError(err, model + '.list');
        } finally {
            fb.value.finishLoading(model + '.list');
        }
    };

    const fetchSubscriptionPlanById = async (subscriptionPlanId) => {
        fb.value.clearError(model + '.edit.' + subscriptionPlanId);
        fb.value.removeSuccess(model + '.edit.' + subscriptionPlanId);
        fb.value.startLoading(model + '.edit.' + subscriptionPlanId);
        try {
            const subscriptionPlan = await SubscriptionPlanService.getSubscriptionPlanById(subscriptionPlanId);
            newSubscriptionPlan.value = new SubscriptionPlan(subscriptionPlan);
            fb.value.showSuccess(model + '.edit.' + subscriptionPlanId);
            return newSubscriptionPlan.value;
        } catch (err) {
            fb.value.setError(err, model + '.edit.' + subscriptionPlanId);
        } finally {
            fb.value.finishLoading(model + '.edit.' + subscriptionPlanId);
        }
    };

    const createSubscriptionPlan = async (newSubscriptionPlan) => {
        fb.value.clearError(model + '.create');
        fb.value.removeSuccess(model + '.create');
        fb.value.startLoading(model + '.create');
        try {
            const createdSubscriptionPlan = await SubscriptionPlanService.createSubscriptionPlan(newSubscriptionPlan);
            newSubscriptionPlan.value = new SubscriptionPlan(createdSubscriptionPlan);
            subscriptionPlans.value.push(newSubscriptionPlan.value);
            fb.value.showSuccess(model + '.create');
            return newSubscriptionPlan.value;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.create');
        } finally {
            fb.value.finishLoading(model + '.create');
        }
    };

    const updateSubscriptionPlan = async (subscriptionPlanId, updatedSubscriptionPlan) => {
        fb.value.clearError(model + '.update.' + subscriptionPlanId);
        fb.value.removeSuccess(model + '.update.' + subscriptionPlanId);
        fb.value.startLoading(model + '.update.' + subscriptionPlanId);
        try {
            const subscriptionPlan = await SubscriptionPlanService.updateSubscriptionPlan(subscriptionPlanId, updatedSubscriptionPlan);
            const index = subscriptionPlans.value.findIndex(s => s.subscription_plan_id === subscriptionPlanId);
            if (index !== -1) {
                subscriptionPlans.value[index] = subscriptionPlan;
            }
        
            fb.value.showSuccess(model + '.update.' + subscriptionPlanId);
            return subscriptionPlan;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.update.' + subscriptionPlanId);
        } finally {
            fb.value.finishLoading(model + '.update.' + subscriptionPlanId);
        }
    };

    const deleteSubscriptionPlan = async (subscriptionPlanId) => {
        fb.value.clearError(model + '.delete.' + subscriptionPlanId);
        fb.value.removeSuccess(model + '.delete.' + subscriptionPlanId);
        fb.value.startLoading(model + '.delete.' + subscriptionPlanId);
        try {
            await SubscriptionPlanService.deleteSubscriptionPlan(subscriptionPlanId);
            subscriptionPlans.value = subscriptionPlans.value.filter(s => s.subscription_plan_id !== subscriptionPlanId);
            fb.value.showSuccess(model + '.delete.' + subscriptionPlanId);
        } catch (err) {
            fb.value.setError(err, model + '.delete.' + subscriptionPlanId);
        } finally {
            fb.value.finishLoading(model + '.delete.' + subscriptionPlanId);
        }
    };

    return { 
        subscriptionPlans, 
        newSubscriptionPlan,
        filter,
        fb,
        resetSubscriptionPlan,
        fetchSubscriptionPlans, 
        fetchSubscriptionPlanById, 
        createSubscriptionPlan, 
        updateSubscriptionPlan, 
        deleteSubscriptionPlan 
    };
}); 