<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useRegionGroupStore } from '../stores/regionGroup';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import TaxRate from '@/models/TaxRate';
import { useTaxRateStore } from '../stores/taxRate';
import { useTaxTypeStore } from '../stores/taxType';

const router = useRouter();
const route = useRoute();
const toast = useToast();
const regionGroupStore = useRegionGroupStore();
const { regionGroups, fb } = storeToRefs(regionGroupStore);
const taxRateStore = useTaxRateStore();
const taxTypeStore = useTaxTypeStore();
const { taxTypes } = storeToRefs(taxTypeStore);
const newTaxRate = ref(new TaxRate());

const taxRateId = route.params.id;

const isLoading = computed(() => {
    return fb.value.loading === true;
});

onMounted( async () => {
    try {
        // Load region groups and tax types first
        await Promise.all([
            regionGroupStore.fetchRegionGroups(),
            taxTypeStore.fetchTaxTypes()
        ]);
        
        // Then fetch the tax rate
        const fetchedTaxRate = await taxRateStore.fetchTaxRateById(taxRateId);
        newTaxRate.value = new TaxRate(fetchedTaxRate);
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load tax type details. Please try again.',
            life: 3000
        });
        goToTaxRateList();
    }
});

const goToTaxRateList = () => {
    router.push('/configuration/settings/tax-rates');
};

const updateTaxRate = async () => {
    try {
        await taxRateStore.updateTaxRate(taxRateId, newTaxRate.value);
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Tax rate updated successfully',
            life: 3000
        });
        goToTaxRateList();
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update tax rate. Please try again.',
            life: 3000
        });
    }
};

// Add watch for newTaxRate
watch(newTaxRate, (newValue) => {
    console.log('Tax rate updated:', newValue);
}, { deep: true });

</script>

<template>
    <div class="flex justify-end gap-2 mb-6">
        <Button 
            icon="pi pi-arrow-left"
            label="Tax Rate List"
            severity="secondary"
            @click="goToTaxRateList"
            class="p-button-md"
        />
        <Button 
            icon="pi pi-save"
            label="Save"
            severity="primary"
            @click="updateTaxRate"
            class="p-button-md"
        />
    </div>
    <Fluid class="flex flex-col md:flex-row gap-8 mb-20">
        <div class="w-full">
            
            <div class="flex flex-col gap-6">

                <div class="grid grid-cols-12 gap-2">
                    <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText v-model="newTaxRate.name" class="text-lg" id="name" type="text" placeholder="Name" />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="rate" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Rate</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText v-model="newTaxRate.rate" class="text-lg" id="rate" type="text" placeholder="Rate" />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="type" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Type</label>
                    <div class="col-span-12 md:col-span-10">
                        <Select 
                            class="text-lg"
                            v-model="newTaxRate.type" 
                            :options="[
                                { name: 'Percentage', type: 'P' },
                                { name: 'Fixed', type: 'F' }
                            ]" 
                            optionLabel="name" 
                            optionValue="type" 
                            placeholder="Select Type"
                            :loading="isLoading"
                        />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="region_group" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Region Group</label>
                    <div class="col-span-12 md:col-span-10">
                        <Select 
                            class="text-lg" 
                            v-model="newTaxRate.region_group_id" 
                            :options="regionGroups" 
                            optionLabel="name"
                            optionValue="region_group_id"
                            placeholder="Select Region Group"
                            :loading="isLoading"
                        />
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
