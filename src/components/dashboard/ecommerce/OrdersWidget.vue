<script setup>
import { ref, watch, onMounted, computed } from 'vue';

const props = defineProps({
    fb: {
        type: Object,
        required: false
    },
    recentActivities: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['show-recent-activities']);

const showRecentActivities = () => {
    emit('show-recent-activities', props.recentActivities);
};

const randomColor = (customer_name) => {
    const colors = ['#007bff', '#28a745', '#dc3545', '#ffc107', '#6f42c1', '#e83e8c', '#fd7e14', '#6c757d', '#343a40', '#1a1a1a', '#ffffff','#4a4a4a','#999999','#666666','#333333','#000000','#b3b3b3','#d9d9d9','#f2f2f2'];
    const index = Math.abs(customer_name.length) % colors.length;
    return colors[index];
};
</script>

<template>
    <div 
    :loading="fb.loading['dashboard.recent-activities-widget']" 
    class="card !mb-0 flex-1 min-w-[25rem] !p-6 border border-surface rounded-2xl">
        <div class="flex items-center justify-between">
            <span class="label-medium text-surface-950 dark:text-surface-0">Pinboards</span>
            <Button
                @click="showRecentActivities"
                label="See All"
                severity="secondary"
                outlined
                :icon="fb.loading['dashboard.see-all-recent-activities'] ? 'pi pi-spinner pi-spin' : 'pi pi-chevron-right'"
                iconPos="right"
                class="!text-surface-950 dark:!text-surface-0 !px-2 !py-1.5 !rounded-lg !label-xsmall"
                :pt="{
                    icon: {
                        class: '!text-xs'
                    }
                }"
            />
        </div>
        <div class="flex flex-col mt-8">
            <template v-for="(item, index) of recentActivities" :key="index">
                <div class="flex items-center gap-2">
                    <template v-if="item.avatar">
                        <img
                            class="w-13 h-13 rounded-lg object-cover border border-surface-200 dark:border-surface-800"
                            :src="item.avatar"
                            alt="Customer Photo"
                            style="width: 50px; height: 50px;"
                        />
                    </template>
                    <template v-else>
                        <div
                            class="w-13 h-13 rounded-lg flex items-center justify-center text-white text-xl font-semibold border border-surface-200 dark:border-surface-800"
                            :style="{
                                width: '50px',
                                height: '50px',
                                backgroundColor: randomColor(item.customer_name)
                            }"
                        >
                            {{ (item.customer_name && item.customer_name[0] ? item.customer_name[0] : '?').toUpperCase() }}
                        </div>
                    </template>
                    <div class="flex-1">
                        <div class="label-small text-left text-surface-950 dark:text-surface-0">{{ item.customer_name }}</div>
                        <time class="mt-1 body-xsmall">{{ item.date }}</time>
                    </div>
                    <div class="flex flex-col items-end">
                        <Tag
                            :severity="{
                                'pending': 'warn',
                                'processing': 'info',
                                'processed': 'info',
                                'complete': 'success',
                                'canceled': 'danger',
                                'archived': 'secondary',
                                'requires_action': 'help'
                            }[item.status] || 'secondary'"
                            :value="item.status"
                            pt:label:class="!font-normal !text-sm !capitalize" 
                            class="!px-2 !py-1 !rounded-lg !label-xsmall" />
                        <span class="mt-1 body-xsmall">{{ item.amount }}</span>
                    </div>
                </div>
                <Divider v-if="index < recentActivities.length - 1" class="my-3.5" />
            </template>
        </div>
    </div>
</template>
