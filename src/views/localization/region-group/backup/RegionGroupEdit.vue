<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useRegionGroupStore } from '../stores/regionGroup';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import RegionGroup from '@/models/RegionGroup';

const toast = useToast();
const newRegionGroup = ref(new RegionGroup());
const router = useRouter();

const regionGroupStore = useRegionGroupStore();
const { fb } = storeToRefs(regionGroupStore);

const route = useRoute();
const regionGroupId = route.params.id;

const isLoading = computed(() => {
    return fb.value.loading === true;
});

const goToRegionGroupList = () => {
    router.push('/configuration/settings/region-groups');
};

onMounted(async () => {
    const regionGroup = await regionGroupStore.fetchRegionGroupById(regionGroupId);
    newRegionGroup.value = regionGroup;
})

const updateRegionGroup = async () => {
    try {
        await regionGroupStore.updateRegionGroup(regionGroupId, newRegionGroup.value);
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Region group updated successfully',
            life: 3000
        });
        goToRegionGroupList();
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update region group. Please try again.',
            life: 3000
        });
    }
};
</script>

<template>
    <div class="flex justify-end gap-2 mb-6">
        <Button 
            icon="pi pi-arrow-left"
            label="Region Group List"
            severity="secondary"
            @click="goToRegionGroupList"
            class="p-button-md"
        />
        <Button 
            icon="pi pi-save"
            label="Save"
            severity="primary"
            @click="updateRegionGroup"
            class="p-button-md"
        />
    </div>
    <Fluid class="flex flex-col md:flex-row gap-8 mb-20 border-t pt-6">
        <div class="w-full mt-3">
            <div class="flex flex-col gap-6">
                <div class="grid grid-cols-12 gap-2">
                    <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText class="text-lg" id="name" type="text" placeholder="Name" v-model="newRegionGroup.name" />
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