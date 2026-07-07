<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useRegionStore } from '@/stores/region';
import { useCountryStore } from '@/stores/country';
import { storeToRefs } from 'pinia';

const regionStore = useRegionStore();
const countryStore = useCountryStore();
const { fb, region } = storeToRefs(regionStore);
const { countries } = storeToRefs(countryStore);

const statusOptions = ref([
    { label: 'Active', value: 1 },
    { label: 'Inactive', value: 0 },
]);

const countryOptions = computed(() => {
    return countries.value.map(country => ({
        name: country.name,
        code: country.country_id
    }));
});


onMounted(async () => {
    await regionStore.fetchRegions();
    await countryStore.fetchCountries();
});
</script>

<template>
    <Fluid class="flex flex-col md:flex-row gap-8 mb-20">
        <div class="w-full mt-3">
            <div class="flex flex-col gap-6">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">
                    Add Region
                </h3>
                <div class="grid grid-cols-12 gap-2">
                    <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText 
                            class="text-lg w-full" 
                            id="name" 
                            type="text" 
                            v-model="region.name" 
                            placeholder="Name" 
                            :class="{ 'p-invalid': fb.errors['region.create']?.name }"
                        />
                        <Message v-if="fb.errors['region.create']?.name" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors['region.create']?.name" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="code" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Region code</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText 
                            class="text-lg w-full" 
                            id="code" 
                            type="text" 
                            v-model="region.code" 
                            placeholder="code" 
                            :class="{ 'p-invalid': fb.errors['region.create']?.code }"
                        />
                        <Message v-if="fb.errors['region.create']?.code" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors['region.create']?.code" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="country" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Country</label>
                    <div class="col-span-12 md:col-span-10">
                        <Select 
                            class="text-lg w-full" 
                            v-model="region.country_id" 
                            :options="countryOptions" 
                            optionLabel="name"
                            optionValue="code"
                            placeholder="Select Country"
                            :class="{ 'p-invalid': fb.errors['region.create']?.country_id }"
                        />
                        <Message v-if="fb.errors['region.create']?.country_id" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors['region.create']?.country_id" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="status" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Status</label>
                    <div class="col-span-12 md:col-span-10">
                        <Select 
                            class="text-lg w-full" 
                            v-model="region.status" 
                            :options="statusOptions" 
                            optionLabel="label"
                            optionValue="value"
                            placeholder="Select Status"
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
    color: #767779 !important;
    opacity: 1;
    font-size: 1.2rem;
}
</style> 