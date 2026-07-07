import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import Timezone from '@/models/Timezone';
import FeedbackHandler from '../utils/FeedbackHandler';
import TimezoneService from '@/service/TimezoneService';

export const useTimezoneStore = defineStore('timezone', () => {
    /**
     * @type {import('vue').Ref<Timezone[]>}
     */
    const timezones = ref([]);
    
    /**
     * @type {import('vue').Ref<FeedbackHandler>}
     */
    const fb = ref(new FeedbackHandler());
    const model = 'timezone';
    const newTimezone = ref(new Timezone());

    const resetNewTimezone = () => {
        newTimezone.value = new Timezone();
    };

    const fetchTimezones = async () => {
        fb.value.clearError(model + '.list');
        fb.value.removeSuccess(model + '.list');
        fb.value.startLoading(model + '.list');
        try {
            const response = await TimezoneService.getTimezones();
            timezones.value = response.map(timezone => new Timezone(timezone));
            fb.value.showSuccess(model + '.list');
        } catch (err) {
            console.error(err);
            fb.value.setError(err, model + '.list');
        } finally {
            fb.value.finishLoading(model + '.list');
        }
    };

    const fetchTimezoneById = async (timezoneId) => {
        fb.value.clearError(model + '.edit.' + timezoneId);
        fb.value.removeSuccess(model + '.edit.' + timezoneId);
        fb.value.startLoading(model + '.edit.' + timezoneId);
        try {
            const timezone = await TimezoneService.getTimezoneById(timezoneId);
            newTimezone.value = new Timezone(timezone);
            fb.value.showSuccess(model + '.edit.' + timezoneId);
            return newTimezone.value;
        } catch (err) {
            fb.value.setError(err, model + '.edit.' + timezoneId);
        } finally {
            fb.value.finishLoading(model + '.edit.' + timezoneId);
        }
    };

    const createTimezone = async (newTimezone) => {       
        fb.value.clearError(model + '.create');         
        fb.value.removeSuccess(model + '.create');
        fb.value.startLoading(model + '.create');
        try {
            const createdTimezone = await TimezoneService.createTimezone(newTimezone);
            newTimezone.value = new Timezone(createdTimezone);
            fb.value.showSuccess(model + '.create');
            return newTimezone.value;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.create');
        } finally {
            fb.value.finishLoading(model + '.create');
        }
    };

    const updateTimezone = async (timezoneId, updatedTimezone) => { 
        fb.value.clearError(model + '.update.' + timezoneId);
        fb.value.removeSuccess(model + '.update.' + timezoneId);
        fb.value.startLoading(model + '.update.' + timezoneId);
        try {
            const timezone = await TimezoneService.updateTimezone(timezoneId, updatedTimezone);
            const index = timezones.value.findIndex(t => t.timezone_id === timezoneId);
            if (index !== -1) {
                timezones.value[index] = timezone;
            }
            fb.value.showSuccess(model + '.update.' + timezoneId);
            return timezone;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.update.' + timezoneId);
        } finally {
            fb.value.finishLoading(model + '.update.' + timezoneId);
        }
    };

    const deleteTimezone = async (timezoneId) => {
            fb.value.clearError(model + '.delete.' + timezoneId);
        fb.value.removeSuccess(model + '.delete.' + timezoneId);
        fb.value.startLoading(model + '.delete.' + timezoneId);
        try {
            await TimezoneService.deleteTimezone(timezoneId);
            timezones.value = timezones.value.filter(t => t.timezone_id !== timezoneId);
            fb.value.showSuccess(model + '.delete.' + timezoneId);
        } catch (err) {
            fb.value.setError(err, model + '.delete.' + timezoneId);
        } finally {
            fb.value.finishLoading(model + '.delete.' + timezoneId);
        }
    };

    return { 
        timezones, 
        fb,
        newTimezone,
        resetNewTimezone,
        fetchTimezones, 
        fetchTimezoneById, 
        createTimezone, 
        updateTimezone, 
        deleteTimezone 
    };
}); 