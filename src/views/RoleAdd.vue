<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useRoleStore } from '../stores/role';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import Role from '@/models/Role';

const toast = useToast();
const newRole = ref(new Role());
const router = useRouter();
const roleStore = useRoleStore();
const { roles, fb } = storeToRefs(roleStore);

const isLoading = computed(() => {
    return fb.value.loading === true;
});

onMounted(() => {
    roleStore.fetchRoles();
});

const goToRoleList = () => {
    router.push('/configuration/settings/manage-roles');
};

const saveRole = async () => {
    try {
        await roleStore.createRole(newRole.value);
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Role created successfully',
            life: 3000
        });
        goToRoleList();
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create role. Please try again.',
            life: 3000
        });
    }
};


</script>

<template>
    <div class="flex justify-end gap-2 mb-6">
        <Button 
            icon="pi pi-arrow-left"
            label="Role List"
            severity="secondary"
            @click="goToRoleList"
            class="p-button-md"
        />
        <Button 
            icon="pi pi-save"
            label="Save"
            severity="primary"
            @click="saveRole"
            class="p-button-md"
        />
    </div>
    <Fluid class="flex flex-col md:flex-row gap-8 mb-20">
        <div class="w-full">
            
            <div class="flex flex-col gap-6">

                <div class="grid grid-cols-12 gap-2">
                    <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText v-model="newRole.name" class="text-lg" id="name" type="text" placeholder="Name" />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="display_name" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Display Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText v-model="newRole.display_name" class="text-lg" id="display_name" type="text" placeholder="Name" />
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
