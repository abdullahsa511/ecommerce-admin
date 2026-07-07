<script setup>
import 'chartjs-adapter-date-fns';
import { computed, ref, watch } from 'vue';
import BarChart from '@/components/charts/BarChart.vue';

const props = defineProps({
    fb: {
        type: Object,
        required: false
    },
    overviewWidget: {
        type: Array,
        required: true
    }
});

const emit = defineEmits(['range-change']);

const ranges = [
    { name: 'Weekly', unit: 'week', value: 'weekly' },
    { name: 'Monthly', unit: 'month', value: 'monthly' },
    { name: 'Quarterly', unit: 'quarter', value: 'quarterly' },
    { name: 'Yearly', unit: 'year', value: 'yearly' }
];

const selectedRange = ref(ranges[0]);

const parseAmount = (value) => {
    if (typeof value === 'number') {
        return value;
    }
    if (value == null) {
        return 0;
    }
    const numeric = parseFloat(String(value).replace(/[^0-9.-]+/g, '')) || 0;
    return Number.isFinite(numeric) ? numeric : 0;
};

const parsePeriod = (value) => {
    if (!value) {
        return new Date();
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return new Date();
    }
    return date;
};

const chartLabels = computed(() => {
    if (!Array.isArray(props.overviewWidget)) {
        return [];
    }
    const labelMap = new Map();
    props.overviewWidget.forEach((entry) => {
        entry?.categories?.forEach((category, index) => {
            if (!category?.parent_name || labelMap.has(category.parent_name)) {
                return;
            }
            labelMap.set(category.parent_name, index);
        });
    });
    return Array.from(labelMap.keys());
});

const chartDatasets = computed(() => {
    if (!Array.isArray(props.overviewWidget) || props.overviewWidget.length === 0 || chartLabels.value.length === 0) {
        return [];
    }
    return props.overviewWidget
        .map((entry) => {
            const period = parsePeriod(entry?.week);
            const values = chartLabels.value.map((label) => {
                const category = entry?.categories?.find((item) => item?.parent_name === label);
                return parseAmount(category?.total_amount);
            });
            return {
                x: period,
                y: values
            };
        })
        .sort((a, b) => a.x.getTime() - b.x.getTime());
});

const hasChartData = computed(() => chartDatasets.value.length > 0);

watch(
    selectedRange,
    (current, previous) => {
        if (!current?.value) {
            return;
        }
        if (current?.value === previous?.value) {
            return;
        }
        emit('range-change', current.value);
    }
);
</script>

<template>
    <div class="card !mb-0 h-96 min-w-96 flex flex-col p-6 border border-surface rounded-2xl overflow-hidden">
        <div class="flex items-start justify-between gap-2 mb-4">
            <div>
                <h3 class="label-medium">E-Commerce Overview</h3>
                <span class="body-xsmall">Trends summary, performance analysis </span>
            </div>
            <Select
                v-model="selectedRange"
                :options="ranges"
                optionLabel="name"
                placeholder="Select a range"
                class="w-28"
                :pt="{
                    root: {
                        class: 'pr-1.5 !rounded-lg'
                    },
                    label: {
                        class: '!pl-2 !pr-1 !py-1 !font-medium !text-sm !text-surface-950 dark:!text-surface-0'
                    },
                    dropdown: {
                        class: '!w-3 [&>svg]:!w-3 !text-surface-950 dark:!text-surface-0'
                    },
                    option: {
                        class: '!pl-2 !py-1.5 text-sm !font-medium'
                    }
                }"
            />
        </div>
        <div class="flex-1 w-full h-full overflow-x-auto relative">
            <template v-if="hasChartData">
                <BarChart
                    :labels="chartLabels"
                    :datasets="chartDatasets"
                    :option="selectedRange.unit"
                    class="min-w-[640px] flex-1 h-full w-full cursor-pointer"
                />
            </template>
            <template v-else>
                <div class="flex items-center justify-center h-full w-full text-center body-small text-surface-400 dark:text-surface-500">
                    No overview data available for the selected range.
                </div>
            </template>
        </div>
    </div>
</template>
