<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import InputText from 'primevue/inputtext';
import { storeToRefs } from 'pinia';
import { useSubscriptionStore } from '@/stores/subscription';

// Props passed from parent


const emit = defineEmits(['update:subscription', 'saved', 'editTabUnmunted', 'editTabMounted']);

// Local refs
// const selectedGroup = ref<number | null>(null);
const route = useRoute();
const subscriptionStore = useSubscriptionStore();

const { subscription } = storeToRefs(subscriptionStore);



const statusOptions = [
    { label: 'Enabled', code: 1 },
    { label: 'Disabled', code: 0 },
];



onMounted(async () => {
    emit('editTabMounted');
    if (route.params.id) {
        await subscriptionStore.getSubscriptionById(route.params.id as string);
    }
    // if (postTagGroup.value.postTag_group_id) {
    //   selectedGroup.value = postTagGroup.value.postTag_group_id;
    // }

});



onUnmounted(() => {
    emit('editTabUnmunted');
});
</script>

<template>
    <div class="flex flex-col gap-6">
        <div class="flex flex-col md:flex-row gap-6">
            <!-- Left column: Subscription Form -->
            <div class="sm:w-full md:w-3/5 space-y-4">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Edit Subscription</h3>

                <div class="grid grid-cols-12 gap-2">
                    <label for="user" class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">User
                        Name</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText class="text-lg w-full" id="user" type="text" v-model="subscription.user"
                            placeholder="Name" />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="reason"
                        class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Reason</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText class="text-lg w-full" id="reason" type="text" v-model="subscription.reason"
                            placeholder="Reason" />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="status" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Status</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <Dropdown v-model="subscription.status" :options="statusOptions" optionLabel="label"
                            optionValue="code" placeholder="Select Status" class="w-full text-lg" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Optional custom styles */
</style>
