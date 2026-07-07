import { defineStore } from 'pinia';
import  LanguageService  from '../service/LanguageService';
import { LanguageFilter } from '../filters/LanguageFilter';
import { ref, computed } from 'vue';
import Language from '../models/Language';
import FeedbackHandler from '../utils/FeedbackHandler';

export const useLanguageStore = defineStore('language', () => {
    /**
     * @type {import('vue').Ref<Language[]>}
     */
    const languages = ref([]);
    const filter = ref(new LanguageFilter());
    const newLanguage = ref(new Language());
    
    /**
     * @type {import('vue').Ref<FeedbackHandler>}
     */
    const fb = ref(new FeedbackHandler());
    const model = 'language';

    const resetNewLanguage = () => {
        newLanguage.value = new Language();
    };

    const fetchLanguages = async () => {
        fb.value.clearError(model + '.list');
        fb.value.removeSuccess(model + '.list');
        fb.value.startLoading(model + '.list');
        try {
            const response = await LanguageService.getLanguages();
            languages.value = response.map(language => new Language(language));
            fb.value.showSuccess(model + '.list');
        } catch (err) {
            console.error(err);
            fb.value.setError(err, model + '.list');
        } finally {
            fb.value.finishLoading(model + '.list');
        }
    };

    const authors = computed(() => {
        return languages.value.map(language => language.name);
    });

    const fetchLanguageById = async (languageId) => {
        fb.value.clearError(model + '.edit.' + languageId);
        fb.value.removeSuccess(model + '.edit.' + languageId);
        fb.value.startLoading(model + '.edit.' + languageId);
        try {
            const language = await LanguageService.getLanguageById(languageId);
            newLanguage.value = new Language(language);
            fb.value.showSuccess(model + '.edit.' + languageId);
            return newLanguage.value;
        } catch (err) {
            fb.value.setError(err, model + '.edit.' + languageId);
        } finally {
            fb.value.finishLoading(model + '.edit.' + languageId);
        }
    };

    const createLanguage = async (newLanguage) => {
        fb.value.clearError(model + '.create');
        fb.value.removeSuccess(model + '.create');
        fb.value.startLoading(model + '.create');
        try {
            const createdLanguage = await LanguageService.createLanguage(newLanguage);
            newLanguage.value = new Language(createdLanguage);
            fb.value.showSuccess(model + '.create');
            return newLanguage.value;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.create');
        } finally {
            fb.value.finishLoading(model + '.create');
        }
    };

    const updateLanguage = async (languageId, updatedLanguage) => {
        fb.value.clearError(model + '.update.' + languageId);
        fb.value.removeSuccess(model + '.update.' + languageId);
        fb.value.startLoading(model + '.update.' + languageId);
        try {
            const language = await LanguageService.updateLanguage(languageId, updatedLanguage);
            const index = languages.value.findIndex(l => l.language_id === languageId);
            if (index !== -1) {
                languages.value[index] = language;
            }
            fb.value.showSuccess(model + '.update.' + languageId);
            return language;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.update.' + languageId);
        } finally {
            fb.value.finishLoading(model + '.update.' + languageId);
        }
    };

    const deleteLanguage = async (languageId) => {
        fb.value.clearError(model + '.delete.' + languageId);
        fb.value.removeSuccess(model + '.delete.' + languageId);
        fb.value.startLoading(model + '.delete.' + languageId);
        try {
            await LanguageService.deleteLanguage(languageId);
            languages.value = languages.value.filter(l => l.language_id !== languageId);
            fb.value.showSuccess(model + '.delete.' + languageId);
        } catch (err) {
            fb.value.setError(err, model + '.delete.' + languageId);
        } finally {
            fb.value.finishLoading(model + '.delete.' + languageId);
        }
    };

    return { 
        languages, 
        filter,
        newLanguage,
        fb,
        authors, 
        fetchLanguages, 
        resetNewLanguage,
        fetchLanguageById, 
        createLanguage, 
        updateLanguage, 
        deleteLanguage 
    };
}); 