<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAdminStore } from '../stores/admin';
import { useRoleStore } from '../stores/role';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import Admin from '@/models/Admin';

const toast = useToast();
const newAdmin = ref(new Admin());
const router = useRouter();
const adminStore = useAdminStore();
const roleStore = useRoleStore();
const { admins, fb } = storeToRefs(adminStore);
const { roles } = storeToRefs(roleStore);

const route = useRoute();
const adminId = route.params.id;

// Initialize site_access as a string
newAdmin.value.site_access = '';

const isLoading = computed(() => {
    return fb.value.loading === true;
});

const dropdownStatusValues = ref([
    { name: 'Active', code: 1 },
    { name: 'Inactive', code: 0 },
    { name: 'Pending', code: 2 },
    { name: 'Suspended', code: 3 }
]);

const roleOptions = computed(() => {
    return roles.value.map(role => ({
        name: role.name,
        code: role.role_id
    }));
});

// Add a computed property for the selected role
const selectedRole = computed({
    get: () => {
        return roleOptions.value.find(role => role.code === newAdmin.value.role_id) || null;
    },
    set: (value) => {
        newAdmin.value.role_id = value?.code || null;
    }
});

const avatarFile = ref(null);
const fileInput = ref(null);

const selectImage = () => {
    fileInput.value.click();
};

const onFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        avatarFile.value = file;
    }
};

const removeImage = () => {
    avatarFile.value = null;
    if (fileInput.value) {
        fileInput.value.value = '';
    }
};

onMounted(async () => {
    try {
        await roleStore.fetchRoles();

        const fetchedAdmin = await adminStore.fetchAdminById(adminId);
        newAdmin.value = new Admin(fetchedAdmin);
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load roles. Please try again.',
            life: 3000
        });
    }
});

const goToAdminList = () => {
    router.push('/configuration/settings/admin-list');
};

const saveAdmin = async () => {
    try {
        // Convert site access array to comma-separated string
        if (Array.isArray(newAdmin.value.site_access)) {
            newAdmin.value.site_access = newAdmin.value.site_access.join(',');
        }
        
        await adminStore.updateAdmin(adminId, newAdmin.value);
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Admin updated successfully',
            life: 3000
        });
        goToAdminList();
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update admin. Please try again.',
            life: 3000
        });
    }
};


</script>

<template>
    <div class="flex justify-end gap-2 mb-6">
        <Button 
            icon="pi pi-arrow-left"
            label="Admin List"
            severity="secondary"
            @click="goToAdminList"
            class="p-button-md"
        />
        <Button 
            icon="pi pi-save"
            label="Save"
            severity="primary"
            @click="saveAdmin"
            class="p-button-md"
        />
    </div>
    <Fluid class="flex flex-col md:flex-row gap-8 mb-20">
        <div class="md:w-1/2">
            <div class="flex flex-col gap-6">

                <div class="grid grid-cols-12 gap-2">
                    <label for="firstname" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">First Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText id="firstname" type="text" placeholder="First Name" v-model="newAdmin.first_name" />
                    </div>
                </div>
                <div class="grid grid-cols-12 gap-2">
                    <label for="lastname" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Last Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText id="lastname" type="text" placeholder="Last Name" v-model="newAdmin.last_name" />
                    </div>
                </div>
                <div class="grid grid-cols-12 gap-2">
                    <label for="phone" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Phone Number</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText id="phone" type="text" placeholder="Phone Number" v-model="newAdmin.phone_number" />
                    </div>
                </div>
                <div class="grid grid-cols-12 gap-2">
                    <label for="website" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Website</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText id="website" type="text" placeholder="Website" v-model="newAdmin.url" />
                    </div>
                </div>
                <div class="grid grid-cols-12 gap-2">
                    <label for="username" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Username</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText id="username" type="text" placeholder="Username" v-model="newAdmin.username" />
                    </div>
                </div>
                <div class="grid grid-cols-12 gap-2">
                    <label for="email" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Email</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText id="email" type="text" placeholder="Email" v-model="newAdmin.email" />
                    </div>
                </div>
                <div class="grid grid-cols-12 gap-2">
                    <label for="displayname" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Display Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText id="displayname" type="text" placeholder="Display Name" v-model="newAdmin.display_name" />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2 mt-20">
                    <label for="role" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Role</label>
                    <div class="col-span-12 md:col-span-10">
                        <Select 
                            v-model="selectedRole" 
                            :options="roleOptions" 
                            optionLabel="name" 
                            placeholder="Select Role"
                        />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="siteaccess" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Site Access</label>
                    <div class="col-span-12 md:col-span-10">
                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="flex items-center">
                                <RadioButton 
                                    id="checkOption1" 
                                    name="siteaccess" 
                                    value="all_sites" 
                                    v-model="newAdmin.site_access"
                                />
                                <label for="checkOption1" class="ml-2">All Sites</label>
                            </div>
                            <div class="flex items-center">
                                <RadioButton 
                                    id="checkOption2" 
                                    name="siteaccess" 
                                    value="default" 
                                    v-model="newAdmin.site_access"
                                />
                                <label for="checkOption2" class="ml-2">Default</label>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <div class="md:w-1/2">

            <div class="card flex flex-col gap-6">

                <div class="grid grid-cols-12 gap-2">
                    <label for="avatar" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Avatar</label>
                    <div class="col-span-12 md:col-span-10 flex flex-col items-start">
                        <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center">
                            <img v-if="avatarFile" :src="URL.createObjectURL(avatarFile)" alt="Avatar" class="w-24 h-24 object-cover mb-2" />
                            <div v-else class="text-gray-400">
                                <i class="pi pi-camera" style="font-size: 2rem;"></i>
                            </div>
                            <Button label="Set Image" @click="selectImage" />
                            <Button v-if="avatarFile" label="Remove" class="mt-2" @click="removeImage" />
                        </div>
                        <input type="file" ref="fileInput" @change="onFileChange" accept="image/*" class="hidden" />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="displayname" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Bio</label>
                    <div class="col-span-12 md:col-span-10">
                        <Textarea placeholder="Biography" :autoResize="true" rows="3" cols="30" v-model="newAdmin.bio" />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2 ">
                    <label for="role" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Status</label>
                    <div class="col-span-12 md:col-span-10">
                        <Select v-model="newAdmin.status" :options="dropdownStatusValues" optionLabel="name" optionValue="code" placeholder="Select" />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="password" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Password</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText id="password" type="password" placeholder="Password" v-model="newAdmin.password" />
                    </div>
                </div>
                
            </div>
        </div>
    </Fluid>
</template>
