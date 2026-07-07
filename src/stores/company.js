import { ref } from 'vue';
import { defineStore } from 'pinia';
import CompanyService from '../service/CompanyService';
import ImportExport from '../models/ImportExport';
import Company from '@/models/Company';
import FeedbackHandler from '../utils/FeedbackHandler';
import VendorService from '@/service/VendorService';

export const useCompanyStore = defineStore('company', () => {
    const companies = ref([]);
    const company = ref(new Company());    // If it is edit mode the company will store the response with the id
    const filter = ref(null);
    const error = ref(null);
    const loading = ref(null);
    const vendors = ref([]);
    // const importExport = ref([]);
    const importExport = ref(new ImportExport());
    const fb = ref(new FeedbackHandler());
    const model = 'company';

    const resetCompany = () => {
        company.value = new Company();
    };

    const fetchCompanies = async () => {
        fb.value.clearError(model + '.list');
        fb.value.removeSuccess(model + '.list');
        fb.value.startLoading(model + '.list');
        try {
            const response = await CompanyService.getCompanies();
            companies.value = response.map(cc => new Company(cc));
            return companies.value;
            fb.value.showSuccess(model + '.list');
        } catch (err) {
            console.error('Failed to fetch companies:', err);
            fb.value.setError(err, model + '.list');
        } finally {
            fb.value.finishLoading(model + '.list');
        }
    };

    const searchVendors = async (query) => {
        fb.value.clearError(model + '.searchVendors');
        fb.value.removeSuccess(model + '.searchVendors');
        fb.value.startLoading(model + '.searchVendors');
        try {
            const response = await VendorService.searchVendors(query);
           vendors.value = response;
           return vendors.value;
             
        } catch (err) {
            let error = err.response?.data?.errors;
            if (!error) error = err;
            fb.value.setError(error, model + '.searchVendors');
        }
        finally {
            fb.value.finishLoading(model + '.searchVendors');
        }
    }

    const createCompany = async (newCompany) => {
        console.log('Creating company:', newCompany);
        fb.value.clearError(model + '.create');
        fb.value.removeSuccess(model + '.create');
        fb.value.startLoading(model + '.create');
        try {
            const companyResponse = await CompanyService.createCompany(newCompany);
            const companyObj = new Company(companyResponse);
            companyObj.value = companyObj;
            fb.value.showSuccess(model + '.create');
            company.value = new Company();
            return companyObj.value;
        } catch (err) {
            // Set error in FeedbackHandler
            let error = err.response?.data?.errors;
            if (!error) error = err;
            fb.value.setError(error, model + '.create');
            throw error;
        } finally {
            fb.value.finishLoading(model + '.create');
        }
    };

    const getCompanyById = async (id) => {
        fb.value.clearError(model + '.show.' + id);
        fb.value.removeSuccess(model + '.show.' + id);
        fb.value.startLoading(model + '.show.' + id);
        try {
            const response = await CompanyService.getCompanyById(id);
            console.log('response', response);
            company.value = new Company(response);
            fb.value.showSuccess(model + '.show.' + id);
            return response;
        } catch (err) {
            fb.value.setError(err, model + '.show.' + id);
            throw err;
        } finally {
            fb.value.finishLoading(model + '.show.' + id);
        }
    };

    const updateCompany = async (company) => {
        fb.value.clearError(model + '.update.' + company.company_id);
        fb.value.removeSuccess(model + '.update.' + company.company_id);
        fb.value.startLoading(model + '.update.' + company.company_id);
        try {
            const response = await CompanyService.updateCompany(company);
            fb.value.showSuccess(model + '.update.' + company.company_id);
            return response;
        } catch (err) {
            let error = err.response?.data?.errors;
            if (!error) error = err;
            fb.value.setError(error, model + '.update.' + company.company_id);
        } finally {
            fb.value.finishLoading(model + '.update.' + company.company_id);
        }
    };

    const deleteCompany = async (id) => {
        fb.value.clearError(model + '.delete.'+id);
        fb.value.removeSuccess(model + '.delete.'+id);
        fb.value.startLoading(model + '.delete.'+id);
        try {
            await CompanyService.deleteCompany(id);
            companies.value = companies.value.filter(c => c.company_id !== id);
            fb.value.showSuccess(model + '.delete.'+id);
        } catch (err) {
            fb.value.setError(err, model + '.delete.'+id);
        } finally {
            fb.value.finishLoading(model + '.delete.'+id);
        }
    };

    const companiesImport = async (newImport) => {
        fb.value.clearError(model + '.import');
        fb.value.removeSuccess(model + '.import');
        fb.value.startLoading(model + '.import');
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }
            const response = await CompanyService.companiesImport(newImport);
            importExport.value = new ImportExport(response);
            fb.value.showSuccess(model + '.import');
            return response;
        } catch (err) {
            console.error('Import error:', err);
            fb.value.setError(err, model + '.import');
            throw err;
        } finally {
            fb.value.finishLoading(model + '.import');
        }
    };

    return {
        companies,
        company,
        filter,
        loading,
        error,
        fb,
        importExport,
        model,
        resetCompany,
        fetchCompanies,
        searchVendors,
        getCompanyById,
        createCompany,
        updateCompany,
        deleteCompany,
        companiesImport,
    };
});

