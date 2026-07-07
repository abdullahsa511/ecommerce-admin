<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserGroupStore } from '@/stores/userGroup';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import UserGroup from '@/models/UserGroup.ts';
import Select from 'primevue/select';

const router = useRouter();
const toast = useToast();
const userGroupStore = useUserGroupStore();
const { fb, userGroup } = storeToRefs(userGroupStore);
const emit = defineEmits(['update:userGroup', 'saved', 'editTabUnmunted', 'editTabMounted']);
const isLoading = ref(false);
let loadingTimer = null;

onMounted(() => {
    emit('editTabMounted');
    if (router.currentRoute.value.path.includes('/users/groups/add')) {
        isLoading.value = true;
        // Briefly show loading overlay when arriving at the add page
        loadingTimer = setTimeout(() => {
            isLoading.value = false;
            loadingTimer = null;
        }, 500);
    }
    userGroupStore.fetchUserGroups();
});

onUnmounted(() => {
    emit('editTabUnmunted');
    if (loadingTimer !== null) {
        clearTimeout(loadingTimer);
        loadingTimer = null;
    }
});
const statusOptions = [
    { label: 'Active', value: 1 },
    { label: 'Inactive', value: 0 }
];
</script>

<template>
    <Fluid class="flex flex-col md:flex-row gap-8 mb-20 pt-6 mt-6 card">

        <div class="loading-overlay" v-if="isLoading">
            <div class="flex justify-center items-center h-full spinner">
                <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
                <p class="mt-2">Loading user group creation. Please wait.</p>
            </div>
        </div>
        
        <div class="w-full">
            <div class="flex flex-col gap-6">
                <div class="grid grid-cols-12 gap-2">
                    <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText 
                            class="text-lg w-full" 
                            id="name" 
                            type="text" 
                            v-model="userGroup.userGroupContent.name" 
                            placeholder="Name" 
                            :class="{'p-invalid': fb.errors?.['userGroup.create']?.name}"
                        />
                        <Message v-if="fb.errors?.['userGroup.create']?.name" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors?.['userGroup.create']?.name" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="content" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Content</label>
                    <div class="col-span-12 md:col-span-10">
                        <Textarea 
                            class="text-lg w-full" 
                            id="content" 
                            type="text" 
                            v-model="userGroup.userGroupContent.content" 
                            placeholder="Content" 
                            :class="{'p-invalid': fb.errors?.['userGroup.create']?.content}"
                        />
                        <Message v-if="fb.errors?.['userGroup.create']?.content" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors?.['userGroup.create']?.content" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="status" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Status</label>
                    <div class="col-span-12 md:col-span-10">
                        <Select 
                            v-model="userGroup.status"
                            :options="statusOptions"
                            optionLabel="label"
                            optionValue="value"
                            placeholder="Select Status"
                            class="w-full text-lg"
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
