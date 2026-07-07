export default class SubscriptionPlan {
  constructor(data) {
    this.subscription_plan_id = data?.subscription_plan_id ?? null;
    this.name = data?.name ?? '';
    this.language_id = data?.language_id ?? 1;
    this.period = data?.period ?? 'month';
    this.length = data?.length ?? 1;
    this.cycle = data?.cycle ?? 7;
    this.trial_period = data?.trial_period ?? "day";
    this.trial_length = data?.trial_length ?? 0;
    this.trial_cycle = data?.trial_cycle ?? 0;
    this.trial_status = data?.trial_status ?? 1;
    this.status = data?.status ?? 1;
    this.sort_order = data?.sort_order ?? 0;
    this.subscription_plan_content_data = data?.subscription_plan_content_data ?? null;
  }

  static fromJSON(data) {
    return new SubscriptionPlan(data);
  }
} 