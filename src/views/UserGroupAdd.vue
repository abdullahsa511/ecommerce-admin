<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserGroupStore } from '../stores/userGroup';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import UserGroup from '@/models/UserGroup.ts';
import Dropdown from 'primevue/dropdown';

const toast = useToast();
const newUserGroup = ref(new UserGroup());
const router = useRouter();
const userGroupStore = useUserGroupStore();
const { fb } = storeToRefs(userGroupStore);

const statusOptions = [
    { label: 'Active', value: 1 },
    { label: 'Inactive', value: 0 }
];

const isLoading = computed(() => {
    return fb.value.loading === true;
});

onMounted(() => {
    userGroupStore.fetchUserGroups();
});

const goToUserGroupList = () => {
    router.push('/users/groups');
};

const saveUserGroup = async () => {
    try {
        await userGroupStore.createUserGroup(newUserGroup.value);
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User group created successfully',
            life: 3000
        });
        goToUserGroupList();
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create user group. Please try again.',
            life: 3000
        });
    }
};
</script>

<template>
    <div class="flex justify-end gap-2 mb-6">
        <Button 
            icon="pi pi-arrow-left"
            label="User Group List"
            severity="secondary"
            @click="goToUserGroupList"
            class="p-button-md"
        />
        <Button 
            icon="pi pi-save"
            label="Save"
            severity="primary"
            @click="saveUserGroup"
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
                            v-model="newUserGroup.userGroupContent.name" 
                            placeholder="Name" 
                        />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="content" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Content</label>
                    <div class="col-span-12 md:col-span-10">
                        <Textarea 
                            class="text-lg w-full" 
                            id="content" 
                            type="text" 
                            v-model="newUserGroup.userGroupContent.content" 
                            placeholder="Content" 
                        />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="status" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Status</label>
                    <div class="col-span-12 md:col-span-10">
                        <Dropdown 
                            v-model="newUserGroup.status"
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
