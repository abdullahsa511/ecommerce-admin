import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import OrderItemService from '../service/OrderItemService';
import { Order, OrderItem } from '../models/Order.ts';
import FeedbackHandler from '../utils/FeedbackHandler';

export const useOrderItemStore = defineStore('orderItem', () => {
    /**
     * @type {import('vue').Ref<Order[]>}
     */
    const orderItems = ref([]);
     /**
     * @type {import('vue').Ref<FeedbackHandler>}
     */
     const fb = ref(new FeedbackHandler());
     const model = 'orderItem';

     const fetchOrderItems = async () => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const response = await OrderItemService.getOrderItems();
            orderItems.value = response.map(orderItem => new OrderItem(orderItem));
            fb.value.showSuccess(model);
        } catch (err) {
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const orderNames = computed(() => {
        return orderItems.value.map(orderItem => orderItem.name);
    });

    const fetchOrderItemById = async (orderItemId) => {
        fb.value.clearError(model+'.show');
        fb.value.removeSuccess(model+'.show');
        fb.value.startLoading(model+'.show');
        try {
            const orderItem = await OrderItemService.getOrderItemById(orderItemId);
            fb.value.showSuccess(model+'.show');
            return new OrderItem(orderItem);
        } catch (err) {
            fb.value.setError(err, model+'.show');
        } finally {
            fb.value.finishLoading(model+'.show');
        }
    };

    const createOrderItem = async (newOrderItem) => {
        fb.value.clearError(model+'.create');
        fb.value.removeSuccess(model+'.create');
        fb.value.startLoading(model+'.create');
        try {
            const createdOrderItem = await OrderItemService.createOrderItem(newOrderItem);
            let orderItem = new OrderItem(createdOrderItem);
            orderItems.value.push(orderItem);
            fb.value.showSuccess(model+'.create');
            return orderItem;
        } catch (err) {
            fb.value.setError(err, model+'.create');
        } finally {
            fb.value.finishLoading(model+'.create');
        }
    };

    const updateOrderItem = async (updatedOrderItem) => {
        fb.value.clearError(model+'.update');
        fb.value.removeSuccess(model+'.update');
        fb.value.startLoading(model+'.update');
        try {
            const orderItem = await OrderItemService.updateOrderItem(updatedOrderItem);
            fb.value.showSuccess(model+'.update');
            return new OrderItem(orderItem);
        } catch (err) {
            fb.value.setError(err, model+'.update');
        } finally {
            fb.value.finishLoading(model+'.update');
        }
    };

    const deleteOrderItem = async (orderItemId) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            await OrderItemService.deleteOrderItem(orderItemId);
            orderItems.value = orderItems.value.filter(q => q.order_id !== orderItemId);
            fb.value.showSuccess(model);
        } catch (err) {
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const getProductList = async (query) => {
        fb.value.clearError(model+"-product-list");
        fb.value.removeSuccess(model+"-product-list");
        fb.value.startLoading(model+"-product-list");
        try {
            const response = await OrderItemService.getProductList(query);
            fb.value.showSuccess(model+"-product-list");
            return response;
        } catch (err) {
            fb.value.setError(err, model+"-product-list");
            return [];
        } finally {
            fb.value.finishLoading(model+"-product-list");
        }
    };

    return { 
        orderItems, 
        fb, 
        model, 
        orderNames, 
        fetchOrderItems, 
        fetchOrderItemById, 
        createOrderItem, 
        updateOrderItem, 
        deleteOrderItem, 
        getProductList
    };
}); 