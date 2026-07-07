import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { StockStatusService } from '@/service/StockStatusService';
import { StockStatusFilter } from '@/filters/StockStatusFilter';
import FeedbackHandler from '@/utils/FeedbackHandler';
import StockStatus from '@/models/StockStatus';
import StockStatusImportResponse from '@/models/StockStatusImportResponse';

export const useStockStatusStore = defineStore('stockStatus', () => {
    /**
     * @type {import('vue').Ref<StockStatus[]>}
     */
    const stockStatuses = ref([]);
    const stockStatus = ref(new StockStatus());
    const filter = ref(new StockStatusFilter());
    const fb = ref(new FeedbackHandler());
    const model = 'stockStatus';
    const importExport = ref(new StockStatusImportResponse());

    const filteredStockStatuses = computed(() => {
        return filter.value.apply(stockStatuses.value);
    });
    const resetStockStatus = () => {
        stockStatus.value = new StockStatus();
    };

    const fetchStockStatuses = async () => {
        fb.value.clearError(model + '.list');
        fb.value.removeSuccess(model + '.list');
        fb.value.startLoading(model + '.list');
        try {
            const response = await StockStatusService.getStockStatuses();
            stockStatuses.value = response.map(stockStatus => new StockStatus(stockStatus));
            fb.value.showSuccess(model + '.list');
        } catch (err) {
            fb.value.setError(err, model + '.list');
            console.error('Error fetching stock statuses:', err);
        } finally {
            fb.value.finishLoading(model + '.list');
        }
    };

    const findStockStatusById = async (stockStatusId) => {
        let status = stockStatuses.value.find(s => s.stock_status_id === stockStatusId);
        if (!status) {
            fb.value.clearError(model + '.edit.' + stockStatusId);
            fb.value.removeSuccess(model + '.edit.' + stockStatusId);
            fb.value.startLoading(model + '.edit.' + stockStatusId);
            try {
                const response = await StockStatusService.getStockStatusById(stockStatusId);
                stockStatus.value = new StockStatus(response);
                fb.value.showSuccess(model + '.edit.' + stockStatusId);
                return stockStatus.value;
            } catch (err) {
                let error = err.response?.data?.errors;
                if(!error) error = err;
                fb.value.setError(error, model + '.edit.' + stockStatusId);
            } finally {
                fb.value.finishLoading(model + '.edit.' + stockStatusId);
            }
        }else{
            stockStatus.value = status;
            fb.value.showSuccess(model + '.edit.' + stockStatusId);
            return stockStatus.value;
        }
    };

    const updateFilter = (newFilter) => {
        filter.value = { ...filter.value, ...newFilter };
    };

    const createStockStatus = async () => {
        const newStockStatus = stockStatus.value;
        fb.value.clearError(model + '.create');
        fb.value.removeSuccess(model + '.create');
        fb.value.startLoading(model + '.create');
        try {
            const createdStockStatus = await StockStatusService.createStockStatus(newStockStatus);
            stockStatus.value = new StockStatus(createdStockStatus);
            stockStatuses.value.push(stockStatus.value);
            fb.value.showSuccess(model + '.create');
            return stockStatus.value;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.create');
        } finally {
            fb.value.finishLoading(model + '.create');
        }
    };

    const updateStockStatus = async (stockStatus) => {
        fb.value.clearError(model + '.update.' + stockStatus.stock_status_id);
        fb.value.removeSuccess(model + '.update.' + stockStatus.stock_status_id);
        fb.value.startLoading(model + '.update.' + stockStatus.stock_status_id);
        try {
            console.log('stockStatusId', stockStatus.stock_status_id);
            const status = await StockStatusService.updateStockStatus(stockStatus.stock_status_id, stockStatus);
            const index = stockStatuses.value.findIndex(s => s.stock_status_id === stockStatus.stock_status_id);
            if (index !== -1) {
                stockStatuses.value[index] = status;
            }
            stockStatus.value = new StockStatus(status);
            fb.value.showSuccess(model + '.update.' + stockStatus.stock_status_id);
            return status;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.update.' + stockStatus.stock_status_id);
        } finally {
            fb.value.finishLoading(model + '.update.' + stockStatus.stock_status_id);
        }
    };

    const deleteStockStatus = async (stockStatusId) => {
        fb.value.clearError(model + '.delete.' + stockStatusId);
        fb.value.removeSuccess(model + '.delete.' + stockStatusId);
        fb.value.startLoading(model + '.delete.' + stockStatusId);
        try {
            await StockStatusService.deleteStockStatus(stockStatusId);
            stockStatuses.value = stockStatuses.value.filter(s => s.stock_status_id !== stockStatusId);
            fb.value.showSuccess(model + '.delete.' + stockStatusId);
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.delete.' + stockStatusId);
        } finally {
            fb.value.finishLoading(model + '.delete.' + stockStatusId);
        }
    };
    const stockStatusesImport = async (newImport) => {
        fb.value.clearError(model+'.import');
        fb.value.removeSuccess(model+'.import');
        fb.value.startLoading(model+'.import');
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }
            const response = await StockStatusService.stockStatusesImport(newImport);
            console.log('Store received response:', response);
            importExport.value = new StockStatusImportResponse(response);
            fb.value.showSuccess(model+'.import');
            return importExport.value;
        } catch (err) {
            console.error('Import error:', err);
            fb.value.setError(err, model+'.import');
            throw err;
        } finally {
            fb.value.finishLoading(model+'.import');
        }
    }
    return { 
        stockStatuses, 
        stockStatus,
        filter, 
        fb, 
        filteredStockStatuses, 
        importExport,
        resetStockStatus,
        fetchStockStatuses, 
        findStockStatusById,
        updateFilter, 
        createStockStatus, 
        updateStockStatus, 
        deleteStockStatus,
        stockStatusesImport
    };
}); 