<script setup>
import { ref, onMounted, computed, defineEmits } from 'vue';
import { useRouter } from 'vue-router';
import { useAdminStore } from '@/stores/admin';
import { useRoleStore } from '@/stores/role';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import Admin from '@/models/Admin';

const toast = useToast();
const router = useRouter();
const adminStore = useAdminStore();
const roleStore = useRoleStore();
const { newAdmin, fb } = storeToRefs(adminStore);
const { roles } = storeToRefs(roleStore);

const emit = defineEmits(['update:admin', 'saved']);

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
    newAdmin.value.site_access = '';
    try {
        await roleStore.fetchRoles();
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load roles. Please try again.',
            life: 3000
        });
    }
});
</script>

<template>
    <Fluid class="flex flex-col md:flex-row gap-8 mb-20">
        <div class="md:w-1/2">
            <div class="flex flex-col gap-6">
                <div class="grid grid-cols-12 gap-2">
                    <label for="firstname" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">First
                        Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText class="w-full text-lg" id="firstname" type="text" placeholder="First Name"
                            v-model="newAdmin.first_name" :class="{ 'p-invalid': fb.errors['admin.create']?.first_name }" />
                            <Message v-if="fb.errors['admin.create']?.first_name" severity="error" size="small" variant="title">
                                <span v-for="error in fb.errors['admin.create']?.first_name" :key="error" class="flex flex-col">
                                    {{ error }}
                                </span>
                            </Message>
                    </div>
                </div>
                <div class="grid grid-cols-12 gap-2">
                    <label for="lastname" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Last
                        Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText class="w-full text-lg" id="lastname" type="text" placeholder="Last Name"
                            v-model="newAdmin.last_name" :class="{ 'p-invalid': fb.errors['admin.create']?.last_name }" />
                            <Message v-if="fb.errors['admin.create']?.last_name" severity="error" size="small" variant="title">
                                <span v-for="error in fb.errors['admin.create']?.last_name" :key="error" class="flex flex-col">
                                    {{ error }}
                                </span>
                            </Message>
                    </div>
                </div>
                <div class="grid grid-cols-12 gap-2">
                    <label for="phone" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Phone
                        Number</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText class="w-full text-lg" id="phone" type="text" placeholder="Phone Number"
                            v-model="newAdmin.phone_number" :class="{ 'p-invalid': fb.errors['admin.create']?.phone_number }" />
                            <Message v-if="fb.errors['admin.create']?.phone_number" severity="error" size="small" variant="title">
                                <span v-for="error in fb.errors['admin.create']?.phone_number" :key="error" class="flex flex-col">
                                    {{ error }}
                                </span>
                            </Message>
                    </div>
                </div>
                <div class="grid grid-cols-12 gap-2">
                    <label for="website"
                        class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Website</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText class="w-full text-lg" id="website" type="text" placeholder="Website"
                            v-model="newAdmin.url" />
                    </div>
                </div>
                <div class="grid grid-cols-12 gap-2">
                    <label for="username"
                        class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Username</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText class="w-full text-lg" id="username" type="text" placeholder="Username"
                            v-model="newAdmin.username" :class="{ 'p-invalid': fb.errors['admin.create']?.username }" />
                            <Message v-if="fb.errors['admin.create']?.username" severity="error" size="small" variant="title">
                                <span v-for="error in fb.errors['admin.create']?.username" :key="error" class="flex flex-col">
                                    {{ error }}
                                </span>
                            </Message>
                    </div>
                </div>
                <div class="grid grid-cols-12 gap-2">
                    <label for="email" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Email</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText class="w-full text-lg" id="email" type="text" placeholder="Email"
                            v-model="newAdmin.email" :class="{ 'p-invalid': fb.errors['admin.create']?.email }" />
                            <Message v-if="fb.errors['admin.create']?.email" severity="error" size="small" variant="title">
                                <span v-for="error in fb.errors['admin.create']?.email" :key="error" class="flex flex-col">
                                    {{ error }}
                                </span>
                            </Message>
                    </div>
                </div>
                <div class="grid grid-cols-12 gap-2">
                    <label for="displayname" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Display
                        Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText class="w-full text-lg" id="displayname" type="text" placeholder="Display Name"
                            v-model="newAdmin.display_name" />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2 mt-20">
                    <label for="role" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Role</label>
                    <div class="col-span-12 md:col-span-10">
                        <Select class="w-full text-lg" v-model="selectedRole" :options="roleOptions" optionLabel="name"
                            placeholder="Select Role" />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="siteaccess" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Site
                        Access</label>
                    <div class="col-span-12 md:col-span-10">
                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="flex items-center">
                                <RadioButton id="checkOption1" name="siteaccess" value="all_sites"
                                    v-model="newAdmin.site_access" :class="{ 'p-invalid': fb.errors['admin.create']?.site_access }" />
                                <label for="checkOption1" class="ml-2">All Sites</label>
                                <Message v-if="fb.errors['admin.create']?.site_access" severity="error" size="small" variant="title">
                                    <span v-for="error in fb.errors['admin.create']?.site_access" :key="error" class="flex flex-col">
                                        {{ error }}
                                    </span>
                                </Message>
                            </div>
                            <div class="flex items-center">
                                <RadioButton id="checkOption2" name="siteaccess" value="default"
                                    v-model="newAdmin.site_access" />
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
                    <label for="displayname"
                        class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Bio</label>
                    <div class="col-span-12 md:col-span-10">
                        <Textarea class="w-full text-lg" placeholder="Biography" :autoResize="true" rows="3" cols="30"
                            v-model="newAdmin.bio" />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2 ">
                    <label for="role" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Status</label>
                    <div class="col-span-12 md:col-span-10">
                        <Select class="w-full text-lg" v-model="newAdmin.status" :options="dropdownStatusValues"
                            optionLabel="name" optionValue="code" placeholder="Select" />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="password"
                        class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Password</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText class="w-full text-lg" id="password" type="password" placeholder="Password"
                            v-model="newAdmin.password" :class="{ 'p-invalid': fb.errors['admin.create']?.password }" />
                            <Message v-if="fb.errors['admin.create']?.password" severity="error" size="small" variant="title">
                                <span v-for="error in fb.errors['admin.create']?.password" :key="error" class="flex flex-col">
                                    {{ error }}
                                </span>
                            </Message>
                    </div>
                </div>

            </div>
        </div>
    </Fluid>
</template>
