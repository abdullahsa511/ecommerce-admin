import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import ReturnService from '../service/ReturnService';
import ReturnFilter from '../filters/ReturnFilter';

export const useReturnStore = defineStore('return', () => {
    const returns = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const filter = ref(new ReturnFilter());

    const filteredReturns = computed(() => {
        return returns.value.filter(returnItem => {
            if (filter.value.global.value) {
                const searchStr = filter.value.global.value.toLowerCase();
                return (
                    returnItem.return_id.toString().toLowerCase().includes(searchStr) ||
                    returnItem.user.toLowerCase().includes(searchStr) ||
                    returnItem.reason.toLowerCase().includes(searchStr) ||
                    returnItem.status.toLowerCase().includes(searchStr) ||
                    returnItem.action.toLowerCase().includes(searchStr)
                );
            }
            return true;
        });
    });

    async function fetchReturns() {
        try {
            loading.value = true;
            error.value = null;
            returns.value = await ReturnService.fetchReturns();
        } catch (e) {
            error.value = e.message;
        } finally {
            loading.value = false;
        }
    }

    async function getReturnById(id) {
        try {
            loading.value = true;
            error.value = null;
            return await ReturnService.getReturnById(id);
        } catch (e) {
            error.value = e.message;
            return null;
        } finally {
            loading.value = false;
        }
    }

    async function addReturn(returnItem) {
        try {
            loading.value = true;
            error.value = null;
            const newReturn = await ReturnService.addReturn(returnItem);
            returns.value.push(newReturn);
            return newReturn;
        } catch (e) {
            error.value = e.message;
            return null;
        } finally {
            loading.value = false;
        }
    }

    async function updateReturn(returnItem) {
        try {
            loading.value = true;
            error.value = null;
            const updatedReturn = await ReturnService.updateReturn(returnItem);
            const index = returns.value.findIndex(r => r.return_id === returnItem.return_id);
            if (index !== -1) {
                returns.value[index] = updatedReturn;
            }
            return updatedReturn;
        } catch (e) {
            error.value = e.message;
            return null;
        } finally {
            loading.value = false;
        }
    }

    async function deleteReturn(id) {
        try {
            loading.value = true;
            error.value = null;
            await ReturnService.deleteReturn(id);
            returns.value = returns.value.filter(r => r.return_id !== id);
            return true;
        } catch (e) {
            error.value = e.message;
            return false;
        } finally {
            loading.value = false;
        }
    }

    function clearFilter() {
        filter.value = new ReturnFilter();
    }

    return {
        returns,
        loading,
        error,
        filter,
        filteredReturns,
        fetchReturns,
        getReturnById,
        addReturn,
        updateReturn,
        deleteReturn,
        clearFilter
    };
}); 