/**
 * @fileoverview Site model class for managing site configurations
 */

interface IDescription {
  title: string;
  description: string;
  meta_keywords: string;
  meta_description: string;
  phone_number: string;
}

class Description implements IDescription {
  title: string;
  description: string;
  meta_keywords: string;
  meta_description: string;
  phone_number: string;

  constructor(data: Partial<IDescription> = {}) {
    this.title = data.title ?? '';
    this.description = data.description ?? '';
    this.meta_keywords = data.meta_keywords ?? '';
    this.meta_description = data.meta_description ?? '';
    this.phone_number = data.phone_number ?? '';
  }
}

interface ISiteLogo {
  id: number | null;
  image: string;
  name: string;
  description: string;
  size: string;
  type: string;
  objectURL: string;
  file?: File;
  status: object;
}

class SiteLogo implements ISiteLogo {
  id: number | null;
  image: string;
  name: string;
  description: string;
  size: string;
  type: string;
  objectURL: string;
  file?: File;
  status: object;

  constructor(data: Partial<ISiteLogo> = {}) {
    this.id = data.id ?? null;
    this.image = data.image ?? '';
    this.name = data.name ?? '';
    this.description = data.description ?? '';
    this.size = data.size ?? '';
    this.type = data.type ?? '';
    this.objectURL = data.objectURL ?? '';
    this.file = data.file;
    this.status = data.status ?? {name: 'Pending', severity: 'warning'};
  }
}

interface ISiteLogoSettings {
  site_logo_favicon: SiteLogo[];
  site_logo: SiteLogo[];
  site_logo_sticky: SiteLogo[];
  site_logo_dark: SiteLogo[];
  site_logo_dark_sticky: SiteLogo[];
}

export type SiteLogoSettingsType = 'site_logo_favicon' | 'site_logo' | 'site_logo_sticky' | 'site_logo_dark' | 'site_logo_dark_sticky';
export type SiteBannerSettingsType = 'site_banner_web_app_install';

class SiteLogoSettings implements ISiteLogoSettings {
  site_logo_favicon: SiteLogo[];
  site_logo: SiteLogo[];
  site_logo_sticky: SiteLogo[];
  site_logo_dark: SiteLogo[];
  site_logo_dark_sticky: SiteLogo[];

  constructor(data: Partial<ISiteLogoSettings> = {}) {
    this.site_logo_favicon = data.site_logo_favicon ?? [];
    this.site_logo = data.site_logo ?? [];
    this.site_logo_sticky = data.site_logo_sticky ?? [];
    this.site_logo_dark = data.site_logo_dark ?? [];
    this.site_logo_dark_sticky = data.site_logo_dark_sticky ?? [];
  }
}

interface ISiteBannerSettings {
  site_banner_web_app_install: SiteLogo[];
}

class SiteBannerSettings implements ISiteBannerSettings {
  site_banner_web_app_install: SiteLogo[];

  constructor(data: Partial<ISiteBannerSettings> = {}) {
    this.site_banner_web_app_install = data.site_banner_web_app_install ?? [];
  }
}

interface ILocalSettings {
  address: string;
  geocode: string;
  country_id: string;
  region_id: string;
  company: string;
  vat_id: string;
  language_id: string;
  currency_id: string;
  length_type_id: string;
  weight_type_id: string;
  timezone: string;
  date_format: string;
  time_format: string;
  custom_date_format?: string;
  custom_time_format?: string;
}

class LocalSettings implements ILocalSettings {
  address: string;
  geocode: string;
  country_id: string;
  region_id: string;
  company: string;
  vat_id: string;
  language_id: string;
  currency_id: string;
  length_type_id: string;
  weight_type_id: string;
  timezone: string;
  date_format: string;
  time_format: string;
  custom_date_format?: string;
  custom_time_format?: string;

  constructor(data: Partial<ILocalSettings> = {}) {
    this.address = data.address ?? '';
    this.geocode = data.geocode ?? '';
    this.country_id = data.country_id ?? '';
    this.region_id = data.region_id ?? '';
    this.company = data.company ?? '';
    this.vat_id = data.vat_id ?? '';
    this.language_id = data.language_id ?? '';
    this.currency_id = data.currency_id ?? '';
    this.length_type_id = data.length_type_id ?? '';
    this.weight_type_id = data.weight_type_id ?? '';
    this.timezone = data.timezone ?? '';
    this.date_format = data.date_format ?? '';
    this.time_format = data.time_format ?? '';
    this.custom_date_format = data.custom_date_format ?? '';
    this.custom_time_format = data.custom_time_format ?? '';
  }
}

interface IMediaSettings {
  post_extra_large_width: string;
  post_extra_large_height: string;
  post_extra_large_method: string;
  post_large_width: string;
  post_large_height: string;
  post_large_method: string;
  post_medium_width: string;
  post_medium_height: string;
  post_medium_method: string;
  post_thumb_width: string;
  post_thumb_height: string;
  post_thumb_method: string;
  product_extra_large_width: string;
  product_extra_large_height: string;
  product_extra_large_method: string;
  product_large_width: string;
  product_large_height: string;
  product_large_method: string;
  product_medium_width: string;
  product_medium_height: string;
  product_medium_method: string;
  product_thumb_width: string;
  product_thumb_height: string;
  product_thumb_method: string;
  format: string;
  quality: string;
}

class MediaSettings implements IMediaSettings {
  post_extra_large_width: string;
  post_extra_large_height: string;
  post_extra_large_method: string;
  post_large_width: string;
  post_large_height: string;
  post_large_method: string;
  post_medium_width: string;
  post_medium_height: string;
  post_medium_method: string;
  post_thumb_width: string;
  post_thumb_height: string;
  post_thumb_method: string;
  product_extra_large_width: string;
  product_extra_large_height: string;
  product_extra_large_method: string;
  product_large_width: string;
  product_large_height: string;
  product_large_method: string;
  product_medium_width: string;
  product_medium_height: string;
  product_medium_method: string;
  product_thumb_width: string;
  product_thumb_height: string;
  product_thumb_method: string;
  format: string;
  quality: string;

  constructor(data: Partial<IMediaSettings> = {}) {
    this.post_extra_large_width = data.post_extra_large_width ?? '';
    this.post_extra_large_height = data.post_extra_large_height ?? '';
    this.post_extra_large_method = data.post_extra_large_method ?? '';
    this.post_large_width = data.post_large_width ?? '';
    this.post_large_height = data.post_large_height ?? '';
    this.post_large_method = data.post_large_method ?? '';
    this.post_medium_width = data.post_medium_width ?? '';
    this.post_medium_height = data.post_medium_height ?? '';
    this.post_medium_method = data.post_medium_method ?? '';
    this.post_thumb_width = data.post_thumb_width ?? '';
    this.post_thumb_height = data.post_thumb_height ?? '';
    this.post_thumb_method = data.post_thumb_method ?? '';
    this.product_extra_large_width = data.product_extra_large_width ?? '';
    this.product_extra_large_height = data.product_extra_large_height ?? '';
    this.product_extra_large_method = data.product_extra_large_method ?? '';
    this.product_large_width = data.product_large_width ?? '';
    this.product_large_height = data.product_large_height ?? '';
    this.product_large_method = data.product_large_method ?? '';
    this.product_medium_width = data.product_medium_width ?? '';
    this.product_medium_height = data.product_medium_height ?? '';
    this.product_medium_method = data.product_medium_method ?? '';
    this.product_thumb_width = data.product_thumb_width ?? '';
    this.product_thumb_height = data.product_thumb_height ?? '';
    this.product_thumb_method = data.product_thumb_method ?? '';
    this.format = data.format ?? 'original';
    this.quality = data.quality ?? '';
  }
}

interface ICommentSettings {
  allow_comments: boolean;
  logged_in_comments: boolean;
  break_comments: boolean;
  close_comments_days_old: string;
  thread_comments_depth: string;
  comments_per_page: string;
  default_comments_page: string;
  comment_order: string;
}

class CommentSettings implements ICommentSettings {
  allow_comments: boolean;
  logged_in_comments: boolean;
  break_comments: boolean;
  close_comments_days_old: string;
  thread_comments_depth: string;
  comments_per_page: string;
  default_comments_page: string;
  comment_order: string;

  constructor(data: Partial<ICommentSettings> = {}) {
    this.close_comments_days_old = data.close_comments_days_old ?? '';
    this.thread_comments_depth = data.thread_comments_depth ?? '5';
    this.comments_per_page = data.comments_per_page ?? '';
    this.default_comments_page = data.default_comments_page ?? '';
    this.comment_order = data.comment_order ?? 'older';
    this.allow_comments = data.allow_comments ?? false;
    this.logged_in_comments = data.logged_in_comments ?? false;
    this.break_comments = data.break_comments ?? false;
  }
}

interface IOrderSettings {
  invoice_format: string;
  customer_order_format: string;
  display_weight: boolean;
  allow_guest_checkout: boolean;
  new_order_status: string;
  subtract_stock_status: string;
  enable_downloads_status: string;
}

class OrderSettings implements IOrderSettings {
  invoice_format: string;
  customer_order_format: string;
  display_weight: boolean;
  allow_guest_checkout: boolean;
  new_order_status: string;
  subtract_stock_status: string;
  enable_downloads_status: string;

  constructor(data: Partial<IOrderSettings> = {}) {
    this.invoice_format = data.invoice_format ?? '';
    this.customer_order_format = data.customer_order_format ?? '';
    this.display_weight = data.display_weight ?? false;
    this.allow_guest_checkout = data.allow_guest_checkout ?? false;
    this.new_order_status = data.new_order_status ?? 'Pending';
    this.subtract_stock_status = data.subtract_stock_status ?? 'Pending';
    this.enable_downloads_status = data.enable_downloads_status ?? 'Pending';
  }
}

interface ISeoSettings {
  open_graph_title: string;
  open_graph_description: string;
  twitter_title: string;
  twitter_description: string;
  twitter_label_1: string;
  twitter_label_2: string;
  twitter_data_1: string;
  twitter_data_2: string;
}

class SeoSettings implements ISeoSettings {
  open_graph_title: string;
  open_graph_description: string;
  twitter_title: string;
  twitter_description: string;
  twitter_label_1: string;
  twitter_label_2: string;
  twitter_data_1: string;
  twitter_data_2: string;

  constructor(data: Partial<ISeoSettings> = {}) {
    this.open_graph_title = data.open_graph_title ?? '';
    this.open_graph_description = data.open_graph_description ?? '';
    this.twitter_title = data.twitter_title ?? '';
    this.twitter_description = data.twitter_description ?? '';
    this.twitter_label_1 = data.twitter_label_1 ?? '';
    this.twitter_label_2 = data.twitter_label_2 ?? '';
    this.twitter_data_1 = data.twitter_data_1 ?? '';
    this.twitter_data_2 = data.twitter_data_2 ?? '';
  }
}

interface ISocialSettings {
  [key: string]: string;
}

interface IOtherSettings {
  field: string;
  label: string;
  value?: string;
  placeholder?: string;
  helper?: string;
  isSecret?: boolean;
}
class OtherSettings implements IOtherSettings {
  field: string;
  label: string;
  value?: string;
  placeholder?: string;
  helper?: string;
  isSecret?: boolean;

  constructor(data: Partial<IOtherSettings> = {}) {
    this.field = data.field ?? '';
    this.label = data.label ?? '';
    this.value = data.value ?? '';
    this.placeholder = data.placeholder ?? '';
    this.helper = data.helper ?? '';
    this.isSecret = data.isSecret ?? false;
  }
}

class SocialSettings implements ISocialSettings {
  [key: string]: string;

  constructor(data: Partial<ISocialSettings> = {}) {
      for (let property in Object.keys(data)) {
        this[property] = data[property] ?? '';
      }
  }
}

interface ISiteSettings {
  site_logo_settings: SiteLogoSettings;
  site_banner_settings: SiteBannerSettings;
  [key: string]: any;
}

class SiteSettings implements ISiteSettings {
  site_logo_settings: SiteLogoSettings;
  site_banner_settings: SiteBannerSettings;
  settings: any;

  constructor(data: Partial<ISiteSettings> = {}) {
    this.site_logo_settings = (data.site_logo_settings || data.siteLogoSettings) ?? new SiteLogoSettings();
    this.site_banner_settings = (data.site_banner_settings || data.siteBannerSettings) ?? new SiteBannerSettings();
    this.settings = data.settings ?? {};
  }
}

interface ISite {
  site_id: number | null;
  key: string;
  name: string;
  host: string;
  theme: string;
  template: string;
  admin_email: string;
  contact_email: string;
  descriptionSettings: Description;
  localSettings: LocalSettings;
  mediaSettings: MediaSettings;
  commentSettings: CommentSettings;
  orderSettings: OrderSettings;
  seoSettings: SeoSettings;
  socialSettings: SocialSettings;
  siteSettings: SiteSettings;
  otherSettings: OtherSettings;
}

/**
 * Site Model
 * Represents a site configuration in the system
 */
export default class Site implements ISite {
  site_id: number | null;
  key: string;
  name: string;
  host: string;
  theme: string;
  template: string;
  admin_email: string;
  contact_email: string;
  descriptionSettings: Description;
  localSettings: LocalSettings;
  mediaSettings: MediaSettings;
  commentSettings: CommentSettings;
  orderSettings: OrderSettings;
  seoSettings: SeoSettings;
  socialSettings: SocialSettings;
  siteSettings: SiteSettings;
  otherSettings: OtherSettings;
  /**
   * Creates a new Site instance
   * @param {Partial<ISite>} data - Site data
   */
  constructor(data: Partial<ISite> = {}) {
    this.site_id = data.site_id ?? null;
    this.key = data.key ?? '';
    this.name = data.name ?? '';
    this.host = data.host ?? '';
    this.theme = data.theme ?? '';
    this.template = data.template ?? '';
    this.admin_email = data.admin_email ?? '';
    this.contact_email = data.contact_email ?? '';
    this.descriptionSettings = new Description(data.descriptionSettings);
    this.localSettings = new LocalSettings(data.localSettings);
    this.mediaSettings = new MediaSettings(data.mediaSettings);
    this.commentSettings = new CommentSettings(data.commentSettings);
    this.orderSettings = new OrderSettings(data.orderSettings);
    this.seoSettings = new SeoSettings(data.seoSettings);
    this.socialSettings = new SocialSettings(data.socialSettings);
    this.siteSettings = new SiteSettings(data.siteSettings);
    this.otherSettings = new OtherSettings(data.otherSettings);
  }

  /**
   * Create a Site instance from a plain object
   * @param {Partial<ISite>} data - Plain object containing site data
   * @returns {Site} New Site instance
   */
  static fromJSON(data: Partial<ISite>): Site {
    return new Site(data);
  }
} 

export type MailEngine = 'mail' | 'smtp' | 'sendmail';
// email setting model
interface IEmailSetting {
  key: 'email_setting';
  email: string;
  password: string;
  host: string;
  port: string;
  encryption: string;
  site_id: number;
  mail_engine: MailEngine;
  mail_parameters: string;
  test_email: string;
  language_id: string;
}

export class EmailSetting implements IEmailSetting {
  key: 'email_setting';
  email: string;
  password: string;
  host: string;
  port: string;
  encryption: string;
  site_id: number;
  mail_engine: MailEngine;
  mail_parameters: string;
  test_email: string;
  language_id: string;

  constructor(data: Partial<IEmailSetting> = {}) {
    this.key = data.key ?? 'email_setting';
    this.email = data.email ?? '';
    this.password = data.password ?? '';
    this.host = data.host ?? '';
    this.port = data.port ?? '';
    this.encryption = data.encryption ?? 'tls'; // default encryption is tls
    this.site_id = data.site_id ?? 1;
    this.mail_engine = data.mail_engine ?? 'mail';
    this.mail_parameters = data.mail_parameters ?? '';
    this.test_email = data.test_email ?? '';
    this.language_id = data.language_id ?? '1';
  }

  static fromJSON(data: Partial<IEmailSetting>): EmailSetting {
    return new EmailSetting(data);
  }
}