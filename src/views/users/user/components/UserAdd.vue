<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import { useRoleStore } from '@/stores/role';
import { Message } from 'primevue';
import MultiSelect from 'primevue/multiselect';

const emit = defineEmits(['update:user', 'saved', 'editTabUnmunted', 'editTabMounted']);

const userStore = useUserStore();
const { newUser, fb } = storeToRefs(userStore);
const roleStore = useRoleStore();
const { roles } = storeToRefs(roleStore);
const selectedRoleId = ref<number[]>([]);

const dropdownStatusValues = ref([
    { name: 'Active', code: 1 },
    { name: 'Inactive', code: 0 },
    { name: 'Pending', code: 2 },
    { name: 'Suspended', code: 3 }
]);

const roleOptions = (event: any) => {
    const selectedIds: number[] = event?.value ?? [];
    // map selected ids to role objects (keep name/display_name if available)
    newUser.value.userRole = selectedIds.map((id: number) => {
        return {
            model_id: 0,
            model_type: 'user',
            role_id: id,
        };
    });
};

onMounted(async () => {
    emit('editTabMounted');
    await roleStore.fetchRoles();
});

onUnmounted(() => {
    emit('editTabUnmunted');
});

</script>
<template>
    <Fluid class="flex flex-col md:flex-row gap-8 mb-20 pt-6">
        <div class="md:w-1/2">
            <div class="flex flex-col gap-6">
                <div class="grid grid-cols-12 gap-2">
                    <label for="firstname" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">First Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText class="w-full text-lg" id="firstname" type="text" placeholder="First Name" v-model="newUser.first_name" :class="{'p-invalid': fb.errors?.['user.create']?.first_name}" />
                        <Message v-if="fb.errors?.['user.create']?.first_name" severity="error" size="small" variant="title">
                                <span v-for="error in fb.errors?.['user.create']?.first_name" :key="error" class="flex flex-col">
                                    {{ error }}
                                </span>
                            </Message>
                    </div>
                </div>
                <div class="grid grid-cols-12 gap-2">
                    <label for="lastname" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Last Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText class="w-full text-lg" id="lastname" type="text" placeholder="Last Name" v-model="newUser.last_name" :class="{'p-invalid': fb.errors?.['user.create']?.last_name}" />
                        <Message v-if="fb.errors?.['user.create']?.last_name" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors?.['user.create']?.last_name" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>
                <div class="grid grid-cols-12 gap-2">
                    <label for="phone" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Phone Number</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText class="w-full text-lg" id="phone" type="text" placeholder="Phone Number" v-model="newUser.phone_number" :class="{'p-invalid': fb.errors?.['user.create']?.phone_number}" />
                        <Message v-if="fb.errors?.['user.create']?.phone_number" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors?.['user.create']?.phone_number" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>
                <div class="grid grid-cols-12 gap-2">
                    <label for="website" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Website</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText class="w-full text-lg" id="website" type="text" placeholder="Website" v-model="newUser.url" :class="{'p-invalid': fb.errors?.['user.create']?.url}" />
                        <Message v-if="fb.errors?.['user.create']?.url" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors?.['user.create']?.url" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>
                <div class="grid grid-cols-12 gap-2">
                    <label for="username" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Username</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText class="w-full text-lg" id="username" type="text" placeholder="Username" v-model="newUser.username" :class="{'p-invalid': fb.errors?.['user.create']?.username}" />
                        <Message v-if="fb.errors?.['user.create']?.username" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors?.['user.create']?.username" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>
                <div class="grid grid-cols-12 gap-2">
                    <label for="email" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Email</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText class="w-full text-lg" id="email" type="text" placeholder="Email" v-model="newUser.email" :class="{'p-invalid': fb.errors?.['user.create']?.email}" />
                        <Message v-if="fb.errors?.['user.create']?.email" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors?.['user.create']?.email" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>
                <div class="grid grid-cols-12 gap-2">
                    <label for="displayname" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Display Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText class="w-full text-lg" id="displayname" type="text" placeholder="Display Name" v-model="newUser.display_name" :class="{'p-invalid': fb.errors?.['user.create']?.display_name}" />
                        <Message v-if="fb.errors?.['user.create']?.display_name" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors?.['user.create']?.display_name" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>

                

            </div>
        </div>
        <div class="md:w-1/2">
            <div class="card flex flex-col gap-6">
                <div class="grid grid-cols-12 gap-2">
                    <label for="displayname" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Bio</label>
                    <div class="col-span-12 md:col-span-10">
                        <Textarea class="w-full text-lg" placeholder="Biography" :autoResize="true" rows="3" cols="30" v-model="newUser.bio" />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2 ">
                    <label for="role" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Status</label>
                    <div class="col-span-12 md:col-span-10">
                        <Select class="w-full text-lg" v-model="newUser.status" :options="dropdownStatusValues" optionLabel="name" optionValue="code" placeholder="Select" />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="password" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Password</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText class="w-full text-lg" id="password" type="password" placeholder="Password" v-model="newUser.password" :class="{'p-invalid': fb.errors?.['user.create']?.password}" />
                        <Message v-if="fb.errors?.['user.create']?.password" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors?.['user.create']?.password" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="role" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Role</label>
                    <div class="col-span-12 md:col-span-10">
                        <MultiSelect 
                            class="w-full text-lg" 
                            v-model="selectedRoleId" 
                            :options="roles" 
                            optionLabel="display_name" 
                            optionValue="role_id" 
                            placeholder="Select Role" 
                            checkbox 
                            @change="roleOptions($event)"
                        />
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>
