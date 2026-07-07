<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useLengthTypeStore } from '../stores/lengthType';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import LengthType from '@/models/LengthType';

const toast = useToast();
const router = useRouter();
const route = useRoute();
const lengthTypeStore = useLengthTypeStore();
const { fb } = storeToRefs(lengthTypeStore);

const lengthTypeId = route.params.id;
const newLengthType = ref(new LengthType());

const isLoading = computed(() => {
    return fb.value.loading === true;
});

onMounted(async () => {
    try {
        const fetchedLengthType = await lengthTypeStore.fetchLengthTypeById(lengthTypeId);
        console.log('Fetched LengthType:', fetchedLengthType);
        
        // Parse the lengthTypeContent JSON string
        let contentData = null;
        if (fetchedLengthType.lengthTypeContent) {
            try {
                contentData = JSON.parse(fetchedLengthType.lengthTypeContent);
                fetchedLengthType.name = contentData.name;
                fetchedLengthType.unit = contentData.unit;
            } catch (e) {
                console.error('Error parsing lengthTypeContent:', e);
            }
        }
        
        // // Set the form values
        // newLengthType.value = {
        //     ...fetchedLengthType,
        //     name: contentData?.name || '',
        //     unit: contentData?.unit || '',
        //     value: fetchedLengthType.value
        // };

        newLengthType.value = new LengthType(fetchedLengthType);
        
        console.log('Assigned LengthType:', newLengthType.value);
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load length type details. Please try again.',
            life: 3000
        });
        goToLengthTypeList();
    }
});

const goToLengthTypeList = () => {
    router.push('/configuration/settings/length');
};

const updateLengthType = async () => {
    try {
        await lengthTypeStore.updateLengthType(lengthTypeId, newLengthType.value);
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Length type updated successfully',
            life: 3000
        });
        goToLengthTypeList();
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update length type. Please try again.',
            life: 3000
        });
    }
};
</script>

<template>
    <div class="flex justify-end gap-2 mb-6">
        <Button 
            icon="pi pi-arrow-left"
            label="Length Type List"
            severity="secondary"
            @click="goToLengthTypeList"
            class="p-button-md"
        />
        <Button 
            icon="pi pi-save"
            label="Save"
            severity="primary"
            @click="updateLengthType"
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
                            v-model="newLengthType.name" 
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
                            v-model="newLengthType.unit" 
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
                            v-model="newLengthType.value" 
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