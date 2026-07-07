<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useSubscriptionPlanStore } from '@/stores/subscriptionPlan';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import SubscriptionPlan from '@/models/SubscriptionPlan';

const emit = defineEmits(['update:subscriptionPlan', 'saved', 'editTabUnmunted', 'editTabMounted']);
const toast = useToast();
const router = useRouter();
const subscriptionPlanStore = useSubscriptionPlanStore();
const { newSubscriptionPlan, fb } = storeToRefs(subscriptionPlanStore);

onMounted(() => {
    emit('editTabMounted');
});

onUnmounted(() => {
    emit('editTabUnmunted');
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


</script>

<template>

    <Fluid class="flex flex-col md:flex-row gap-8 mb-20">
        <div class="w-full">
            <div class="flex flex-col gap-6">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">
                    Add New Subscription Plan
                </h3>
                <!-- Basic Info -->
                <div class="grid grid-cols-12 gap-2">
                    <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText class="text-lg w-full" id="name" type="text" v-model="newSubscriptionPlan.name" placeholder="Name" :class="{ 'p-invalid': fb.errors['subscriptionPlan.create']?.name }" />
                        <Message v-if="fb.errors['subscriptionPlan.create']?.name" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors['subscriptionPlan.create']?.name" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
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
                                <InputNumber class="text-lg w-full" id="recurring_length" v-model="newSubscriptionPlan.length" placeholder="Length" :class="{'border border-red-400 rounded-md': fb.errors['subscriptionPlan.create']?.length }" />
                                <Message v-if="fb.errors['subscriptionPlan.create']?.length" severity="error" size="small" variant="title">
                                    <span v-for="error in fb.errors['subscriptionPlan.create']?.length" :key="error" class="flex flex-col">
                                        {{ error }}
                                    </span>
                                </Message>
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
