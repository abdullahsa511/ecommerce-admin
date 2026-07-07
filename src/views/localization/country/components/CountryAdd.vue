<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCountryStore } from '@/stores/country';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import Country from '@/models/Country';

const emit = defineEmits(['update:newCountry', 'saved', 'editTabUnmunted', 'editTabMounted']);
const toast = useToast();
const router = useRouter();
const countryStore = useCountryStore();
const { newCountry, fb } = storeToRefs(countryStore);

const statusOptions = ref([
    { label: 'Active', value: 1 },
    { label: 'Inactive', value: 0 },
]);

onMounted(async () => {
    emit('editTabMounted');
});

onUnmounted(() => {
    emit('editTabUnmunted');
});
</script>

<template>
    <Fluid class="flex flex-col md:flex-row gap-8 mb-20">
        <div class="w-full mt-3">
            <div class="flex flex-col gap-6">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Add Country</h3>
                <div class="grid grid-cols-12 gap-2">
                    <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText 
                            class="text-lg w-full" 
                            id="name" 
                            type="text" 
                            v-model="newCountry.name" 
                            placeholder="Name" 
                            :class="{ 'p-invalid': fb.errors['country.create']?.name }"
                        />
                        <Message v-if="fb.errors['country.create']?.name" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors['country.create']?.name" :key="error" class="flex flex-col">
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
                            :class="{ 'p-invalid': fb.errors['country.create']?.iso_code_2 }"
                        />
                        <Message v-if="fb.errors['country.create']?.iso_code_2" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors['country.create']?.iso_code_2" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
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
                            :class="{ 'p-invalid': fb.errors['country.create']?.iso_code_3 }"
                        />
                        <Message v-if="fb.errors['country.create']?.iso_code_3" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors['country.create']?.iso_code_3" :key="error" class="flex flex-col">
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