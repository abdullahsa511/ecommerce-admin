<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStockStatusStore } from '../stores/stockStatus';
import { storeToRefs } from 'pinia';
import StockStatus from '../models/StockStatus';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const route = useRoute();
const router = useRouter();
const stockStatusStore = useStockStatusStore();
const { fb} = storeToRefs(stockStatusStore);

// const props = defineProps(['id']);
// const stockStatusId = props.id;
const stockStatusId = route.params.id;
const stockStatus = ref(new StockStatus());

const isLoading = computed(() => {
    return fb.value.loading === true;
});

const goToStockStatusList = () => {
    router.push('/configuration/settings/stock-statuses');
};

onMounted(async () => {
    try {
        const fetchedStockStatus = await stockStatusStore.findStockStatusById(stockStatusId);
        stockStatus.value = new StockStatus(fetchedStockStatus);
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load stock status details. Please try again.',
            life: 3000
        });
        goToStockStatusList();
    }
});

const updateStockStatus = async () => {
    try {
        await stockStatusStore.updateStockStatus(stockStatusId, stockStatus.value);
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Stock status updated successfully',
            life: 3000
        });
        goToStockStatusList();
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update stock status. Please try again.',
            life: 3000
        });
    }
};

</script>

<template>
    <div class="flex justify-end gap-2 mb-6">
        <Button 
            icon="pi pi-arrow-left"
            label="Stock Status List"
            severity="secondary"
            @click="goToStockStatusList"
            class="p-button-md"
        />
        <Button 
            icon="pi pi-save"
            label="Save"
            severity="primary"
            @click="updateStockStatus"
            class="p-button-md"
        />
    </div>
    <Fluid class="flex flex-col md:flex-row gap-8 mb-20 border-t pt-6">
        <div class="w-full mt-3">
            <div class="flex flex-col gap-6">
                <div class="grid grid-cols-12 gap-2">
                    <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <IconField>
                            <InputText 
                            v-model="stockStatus.name" 
                            variant="filled"  
                            class="text-lg" 
                            placeholder="loading..."
                            id="name" />
                            <InputIcon v-if="fb.loading.stockStatus" class="pi pi-spin pi-spinner" />
                        </IconField>
                    </div>
                </div>

            </div>
        </div>
        
    </Fluid>
</template>

<style scoped>
label {
    font-size: 1.2rem;
}
:deep(input::placeholder),
:deep(textarea::placeholder) {
    color: #767779 !important; /* gray-600 equivalent */
    opacity: 1;
    font-size: 1.2rem;
}

</style>
