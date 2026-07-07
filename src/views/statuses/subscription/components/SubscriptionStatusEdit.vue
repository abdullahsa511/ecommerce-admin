<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useSubscriptionStatusStore } from '@/stores/subscriptionStatus';
import { storeToRefs } from 'pinia';
import SubscriptionStatus from '@/models/SubscriptionStatus';
import { useToast } from 'primevue/usetoast';

const emit = defineEmits(['update:subscriptionStatus', 'saved', 'editTabUnmunted', 'editTabMounted']);

const toast = useToast();
const route = useRoute();
const router = useRouter();
const subscriptionStatusStore = useSubscriptionStatusStore();
const { fb, subscriptionStatus: status} = storeToRefs(subscriptionStatusStore);

const props = defineProps(['id']);

onMounted(async () => {
    try {
        emit('editTabMounted');
        await subscriptionStatusStore.findSubscriptionStatusById(props.id);
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load subscription status details. Please try again.',
            life: 3000
        });
    }
});

onUnmounted(() => {
    emit('editTabUnmunted');
});

</script>

<template>

<div class="loading-overlay" v-if="fb.loading['subscriptionStatus.edit.' + (props.id ?? (route.params.id))]">
        <div class="flex justify-center items-center h-full spinner">
            <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
            <p class="mt-2">Loading subscription status details. Please wait.</p>
        </div>
    </div>

    <Fluid class="flex flex-col md:flex-row gap-8 mb-20">
        <div class="w-3/5 mt-3">
            <div class="flex flex-col gap-6">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">
                    Subscription Status Details
                </h3>
                <div class="grid grid-cols-12 gap-2">
                    <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <IconField>
                            <InputText 
                            v-model="status.name" 
                            variant="filled"  
                            class="text-lg" 
                            placeholder="Enter name"
                            id="name" :class="{'p-invalid': fb.errors['subscriptionStatus.update.' + props.id]?.name}" />
                            <Message v-if="fb.errors['subscriptionStatus.update.' + props.id]?.name" severity="error" size="small" variant="title">
                                <span v-for="error in fb.errors['subscriptionStatus.update.' + props.id]?.name" :key="error" class="flex flex-col">
                                    {{ error }}
                                </span>
                            </Message>
                            <InputIcon v-if="fb.loading['subscriptionStatus.update.' + props.id]" class="pi pi-spin pi-spinner" />
                        </IconField>
                    </div>
                </div>

            </div>
        </div>
           <!-- Right column: Preview Sidebar -->
        <div class="w-2/5" v-if="status?.subscription_status_id">
            <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Preview Subscription Status</h3>
            <div class="border border-gray-200 rounded-md p-4">
                <p><strong>Name:</strong> {{ status?.name }}</p>
                <p><strong>Language:</strong> {{ status?.language?.name }}</p>
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
    color: #767779 !important; /* gray-600 equivalent */
    opacity: 1;
    font-size: 1.2rem;
}

</style>
