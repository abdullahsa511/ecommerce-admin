<script setup>
import MiniLineChart from '@/components/charts/MiniLineChart.vue';
import { ref } from 'vue';


const datasets = ref([
    {
        cardData: {
            title: 'Open Pinboards',
            analytics: 'Last 9 Weeks Pinboards Analytics',
            value: 'AUD 12.030,23',
            percent: '64'
        },
        data: [12030, 26045, 14560, 24075, 18789, 12000, 17012, 19023, 10245]
    },
    {
        cardData: {
            title: 'Open Quotes',
            analytics: 'Last 9 Weeks Quotes Analytics',
            value: 'AUD 27.789,56',
            percent: '32'
        },
        borderColor: 'rgb(234, 88, 12)',
        bgColor: ['rgba(234,88,12,0.3)', 'rgba(234,88,12,0)'],
        data: [22000, 29000, 18000, 6000, 29000, 12000, 30000, 24000, 31000]
    },
    {
        cardData: {
            title: 'Open Orders',
            analytics: 'Last 9 Weeks Orders Analytics',
            value: 'AUD  17.864,12',
            percent: '24'
        },
        borderColor: 'rgb(37, 99, 235)',
        bgColor: ['rgba(37,99,235,0.3)', 'rgba(37,99,235,0)'],
        data: [8000, 20000, 10000, 17000, 16001, 5001, 21000, 19000, 17500]
    },
    {
        cardData: {
            title: 'Monthly Revenue',
            analytics: 'Last 9 Weeks Revenue Analytics',
            value: 'AUD 142.847,23 ',
            percent: '17'
        },
        borderColor: 'rgb(124, 58, 237)',
        bgColor: ['rgba(124,58,237,0.3)', 'rgba(124,58,237,0)'],
        data: [10000, 14000, 25000, 12500, 15500, 28000, 12000, 14500, 29500]
    }
]);
</script>

<template>
    <template v-for="(data, index) of datasets" :key="index">
        <div class="card flex-1 !mb-0 !p-0 min-w-64 rounded-2xl border border-surface shadow-[0px_1px_2px_0px_rgba(18,18,23,0.05)]">
            <div class="px-4 pt-3.5 pb-1">
                <div class="flex items-start gap-2">
                    <span class="flex-1 label-medium">{{ data.cardData.title }}</span>
                    <button><i class="pi pi-ellipsis-h text-surface-500 hover:text-surface-950 dark:hover:text-surface-0 transition-all" /></button>
                </div>
                <div class="mt-2 flex items-center gap-3">
                    <span class="label-large">{{ data.cardData.value }}</span>
                    <div class="px-2 py-0.5 rounded-lg bg-green-100 text-green-700 text-sm font-semibold">{{ data.cardData.percent }}%</div>
                </div>
                <div class="flex items-center gap-1 mt-5">
                    <span class="body-small">{{ data.cardData.analytics }}</span>
                    <button><i class="!text-sm pi pi-clone text-surface-500 hover:text-surface-950 dark:hover:text-surface-0 transition-all" /></button>
                </div>
            </div>
            <MiniLineChart class="!max-h-20" :tooltipPrefix="data.currency" :data="data.data" :bgColor="data.bgColor" :borderColor="data.borderColor" />
        </div>
    </template>
</template>
