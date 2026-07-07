import Company from '@/models/Company';
import ImportExport from '@/models/ImportExport';
import FeedbackHandler from '@/utils/FeedbackHandler';
import { defineStore } from 'pinia';

export interface CompanyState {
    companies: Company[];
    company: Company;
    filter: any | null;
    error: any | null;
    loading: any | null;
    importExport: ImportExport;
    fb: FeedbackHandler;
    model: string;
    vendors: any[];
}

export const useCompanyStore = defineStore('company', {
    state: (): CompanyState => ({
        companies: [],
        company: new Company(),
        filter: null,
        error: null,
        loading: null,
        importExport: new ImportExport(),
        fb: new FeedbackHandler(),
        model: 'company',
        vendors: [],
    }),
    actions: {
        resetCompany(): void {},
        async fetchCompanies(): Promise<Company[]> {},
        async searchVendors(query: string): Promise<any> {},
        async createCompany(newCompany: Company | any): Promise<Company | any> {},
        async getCompanyById(id: number | string): Promise<Company | any> {},
        async updateCompany(company: Company | any): Promise<any> {},
        async deleteCompany(id: number | string): Promise<void> {},
        async companiesImport(newImport: FormData): Promise<any> {}
    }
});

