<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { useRegionGroupStore } from '@/stores/regionGroup';
import { storeToRefs } from 'pinia';
import TaxRate from '@/models/TaxRate';
import { useTaxRateStore } from '@/stores/taxRate';
import { useTaxTypeStore } from '@/stores/taxType';
import { useToast } from 'primevue/usetoast';
  
const emit = defineEmits(['editTabMounted', 'editTabUnmunted', 'saved']);
const toast = useToast(); 
const regionGroupStore = useRegionGroupStore();
const taxRateStore = useTaxRateStore();
const taxTypeStore = useTaxTypeStore();
const { regionGroups } = storeToRefs(regionGroupStore);
const { taxTypes } = storeToRefs(taxTypeStore);
const { newTaxRate, fb } = storeToRefs(taxRateStore);

onMounted(async () => {
    emit('editTabMounted');
    await regionGroupStore.fetchRegionGroups();
    await taxTypeStore.fetchTaxTypes();
    // Set the first region group as default after data is loaded
    if (regionGroups.value && regionGroups.value.length > 0) {
        newTaxRate.value.region_group_id = regionGroups.value[0].region_group_id;
    }
    // Set default type to Percentage
    newTaxRate.value.type = 'P';
});

onUnmounted(() => {
    emit('editTabUnmunted');
});

const handleRateInput = (event) => {
    let value = parseFloat(event.target.value);
    // If not a number, clear rate
    if (isNaN(value)) {
        newTaxRate.value.rate = '';
        return;
    }

    if (newTaxRate.value.type === 'P') {
        if(value > 100) {
            newTaxRate.value.rate = 100;
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Rate cannot be greater than 100',
                life: 6000
            });
            return;
        }
    }
    newTaxRate.value.rate = value;
};

const handleTypeChange = (event) => {
    if(event.value === 'P' && parseFloat(newTaxRate.value.rate) > 100) {
        newTaxRate.value.rate = '';
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Rate cannot be greater than 100%',
            life: 6000
        });
    }
};

</script>

<template>
    <Fluid class="flex flex-col md:flex-row">
        <div class="w-3/5">
            <h3 class="text-lg font-medium border-b border-gray-200 pb-2">
                Tax Rate Details
            </h3>
            <div class="flex flex-col gap-6 mt-3">
                <div class="grid grid-cols-12 gap-2">
                    <label for="name"
                        class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText v-model="newTaxRate.name" :disabled="fb.loading['taxRate.create']" class="text-lg"
                            id="name" type="text" placeholder="Name" :class="{ 'p-invalid': fb.errors['taxRate.create']?.name }" />
                            <Message v-if="fb.errors['taxRate.create']?.name" severity="error" size="small" variant="title">
                                <span v-for="error in fb.errors['taxRate.create']?.name" :key="error" class="flex flex-col">
                                    {{ error }}
                                </span>
                            </Message>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="rate"
                        class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Rate</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText v-model="newTaxRate.rate" class="text-lg" id="rate" type="text" 
                        placeholder="Rate" :class="{ 'p-invalid': fb.errors['taxRate.create']?.rate }" 
                        @input="handleRateInput"
                        />
                        <Message v-if="fb.errors['taxRate.create']?.rate" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors['taxRate.create']?.rate" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="type"
                        class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Type</label>
                    <div class="col-span-12 md:col-span-10">
                        <Select class="text-lg" v-model="newTaxRate.type" :options="[
                            { name: 'Percentage', type: 'P' },
                            { name: 'Fixed', type: 'F' }
                        ]" optionLabel="name" optionValue="type" placeholder="Select Type"
                            :loading="fb.loading['taxRate.create']" 
                            @change="handleTypeChange"
                            />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="region_group"
                        class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Region Group</label>
                    <div class="col-span-12 md:col-span-10">
                        <Select class="text-lg" v-model="newTaxRate.region_group_id" :options="regionGroups"
                            optionLabel="name" optionValue="region_group_id" placeholder="Select Region Group"
                            :loading="fb.loading['taxRate.create']" />
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
    color: #767779 !important;
    /* gray-600 equivalent */
    opacity: 1;
    font-size: 1.2rem;
}
</style>
