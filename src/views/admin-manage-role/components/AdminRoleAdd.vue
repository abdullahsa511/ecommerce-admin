<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useRoleStore } from '@/stores/role';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import Role from '@/models/Role';

const toast = useToast();
const router = useRouter();
const roleStore = useRoleStore();
const { newRole, fb } = storeToRefs(roleStore);

const emit = defineEmits(['editTabUnmunted', 'editTabMounted', 'saved']);
onMounted(() => {
    emit('editTabMounted');
    roleStore.fetchRoles();
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
                    <!-- Attribute Name -->
                    <label class="col-span-12 md:col-span-2 flex items-center text-lg">
                        Name
                    </label>
                    <div class="col-span-12 md:col-span-10 py-2">
                        <InputText v-model="newRole.name" :disabled="fb.loading['role.create']"
                            class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter role name" :class="{ 'p-invalid': fb.errors['role.create']?.name }" />
                            <Message v-if="fb.errors['role.create']?.name" severity="error" size="small" variant="title">
                                <span v-for="error in fb.errors['role.create']?.name" :key="error" class="flex flex-col">
                                    {{ error }}
                                </span>
                            </Message>
                    </div>

                    <!-- Display Name -->
                    <label class="col-span-12 md:col-span-2 flex items-center text-lg">
                        Display Name
                    </label>
                    <div class="col-span-12 md:col-span-10 py-2">
                        <InputText v-model="newRole.display_name" :disabled="fb.loading['role.create']"
                            class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter role display name" :class="{ 'p-invalid': fb.errors['role.create']?.display_name }" />
                            <Message v-if="fb.errors['role.create']?.display_name" severity="error" size="small" variant="title">
                                <span v-for="error in fb.errors['role.create']?.display_name" :key="error" class="flex flex-col">
                                    {{ error }}
                                </span>
                            </Message>
                    </div>
                </div>
            </div>
            <!-- <div class="w-2/5 space-y-4" v-if="fb.errors['role.create']">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">
                    Errors
                </h3>
                <div v-html="fb.renderErrors('role.create')" class="border border-red-300 bg-red-50 text-red-700 rounded-md p-3"></div>
            </div> -->
        </div>
    </div>
</template>

<style scoped>
label {
    font-size: 1.2rem;
}

:deep(input::placeholder),
:deep(textarea::placeholder) {
    color: #767779 !important;
    /* gray-600 equivalent */
    opacity: 1;
    font-size: 1.2rem;
}
</style>
