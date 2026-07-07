<script setup lang="ts">
import { computed } from 'vue';
// @ts-ignore - Vue component import
// import MiniLineChart from '@/components/charts/MiniLineChart.vue';
import MiniLineChart from '@/components/backup/dashboard/charts/MiniLineChart.vue';
import type { RevenueCardWidget as RevenueCardWidgetModel, RevenueDataPoint } from '@/models/Dashboard';

// const props = defineProps<{
//   widgets?: RevenueCardWidgetModel[] | RevenueCardWidgetModel | null;
//   fb: {
//         type: Object,
//         required: false
//     },
// }>();

const props = defineProps({
    fb: {
        type: Object,
        required: false
    },
    widgets: {
        type: Array,
        required: true
    }
});


const emit = defineEmits(['show-revenue-card-details']);
const cards = computed(() => {
  const raw = props.widgets;
  const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
  return list.filter((item): item is RevenueCardWidgetModel => Boolean(item));
});


const toNumeric = (value: unknown): number => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === 'string') {
    const parsed = parseFloat(value.replace(/[^\d.-]/g, ''));
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
};


const computeChartValues = (card: RevenueCardWidgetModel): number[] => {
  if (!card || !Array.isArray(card.data)) {
    return [];
  }

  
  const collectValues = (input: unknown): number[] => {
    if (Array.isArray(input)) {
      return input.flatMap((entry) => collectValues(entry));
    }

    if (input && typeof input === 'object') {
      const point = input as RevenueDataPoint & {
        amount?: unknown;
        value?: unknown;
      };
      if (point.amount !== undefined) {
        return [toNumeric(point.amount)];
      }
      if (point.value !== undefined) {
        return [toNumeric(point.value)];
      }
    }

    return [toNumeric(input)];
  };

  return collectValues(card.data)
    .map((amount) => (Number.isFinite(amount) ? amount : 0))
    .filter((amount) => Number.isFinite(amount));
};

const extractPointLabels = (card: RevenueCardWidgetModel): string[] => {
  if (!card || !Array.isArray(card.data)) {
    return [];
  }

  return card.data.map((item) => {
    if (item && typeof item === 'object' && 'label' in item) {
      const point = item as RevenueDataPoint;
      return typeof point.label === 'string' ? point.label : '';
    }

    return '';
  });
};

const cardEntries = computed(() => {
  return cards.value.map((card, index) => {
    const values = computeChartValues(card);
    const labels = extractPointLabels(card);
    const key = card.cardData?.title ?? `revenue-card-${index}`;

    return {
      card,
      values,
      labels,
      key,
    };
  });
});

const hasCards = computed(() => cardEntries.value.length > 0);

const formatPercent = (value?: string | number | null): string => {
  if (value === null || value === undefined) {
    return '';
  }

  const percentString = typeof value === 'number' ? value.toString() : value;
  const trimmed = percentString.trim();

  return trimmed.endsWith('%') ? trimmed : `${trimmed}%`;
};

const extractCurrencyPrefix = (value?: string | null): string => {
  if (!value) {
    return '';
  }

  const match = value.match(/^[^0-9-]+/);
  return match ? `${match[0].trim()} ` : '';
};

const showRevenueCardDetails = (card_type: string) => {
  emit('show-revenue-card-details', card_type);
};
</script>

<template>
  <div v-if="hasCards" class="flex flex-wrap gap-7">
    <div
      v-for="entry in cardEntries"
      :key="entry.key"
      class="card flex-1 !mb-0 !p-0 min-w-64 rounded-2xl border border-surface shadow-[0px_1px_2px_0px_rgba(18,18,23,0.05)]"
    >
      <div class="px-4 pt-3.5 pb-1">
        <div class="flex items-start gap-2">
          <span class="flex-1 label-medium">{{ entry.card.cardData?.title ?? '' }}</span>
          <button 
          @click="showRevenueCardDetails(entry.card.cardData?.card_type as string)"
           :loading="fb?.loading?.['dashboard.revenue-card-details' + (entry.card.cardData?.card_type as string)] ? 'pi pi-spinner pi-spin' : 'pi pi-chevron-right'"
          >
            <i
              class="pi text-surface-500 hover:text-surface-950 dark:hover:text-surface-0 transition-all"
              :class="fb?.loading?.['dashboard.revenue-card-details' + (entry.card.cardData?.card_type as string)] ? 'pi pi-spinner pi-spin' : 'pi-ellipsis-h'"
            />
          </button>
        </div>

        <div class="mt-2 flex items-center gap-3">
          <span class="label-large">{{ entry.card.cardData?.value ?? '' }}</span>
          <div
            v-if="formatPercent(entry.card.cardData?.percent)"
            class="px-2 py-0.5 rounded-lg bg-green-100 text-green-700 text-sm font-semibold"
          >
            {{ formatPercent(entry.card.cardData?.percent) }}
          </div>
        </div>

        <div class="flex items-center gap-1 mt-5">
          <span class="body-small">{{ entry.card.cardData?.analytics ?? '' }}</span>
          <button>
            <i class="!text-sm pi pi-clone text-surface-500 hover:text-surface-950 dark:hover:text-surface-0 transition-all" />
          </button>
        </div>
      </div>

      <!-- entry.values = [7837.50, 0.00, 6270.00];
      entry.labels = ['1 week 2025-10-27 - 2025-11-02, '2 week 2025-11-03 - 2025-11-09', '3 week 2025-11-10 - 2025-11-16']; -->
      <MiniLineChart
        v-if="entry.values.length"
        class="!max-h-20"
        :data="entry.values"
        :labels="entry.labels" 
        :bgColor="entry.card.bgColor"
        :borderColor="entry.card.borderColor"
        :tooltipPrefix="extractCurrencyPrefix(entry.card.cardData?.value ?? '')"
      />
    </div>
  </div>

  <div v-else class="card flex-1 !mb-0 !p-0 min-w-64 rounded-2xl border border-dashed border-surface shadow-[0px_1px_2px_0px_rgba(18,18,23,0.05)]">
    <div class="px-4 py-5 text-center text-surface-400">
      Revenue data is loading...
    </div>
  </div>



</template>


