<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useSubscriptionStatusStore } from '../stores/subscriptionStatus';
import { storeToRefs } from 'pinia';
import SubscriptionStatus from '../models/SubscriptionStatus';
import { useLanguageStore } from '../stores/language';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const router = useRouter();
const route = useRoute();
const subscriptionStatusStore = useSubscriptionStatusStore();
const languageStore = useLanguageStore();
const subscriptionStatus = ref(new SubscriptionStatus());
const {languages} = storeToRefs(languageStore);
const {fb} = storeToRefs(subscriptionStatusStore);

const subscriptionStatusId = route.params.id;

const isLoading = computed(() => {
    return fb.value.loading === true;
});

const goToSubscriptionStatusList = () => {
    router.push('/configuration/settings/subscription-statuses');
};

onMounted(async () => {
    try {
        languageStore.fetchLanguages();
        const fetchedSubscriptionStatus = await subscriptionStatusStore.findSubscriptionStatusById(subscriptionStatusId);
        subscriptionStatus.value = new SubscriptionStatus(fetchedSubscriptionStatus);
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load subscription status details. Please try again.',
            life: 3000
        });
        goToSubscriptionStatusList();
    }
});

const updateSubscriptionStatus = async () => {
    try {
        await subscriptionStatusStore.updateSubscriptionStatus(subscriptionStatusId, subscriptionStatus.value);
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Subscription status updated successfully',
            life: 3000
        });
        goToSubscriptionStatusList();
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update subscription status. Please try again.',
            life: 3000
        });
    }
};


</script>

<template>
    <div class="flex justify-end gap-2 mb-6">
        <Button 
            icon="pi pi-arrow-left"
            label="Subscription Status List"
            severity="secondary"
            @click="goToSubscriptionStatusList"
            class="p-button-md"
        />
        <Button 
            icon="pi pi-save"
            label="Save"
            severity="primary"
            @click="updateSubscriptionStatus"
            class="p-button-md"
        />
    </div>
    <Fluid class="flex flex-col md:flex-row gap-8 mb-20 border-t pt-6">
        <div class="w-full mt-3">
            <div class="flex flex-col gap-6">
                <div class="grid grid-cols-12 gap-2">
                    <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <IconField>
                            <InputText 
                            v-model="subscriptionStatus.name" 
                            variant="filled"  
                            class="text-lg" 
                            placeholder="loading..."
                            id="name" />
                            <InputIcon v-if="fb.loading.subscriptionStatus" class="pi pi-spin pi-spinner" />
                        </IconField>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <Select v-model="subscriptionStatus.language_id" :options="languages" optionLabel="name" optionValue="language_id" placeholder="Select a Language" class="w-full md:w-56 text-lg" />
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
    color: #767779 !important;
    opacity: 1;
    font-size: 1.2rem;
}
</style> 