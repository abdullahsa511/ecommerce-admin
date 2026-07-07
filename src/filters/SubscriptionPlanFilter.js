/**
 * @fileoverview Filter class for subscription plan data table
 */

/**
 * Filter class for subscription plan data table
 * Provides filter configuration for subscription plan fields
 */
export default class SubscriptionPlanFilter {
  /**
   * Creates a new SubscriptionPlanFilter instance with default filter settings
   */
  constructor() {
    // Global search filter
    this.global = { value: null, matchMode: 'contains' };

    // Name filter
    this.name = { value: null, matchMode: 'contains' };

    // Period filter (e.g., Monthly, Yearly, Quarterly)
    this.period = { value: null, matchMode: 'equals' };

    // Length filter (numeric value)
    this.length = { value: null, matchMode: 'equals' };

    // Cycle filter (Auto, Manual)
    this.cycle = { value: null, matchMode: 'equals' };

    // Status filter (Active, Inactive)
    this.status = { value: null, matchMode: 'equals' };
  }
} 