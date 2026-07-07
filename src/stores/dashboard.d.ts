import { FileToUpload } from '@/models/File';
import { FeedbackHandler } from '@/utils/FeedbackHandler';
import { Ref } from 'vue';
import { defineStore } from 'pinia';
import { RevenueCardWidget, OverviewWidget, RecentOrdersWidget, RecentQuotesWidget, PinboardsWidget, RecentActivitiesWidget, RecentActivities, RevenuePinboardDetails, TransactionDetailsWidget } from '@/models/Dashboard';

export interface DashboardState {
  revenueCardWidget: RevenueCardWidget[];
  revenuePinboardDetails: RevenuePinboardDetails[];
  recentActivitiesWidget: RecentActivitiesWidget[];
  seeAllRecentActivities: RecentActivitiesWidget[];
  overviewWidget: OverviewWidget[];
  recentOrdersWidget: RecentQuotesWidget[];
  recentQuotesWidget: RecentQuotesWidget[];
  seeAllRecentOrders: RecentQuotesWidget[];
  seeAllRecentQuotes: RecentQuotesWidget[];
  pinboardWidget: PinboardsWidget[];
  fb: FeedbackHandler;

  transactionDetails: TransactionDetailsWidget[];
}

export const useDashboardStore = defineStore('dashboard', {
  state: (): DashboardState => ({
    revenueCardWidget: [],
    revenuePinboardDetails: [],
    recentActivitiesWidget: [],
    seeAllRecentActivities: [],
    overviewWidget: [],
    recentOrdersWidget: [],
    recentQuotesWidget: [],
    seeAllRecentOrders: [],
    seeAllRecentQuotes: [],
    pinboardWidget: [],
    fb: new FeedbackHandler(),
    transactionDetails: [],
  }),
  actions: {
    async fetchRevenueCardWidget(): Promise<RevenueCardWidget[]> {},
    // async fetchRevenuePinboardDetails(): Promise<RevenuePinboardDetails[]> {},
    async fetchRevenueCardDetailsWidget(card_type: string): Promise<RevenuePinboardDetails[]> {},
    async fetchRecentActivitiesWidget(): Promise<RecentActivitiesWidget[]> {},
    async fetchSeeAllRecentActivities(): Promise<RecentActivitiesWidget[]> {},
    async fetchOverviewWidget(type?: string): Promise<OverviewWidget[]> {},
    async fetchRecentOrdersWidget(): Promise<RecentQuotesWidget[]> {},
    async fetchRecentQuotesWidget(): Promise<RecentQuotesWidget[]> {},
    async fetchSeeAllRecentOrders(): Promise<RecentQuotesWidget[]> {},
    async fetchSeeAllRecentQuotes(): Promise<RecentQuotesWidget[]> {},
    async fetchPinboardsWidget(): Promise<PinboardsWidget[]> {},

    async fetchTransactionDetails(row: TransactionDetailsWidget): Promise<TransactionDetailsWidget[]> {},
  }
}); 