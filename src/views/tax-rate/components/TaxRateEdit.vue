<script setup>
import { ref, onMounted, computed, watch, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useRegionGroupStore } from '@/stores/regionGroup';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import TaxRate from '@/models/TaxRate';
import { useTaxRateStore } from '@/stores/taxRate';
import { useTaxTypeStore } from '@/stores/taxType';

const emit = defineEmits(['editTabMounted', 'editTabUnmunted', 'saved']);

const router = useRouter();
const route = useRoute();
const toast = useToast();
const regionGroupStore = useRegionGroupStore();
const { regionGroups } = storeToRefs(regionGroupStore);
const taxRateStore = useTaxRateStore();
const taxTypeStore = useTaxTypeStore();
const { taxTypes } = storeToRefs(taxTypeStore);
const { newTaxRate, fb } = storeToRefs(taxRateStore);

const taxRateId = route.params.id;

onMounted(async () => {
    emit('editTabMounted');
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

onUnmounted(() => {
    emit('editTabUnmunted');
});

// Add watch for newTaxRate
watch(newTaxRate, (newValue) => {
    console.log('Tax rate updated:', newValue);
}, { deep: true });

</script>

<template>
    <Fluid class="flex flex-col md:flex-row">
        <div class="w-3/5">
            <h3 class="text-lg font-medium border-b border-gray-200 pb-2">
                Tax Rate Edit
            </h3>
            <div class="flex flex-col gap-6 mt-3">

                <div class="grid grid-cols-12 gap-2">
                    <label for="name"
                        class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText v-model="newTaxRate.name" class="text-lg"
                            id="name" type="text" placeholder="Name" :class="{ 'p-invalid': fb.errors['taxRate.update.' + taxRateId]?.name }" />
                            <Message v-if="fb.errors['taxRate.update.' + taxRateId]?.name" severity="error" size="small" variant="title">
                                <span v-for="error in fb.errors['taxRate.update.' + taxRateId]?.name" :key="error" class="flex flex-col">
                                    {{ error }}
                                </span>
                            </Message>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="rate"
                        class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Rate</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText v-model="newTaxRate.rate" class="text-lg"
                            id="rate" type="text" placeholder="Rate" :class="{ 'p-invalid': fb.errors['taxRate.update.' + taxRateId]?.rate }" />
                            <Message v-if="fb.errors['taxRate.update.' + taxRateId]?.rate" severity="error" size="small" variant="title">
                                <span v-for="error in fb.errors['taxRate.update.' + taxRateId]?.rate" :key="error" class="flex flex-col">
                                    {{ error }}
                                </span>
                            </Message>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="type"
                        class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Type</label>
                    <div class="col-span-12 md:col-span-10">
                        <Select class="text-lg" v-model="newTaxRate.type"
                            :options="[
                                { name: 'Percentage', type: 'P' },
                                { name: 'Fixed', type: 'F' }
                            ]" optionLabel="name" optionValue="type" placeholder="Select Type"
                            :class="{ 'p-invalid': fb.errors['taxRate.update.' + taxRateId]?.type }" />
                            <Message v-if="fb.errors['taxRate.update.' + taxRateId]?.type" severity="error" size="small" variant="title">
                                <span v-for="error in fb.errors['taxRate.update.' + taxRateId]?.type" :key="error" class="flex flex-col">
                                    {{ error }}
                                </span>
                            </Message>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="region_group"
                        class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Region Group</label>
                    <div class="col-span-12 md:col-span-10">
                        <Select class="text-lg"
                            v-model="newTaxRate.region_group_id" :options="regionGroups" optionLabel="name"
                            optionValue="region_group_id" placeholder="Select Region Group"
                            :loading="fb.loading['taxRate.update']" />
                    </div>
                </div>
            </div>
        </div>
        <div class="w-2/5 pl-6" v-if="newTaxRate?.tax_rate_id">
            <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Preview Tax Rate</h3>
            <div class="border border-gray-200 rounded-md p-4">
                <p><strong>Name:</strong> {{ newTaxRate?.name }}</p>
                <p><strong>Rate:</strong> {{ newTaxRate?.rate }}</p>
                <p><strong>Type:</strong> {{ newTaxRate?.type }}</p>
                <p><strong>Region Group:</strong> {{ newTaxRate?.region_group_id }}</p>
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
    color: #767779 !important;
    /* gray-600 equivalent */
    opacity: 1;
    font-size: 1.2rem;
}
</style>
