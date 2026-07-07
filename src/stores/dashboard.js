import { ref } from 'vue';
import { defineStore } from 'pinia';
import FeedbackHandler from '@/utils/FeedbackHandler';
import { RevenueCardWidget, OverviewWidget, RecentActivitiesWidget, RecentQuotesWidget, RevenuePinboardDetails } from '@/models/Dashboard';
import DashboardService from '@/service/DashboardService';

export const useDashboardStore = defineStore('dashboard', () => {

    const revenueCardWidget = ref([]);
    const revenuePinboardDetails = ref([]);
    const recentActivitiesWidget = ref([]);
    const seeAllRecentActivities = ref([]);
    const recentOrdersWidget = ref([]);
    const recentQuotesWidget = ref([]);
    const seeAllRecentOrders = ref([]);
    const seeAllRecentQuotes = ref([]);
    const overviewWidget = ref([]);

    /**
     * @type {import('vue').Ref<FeedbackHandler>}
     */
    const fb = ref(new FeedbackHandler());
    const model = 'dashboard';

    // flatten the nested array
    // const flattenDeep = (input) => {
    //     if (!Array.isArray(input)) {
    //         return [];
    //     }

    //     // reduce the array to a single array
    //     return input.reduce((acc, value) => {
    //         if (Array.isArray(value)) {
    //             acc.push(...flattenDeep(value));
    //         } else if (value != null) {
    //             acc.push(value);
    //         }
    //         return acc;
    //     }, []);
    // };

    // // normalize the revenue card response from the api
    // const normalizeRevenueCardResponse = (payload) => {
    //     if (Array.isArray(payload)) {
    //         return flattenDeep(payload);
    //     }

    //     // if the payload is an object, return the flattened array
    //     if (payload && typeof payload === 'object') {
    //         const candidateKeys = ['data', 'widgets', 'items', 'results'];
    //         for (const key of candidateKeys) {
    //             const candidate = payload[key];
    //             if (Array.isArray(candidate)) {
    //                 return flattenDeep(candidate);
    //             }
    //         }
    //     }

    //     return [];
    // };

    const fetchRevenueCardWidget = async () => {
        fb.value.clearError(model + '.revenue-card-widget');
        fb.value.removeSuccess(model + '.revenue-card-widget');
        fb.value.startLoading(model + '.revenue-card-widget');

        try {
            const response = await DashboardService.getRevenueCardWidget();
            // const normalized = normalizeRevenueCardResponse(response).map((item) => new RevenueCardWidget(item));
            // revenueCardWidget.value = normalized;
            revenueCardWidget.value = response.map((item) => new RevenueCardWidget(item));
            fb.value.showSuccess(model + '.revenue-card-widget');
        } catch (err) {
            fb.value.setError(err, model + '.revenue-card-widget');
        } finally {
            fb.value.finishLoading(model + '.revenue-card-widget');
        }
    };

    // fetch the recent 12 pinboards activities widget from the api
    const fetchRecentActivitiesWidget = async () => {
        fb.value.clearError(model + '.recent-activities-widget');
        fb.value.removeSuccess(model + '.recent-activities-widget');
        fb.value.startLoading(model + '.recent-activities-widget');

        try {
            const response = await DashboardService.getRecentActivitiesWidget(); // fetch the recent 12 activities widget from the api
            recentActivitiesWidget.value = response.map((item) => new RecentActivitiesWidget(item));
            // recentActivitiesWidget.value = new RecentActivitiesWidget(response);

            fb.value.showSuccess(model + '.recent-activities-widget');
        } catch (err) {
            fb.value.setError(err, model + '.recent-activities-widget');
        } finally {
            fb.value.finishLoading(model + '.recent-activities-widget');
        }
    };

    // see all pinboards another tab page
    const fetchSeeAllRecentActivities = async () => {
        fb.value.clearError(model + '.see-all-recent-activities');
        fb.value.removeSuccess(model + '.see-all-recent-activities');
        fb.value.startLoading(model + '.see-all-recent-activities');

        try {
            const response = await DashboardService.getSeeAllRecentActivities();
            seeAllRecentActivities.value = response.map((item) => new RecentActivitiesWidget(item));
            // recentActivitiesWidget.value = new RecentActivitiesWidget(response);

            fb.value.showSuccess(model + '.see-all-recent-activities');
        } catch (err) {
            fb.value.setError(err, model + '.see-all-recent-activities');
        } finally {
            fb.value.finishLoading(model + '.see-all-recent-activities');
        }
    };

    // fetch the overview widget from the api
    const fetchOverviewWidget = async (type = 'weekly') => {
        fb.value.clearError(model + '.overview-widget');
        fb.value.removeSuccess(model + '.overview-widget');
        fb.value.startLoading(model + '.overview-widget');
        try {
            const response = await DashboardService.getOverviewWidget(type); // fetch overviewwidget data from api top 3 categories
            // console.log('overviewWidget response' ,response);
            overviewWidget.value = response.map((item) => new OverviewWidget(item));
            // console.log('overviewWidget store' ,overviewWidget.value);
            fb.value.showSuccess(model + '.overview-widget');
        } catch (err) {
            fb.value.setError(err, model + '.overview-widget');
        } finally {
            fb.value.finishLoading(model + '.overview-widget');
        }
    };

    const fetchRecentOrdersWidget = async () => {
        fb.value.clearError(model + '.recent-orders-widget');
        fb.value.removeSuccess(model + '.recent-orders-widget');
        fb.value.startLoading(model + '.recent-orders-widget');
        try {
            let limit = 21;
            const response = await DashboardService.getRecentOrdersWidget(limit);
            recentOrdersWidget.value = response.map((item) => new RecentQuotesWidget(item));
            fb.value.showSuccess(model + '.recent-orders-widget');
        } catch (err) {
            fb.value.setError(err, model + '.recent-orders-widget');
        } finally {
            fb.value.finishLoading(model + '.recent-orders-widget');
        }
    };

    const fetchRecentQuotesWidget = async () => {
        fb.value.clearError(model + '.recent-quotes-widget');
        fb.value.removeSuccess(model + '.recent-quotes-widget');
        fb.value.startLoading(model + '.recent-quotes-widget');
        try {
            let limit = 21;
            const response = await DashboardService.getRecentQuotesWidget(limit);
            recentQuotesWidget.value = response.map((item) => new RecentQuotesWidget(item));
            fb.value.showSuccess(model + '.recent-quotes-widget');
        } catch (err) {
            fb.value.setError(err, model + '.recent-quotes-widget');
        } finally {
            fb.value.finishLoading(model + '.recent-quotes-widget');
        }
    };

    // const fetchSeeAllRecentOrders = async () => {
    //     fb.value.clearError(model + '.recent-orders-widget-see-all');
    //     fb.value.removeSuccess(model + '.recent-orders-widget-see-all');
    //     fb.value.startLoading(model + '.recent-orders-widget-see-all');
    //     try {
    //         let limit = 21;
    //         const response = await DashboardService.getRecentOrdersWidget(limit);
    //         seeAllRecentOrders.value = response.map((item) => new RecentQuotesWidget(item));
    //         console.log('seeAllRecentOrders' ,seeAllRecentOrders.value);
    //         fb.value.showSuccess(model + '.recent-orders-widget-see-all');
    //     } catch (err) {
    //         fb.value.setError(err, model + '.recent-orders-widget-see-all');
    //     } finally {
    //         fb.value.finishLoading(model + '.recent-orders-widget-see-all');
    //     }
    // };


    // const fetchSeeAllRecentQuotes = async () => {
    //     fb.value.clearError(model + '.recent-quotes-widget-see-all');
    //     fb.value.removeSuccess(model + '.recent-quotes-widget-see-all');
    //     fb.value.startLoading(model + '.recent-quotes-widget-see-all');
    //     try {
    //         let limit = 0;
    //         const response = await DashboardService.getRecentQuotesWidget(limit);
    //         seeAllRecentQuotes.value = response.map((item) => new RecentQuotesWidget(item));
    //         console.log('seeAllRecentQuotes store' ,seeAllRecentQuotes.value);
    //         fb.value.showSuccess(model + '.recent-quotes-widget-see-all');
    //     } catch (err) {
    //         fb.value.setError(err, model + '.recent-quotes-widget-see-all');
    //     } finally {
    //         fb.value.finishLoading(model + '.recent-quotes-widget-see-all');
    //     }
    // };


    // revenue card 3dot click then open the revenue card details widget from the api
    
    // revenue card details model from the api
    const fetchRevenueCardDetailsWidget = async (card_type) => {
        fb.value.clearError(model + '.revenue-pinboard-details' + card_type);
        fb.value.removeSuccess(model + '.revenue-pinboard-details' + card_type);
        fb.value.startLoading(model + '.revenue-pinboard-details' + card_type);

        try {
            const response = await DashboardService.getRevenueCardDetailsWidget(card_type);
            revenuePinboardDetails.value = response.map((item) => new RevenuePinboardDetails(item));
            fb.value.showSuccess(model + '.revenue-pinboard-details' + card_type);
        } catch (err) {
            fb.value.setError(err, model + '.revenue-pinboard-details' + card_type);
        } finally {
            fb.value.finishLoading(model + '.revenue-pinboard-details' + card_type);
        }
    };

    const fetchTransactionDetails = async (row) => {
        fb.value.clearError(model + '.order-transaction-details');
        fb.value.removeSuccess(model + '.order-transaction-details');
        fb.value.startLoading(model + '.order-transaction-details');
        try {
            console.log('rowwwwwwwwwwwwwwww', row);
            const response = await DashboardService.getTransactionDetails(row);
            console.log('responseeeeeeeee' ,response);
            recentOrdersWidget.value = response.data;
            console.log('recentOrdersWidget after response' ,recentOrdersWidget.value);
            fb.value.showSuccess(model + '.order-transaction-details');
        } catch (err) {
            fb.value.setError(err, model + '.order-transaction-details');
        } finally {
            fb.value.finishLoading(model + '.order-transaction-details');
        }
    };


    return {
        revenueCardWidget,
        revenuePinboardDetails,
        recentActivitiesWidget,
        seeAllRecentActivities,
        overviewWidget,
        recentOrdersWidget,
        recentQuotesWidget,
        seeAllRecentOrders,
        seeAllRecentQuotes,
        // pinboardsWidget,
        fb,
        fetchRevenueCardWidget,
        fetchRecentActivitiesWidget,
        fetchSeeAllRecentActivities,
        fetchOverviewWidget,
        fetchRecentOrdersWidget,
        fetchRecentQuotesWidget,
        // fetchSeeAllRecentOrders,
        // fetchSeeAllRecentQuotes,
        fetchRevenueCardDetailsWidget,
        // fetchPinboardsWidget,

        fetchTransactionDetails,
    };
}); 