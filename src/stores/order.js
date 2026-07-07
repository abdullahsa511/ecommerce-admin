import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import OrderService from '../service/OrderService';
import OrderFilter from '@/filters/OrderFilter';
import { Order } from '../models/Order.ts';
import FeedbackHandler from '../utils/FeedbackHandler';
import OrderImportResponse from '@/models/OrderImport';
import CustomerService from '@/service/CustomerService';
import { CustomerData } from '@/models/Customer';

export const useOrderStore = defineStore('order', () => {
    /**
     * @type {import('vue').Ref<Order[]>}
    */
    const importExport = ref(new OrderImportResponse());
    const orders = ref([]);
    const order = ref(new Order());
    /**
     * @type {import('vue').Ref<FeedbackHandler>}
     */
    const fb = ref(new FeedbackHandler());
    const model = 'order';
    const orderStatuses = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const filter = ref(new OrderFilter());
    const customers = ref([]);

    const resetOrder = () => {
        order.value = new Order();
    };

    const filteredOrders = computed(() => {
        let result = [...orders.value];

        if (filter.value.global.value) {
            const searchTerm = filter.value.global.value.toLowerCase();
            result = result.filter(order =>
                order.user.toLowerCase().includes(searchTerm) ||
                order.status.toLowerCase().includes(searchTerm) ||
                order.payment_status.toLowerCase().includes(searchTerm) ||
                order.shipping_status.toLowerCase().includes(searchTerm)
            );
        }

        if (filter.value.order_id.value) {
            result = result.filter(order => order.order_id === filter.value.order_id.value);
        }

        if (filter.value.user.value) {
            result = result.filter(order =>
                order.user.toLowerCase().includes(filter.value.user.value.toLowerCase())
            );
        }

        if (filter.value.status.value) {
            result = result.filter(order => order.status === filter.value.status.value);
        }

        if (filter.value.payment_status.value) {
            result = result.filter(order => order.payment_status === filter.value.payment_status.value);
        }

        if (filter.value.shipping_status.value) {
            result = result.filter(order => order.shipping_status === filter.value.shipping_status.value);
        }

        if (filter.value.total.value) {
            result = result.filter(order => order.total === filter.value.total.value);
        }

        return result;
    });

    const fetchOrders = async () => {
        fb.value.clearError(model + '.list');
        fb.value.removeSuccess(model + '.list');
        fb.value.startLoading(model + '.list');
        try {
            const response = await OrderService.getOrders();
            orders.value = response.map(order => new Order(order));
            console.log('orders', orders.value);
            fb.value.showSuccess(model + '.list');
        } catch (err) {
            fb.value.setError(err, model + '.list');
        } finally {
            fb.value.finishLoading(model + '.list');
        }
    };

    const orderNames = computed(() => {
        return orders.value.map(order => order.name);
    });

    const fetchOrderById = async (orderId) => {
        fb.value.clearError(model + '.show');
        fb.value.removeSuccess(model + '.show');
        fb.value.startLoading(model + '.show');
        try {
            const response = await OrderService.getOrderById(orderId);
            fb.value.showSuccess(model + '.show');
            order.value = new Order(response);
            return order.value;
        } catch (err) {
            fb.value.setError(err, model + '.show');
        } finally {
            fb.value.finishLoading(model + '.show');
        }
    };

    const createOrder = async (newOrder) => {
        fb.value.clearError(model + '.create');
        fb.value.removeSuccess(model + '.create');
        fb.value.startLoading(model + '.create');
        try {
            const createdOrder = await OrderService.createOrder(newOrder);
            let order = new Order(createdOrder);
            orders.value.push(order);
            fb.value.showSuccess(model + '.create');
            return order;
        } catch (err) {
            fb.value.setError(err, model + '.create');
        } finally {
            fb.value.finishLoading(model + '.create');
        }
    };

    const updateOrder = async (updatedOrder) => {
        fb.value.clearError(model + '.update');
        fb.value.removeSuccess(model + '.update');
        fb.value.startLoading(model + '.update');
        try {
            const order = await OrderService.updateOrder(updatedOrder);
            fb.value.showSuccess(model + '.update');
            return new Order(order);
        } catch (err) {
            fb.value.setError(err, model + '.update');
        } finally {
            fb.value.finishLoading(model + '.update');
        }
    };

    const deleteOrder = async (orderId) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            await OrderService.deleteOrder(orderId);
            orders.value = orders.value.filter(o => o.orderDetails.order_id !== orderId);
            fb.value.showSuccess(model);
        } catch (err) {
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const getOrderStatuses = async () => {
        fb.value.clearError(model + "-statuses");
        fb.value.removeSuccess(model + "-statuses");
        fb.value.startLoading(model + "-statuses");
        try {
            const response = await OrderService.getOrderStatuses();
            orderStatuses.value = response;
            fb.value.showSuccess(model + "-statuses");
            return response;
        } catch (err) {
            fb.value.setError(err, model + "-statuses");
            return [];
        } finally {
            fb.value.finishLoading(model + "-statuses");
        }
    };

    const setFilter = (newFilter) => {
        filter.value = newFilter;
    };

    const clearFilter = () => {
        filter.value = new OrderFilter();
    };

    const importOrders = async (newImport) => {
        fb.value.clearError(model + '.import');
        fb.value.removeSuccess(model + '.import');
        fb.value.startLoading(model + '.import');
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }
            const response = await OrderService.importOrders(newImport);
            importExport.value = new OrderImportResponse(response);
            fb.value.showSuccess(model + '.import');
            return importExport.value;
        } catch (err) {
            console.error('Import error:', err);
            fb.value.setError(err, model + '.import');
            throw err;
        } finally {
            fb.value.finishLoading(model + '.import');
        }
    };

    const getCustomers = async (query) => {
        fb.value.clearError(model + '.customers');
        fb.value.removeSuccess(model + '.customers');
        fb.value.startLoading(model + '.customers');
        try {
            const response = await CustomerService.searchCustomers(query);
            // console.log('response store getCustomers', response);
            // convert response to CustomerData
            const customersData = response.map(customer => new CustomerData(customer));
            console.log('customersData store getCustomers', customersData);
            customers.value = customersData;
            console.log('customers store data', customers.value);
            fb.value.showSuccess(model + '.customers');
            return customers.value;
        } catch (err) {
            fb.value.setError(err, model + '.customers');
            return [];
        } finally {
            fb.value.finishLoading(model + '.customers');
        }
    };

    return {
        orders,
        order,
        fb,
        model,
        orderNames,
        orderStatuses,
        loading,
        error,
        filter,
        filteredOrders,
        importExport,
        fetchOrders,
        fetchOrderById,
        createOrder,
        updateOrder,
        deleteOrder,
        getOrderStatuses,
        setFilter,
        clearFilter,
        importOrders,
        resetOrder,
        getCustomers,
        customers
    };
}); 