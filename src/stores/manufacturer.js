import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import ManufacturerService from '@/service/ManufacturerService';
import FeedbackHandler from '@/utils/FeedbackHandler';
import ManufacturerImportResponse from '@/models/ManufacturerImport';
import ManufacturerFilter from '@/filters/ManufacturerFilter';
import { FileModel } from '@/models/Media';
import Manufacturer from '@/models/Manufacturer';

export const useManufacturerStore = defineStore('manufacturer', () => {
    const manufacturers = ref([]);
    const manufacturer = ref(new Manufacturer());
    const filter = ref(new ManufacturerFilter());
    const fb = ref(new FeedbackHandler());
    const model = 'manufacturer';
    const importExport = ref(new ManufacturerImportResponse());

    const resetManufacturer = () => {
        manufacturer.value = new Manufacturer();
    };

    const fetchManufacturers = async () => {
        fb.value.clearError(model + '.list');
        fb.value.removeSuccess(model + '.list');
        fb.value.startLoading(model + '.list');
        try {
            const response = await ManufacturerService.fetchManufacturers();
            manufacturers.value = response.map(m => new Manufacturer(m));
            fb.value.showSuccess(model + '.list');
        } catch (e) {
            console.error(e);
            fb.value.setError(e, model + '.list');
        } finally {
            fb.value.finishLoading(model + '.list');
        }
    };

    const getManufacturerById = async (id) => {
        fb.value.clearError(model + '.show.' + id);
        fb.value.removeSuccess(model + '.show.' + id);
        fb.value.startLoading(model + '.show.' + id);
        try {
            const response = await ManufacturerService.getManufacturerById(id);
            manufacturer.value = new Manufacturer(response);
            fb.value.showSuccess(model + '.show.' + id);
            return manufacturer.value;
        } catch (e) {
            console.error(e);
            fb.value.setError(e, model + '.show.' + id);
        } finally {
            fb.value.finishLoading(model + '.show.' + id);
        }
    };
    const createManufacturer = async (newManufacturer) => {
        fb.value.clearError(model + '.create');
        fb.value.removeSuccess(model + '.create');
        fb.value.startLoading(model + '.create');
        try {
            const response = await ManufacturerService.createManufacturer(newManufacturer);
            const manufacturerObj = new Manufacturer(response);
            manufacturerObj.value = manufacturerObj;
            fb.value.showSuccess(model + '.create');
            return manufacturerObj.value;
        }catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.create');
        } finally {
            fb.value.finishLoading(model + '.create');
        }
    };
    const updateManufacturer = async (updatedManufacturer) => {
        fb.value.clearError(model + '.update.' + updatedManufacturer.manufacturer_id);
        fb.value.removeSuccess(model + '.update.' + updatedManufacturer.manufacturer_id);
        fb.value.startLoading(model + '.update.' + updatedManufacturer.manufacturer_id);
        try {
            const response = await ManufacturerService.updateManufacturer(updatedManufacturer);
            fb.value.showSuccess(model + '.update.' + updatedManufacturer.manufacturer_id);
            return response;
        }catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.update.' + updatedManufacturer.manufacturer_id);
        } finally {
            fb.value.finishLoading(model + '.update.' + updatedManufacturer.manufacturer_id);
        }   
    };
    const deleteManufacturer = async (id) => {
        fb.value.clearError(model + '.delete.' + id);
        fb.value.removeSuccess(model + '.delete.' + id);
        fb.value.startLoading(model + '.delete.' + id);
        try {
           await ManufacturerService.deleteManufacturer(id);
            manufacturers.value = manufacturers.value.filter(m => m.manufacturer_id !== id);
            fb.value.showSuccess(model + '.delete.' + id);
        } catch (err) {
            fb.value.setError(err, model + '.delete.' + id);
        } finally {
            fb.value.finishLoading(model + '.delete.' + id);
        }
    };

    const clearFilter = () => {
        filter.value = new ManufacturerFilter();
    };

    const importManufacturers = async (newImport) => {
        fb.value.clearError(model + '.import');
        fb.value.removeSuccess(model + '.import');
        fb.value.startLoading(model + '.import');
        try {
            const response = await ManufacturerService.importManufacturers(newImport);
            importExport.value = new ManufacturerImportResponse(response);
            fb.value.showSuccess(model + '.import');
            return importExport.value;
        } catch (e) {
            console.error(e);
            fb.value.setError(e, model + '.import');
        } finally {
            fb.value.finishLoading(model + '.import');
        }
    };


    const uploadManufacturerImages = async (files, property, manufacturerId) => {
        fb.value.clearError('media.files.upload.'+property);
        fb.value.removeSuccess('media.files.upload.'+property);
        fb.value.startLoading('media.files.upload.'+property);
        try {
            const response = await ManufacturerService.uploadManufacturerImages(files, property, manufacturerId);
            manufacturer.value.image = response.files.map(item => new FileModel(item));
            fb.value.showSuccess('Files uploaded successfully', 'media.files.upload.'+property);
            return response;
        } catch (err) {
            fb.value.setError(err, 'media.files.upload.'+property);
            throw err;
        } finally {
            fb.value.finishLoading('media.files.upload.'+property);
        }
    };

    const deleteManufacturerImages = async (file, manufacturerId) => {
        fb.value.clearError('media.files.delete.'+manufacturerId);
        fb.value.removeSuccess('media.files.delete.'+manufacturerId);
        fb.value.startLoading('media.files.delete.'+manufacturerId);
        try {
            console.log('file', file);
            const response = await ManufacturerService.deleteManufacturerImages(file, manufacturerId);
            manufacturer.value.image = [];
            fb.value.showSuccess('media.files.delete.'+manufacturerId);
            return response;
        } catch (err) {
            fb.value.setError(err, 'media.files.delete.'+manufacturerId);
            throw err;
        } finally {
            fb.value.finishLoading('media.files.delete.'+manufacturerId);
        }
    };


    return {
        manufacturers,
        manufacturer,
        filter,
        fb,
        model,
        importExport,
        clearFilter,
        resetManufacturer,
        fetchManufacturers,
        getManufacturerById,
        createManufacturer,
        updateManufacturer,
        deleteManufacturer,
        importManufacturers,
        uploadManufacturerImages,
        deleteManufacturerImages,

    };
}); 