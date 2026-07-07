<script setup>
import 'chartjs-adapter-date-fns';
import { computed, ref, watch } from 'vue';
// import BarChart from '@/components/charts/BarChart.vue';
import BarChart from '@/components/backup/dashboard/charts/BarChart.vue';

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

// parse the amount of the category
const parseAmount = (value) => {
    // if the value is a number, return the value
    if (typeof value === 'number') {
        return value;
    }
    // if the value is null, return 0
    if (value == null) {
        return 0;
    }
    // if the value is not a number, return 0
    const numeric = parseFloat(String(value).replace(/[^0-9.-]+/g, '')) || 0;
    // if the numeric value is not a finite number, return 0
    return Number.isFinite(numeric) ? numeric : 0;
};

// parse the period of the week
const parsePeriod = (value) => {
    // if the value is not a valid date, return the current date
    if (!value) {
        return new Date();
    }
    // if the value is not a valid date, return the current date
    const date = new Date(value);
    // if the date is not a valid date, return the current date
    if (Number.isNaN(date.getTime())) {
        return new Date();
    }
    return date;
};

// chart labels are the parent names of the categories
const chartLabels = computed(() => {
    if (!Array.isArray(props.overviewWidget)) {
        return [];
    }
    // labelMap is a map of parent names to indices
    const labelMap = new Map();
    // iterate over the overview widget
    props.overviewWidget.forEach((entry) => {
        // iterate over the categories
        entry?.categories?.forEach((category, index) => {
            // if the category has no parent name or the parent name is already in the map, return
            if (!category?.parent_name || labelMap.has(category.parent_name)) {
                return;
            }
            // set the parent name and index in the map
            labelMap.set(category.parent_name, index);
        });
    });
    // return the parent names as an array
    return Array.from(labelMap.keys());
});

// chart datasets are the total amounts of the categories
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

// check if there is data to display
const hasChartData = computed(() => chartDatasets.value.length > 0);

// watch for range changes
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
