import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import FeedbackHandler from '../utils/FeedbackHandler';
import Quote from '@/models/Quote';
import QuoteService from '@/service/QuoteService';
import QuoteItemService from '@/service/QuoteItemService';
import QuoteImportResponse from '@/models/QuoteImport';
import CustomerService from '@/service/CustomerService';
import { CustomerData } from '@/models/Customer';

export const useQuoteStore = defineStore('quote', () => {


    const quotes = ref([]);
    const quote = ref(new Quote());
    const quoteItems = ref([]);
    const fb = ref(new FeedbackHandler());
    const model = 'quote';
    const quoteStatuses = ref([]);
    const productList = ref([]);
    const importExport = ref([]);
    const customers = ref([]);

    const resetQuote = () => {
        quote.value = new Quote();
    };

    const fetchQuotes = async () => {
        fb.value.startLoading(model + ".list");
        try {
            const response = await QuoteService.getQuotes();
            quotes.value = response.map(qu => new Quote(qu));
            console.log('quote store data', quotes.value);
            fb.value.showSuccess(model + '.list');
        } catch (err) {
            fb.value.setError(err, model + '.list');
        } finally {
            fb.value.finishLoading(model + '.list');
        }
    };

    const quoteNames = computed(() => {
        return quotes.value.map(quote => quote.name);
    });

    const fetchQuoteById = async (quoteId) => {
        fb.value.clearError(model + '.show.' + quoteId);
        fb.value.removeSuccess(model + '.show.' + quoteId);
        fb.value.startLoading(model + '.show.' + quoteId);
        try {
            const response = await QuoteService.getQuoteById(quoteId);
            quote.value = new Quote(response);
            fb.value.showSuccess(model + '.show.' + id);
            return response;



            // fb.value.showSuccess(model + '.show.' + quoteId);
            // return new Quote(quote);
        } catch (err) {
            fb.value.setError(err, model + '.show.' + quoteId);
        } finally {
            fb.value.finishLoading(model + '.show.' + quoteId);
        }
    };

    const createQuote = async (newQuote) => {
        fb.value.clearError(model + '.create');
        fb.value.removeSuccess(model + '.create');
        fb.value.startLoading(model + '.create');
        try {
            const createdQuote = await QuoteService.createQuote(newQuote);
            let quote = new Quote(createdQuote);
            // quotes.value.push(quote);
            quotes.value = quote;
            fb.value.showSuccess(model + '.create');
            // return quote;
            return quotes.value;
        } catch (err) {
            let error = err.response?.data?.errors;
            if (!error) error = err;
            fb.value.setError(error, model + '.create');

            // fb.value.setError(err, model + '.create');
        } finally {
            fb.value.finishLoading(model + '.create');
        }
    };

    const updateQuote = async (updatedQuote) => {
        fb.value.clearError(model + '.update.' + updateQuote.quote_id);
        fb.value.removeSuccess(model + '.update.' + updateQuote.quote_id);
        fb.value.startLoading(model + '.update.' + updateQuote.quote_id);
        try {
            const quote = await QuoteService.updateQuote(updatedQuote);
            fb.value.showSuccess(model + '.update.' + updateQuote.quote_id);
            return new Quote(quote);
        } catch (err) {
            fb.value.setError(err, model + '.update.' + updateQuote.quote_id);
        } finally {
            fb.value.finishLoading(model + '.update.' + updateQuote.quote_id);
        }
    };

    const deleteQuote = async (quoteId) => {
        fb.value.clearError(model + '.delete.' + quoteId);
        fb.value.removeSuccess(model + '.delete.' + quoteId);
        fb.value.startLoading(model + '.delete.' + quoteId);
        try {
            await QuoteService.deleteQuote(quoteId);
            quotes.value = quotes.value.filter(q => q.quote_id !== quoteId);
            fb.value.showSuccess(model + '.delete.' + quoteId);
        } catch (err) {
            fb.value.setError(err, model + '.delete.' + quoteId);
        } finally {
            fb.value.finishLoading(model + '.delete.' + quoteId);
        }
    };

    const getQuoteStatuses = async () => {
        fb.value.clearError(model + "-statuses");
        fb.value.removeSuccess(model + "-statuses");
        fb.value.startLoading(model + "-statuses");
        try {
            const response = await QuoteService.getQuoteStatuses();
            quoteStatuses.value = response;
            fb.value.showSuccess(model + "-statuses");
            return response;
        } catch (err) {
            fb.value.setError(err, model + "-statuses");
            return [];
        } finally {
            fb.value.finishLoading(model + "-statuses");
        }
    };

    const getProductList = async (query) => {
        fb.value.clearError(model + "-product-list");
        fb.value.removeSuccess(model + "-product-list");
        fb.value.startLoading(model + "-product-list");
        try {
            const response = await QuoteItemService.getProductList(query);
            fb.value.showSuccess(model + "-product-list");
            return response;
        } catch (err) {
            fb.value.setError(err, model + "-product-list");
            return [];
        } finally {
            fb.value.finishLoading(model + "-product-list");
        }
    };

    const importQuotes = async (newImport) => {
        fb.value.clearError(model + '.import');
        fb.value.removeSuccess(model + '.import');
        fb.value.startLoading(model + '.import');
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }
            const response = await QuoteService.importQuotes(newImport);
            importExport.value = new QuoteImportResponse(response);
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
    // get customers
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
    const getCustomers2 = async () => {
        fb.value.clearError(model + '.customers');
        fb.value.removeSuccess(model + '.customers');
        fb.value.startLoading(model + '.customers');
        try {
            const response = await CustomerService.getCustomers();

            const customersData = response.map(customer => ({
                name: customer.name,
                organisationCode: customer.org_code,
                organisationName: customer.org_name,
                zohoId: customer.abn,
                terms: customer.term_id,
                deposit: customer.deposit_percentage,
                gst: customer.gst,
                billTo: 'SA Techonology, Bablatola Street, Pabna, Bangladesh',
                shipTo: 'SA Techonology, Bablatola Street, Pabna, Bangladesh',
                siteContacts: customer.phone ?? '0849378511',
                customerBalance: customer.customer_balance ?? 20000.00
            }));
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

    const showQuoteItems = async (quoteId) => {
        fb.value.clearError(model + '.quote-items.' + quoteId);
        fb.value.removeSuccess(model + '.quote-items.' + quoteId);
        fb.value.startLoading(model + '.quote-items.' + quoteId);
        try {
            const response = await QuoteItemService.showQuoteItems(quoteId);
            quoteItems.value = response;
            fb.value.showSuccess(model + '.quote-items.' + quoteId);
            return quoteItems.value;
        } catch (err) {
            fb.value.setError(err, model + '.quote-items.' + quoteId);
            return [];
        } finally {
            fb.value.finishLoading(model + '.quote-items.' + quoteId);
        }
    };

    const acceptQuote = async (quoteId) => {
        fb.value.clearError(model + '.accept-quote.' + quoteId);
        fb.value.removeSuccess(model + '.accept-quote.' + quoteId);
        fb.value.startLoading(model + '.accept-quote.' + quoteId);
        try {
            const response = await QuoteItemService.acceptQuote(quoteId);
            fb.value.showSuccess(model + '.accept-quote.' + quoteId);
            return response;
        } catch (err) {
            fb.value.setError(err, model + '.accept-quote.' + quoteId);
        } finally {
            fb.value.finishLoading(model + '.accept-quote.' + quoteId);
        }
    };

    return {
        quotes,
        quote,
        quoteItems,
        fb,
        model,
        quoteNames,
        quoteStatuses,
        productList,
        importExport,
        resetQuote,
        fetchQuotes,
        fetchQuoteById,
        createQuote,
        updateQuote,
        deleteQuote,
        getQuoteStatuses,
        getProductList,
        importQuotes,
        getCustomers,
        customers,
        showQuoteItems,
        acceptQuote,
    };
}); 