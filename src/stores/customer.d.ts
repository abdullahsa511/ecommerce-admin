import { Customer } from '@/models/Customer';
import ImportExport from '@/models/ImportExport';
import FeedbackHandler from '@/utils/FeedbackHandler';
import { defineStore } from 'pinia';

export interface CustomerState {
    customers: Customer[];
    customer: Customer;
    filter: any | null;
    error: any | null;
    loading: any | null;
    importExport: ImportExport[];
    fb: FeedbackHandler;
    model: string;
}

export const useCustomerStore = defineStore('customer', {
    state: (): CustomerState => ({
        customers: [],
        customer: new Customer(),
        filter: null,
        error: null,
        loading: null,
        importExport: [],
        fb: new FeedbackHandler(),
        model: 'customer',
    }),
    actions: {
        resetCustomer(): void {},
        async fetchCustomers(): Promise<Customer[]> {},
        async createCustomer(newCustomer: Customer | any): Promise<Customer | any> {},
        async getCustomerById(id: number | string): Promise<Customer | any> {},
        async updateCustomer(customer: Customer | any): Promise<any> {},
        async deleteCustomer(id: number | string): Promise<void> {},
        async customersImport(newImport: FormData): Promise<any> {}
    }
});

