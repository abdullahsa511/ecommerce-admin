<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { usePaymentStatusStore } from '@/stores/paymentStatus';
import { storeToRefs } from 'pinia';
import PaymentStatus from '@/models/PaymentStatus';
import { useLanguageStore } from '@/stores/language';
import { useToast } from 'primevue/usetoast';

const emit = defineEmits(['update:paymentStatus', 'saved', 'editTabUnmunted', 'editTabMounted']);

const toast = useToast();

const router = useRouter();
const paymentStatusStore = usePaymentStatusStore();
const languageStore = useLanguageStore();
const {languages} = storeToRefs(languageStore);
const {fb, paymentStatus} = storeToRefs(paymentStatusStore);

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
                    Payment Status Details
                </h3>
                <div class="grid grid-cols-12 gap-2">
                    <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText class="text-lg" id="name" type="text" placeholder="Name" v-model="paymentStatus.name" 
                        :class="{'p-invalid': fb.errors['paymentStatus.create']?.name}"
                        />
                        <Message v-if="fb.errors['paymentStatus.create']?.name" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors['paymentStatus.create']?.name" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>
                <div class="grid grid-cols-12 gap-2">
                    <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Language</label>
                    <div class="col-span-12 md:col-span-10">
                        <Select v-model="paymentStatus.language_id" :options="languages" optionLabel="name" optionValue="language_id" placeholder="Select a Language" class="w-full md:w-56 text-lg" />
                    </div>
                </div>

            </div>
        </div>
    </Fluid>
</template>

<style scoped>
</style>
