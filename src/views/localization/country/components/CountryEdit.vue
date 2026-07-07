<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useCountryStore } from '@/stores/country';
import { storeToRefs } from 'pinia';

const emit = defineEmits(['update:newCountry', 'saved', 'editTabUnmunted', 'editTabMounted']);

const route = useRoute();
const countryStore = useCountryStore();
const { newCountry, fb } = storeToRefs(countryStore);

const countryId = route.params.id;

const statusOptions = ref([
    { label: 'Active', value: 1 },
    { label: 'Inactive', value: 0 },
]);

onMounted(async () => {
    emit('editTabMounted');
    await countryStore.fetchCountryById(countryId);
});

onUnmounted(() => {
    emit('editTabUnmunted');
});
</script>

<template>
    <Fluid class="flex flex-col md:flex-row gap-8 mb-20">
        <div class="w-full mt-3">
            <div class="flex flex-col gap-6">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Edit Country</h3>
                <div class="grid grid-cols-12 gap-2">
                    <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText 
                            class="text-lg w-full" 
                            id="name" 
                            type="text" 
                            v-model="newCountry.name" 
                            placeholder="Name" 
                            :class="{ 'p-invalid': fb.errors['country.update.' + countryId]?.name }"
                        />
                        <Message v-if="fb.errors['country.update.' + countryId]?.name" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors['country.update.' + countryId]?.name" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="iso_code_2" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Iso code 2</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText 
                            class="text-lg w-full" 
                            id="iso_code_2" 
                            type="text" 
                            v-model="newCountry.iso_code_2" 
                            placeholder="iso_code_2"
                            maxlength="2"
                        />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="iso_code_3" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Iso code 3</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText 
                            class="text-lg w-full" 
                            id="iso_code_3" 
                            type="text" 
                            v-model="newCountry.iso_code_3" 
                            placeholder="iso_code_2"
                            maxlength="3"
                        />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="status" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Status</label>
                    <div class="col-span-12 md:col-span-10">
                        <Select 
                            class="text-lg w-full" 
                            v-model="newCountry.status" 
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