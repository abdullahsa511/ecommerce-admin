import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import SiteService from '../service/SiteService';
import FeedbackHandler from '../utils/FeedbackHandler';
import Site, { EmailSetting } from '@/models/Site';
// import Site from '../models/Site.ts';

export const useSiteStore = defineStore('site', () => {
  
     const sites = ref([]);
     const site = ref(new Site());
     const emailSetting = ref(new EmailSetting());
    //  const filter = ref(new SiteFilter());
     
    
     const fb = ref(new FeedbackHandler());
     const model = 'site';

    const fetchSites = async () => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const response = await SiteService.getSites();
            sites.value = response.map(site => new Site(site));
            fb.value.showSuccess(model);
        } catch (err) {
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const siteNames = computed(() => {
        return sites.value.map(site => site.name);
    });

    const fetchSiteById = async (siteId) => {
        fb.value.clearError(model+'.edit.'+siteId);
        fb.value.removeSuccess(model+'.edit.'+siteId);
        fb.value.startLoading(model+'.edit.'+siteId);
        try {
            const response = await SiteService.getSiteById(siteId);
            site.value = new Site(response);
            fb.value.showSuccess(model+'.edit.'+siteId);
            return site.value;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model+'.edit.'+siteId);
        } finally {
            fb.value.finishLoading(model+'.edit.'+siteId);
        }
    };

    const createSite = async (newSite) => {
        console.log('createSite', newSite);
        fb.value.clearError(model+'.create');
        fb.value.removeSuccess(model+'.create');
        fb.value.startLoading(model+'.create');
        try {
            const createdSite = await SiteService.createSite(newSite);
            const siteObj = new Site(createdSite);
            site.value = siteObj;
            // sites.value.push(site);
            fb.value.showSuccess(model+'.create');
            return site.value;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model+'.create');
        } finally {
            fb.value.finishLoading(model+'.create');
        }
    };

    const updateSite = async (updatedSite) => {
        fb.value.clearError(model+'.update.'+updatedSite.site_id);
        fb.value.removeSuccess(model+'.update.'+updatedSite.site_id);
        fb.value.startLoading(model+'.update.'+updatedSite.site_id);
        try {
            const site = await SiteService.updateSite(updatedSite);
            const siteObj = new Site(site);
            const index = sites.value.findIndex(s => s.site_id === updatedSite.site_id);
            if (index !== -1) {
                sites.value[index] = siteObj;
            }
            site.value = siteObj;
            fb.value.showSuccess(model+'.update.'+updatedSite.site_id);
            return siteObj;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model+'.update.'+updatedSite.site_id);
        } finally {
            fb.value.finishLoading(model+'.update.'+updatedSite.site_id);
        }
    };

    const deleteSite = async (siteId) => {
        fb.value.clearError(model+'.delete.'+siteId);
        fb.value.removeSuccess(model+'.delete.'+siteId);
        fb.value.startLoading(model+'.delete.'+siteId);
        try {
            await SiteService.deleteSite(siteId);
            sites.value = sites.value.filter(s => s.site_id !== siteId);
            fb.value.showSuccess(model+'.delete.'+siteId);
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model+'.delete.'+siteId);
        } finally {
            fb.value.finishLoading(model+'.delete.'+siteId);
        }
    };

    const fetchEmailSettings = async () => {
        fb.value.clearError('email.fetch');
        fb.value.removeSuccess('email.fetch');
        fb.value.startLoading('email.fetch');
        try {
            const response = await SiteService.getEmailSettings();
            emailSetting.value = new EmailSetting(response);
            fb.value.showSuccess('email.fetch');
            return emailSetting.value;
        }catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, 'email.fetch');
        } finally {
            fb.value.finishLoading('email.fetch');
        }
    }
    // email setting 
    const createEmailSetting = async (newEmailSetting) => {
        fb.value.clearError('email.create');
        fb.value.removeSuccess('email.create');
        fb.value.startLoading('email.create');
        try {
            const createdEmailSetting = await SiteService.createEmailSetting(newEmailSetting);
            emailSetting.value = new EmailSetting(createdEmailSetting);
            fb.value.showSuccess('email.create');
            return emailSetting.value;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, 'email.create');
        } finally {
            fb.value.finishLoading('email.create');
        }
    }

    return { sites, emailSetting, fb, siteNames, fetchSites, fetchSiteById, createSite, updateSite, deleteSite, createEmailSetting, fetchEmailSettings };
});