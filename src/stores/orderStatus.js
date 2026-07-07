import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { OrderStatusService } from '../service/OrderStatusService';
// import { OrderStatusFilter } from '../filters/OrderStatusFilter';
import FeedbackHandler from '../utils/FeedbackHandler';
import OrderStatus from '../models/OrderStatus';
import OrderStatusImportResponse from '@/models/OrderStatusImportResponse';
import OrderStatusFilter from '@/filters/OrderStatusFilter';

export const useOrderStatusStore = defineStore('orderStatus', () => {
    /**
     * @type {import('vue').Ref<OrderStatus[]>}
     */
    const orderStatuses = ref([]);
    const orderStatus = ref(new OrderStatus());
    const filter = ref(new OrderStatusFilter());
    const fb = ref(new FeedbackHandler());
    const model = 'orderStatus';
    const importExport = ref(new OrderStatusImportResponse());

    const filteredOrderStatuses = computed(() => {
        return filter.value.apply(orderStatuses.value);
    });
    const resetOrderStatus = () => {
        orderStatus.value = new OrderStatus();
    };

    const fetchOrderStatuses = async () => {
        fb.value.clearError(model + '.list');
        fb.value.removeSuccess(model + '.list');
        fb.value.startLoading(model + '.list');
        try {
            const response = await OrderStatusService.getOrderStatuses();
            orderStatuses.value = response.map(orderStatus => new OrderStatus(orderStatus));
            fb.value.showSuccess(model + '.list');
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.list');
        } finally {
            fb.value.finishLoading(model + '.list');
        }
    };

    const findOrderStatusById = async (orderStatusId) => {
            fb.value.clearError(model + '.edit.' + orderStatusId);
            fb.value.removeSuccess(model + '.edit.' + orderStatusId);
            fb.value.startLoading(model + '.edit.' + orderStatusId);
            try {
                const response = await OrderStatusService.getOrderStatusById(orderStatusId);
                orderStatus.value = new OrderStatus(response);
                fb.value.showSuccess(model + '.edit.' + orderStatusId);
                return orderStatus.value;
            } catch (err) {
                let error = err.response?.data?.errors;
                if(!error) error = err;
                fb.value.setError(error, model + '.edit.' + orderStatusId);
            } finally {
                fb.value.finishLoading(model + '.edit.' + orderStatusId);
            }
       
    };

    const updateFilter = (newFilter) => {
        filter.value = { ...filter.value, ...newFilter };
    };

    const createOrderStatus = async () => {
        const newOrderStatus = orderStatus.value;
        fb.value.clearError(model + '.create'); 
        fb.value.removeSuccess(model + '.create');
        fb.value.startLoading(model + '.create');
        try {
            const createdOrderStatus = await OrderStatusService.createOrderStatus(newOrderStatus);
            const orderStatusObj = new OrderStatus(createdOrderStatus);
            orderStatus.value = orderStatusObj;
            fb.value.showSuccess(model + '.create');
            return orderStatus.value;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.create');
        } finally {
            fb.value.finishLoading(model + '.create');
        }
    };

    const updateOrderStatus = async (orderStatus) => {
        fb.value.clearError(model + '.update.' + orderStatus.order_status_id);
        fb.value.removeSuccess(model + '.update.' + orderStatus.order_status_id);
        fb.value.startLoading(model + '.update.' + orderStatus.order_status_id);
        try {
            const status = await OrderStatusService.updateOrderStatus(orderStatus);
            const orderStatusObj = new OrderStatus(status);
            orderStatus.value = orderStatusObj;
            fb.value.showSuccess(model + '.update.' + orderStatus.order_status_id);
            return orderStatus.value;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.update.' + orderStatus.order_status_id);
        } finally {
            fb.value.finishLoading(model + '.update.' + orderStatus.order_status_id);
        }
    };

    const deleteOrderStatus = async (orderStatusId) => {
        fb.value.clearError(model + '.delete.' + orderStatusId);
        fb.value.removeSuccess(model + '.delete.' + orderStatusId);
        fb.value.startLoading(model + '.delete.' + orderStatusId);
        try {
            await OrderStatusService.deleteOrderStatus(orderStatusId);
            orderStatuses.value = orderStatuses.value.filter(o => o.order_status_id !== orderStatusId);
            fb.value.showSuccess(model + '.delete.' + orderStatusId);
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.delete.' + orderStatusId);
        } finally {
            fb.value.finishLoading(model + '.delete.' + orderStatusId);
        }
    };
    const orderStatusesImport = async (newImport) => {
        fb.value.clearError(model+'.import');
        fb.value.removeSuccess(model+'.import');
        fb.value.startLoading(model+'.import');
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }
            const response = await OrderStatusService.orderStatusesImport(newImport);
            importExport.value = new OrderStatusImportResponse(response);
            fb.value.showSuccess(model+'.import');
            return importExport.value;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model+'.import');
            throw error;
        } finally {
            fb.value.finishLoading(model+'.import');
        }
    }

    return { 
        orderStatuses, 
        orderStatus,
        filter, 
        fb, 
        filteredOrderStatuses, 
        importExport,
        resetOrderStatus,
        fetchOrderStatuses, 
        findOrderStatusById,
        updateFilter, 
        createOrderStatus, 
        updateOrderStatus, 
        deleteOrderStatus,
        orderStatusesImport
    };
}); 