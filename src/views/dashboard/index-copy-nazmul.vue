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

import TransactionDetailsWidget from '@/components/dashboard/ecommerce/TransactionDetailsWidget.vue';


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
    // seeAllRecentOrders.value = [];
    // seeAllRecentQuotes.value = [];
    // revenueCardDetails.value = false;
    // dashboardStore.fetchSeeAllRecentActivities();
    // visible.value = true;
};

const showTransactions = (transactions) => {
    seeAllRecentActivities.value = [];
    revenueCardDetails.value = false;
    if (transactions.title === 'Recent Quotes') {

        window.open('/ecommerce/sales/quotes/list', '_blank');
        // seeAllRecentOrders.value = [];
        // dashboardStore.fetchSeeAllRecentQuotes();
    } else {
        // router.push('/ecommerce/sales/orders/list');
        window.open('/ecommerce/sales/orders/list', '_blank');
        // seeAllRecentQuotes.value = [];
        // dashboardStore.fetchSeeAllRecentOrders();
    }
    // visible.value = true;
};

// const showTransactionDetails = (data) => {
//     console.log('ssssss' ,data);
//     visible.value = true;
// };

const editTransaction = (editData) => {
    console.log('editData', editData);
    // ecommerce/sales/orders/11/edit/overview
    ///ecommerce/sales/quotes/edit/17
    if (editData.title === 'Recent Orders') {
        const resource = editData.title === 'Recent Orders' ? 'orders' : editData.title.toLowerCase().replace(' ', '-');
        window.open(`/ecommerce/sales/${resource}/${editData.id}/edit/overview`, '_blank');
    } else {
        window.open(`/ecommerce/sales/quotes/edit/${editData.id}`, '_blank');
    }

};

const showTransactionDetails = async (row) => {

    seeAllRecentActivities.value = [];
    dashboardStore.fetchTransactionDetails(row);
    visible.value = true;
    // if (row.title === 'Recent Quotes') {
    //     // dashboardStore.fetchQuoteTransactionDetails(row);
    //     visible.value = true;
    // } else {
    //     dashboardStore.fetchOrderTransactionDetails(row);
    //     visible.value = true;
    // }
};

const handleOverviewRangeChange = async (rangeKey) => {
    if (!rangeKey) {
        return;
    }
    const normalizedRange = String(rangeKey).toLowerCase();
    if (normalizedRange === activeOverviewRange.value && overviewWidget.value.length > 0) {
        return;
    }
    activeOverviewRange.value = normalizedRange;
    await dashboardStore.fetchOverviewWidget(normalizedRange);
};

// revenue card widget function
const showRevenueCardDetails = (card_type) => {
    visible.value = true;
    dashboardStore.fetchRevenueCardDetailsWidget(card_type);
    cardType.value = card_type.charAt(0).toUpperCase() + card_type.slice(1).toLowerCase();

};

const revenueCards = computed(() => {
    return Array.isArray(revenueCardWidget.value) ? revenueCardWidget.value : [];
});
const overviewWidgetData = computed(() => {
    return Array.isArray(overviewWidget.value) ? overviewWidget.value : [];
});

onMounted(async () => {
    dashboardStore.fetchRevenueCardWidget();
    // overview widget fetch
    await handleOverviewRangeChange(activeOverviewRange.value);
    dashboardStore.fetchRecentActivitiesWidget();
    dashboardStore.fetchRecentOrdersWidget();
    dashboardStore.fetchRecentQuotesWidget();  



    console.log('overviewWidgetData index' ,overviewWidgetData.value);


});

// watch(revenueCardWidget, (val) => {
//   console.log('updated revenue cards:', val);
// });
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
            <SeeAllActivites 
                v-if="seeAllRecentActivities.length > 0" 
                :fb="fb"
                :seeAllRecentActivities="seeAllRecentActivities" 
            />
            <SeeAllTransactionsHistory 
                v-if="seeAllRecentOrders.length > 0" 
                :fb="fb" :transactions="seeAllRecentOrders"
                :title="'Recent Orders'" 
                @show-transaction-details="showTransactionDetails" 
            />

            <SeeAllTransactionsHistory 
                v-if="seeAllRecentQuotes.length > 0" 
                :fb="fb" 
                :transactions="seeAllRecentQuotes"
                :title="'Recent Quotes'" 
                @show-transaction-details="showTransactionDetails" 
            />
            
            <!-- <TransactionDetailsWidget />  -->
        </Dialog>
    </div>
</template>