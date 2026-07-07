import { ref } from 'vue';
import { defineStore } from 'pinia';
import CustomerService from '../service/CustomerService';
import ImportExport from '../models/ImportExport';
import { Customer } from '@/models/Customer';
import FeedbackHandler from '../utils/FeedbackHandler';

export const useCustomerStore = defineStore('customer', () => {
    const customers = ref([]);
    const customer = ref(new Customer());    // If it is edit mode the customer will store the response with the id
    const filter = ref(null);
    const error = ref(null);
    const loading = ref(null);
    const importExport = ref([]);
    const fb = ref(new FeedbackHandler());

    
    const model = 'customer';

    const resetCustomer = () => {
        customer.value = new Customer();
    };

    const fetchCustomers = async () => {
        fb.value.clearError(model + '.list');
        fb.value.removeSuccess(model + '.list');
        fb.value.startLoading(model + '.list');
        try {
            const response = await CustomerService.getCustomers();
            customers.value = response.map(cc => new Customer(cc));
            return customers.value;
            fb.value.showSuccess(model + '.list');
        } catch (err) {
            console.error('Failed to fetch customers:', err);
            fb.value.setError(err, model + '.list');
        } finally {
            fb.value.finishLoading(model + '.list');
        }
    };

    const createCustomer = async (newCustomer) => {
        console.log('Creating customer:', newCustomer);
        fb.value.clearError(model + '.create');
        fb.value.removeSuccess(model + '.create');
        fb.value.startLoading(model + '.create');
        try {
            const customerResponse = await CustomerService.createCustomer(newCustomer);
            const customerObj = new Customer(customerResponse);
            customerObj.value = customerObj;
            fb.value.showSuccess(model + '.create');
            customer.value = new Customer();
            return customerObj.value;
        } catch (err) {
            // Set error in FeedbackHandler
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.create');
            // Re-throw the error so caller can catch it
            throw err;
        } finally {
            fb.value.finishLoading(model + '.create');
        }
    };

    const getCustomerById = async (id) => {
        fb.value.clearError(model + '.show.' + id);
        fb.value.removeSuccess(model + '.show.' + id);
        fb.value.startLoading(model + '.show.' + id);
        try {
            const response = await CustomerService.getCustomerById(id);
            customer.value = new Customer(response);
            fb.value.showSuccess(model + '.show.' + id);
            return response;
        } catch (err) {
            fb.value.setError(err, model + '.show.' + id);
            throw err;
        } finally {
            fb.value.finishLoading(model + '.show.' + id);
        }
    };

    const updateCustomer = async (customer) => {
        fb.value.clearError(model + '.update.' + customer.customer_id);
        fb.value.removeSuccess(model + '.update.' + customer.customer_id);
        fb.value.startLoading(model + '.update.' + customer.customer_id);
        try {
            const response = await CustomerService.updateCustomer(customer);
            fb.value.showSuccess(model + '.update.' + customer.customer_id);
            return response;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.update.' + customer.customer_id);
            throw err;
        } finally {
            fb.value.finishLoading(model + '.update.' + customer.customer_id);
        }
    };

    const deleteCustomer = async (id) => {
        fb.value.clearError(model + '.delete.'+id);
        fb.value.removeSuccess(model + '.delete.'+id);
        fb.value.startLoading(model + '.delete.'+id);
        try {
            await CustomerService.deleteCustomer(id);
            customers.value = customers.value.filter(c => c.customer_id !== id);
            fb.value.showSuccess(model + '.delete.'+id);
        } catch (err) {
            fb.value.setError(err, model + '.delete.'+id);
        } finally {
            fb.value.finishLoading(model + '.delete.'+id);
        }
    };

    const customersImport = async (newImport) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }
            const response = await CustomerService.customersImport(newImport);
            console.log('Store received response:', response);
            importExport.value.push(response);
            fb.value.showSuccess(model);
            return response;
        } catch (err) {
            console.error('Import error:', err);
            fb.value.setError(err, model);
            throw err;
        } finally {
            fb.value.finishLoading(model);
        }
    };

    return {
        customers,
        customer,
        filter,
        loading,
        error,
        fb,
        resetCustomer,
        fetchCustomers,
        getCustomerById,
        createCustomer,
        updateCustomer,
        deleteCustomer,
        customersImport,
    };
});

