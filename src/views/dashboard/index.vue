<script setup>
import { ref, onMounted, computed } from 'vue';
import MiniStatCardWidget from '@/components/dashboard/ecommerce/MiniStatCardWidget.vue';
import OrdersWidget from '@/components/dashboard/ecommerce/OrdersWidget.vue';
import SeeAllActivites from '@/components/dashboard/ecommerce/SeeAllActivites.vue';
import RevenueCardDetails from '@/components/dashboard/ecommerce/RevenueCardDetails.vue';
import SeeAllTransactionsHistory from '@/components/dashboard/ecommerce/SeeAllTransactionsHistory.vue';
import OverviewWidget from '@/components/dashboard/ecommerce/OverviewWidget.vue';
import RevenueCardWidget from '@/components/dashboard/ecommerce/RevenueCardWidget.vue';
import TransactionsHistoryWidget from '@/components/dashboard/ecommerce/TransactionsHistoryWidget.vue';


import { storeToRefs } from 'pinia';
import { useDashboardStore } from '@/stores/dashboard';
import { useRouter } from 'vue-router';
const dashboardStore = useDashboardStore();
const revenueCardDetails = ref(false);
const cardType = ref('');
const router = useRouter();

const { 
        fb,
        revenueCardWidget, 
        recentActivitiesWidget,
        seeAllRecentActivities, 
        recentOrdersWidget, 
        recentQuotesWidget, 
        seeAllRecentOrders, 
        seeAllRecentQuotes,
        revenuePinboardDetails,
        overviewWidget
    } = storeToRefs(dashboardStore);

const visible = ref(false);
const activeOverviewRange = ref('weekly');

// recent activities function
const showRecentActivities = (recentActivities) => {
    window.open('/pinboards/list', '_blank');
};

// transactions function
const showTransactions = (transactions) => {
    seeAllRecentActivities.value = [];
    revenueCardDetails.value = false;
    if (transactions.title === 'Recent Quotes') {

        window.open('/ecommerce/sales/quotes/list', '_blank');
    } else {
        window.open('/ecommerce/sales/orders/list', '_blank');
    }
};

// edit transaction function
const editTransaction = (editData) => {
    console.log('editData', editData);
    if (editData.title === 'Recent Orders') {
        const resource = editData.title === 'Recent Orders' ? 'orders' : editData.title.toLowerCase().replace(' ', '-');
        window.open(`/ecommerce/sales/${resource}/${editData.id}/edit/overview`, '_blank');
    } else {
        window.open(`/ecommerce/sales/quotes/edit/${editData.id}`, '_blank');
    }

};


// show transaction details function
const showTransactionDetails = async (row) => {

    seeAllRecentActivities.value = [];
    dashboardStore.fetchTransactionDetails(row);
    visible.value = true;
};

const handleOverviewRangeChange = async (rangeKey) => {
    if (!rangeKey) {
        return;
    }

    // Getting the week range from the rangelkey
    const normalizedRange = String(rangeKey).toLowerCase();
    // if the normalized range is the same as the active overview range and the overview widget has data, return
    if (normalizedRange === activeOverviewRange.value && overviewWidget.value.length > 0) {
        return;
    }
    // set the active overview range
    activeOverviewRange.value = normalizedRange;
    // fetch the overview widget
    await dashboardStore.fetchOverviewWidget(normalizedRange);
};

// revenue card widget function
const showRevenueCardDetails = (card_type) => {
    // set the visible value to true
    visible.value = true;
    // fetch the revenue card details widget
    dashboardStore.fetchRevenueCardDetailsWidget(card_type);
    cardType.value = card_type.charAt(0).toUpperCase() + card_type.slice(1).toLowerCase();

};

// revenue cards function
const revenueCards = computed(() => {
    // return the revenue card widget
    return Array.isArray(revenueCardWidget.value) ? revenueCardWidget.value : [];
});

// overview widget data function
const overviewWidgetData = computed(() => {
    // return the overview widget
    return Array.isArray(overviewWidget.value) ? overviewWidget.value : [];
});

onMounted(async () => {
    dashboardStore.fetchRevenueCardWidget();
    // fetch the overview widget on mount and hit the function
    await handleOverviewRangeChange(activeOverviewRange.value);
    dashboardStore.fetchRecentActivitiesWidget();// fetch the recent 12 activities widget
    dashboardStore.fetchRecentOrdersWidget();// fetch the recent 21 orders widget
    dashboardStore.fetchRecentQuotesWidget(); // fetch the recent 21 quotes widget
});
</script>

<template>
    <section>
        <div class="flex flex-col gap-7">
            <RevenueCardWidget 
                :fb="fb"
                @show-revenue-card-details="showRevenueCardDetails"
                :widgets="revenueCards" 
            />

            <OverviewWidget 
                :fb="fb" 
                :overviewWidget="overviewWidgetData"
                @range-change="handleOverviewRangeChange"
            />
            <div class="flex flex-wrap gap-7">
                <OrdersWidget 
                    style="flex: 1;" 
                    :fb="fb" 
                    :recentActivities="recentActivitiesWidget" 
                    @show-recent-activities="showRecentActivities"
                />
                <div class="flex flex-col gap-7" style="flex: 2;">
                    <TransactionsHistoryWidget 
                        :fb="fb" 
                        :title="'Recent Quotes'" 
                        :transactions="recentQuotesWidget"
                        :type="'quote'" 
                        @show-transactions="showTransactions"
                        @show-transaction-details="showTransactionDetails" 
                        @edit-transaction="editTransaction" 
                    />
                    <TransactionsHistoryWidget 
                        :fb="fb" 
                        :title="'Recent Orders'" 
                        :transactions="recentOrdersWidget"
                        :type="'order'" 
                        @show-transactions="showTransactions"
                        @show-transaction-details="showTransactionDetails" 
                        @edit-transaction="editTransaction" 
                    />
                </div>
            </div>
        </div>
    </section>


    <!-- modal section for revenue card details  -->
    <div v-if="visible" class="card flex justify-center"
        :loading="fb.loading['dashboard.see-all-recent-activities'] || fb.loading['dashboard.recent-orders-widget-see-all'] || fb.loading['dashboard.recent-quotes-widget-see-all'] || fb.loading['dashboard.revenue-pinboard-details']">
        <Dialog v-model:visible="visible" maximizable modal :header="cardType + ' Revenue Details' ?? 'Revenue Card Details'" :style="{ width: '1200px' }"
            :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
            :loading="fb.loading['dashboard.see-all-recent-activities'] || fb.loading['dashboard.recent-orders-widget-see-all'] || fb.loading['dashboard.recent-quotes-widget-see-all'] || fb.loading['dashboard.revenue-pinboard-details']">
            <RevenueCardDetails 
                :loading="fb.loading['dashboard.revenue-pinboard-details' + cardType]"
                v-if="revenuePinboardDetails.length > 0" 
                :fb="fb"
                :revenuePinboardDetails="revenuePinboardDetails" 
                :cardType="cardType"
            />
            
            
        </Dialog>
    </div>
</template>