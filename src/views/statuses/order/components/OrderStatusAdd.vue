<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useOrderStatusStore } from '@/stores/orderStatus';
import { storeToRefs } from 'pinia';
import OrderStatus from '@/models/OrderStatus';
import { useLanguageStore } from '@/stores/language';
import { useToast } from 'primevue/usetoast';

const emit = defineEmits(['update:orderStatus', 'saved', 'editTabUnmunted', 'editTabMounted']);

const toast = useToast();

const orderStatusStore = useOrderStatusStore();
const languageStore = useLanguageStore();
const {languages} = storeToRefs(languageStore);
const {fb, orderStatus} = storeToRefs(orderStatusStore);

onMounted(() => {
    emit('editTabMounted');
    languageStore.fetchLanguages();
});

onUnmounted(() => {
    emit('editTabUnmunted');
});
</script>

<template>
    <Fluid class="flex flex-col md:flex-row gap-8 mb-20">
        <div class="w-3/5 mt-3">
            <div class="flex flex-col gap-6">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">
                    Order Status Details
                </h3>
                <div class="grid grid-cols-12 gap-2">
                    <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText 
                            v-model="orderStatus.name" 
                            variant="filled"  
                            class="text-lg" 
                            placeholder="Enter order status name"
                            id="name" 
                            :class="{'p-invalid': fb.errors['orderStatus.create']?.name}"
                            />
                        <Message v-if="fb.errors['orderStatus.create']?.name" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors['orderStatus.create']?.name" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>
                <div class="grid grid-cols-12 gap-2">
                    <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Language</label>
                    <div class="col-span-12 md:col-span-10">
                        <Select v-model="orderStatus.language_id" :options="languages" optionLabel="name" optionValue="language_id" placeholder="Select a Language" class="w-full md:w-56 text-lg" />
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>

<style scoped>
</style> 