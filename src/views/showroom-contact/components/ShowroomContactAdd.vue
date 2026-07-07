<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useShowroomContactStore } from '@/stores/showroomContact';
import { useMediaStore } from '@/stores/media';


const emit = defineEmits(['update:showroomContact', 'saved', 'editTabUnmunted', 'editTabMounted']);

const route = useRoute();
const showroomContactStore = useShowroomContactStore();
const { showroomContact, fb, showrooms } = storeToRefs(showroomContactStore);

onMounted(async () => {
    emit('editTabMounted');
    showroomContactStore.resetShowroomContact();
    await showroomContactStore.getShowrooms();
});

onUnmounted(() => {
    emit('editTabUnmunted');
});
</script>

<template>
    <div class="flex flex-col gap-6">
        <div class="loading-overlay border-2" v-if="fb.loading['showroomContact.show.' + route.params.id]">
            <div class="flex justify-center items-center h-full spinner">
                <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
                <p class="mt-2">Loading showroom contact details. Please wait.</p>
            </div>
        </div>
        <div class="flex flex-col md:flex-row gap-6">
            <!-- Left column: Showroom Contact Form -->
            <div class="sm:w-full md:w-3/5 space-y-4">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Add Showroom Contact</h3>

                <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                    <!-- Name -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">
                        Name
                    </label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="showroomContact.name"
                            class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter showroom contact name" :class="{'p-invalid': fb.errors?.['showroomContact.create']?.name}" />

                        <Message v-if="fb.errors?.['showroomContact.create']?.name" severity="error" size="small"
                            variant="title">
                            <span v-for="error in fb.errors?.['showroomContact.create']?.name" :key="error"
                                class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>

                    <!-- Showroom -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Showroom</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <Select v-model="showroomContact.showroom_id" :options="showrooms" optionLabel="title"
                            optionValue="showrooms_id" class="w-full text-lg border border-gray-200"
                            placeholder="Select showroom" :class="{'p-invalid': fb.errors?.['showroomContact.create']?.showroom_id}" />

                            <Message v-if="fb.errors?.['showroomContact.create']?.showroom_id" severity="error" size="small"
                            variant="title">
                            <span v-for="error in fb.errors?.['showroomContact.create']?.showroom_id" :key="error"
                                class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                    <!-- Showroom Contact Email -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Email</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="showroomContact.email"
                            class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter showroom contact email" />
                    </div>

                    <!-- Phone -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Phone</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="showroomContact.phone"
                            class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter showroom contact phone" />
                    </div>
                    <!-- designation -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Designation</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="showroomContact.designation"
                            class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter showroom contact designation" />
                    </div>
                    <!-- Sort Order -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Sort Order</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="showroomContact.sort_order as any" type="number"
                            class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter sort order" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Optional custom styles */
</style>
