<script setup>
import { useRouter } from 'vue-router';
import { useStockStatusStore } from '../stores/stockStatus';
import { storeToRefs } from 'pinia';
import { ref, onMounted, computed } from 'vue';
import StockStatus from '../models/StockStatus';
import { useLanguageStore } from '../stores/language';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const router = useRouter();
const stockStatusStore = useStockStatusStore();
const languageStore = useLanguageStore();
const stockStatus = ref(new StockStatus());
const {languages} = storeToRefs(languageStore);
const {fb} = storeToRefs(stockStatusStore);

const isLoading = computed(() => {
    return fb.value.loading === true;
});

const goToStockStatusList = () => {
    router.push('/configuration/settings/stock-statuses');
};

const saveStockStatus = async () => {
    try {
        await stockStatusStore.createStockStatus(stockStatus.value);
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Stock status created successfully',
            life: 3000
        });
        goToStockStatusList();
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create stock status. Please try again.',
            life: 3000
        });
    }
};

onMounted(() => {
    languageStore.fetchLanguages();
});

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
            @click="saveStockStatus"
            class="p-button-md"
        />
    </div>
    <Fluid class="flex flex-col md:flex-row gap-8 mb-20 border-t pt-6">
        <div class="w-full mt-3">
            <div class="flex flex-col gap-6">

                <div class="grid grid-cols-12 gap-2">
                    <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText class="text-lg" id="name" type="text" placeholder="Name" v-model="stockStatus.name" />
                    </div>
                </div>
                <div class="grid grid-cols-12 gap-2">
                    <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <Select v-model="stockStatus.language_id" :options="languages" optionLabel="name" optionValue="language_id" placeholder="Select a Language" class="w-full md:w-56 text-lg" />
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
