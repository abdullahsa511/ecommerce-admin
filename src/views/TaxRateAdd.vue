<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useRegionGroupStore } from '../stores/regionGroup';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import TaxRate from '@/models/TaxRate';
import { useTaxRateStore } from '../stores/taxRate';
import { useTaxTypeStore } from '../stores/taxType';

const toast = useToast();
const router = useRouter();
const regionGroupStore = useRegionGroupStore();
const taxRateStore = useTaxRateStore();
const taxTypeStore = useTaxTypeStore();
const { regionGroups, fb } = storeToRefs(regionGroupStore);
const { taxTypes } = storeToRefs(taxTypeStore);

const newTaxRate = ref(new TaxRate());

const isLoading = computed(() => {
    return fb.value.loading === true;
});

onMounted( async () => {
    await regionGroupStore.fetchRegionGroups();
    await taxTypeStore.fetchTaxTypes();
    // Set the first region group as default after data is loaded
    if (regionGroups.value && regionGroups.value.length > 0) {
        newTaxRate.value.region_group_id = regionGroups.value[0].region_group_id;
    }
    // Set default type to Percentage
    newTaxRate.value.type = 'P';
});

const goToTaxRateList = () => {
    router.push('/configuration/settings/tax-rates');
};

const saveTaxRate = async () => {
    try {
        await taxRateStore.createTaxRate(newTaxRate.value);
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Tax rate created successfully',
            life: 3000
        });
        goToTaxRateList();
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create tax rate. Please try again.',
            life: 3000
        });
    }
};

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
            @click="saveTaxRate"
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
