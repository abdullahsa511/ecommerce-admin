<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useSubscriptionPlanStore } from '../stores/subscriptionPlan';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import SubscriptionPlan from '@/models/SubscriptionPlan';
import { useRoute } from 'vue-router';

const toast = useToast();
const route = useRoute();
const newSubscriptionPlan = ref(new SubscriptionPlan());
const router = useRouter();
const subscriptionPlanStore = useSubscriptionPlanStore();
const { subscriptionPlan, fb } = storeToRefs(subscriptionPlanStore);
const subscriptionPlanId = route.params.id;

const isLoading = computed(() => {
    return fb.value.loading === true;
});

onMounted(async () => {
    try {
        const fetchedSubscriptionPlan = await subscriptionPlanStore.fetchSubscriptionPlanById(subscriptionPlanId);
        console.log('Fetched SubscriptionPlan:', fetchedSubscriptionPlan);
        
        // Parse the subscriptionPlanContent JSON string if it exists
        if (fetchedSubscriptionPlan.subscriptionPlanContent) {
            const contentData = JSON.parse(fetchedSubscriptionPlan.subscriptionPlanContent);
            fetchedSubscriptionPlan.name = contentData.name;
        }
        
        newSubscriptionPlan.value = new SubscriptionPlan(fetchedSubscriptionPlan);
        console.log('Assigned SubscriptionPlan:', newSubscriptionPlan.value);
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load subscription plan details. Please try again.',
            life: 3000
        });
        goToSubscriptionPlanList();
    }
});



const statusOptions = ref([
    { name: 'Active', code: 1 },
    { name: 'Inactive', code: 0 }
]);

const periodOptions = ref([
    { name: 'Day', code: 'day' },
    { name: 'Week', code: 'week' },
    { name: 'Month', code: 'month' },
    { name: 'Year', code: 'year' }
]);



const goToSubscriptionList = () => {
    router.push('/ecommerce/sales/subscriptions');
};

const updateSubscription = async () => {
    try {
        await subscriptionPlanStore.updateSubscriptionPlan(subscriptionPlanId, newSubscriptionPlan.value);
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Subscription updated successfully',
            life: 3000
        });
        goToSubscriptionList();
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update subscription. Please try again.',
            life: 3000
        });
    }
};

</script>

<template>
    <div class="flex justify-end gap-2 mb-6">
        <Button 
            icon="pi pi-arrow-left"
            label="Return to Subscription"
            severity="secondary"
            @click="goToSubscriptionList"
            class="p-button-md"
        />
        <Button 
            icon="pi pi-save"
            label="Save"
            severity="primary"
            @click="updateSubscription"
            class="p-button-md"
        />
    </div>
    <Fluid class="flex flex-col md:flex-row gap-8 mb-20">
        <div class="w-full">
            <div class="flex flex-col gap-6">
                <!-- Basic Info -->
                <div class="grid grid-cols-12 gap-2">
                    <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText class="text-lg w-full" id="name" type="text" v-model="newSubscriptionPlan.name" placeholder="Name" />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="status" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Status</label>
                    <div class="col-span-12 md:col-span-10">
                        <Select class="text-lg w-full" id="status" v-model="newSubscriptionPlan.status" :options="statusOptions" optionLabel="name" optionValue="code" placeholder="Select Status" />
                    </div>
                </div>

                <!-- Recurring Section -->
                <div class="border-t pt-6 mt-4">
                    <h2 class="text-xl font-semibold mb-6">Recurring</h2>
                    <div class="flex flex-col gap-6">
                        <div class="grid grid-cols-12 gap-2">
                            <label for="recurring_period" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Period</label>
                            <div class="col-span-12 md:col-span-10">
                                <Select class="text-lg w-full" id="recurring_period" v-model="newSubscriptionPlan.period" :options="periodOptions" optionLabel="name" optionValue="code" placeholder="Select Period" />
                            </div>
                        </div>

                        <div class="grid grid-cols-12 gap-2">
                            <label for="recurring_length" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Length</label>
                            <div class="col-span-12 md:col-span-10">
                                <InputNumber class="text-lg w-full" id="recurring_length" v-model="newSubscriptionPlan.length" placeholder="Length" />
                            </div>
                        </div>

                        <div class="grid grid-cols-12 gap-2">
                            <label for="recurring_cycle" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Cycle</label>
                            <div class="col-span-12 md:col-span-10">
                                <InputNumber class="text-lg w-full" id="recurring_cycle" v-model="newSubscriptionPlan.cycle" placeholder="Cycle" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Trial Section -->
                <div class="border-t pt-6 mt-4">
                    <h2 class="text-xl font-semibold mb-6">Trial</h2>
                    <div class="flex flex-col gap-6">
                        <div class="grid grid-cols-12 gap-2">
                            <label for="trial_period" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Period</label>
                            <div class="col-span-12 md:col-span-10">
                                <Select class="text-lg w-full" id="trial_period" v-model="newSubscriptionPlan.trial_period" :options="periodOptions" optionLabel="name" optionValue="code" placeholder="Select Period" />
                            </div>
                        </div>

                        <div class="grid grid-cols-12 gap-2">
                            <label for="trial_length" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Length</label>
                            <div class="col-span-12 md:col-span-10">
                                <InputNumber class="text-lg w-full" id="trial_length" v-model="newSubscriptionPlan.trial_length" placeholder="Length" />
                            </div>
                        </div>

                        <div class="grid grid-cols-12 gap-2">
                            <label for="trial_cycle" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Cycle</label>
                            <div class="col-span-12 md:col-span-10">
                                <InputNumber class="text-lg w-full" id="trial_cycle" v-model="newSubscriptionPlan.trial_cycle" placeholder="Cycle" />
                            </div>
                        </div>

                        <div class="grid grid-cols-12 gap-2">
                            <label for="trial_status" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Trial Status</label>
                            <div class="col-span-12 md:col-span-10">
                                <Select class="text-lg w-full" id="trial_status" v-model="newSubscriptionPlan.trial_status" :options="statusOptions" optionLabel="name" optionValue="code" placeholder="Select Status" />
                            </div>
                        </div>
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
