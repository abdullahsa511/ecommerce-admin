<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import { mediaUrl } from '@/utils/mediaUrl';

const props = defineProps({
    fb: {
        type: Object,
        required: false
    },
    seeAllRecentActivities: {
        type: Object,
        required: true
    }
});

const imageUrl = (pinboard_item) => {
    if (Array.isArray(pinboard_item) && pinboard_item.length > 0) {
        const firstItem = pinboard_item[0];
        if (Array.isArray(firstItem.image) && firstItem.image.length > 0) {
            return mediaUrl(firstItem.image[0]?.objectURL ?? '');
        }
    }
    return '';
};

const productName = (pinboard_item) => {
    if (Array.isArray(pinboard_item) && pinboard_item.length > 0) {
        const firstItem = pinboard_item[0];
        return firstItem?.name ?? firstItem?.product_code;
    }
    return '';
};

</script>

<template>
    <div :loading="fb.loading['dashboard.see-all-recent-activities']" 
    v-for="(item, index) of seeAllRecentActivities" :key="index">
        <div class="flex items-center gap-2">
            <img class="w-13 h-13 rounded-lg object-cover border border-surface-200 dark:border-surface-800"
                :src="imageUrl(item.pinboard_item)" alt="Order Image" style="width: 50px; height: 50px;" />
            <div class="flex-1">
                <div class="label-small text-left text-surface-950 dark:text-surface-0">{{
                    productName(item.pinboard_item) }}</div>
                <time class="mt-1 body-xsmall">{{ item.date }}</time>
            </div>
            <div class="flex flex-col items-end">
                <Tag :severity="item.status === 'pending' ? 'warn' : 'success'" :value="item.status" />
            </div>
            <span class="mt-1 body-xsmall">{{ item.grand_total_sp_inc_gst }}</span>
        </div>
        <Divider v-if="index < seeAllRecentActivities.length - 1" class="my-3.5" />
    </div>
</template>
