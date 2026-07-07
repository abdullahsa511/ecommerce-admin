<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useWeightTypeStore } from '../stores/weightType';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import WeightType from '@/models/WeightType';

const toast = useToast();
const newWeightType = ref(new WeightType());
const router = useRouter();
const weightTypeStore = useWeightTypeStore();
const { fb } = storeToRefs(weightTypeStore);

const isLoading = computed(() => {
    return fb.value.loading === true;
});

onMounted(() => {
    weightTypeStore.fetchWeightTypes();
});

const goToWeightTypeList = () => {
    router.push('/configuration/settings/weight');
};

const saveWeightType = async () => {
    try {
        await weightTypeStore.createWeightType(newWeightType.value);
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Weight type created successfully',
            life: 3000
        });
        goToWeightTypeList();
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create weight type. Please try again.',
            life: 3000
        });
    }
};
</script>

<template>
    <div class="flex justify-end gap-2 mb-6">
        <Button 
            icon="pi pi-arrow-left"
            label="Weight Type List"
            severity="secondary"
            @click="goToWeightTypeList"
            class="p-button-md"
        />
        <Button 
            icon="pi pi-save"
            label="Save"
            severity="primary"
            @click="saveWeightType"
            class="p-button-md"
        />
    </div>
    <Fluid class="flex flex-col md:flex-row gap-8 mb-20">
        <div class="w-full">
            <div class="flex flex-col gap-6">
                <div class="grid grid-cols-12 gap-2">
                    <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText 
                            class="text-lg w-full" 
                            id="name" 
                            type="text" 
                            v-model="newWeightType.name" 
                            placeholder="Name" 
                        />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="unit" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Unit</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText 
                            class="text-lg w-full" 
                            id="unit" 
                            type="text" 
                            v-model="newWeightType.unit" 
                            placeholder="Unit" 
                        />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="value" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Value</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText 
                            class="text-lg w-full" 
                            id="value" 
                            type="text" 
                            v-model="newWeightType.value" 
                            placeholder="Value" 
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