import ImportExport from '@/models/ImportExport';
import FeedbackHandler from '@/utils/FeedbackHandler';
import { defineStore } from 'pinia';

export interface CategoryState {
    categories: any[];
    category: any;
    fb: FeedbackHandler;
    model: string;
    categoryNames: string[];
}

export const useCategoryStore = defineStore('category', {
    state: (): CategoryState => ({
        categories: [],
        category: {},
        fb: new FeedbackHandler(),
        model: 'category',
        categoryNames: [],
    }),
    actions: {
        async fetchCategories(): Promise<any[]> {},
        async fetchProductCategories(): Promise<any[]> {},
        async fetchCategoryById(categoryId: number | string): Promise<any> {},
        async createCategory(newCategory: any): Promise<any> {},
        async updateCategory(updatedCategory: any): Promise<any> {},
        async deleteCategory(categoryId: number | string): Promise<void> {},
        async createCategoryImport(newImport: FormData): Promise<any> {},

        async updateCategoryWayPoints(categoryId: number | string, wayPoints: any) : Object {},
        async getWayPointSuggestions(query: string): Promise<any[]> {},

        async updateCategoryOrder(categoryId: number | string, orderedCategories: any[]): Promise<any> {},

        async uploadCategoryImage(files: any[], property: string, categoryId: number | string): Promise<any> {},
        async deleteCategoryImage(file: any, property: string, categoryId: number | string): Promise<any> {},
    }
});

