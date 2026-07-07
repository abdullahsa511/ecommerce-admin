import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import PinboardService from '../service/PinboardService';
import { Pinboard } from '../models/Pinboard.ts';
import FeedbackHandler from '../utils/FeedbackHandler';
import QuoteItemService from '../service/QuoteItemService';
import PinboardImportResponse from '@/models/PinboardImportResponse';

export const usePinboardStore = defineStore('pinboard', () => {
    /**
     * @type {import('vue').Ref<Pinboard[]>}
     */
    const pinboards = ref([]);
    const pinboard = ref(new Pinboard());
    const pinboardItems = ref([]);
     /**
     * @type {import('vue').Ref<FeedbackHandler>}
     */
     const fb = ref(new FeedbackHandler());
     const model = 'pinboard';
     const pinboardStatuses = ref([]);
     const productList = ref([]);
     // import export
     const importExport = ref(new PinboardImportResponse());

     const fetchPinboards = async () => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const response = await PinboardService.getPinboards();
            pinboards.value = response.map(pinboard => new Pinboard(pinboard));
            fb.value.showSuccess(model);
        } catch (err) {
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const pinboardNames = computed(() => {
        return pinboards.value.map(pinboard => pinboard.name);
    });

    const fetchPinboardById = async (pinboardId) => {
        fb.value.clearError(model+'.show');
        fb.value.removeSuccess(model+'.show');
        fb.value.startLoading(model+'.show');
        try {
            const data = await PinboardService.getPinboardById(pinboardId);
            pinboard.value = new Pinboard(data);
            fb.value.showSuccess(model+'.show');
            return pinboard.value;
        } catch (err) {
            fb.value.setError(err, model+'.show');
        } finally {
            fb.value.finishLoading(model+'.show');
        }
    };

    const createPinboard = async (newPinboard) => {
        fb.value.clearError(model+'.create');
        fb.value.removeSuccess(model+'.create');
        fb.value.startLoading(model+'.create');
        try {
            const createdPinboard = await PinboardService.createPinboard(newPinboard);
            let pinboard = new Pinboard(createdPinboard);
            pinboards.value.push(pinboard);
            fb.value.showSuccess(model+'.create');
            return pinboard;
        } catch (err) {
            fb.value.setError(err, model+'.create');
        } finally {
            fb.value.finishLoading(model+'.create');
        }
    };

    const updatePinboard = async (updatedPinboard) => {
        fb.value.clearError(model+'.update');
        fb.value.removeSuccess(model+'.update');
        fb.value.startLoading(model+'.update');
        try {
            const pinboard = await PinboardService.updatePinboard(updatedPinboard);
            fb.value.showSuccess(model+'.update');
            return new Pinboard(pinboard);
        } catch (err) {
            fb.value.setError(err, model+'.update');
        } finally {
            fb.value.finishLoading(model+'.update');
        }
    };

    const deletePinboard = async (pinboardId) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            await PinboardService.deletePinboard(pinboardId);
            pinboards.value = pinboards.value.filter(p => p.pinboard_id !== pinboardId);
            if (pinboard.value?.pinboard_id == pinboardId) {
                pinboard.value = new Pinboard();
            }
            fb.value.showSuccess(model);
        } catch (err) {
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };
    const deleteTemporaryPinboard = async (pinboardId) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
           const response = await PinboardService.deleteTemporaryPinboard(pinboardId);
           console.log(response);
            pinboards.value = pinboards.value.filter(
                p => Number(p.pinboard_temp_id) !== Number(pinboardId)
            );
            fb.value.showSuccess(model);
        } catch (err) {
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const sendEmailDraftPinboard = async () => {
        fb.value.clearError(model+".send_email");
        fb.value.removeSuccess(model+".send_email");
        fb.value.startLoading(model+".send_email");
        try {
            const res = await PinboardService.sendEmailDraftPinboard();
            fb.value.showSuccess(model+".send_email");
            return res;
        } catch (err) {
            fb.value.setError(err, model+".send_email");
        } finally {
            fb.value.finishLoading(model+".send_email");
        }
    };

    const getPinboardStatuses = async () => {
        fb.value.clearError(model+"-statuses");
        fb.value.removeSuccess(model+"-statuses");
        fb.value.startLoading(model+"-statuses");
        try {
            const response = await PinboardService.getPinboardStatuses();
            pinboardStatuses.value = response;
            fb.value.showSuccess(model+"-statuses");
            return response;
        } catch (err) {
            fb.value.setError(err, model+"-statuses");
            return [];
        } finally {
            fb.value.finishLoading(model+"-statuses");
        }
    };

    const getProductList = async (query) => {
        fb.value.clearError(model+"-product-list");
        fb.value.removeSuccess(model+"-product-list");
        fb.value.startLoading(model+"-product-list");
        try {
            const response = await QuoteItemService.getProductList(query);
            fb.value.showSuccess(model+"-product-list");
            return response;
        } catch (err) {
            fb.value.setError(err, model+"-product-list");
            return [];
        } finally {
            fb.value.finishLoading(model+"-product-list");
        }
    };

    const pinboardsImport = async (formData) => {
        fb.value.clearError(model+"-import");
        fb.value.removeSuccess(model+"-import");
        fb.value.startLoading(model+"-import");
        try {
            const response = await PinboardService.pinboardsImport(formData);
            importExport.value = new PinboardImportResponse(response);
        }
        catch (err) {
            fb.value.setError(err, model+"-import");
        } finally {
            fb.value.finishLoading(model+"-import");
        }
    };
    // show pinboard items
    const showPinboardItems = async (pinboardId) => {
        fb.value.clearError(model+".show-items");
        fb.value.removeSuccess(model+".show-items");
        fb.value.startLoading(model+".show-items");
        try {
            const response = await PinboardService.showPinboardItems(pinboardId);
            // console.log(response.pinboardItems);
            pinboardItems.value = response;
            fb.value.showSuccess(model+".show-items");
        } catch (err) {
            fb.value.setError(err, model+".show-items");
        } finally {
            fb.value.finishLoading(model+".show-items");
        }
    };
    const acceptPinboard = async (pinboardId) => {
        fb.value.clearError(model+".accept." + pinboardId);
        fb.value.removeSuccess(model+".accept." + pinboardId);
        fb.value.startLoading(model+".accept." + pinboardId);

        try {
            const response = await PinboardService.acceptPinboard(pinboardId);
            fb.value.showSuccess(model+".accept." + pinboardId);
            return response;
        } catch (err) {
            fb.value.setError(err, model+".accept." + pinboardId);
        } finally {
            fb.value.finishLoading(model+".accept." + pinboardId);
        }
    };

    const applyPinboardStatusUpdate = (pinboardData, fallbackPinboardId) => {
        const parsed = new Pinboard(pinboardData);
        const id = parsed.pinboard_id ?? fallbackPinboardId;
        if (id == null) return;

        const statusId = parsed.pinboard_status.order_status_id || parsed.pinboardDetails.pinboard_status_id;
        const statusName = parsed.pinboard_status.name || parsed.pinboardDetails.pinboard_status_name;

        const applyStatusToTarget = (target) => {
            target.pinboardDetails.pinboard_status_id = statusId;
            target.pinboardDetails.pinboard_status_name = statusName;
            Object.assign(target.pinboard_status, parsed.pinboard_status);
        };

        const index = pinboards.value.findIndex(p => p.pinboard_id == id);
        if (index !== -1) {
            applyStatusToTarget(pinboards.value[index]);
        }

        if (pinboard.value?.pinboard_id == id) {
            applyStatusToTarget(pinboard.value);
        }
    };

    const createLead = async (pinboardId) => {
        fb.value.clearError(model+".create.lead");
        fb.value.removeSuccess(model+".create.lead");
        fb.value.startLoading(model+".create.lead");
        try {
            const response = await PinboardService.createLead(pinboardId);
            if (response?.pinboard) {
                applyPinboardStatusUpdate(response.pinboard, pinboardId);
            }
            fb.value.showSuccess(model+".create.lead");
            return response;
        } catch (err) {
            fb.value.setError(err, model+".create.lead");
        } finally {
            fb.value.finishLoading(model+".create.lead");
        }
    };

    const fetchTemporaryPinboards = async () => {
        fb.value.clearError(model + '.list');
        fb.value.removeSuccess(model + '.list');
        fb.value.startLoading(model + '.list');
        try {
            const response = await PinboardService.fetchTemporaryPinboards();
            pinboards.value = response.map(pinboard => new Pinboard(pinboard));
            fb.value.showSuccess(model + '.list');
        } catch (err) {
            console.error(err);
            fb.value.setError(err, model + '.list');
        } finally {
            fb.value.finishLoading(model + '.list');
        }
    };

    return { 
        pinboards,
        pinboard,
        fb, 
        model, 
        pinboardNames, 
        pinboardStatuses,
        productList,
        pinboardItems,
        fetchPinboards, 
        fetchPinboardById, 
        createPinboard, 
        updatePinboard, 
        deletePinboard, 
        deleteTemporaryPinboard, 
        getPinboardStatuses,
        getProductList,
        pinboardsImport,
        importExport,
        showPinboardItems,
        acceptPinboard,
        createLead,
        fetchTemporaryPinboards,
        sendEmailDraftPinboard
    };
}); 