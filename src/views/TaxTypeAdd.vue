<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useTaxTypeStore } from '../stores/taxType';
import { storeToRefs } from 'pinia';
import TaxType from '@/models/TaxType';
const router = useRouter();
const toast = useToast();
const newTaxType = ref(new TaxType());
const taxTypeStore = useTaxTypeStore();
const { taxTypes, fb } = storeToRefs(taxTypeStore);

const isLoading = computed(() => {
    return fb.value.loading === true;
});

const goToTaxTypeList = () => {
    router.push('/configuration/settings/tax-types');
};

const saveTaxType = async () => {
    try {
        await taxTypeStore.createTaxType(newTaxType.value);
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Tax type created successfully',
            life: 3000
        });
        goToTaxTypeList();
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create tax type. Please try again.',
            life: 3000
        });
    }
};

</script>

<template>
    <div class="flex justify-end gap-2 mb-6">
        <Button 
            icon="pi pi-arrow-left"
            label="Tax Type List"
            severity="secondary"
            @click="goToTaxTypeList"
            class="p-button-md"
        />
        <Button 
            icon="pi pi-save"
            label="Save"
            severity="primary"
            @click="saveTaxType"
            class="p-button-md"
        />
    </div>
    <Fluid class="flex flex-col md:flex-row gap-8 mb-20">
        <div class="w-full">
            
            <div class="flex flex-col gap-6">

                <div class="grid grid-cols-12 gap-2">
                    <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText v-model="newTaxType.name" class="text-lg" id="name" type="text" placeholder="Name" />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="content" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Content</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText v-model="newTaxType.content" class="text-lg" id="content" type="text" placeholder="Content" />
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
