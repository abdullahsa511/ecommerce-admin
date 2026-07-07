<script setup>
import { ref, defineEmits, onMounted, onUnmounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useRoleStore } from '@/stores/role';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import Role from '@/models/Role';

const toast = useToast();
// const newRole = ref(new Role());
const router = useRouter();
const roleStore = useRoleStore();
const { roles, newRole, fb } = storeToRefs(roleStore);

const route = useRoute();
const roleId = route.params.id;

const emit = defineEmits(['editTabUnmunted', 'editTabMounted', 'saved']);

onMounted(async () => {
    emit('editTabMounted');
    await roleStore.fetchRoleById(roleId);
});

onUnmounted(() => {
    emit('editTabUnmunted');
});
</script>


<template>
    <div class="flex flex-col gap-6">
        <div class="flex gap-6">
            <!-- Left column: Attribute Form -->
            <div class="w-3/5 space-y-4">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">
                    Role Details
                </h3>

                <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                    <label class="col-span-12 md:col-span-2 flex items-center text-lg">
                        Name
                    </label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText v-model="newRole.name" 
                        :disabled="fb.loading['role.update.' + roleId]" 
                        class="w-full text-lg border border-gray-200 rounded-md p-2" 
                        id="name" type="text" 
                        placeholder="Name" :class="{ 'p-invalid': fb.errors['role.update.' + roleId]?.name }" />
                        <Message v-if="fb.errors['role.update.' + roleId]?.name" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors['role.update.' + roleId]?.name" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                    <label class="col-span-12 md:col-span-2 flex items-center text-lg">
                        Display Name
                    </label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText v-model="newRole.display_name" :disabled="fb.loading['role.update.' + roleId]" class="w-full text-lg border border-gray-200 rounded-md p-2" id="display_name" type="text" placeholder="Name" :class="{ 'p-invalid': fb.errors['role.update.' + roleId]?.display_name }" />
                        <Message v-if="fb.errors['role.update.' + roleId]?.display_name" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors['role.update.' + roleId]?.display_name" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>
            </div>
            <div class="w-2/5 space-y-4" v-if="newRole.role_id">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">
                    Preview Role
                </h3>
                <div class="border border-gray-200 rounded-md p-4">
                    <p><strong>Name:</strong> {{ newRole.name }}</p>
                    <p><strong>Display Name:</strong> {{ newRole.display_name }}</p>
                </div>
            </div>
        </div>
    </div>
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
