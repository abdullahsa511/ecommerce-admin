import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import VendorFilter from '@/filters/VendorFilter';
import VendorImportResponse from '@/models/VendorImport';
import FeedbackHandler from '@/utils/FeedbackHandler';
import VendorService from '@/service/VendorService';
import Vendor from '@/models/Vendor';
import { FileModel } from '@/models/Media';

export const useVendorStore = defineStore('vendor', () => {

    const vendors = ref([]);
    const vendor = ref(new Vendor());
    const filter = ref(new VendorFilter());
    const fb = ref(new FeedbackHandler());
    const model = 'vendor';
    const importExport = ref(new VendorImportResponse());

    const resetVendor = () => {
        vendor.value = new Vendor();
    };

    const fetchVendors = async () => {
        fb.value.clearError(model + '.list');
        fb.value.removeSuccess(model + '.list');
        fb.value.startLoading(model + '.list');
        try {
            const response = await VendorService.fetchVendors();
            vendors.value = response.map(v => new Vendor(v));
            fb.value.showSuccess(model + '.list');
        } catch (err) {
            console.error(err);
            fb.value.setError(err, model + '.list');
        } finally {
            fb.value.finishLoading(model + '.list');
        }
    };

    const getVendorById = async (id) => {
        fb.value.clearError(model + '.show.' + id);
        fb.value.removeSuccess(model + '.show.' + id);
        fb.value.startLoading(model + '.show.' + id);
        try {
            const response = await VendorService.getVendorById(id);
            vendor.value = new Vendor(response);
            fb.value.showSuccess(model + '.show.' + id);
            return vendor.value;
        } catch (err) {
            console.error(err);
            fb.value.setError(err, model + '.show.' + id);
        } finally {
            fb.value.finishLoading(model + '.show.' + id);
        }
    };

    const createVendor = async (vendor) => {
        fb.value.clearError(model + '.create');
        fb.value.removeSuccess(model + '.create');
        fb.value.startLoading(model + '.create');
        try {
            const response = await VendorService.createVendor(vendor);
            const vendorObj = new Vendor(response);
            vendorObj.value = vendorObj;
            fb.value.showSuccess(model + '.create');
            return vendorObj.value;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.create');
        } finally {
            fb.value.finishLoading(model + '.create');
        }
    };

    const updateVendor = async (vendor) => {
        fb.value.clearError(model + '.update.' + vendor.vendor_id);
        fb.value.removeSuccess(model + '.update.' + vendor.vendor_id);
        fb.value.startLoading(model + '.update.' + vendor.vendor_id);
        try {
            const response = await VendorService.updateVendor(vendor);
            fb.value.showSuccess(model + '.update.' + vendor.vendor_id);
            return response;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.update.' + vendor.vendor_id);
        } finally {
            fb.value.finishLoading(model + '.update.' + vendor.vendor_id);
        }
    };

    const deleteVendor = async (id) => {

        fb.value.clearError(model + '.delete.' + id);
        fb.value.removeSuccess(model + '.delete.' + id);
        fb.value.startLoading(model + '.delete.' + id);
        try {
            await VendorService.deleteVendor(id);
            vendors.value = vendors.value.filter(v => v.vendor_id !== id);
            fb.value.showSuccess(model + '.delete.' + id);
        } catch (err) {
            fb.value.setError(err, model + '.delete.' + id);
        } finally {
            fb.value.finishLoading(model + '.delete.' + id);
        }
    };

    const clearFilter = () => {
        filter.value = new VendorFilter();
    };

    
    const importVendors = async (formData) => {
        fb.value.clearError(model + '.import');
        fb.value.removeSuccess(model + '.import');
        fb.value.startLoading(model + '.import');
        try {
            const response = await VendorService.importVendors(formData);
            importExport.value = new VendorImportResponse(response);
            return importExport.value;
        }
        catch (err) {
            console.error(err);
            fb.value.setError(err, model + '.import');
            throw err;
        } finally {
            fb.value.finishLoading(model + '.import');
        }
    };

    const uploadVendorImages = async (files, property, vendorId) => {
        fb.value.clearError('media.files.upload.'+property);
        fb.value.removeSuccess('media.files.upload.'+property);
        fb.value.startLoading('media.files.upload.'+property);
        try {
            const response = await VendorService.uploadVendorImages(files, property, vendorId);
            vendor.value.image = response.files.map(item => new FileModel(item));
            fb.value.showSuccess('Files uploaded successfully', 'media.files.upload.'+property);
            return response;
        } catch (err) {
            fb.value.setError(err, 'media.files.upload.'+property);
            throw err;
        } finally {
            fb.value.finishLoading('media.files.upload.'+property);
        }
    };

    const deleteVendorImages = async (file, vendorId) => {
        fb.value.clearError('media.files.delete.'+vendorId);
        fb.value.removeSuccess('media.files.delete.'+vendorId);
        fb.value.startLoading('media.files.delete.'+vendorId);
        try {
            const response = await VendorService.deleteVendorImages(file, vendorId);
            vendor.value.image = [];
            fb.value.showSuccess('media.files.delete.'+vendorId);
            return response;
        } catch (err) {
            fb.value.setError(err, 'media.files.delete.'+vendorId);
            throw err;
        } finally {
            fb.value.finishLoading('media.files.delete.'+vendorId);
        }
    };
    return {
        vendors,
        vendor,
        filter,
        model,
        fb,
        importExport,
        resetVendor,
        fetchVendors,
        getVendorById,
        createVendor,
        updateVendor,
        deleteVendor,
        clearFilter,
        importVendors,
        uploadVendorImages,
        deleteVendorImages
    };
}); 