<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useShippingStatusStore } from '@/stores/shippingStatus';
import { storeToRefs } from 'pinia';
import ShippingStatus from '@/models/ShippingStatus';
import { useLanguageStore } from '@/stores/language';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const router = useRouter();
const route = useRoute();
const shippingStatusStore = useShippingStatusStore();
const languageStore = useLanguageStore();
const {shippingStatus} = storeToRefs(shippingStatusStore);
const {languages} = storeToRefs(languageStore);
const {fb} = storeToRefs(shippingStatusStore);

const shippingStatusId = route.params.id;
const emit = defineEmits(['update:stockStatus', 'saved', 'editTabUnmunted', 'editTabMounted']);
const props = defineProps(['id']);

onMounted(async () => {
    try {
        emit('editTabMounted');
        languageStore.fetchLanguages();
        await shippingStatusStore.findShippingStatusById(shippingStatusId);
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load shipping status details. Please try again.',
            life: 3000
        });
    }
});

onUnmounted(() => {
    emit('editTabUnmunted');
});
</script>

<template>

<div class="loading-overlay" v-if="fb.loading['shippingStatus.edit.' + (props.id ?? (route.params.id))]">
    <div class="flex justify-center items-center h-full spinner">
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
        <p class="mt-2">Loading shipping status details. Please wait.</p>
    </div>
</div>

    <div class="flex flex-col gap-6">
        <div class="flex gap-6">
            <div class="w-3/5 space-y-4">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">
                    Shipping Status Details
                </h3>
                <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                    <label class="col-span-12 md:col-span-2 flex items-center text-lg">Name</label>
                    <div class="col-span-12 md:col-span-10 py-2">
                        <InputText v-model="shippingStatus.name" :disabled="fb.loading['shippingStatus.update']" class="w-full text-lg border border-gray-200 rounded-md p-2" id="name" type="text" placeholder="Name" 
                        :class="{'p-invalid': fb.errors?.['shippingStatus.update.' + (props.id ?? (route.params.id))]?.name}" />
                        <Message v-if="fb.errors?.['shippingStatus.update.' + (props.id ?? (route.params.id))]?.name" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors?.['shippingStatus.update.' + (props.id ?? (route.params.id))]?.name" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                    <label class="col-span-12 md:col-span-2 flex items-center text-lg">Language</label>
                    <div class="col-span-12 md:col-span-10 py-2">
                        <Select v-model="shippingStatus.language_id" :options="languages" optionLabel="name" optionValue="language_id" :disabled="fb.loading['shippingStatus.update']" class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Select a Language" />
                    </div>
                </div>
            </div>
            <!--  -->
            <div class="w-2/5" v-if="shippingStatus?.shipping_status_id && shippingStatus?.name">
                <div class="border border-gray-200 rounded-md p-4">
                    <h4 class="text-lg font-medium mb-2">Preview Shipping Status</h4>
                    <p><strong>Name:</strong> {{ shippingStatus?.name }}</p>
                    <p><strong>Language:</strong> {{languages.find(language => language.language_id ===
                        shippingStatus?.language_id)?.name}}</p>
                </div>
                <div v-if="fb.errors['shippingStatus.update']" class="mt-4">
                    <h3 class="text-lg font-medium border-b border-gray-200 pb-2">
                        Errors
                    </h3>
                    <div v-html="fb.renderErrors('shippingStatus.update')"
                        class="border border-red-300 bg-red-50 text-red-700 rounded-md p-3"></div>
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
    color: #767779 !important;
    opacity: 1;
    font-size: 1.2rem;
}
</style> 