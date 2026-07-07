<script setup>
import { ref } from 'vue';
import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Favorites',
        icon: 'pi pi-home',
        items: [
            {
                label: 'Dashboard',
                icon: 'pi pi-fw pi-home',
                to: '/'
            },
            {
                label: 'Edit Website',
                icon: 'pi pi-fw pi-pencil',
                to: '/edit'
            },
            {
                label: 'Media Library',
                icon: 'pi pi-fw pi-image',
                to: '/media-library'
            },
            {
                label: 'Users',
                icon: 'pi pi-fw pi-users',
                items: [
                    {
                        label: 'Users',
                        icon: 'pi pi-fw pi-user',
                        to: '/users/list'
                    },
                    {
                        label: 'User Groups',
                        icon: 'pi pi-fw pi-users',
                        to: '/users/groups'
                    }
                ]
            },
            {
                label: 'Messages',
                icon: 'pi pi-fw pi-envelope',
                to: '/messages'
            },
        ]
    },
    { separator: true },
    {
        label: 'Components',
        icon: 'pi pi-fw pi-cog',
        items: [
            {
                label: 'Components',
                icon: 'pi pi-fw pi-cog',
                to: '/components'
            },
            {
                label: 'Add New Component',
                icon: 'pi pi-fw pi-plus',
                to: '/components/add'
            },
        ]
    },
    { separator: true },
    {
        label: 'CONTENT',
        icon: 'pi pi-fw pi-file',
        items: [
            {
                label: 'Posts',
                icon: 'pi pi-fw pi-comments',
                items: [
                    {
                        label: 'Posts',
                        icon: 'pi pi-fw pi-comment',
                        to: '/posts/list'
                    },
                    {
                        label: 'Add New Post',
                        icon: 'pi pi-fw pi-plus',
                        to: '/posts/add'
                    },
                    {
                        label: 'Tags',
                        icon: 'pi pi-fw pi-tag',
                        to: '/posts/tags'
                    },
                    {
                        label: 'Categories',
                        icon: 'pi pi-fw pi-tags',
                        to: '/posts/categories'
                    },
                    {
                        label: 'Comments',
                        icon: 'pi pi-fw pi-comment',
                        to: '/posts/comments'
                    },
                    {
                        label: 'Import Posts',
                        icon: 'pi pi-fw pi-upload',
                        to: '/post-import'
                    }
                ]
            },
            {
                label: 'Pages',
                icon: 'pi pi-fw pi-file',
                items: [
                    {
                        label: 'Pages',
                        icon: 'pi pi-fw pi-file',
                        to: '/pages/list'
                    },
                    {
                        label: 'Add New Page',
                        icon: 'pi pi-fw pi-plus',
                        to: '/pages/add'
                    },
                    {
                        label: 'Import Pages',
                        icon: 'pi pi-fw pi-upload',
                        to: '/page-import'
                    }
                ]
            }
        ]
    },
    { separator: true },
    {
        label: 'Jobs',
        icon: 'pi pi-fw pi-briefcase',
        items: [
            {
                label: 'Job List',
                icon: 'pi pi-fw pi-list',
                to: '/jobs/list'
            },
            {
                label: 'Pinboards',
                icon: 'pi pi-fw pi-clipboard',
                to: '/pinboards/list'
            },
            {
                label: 'Add New Pinboard',
                icon: 'pi pi-fw pi-plus',
                to: '/pinboards/add'
            }
        ]
    },
    { separator: true },
    {
        label: 'Coupon Discounts',
        icon: 'pi pi-fw pi-briefcase',
        items: [
            {
                label: 'Coupon List',
                icon: 'pi pi-fw pi-list',
                to: '/coupons/list'
            },
            {
                label: 'Add New Coupon',
                icon: 'pi pi-fw pi-plus',
                to: '/coupons/add'
            },
            {
                label: 'Product Discounts',
                icon: 'pi pi-fw pi-list',
                to: '/product-discounts/list'
            },
            {
                label: 'Add Product Discount',
                icon: 'pi pi-fw pi-plus',
                to: '/product-discounts/add'
            }
        ]
    },
    { separator: true },
    {
        label: 'ECOMMERCE',
        icon: 'pi pi-fw pi-shopping-cart',
        items: [
            {
                label: 'Design Resources',
                icon: 'pi pi-fw pi-palette',
                items: [
                    {
                        label: 'Import Design Resources',
                        icon: 'pi pi-fw pi-upload',
                        to: '/design-resource-import'
                    }
                ]
            },
            {
                label: 'Categories',
                icon: 'pi pi-fw pi-palette',
                items: [
                    {
                        label: 'Import Categories',
                        icon: 'pi pi-fw pi-upload',
                        to: '/category-import'
                    }
                ]
            },
            {
                label: 'Sales',
                icon: 'pi pi-fw pi-shopping-cart',
                items: [
                    {
                        label: 'Quotes',
                        icon: 'pi pi-fw pi-comment',
                        to: '/quotes/list'
                    },
                    {
                        label: 'Add New Quote',
                        icon: 'pi pi-fw pi-plus',
                        to: '/quotes/add'
                    },
                    {
                        label: 'Orders',
                        icon: 'pi pi-fw pi-shopping-cart',
                        to: '/orders/list'
                    },
                    {
                        label: 'Add New Order',
                        icon: 'pi pi-fw pi-plus',
                        to: '/orders/add'
                    },
                    {
                        label: 'Subscriptions',
                        icon: 'pi pi-fw pi-list',
                        to: '/ecommerce/sales/subscriptions'
                    },
                    {
                        label: 'Returns',
                        icon: 'pi pi-fw pi-pencil',
                        to: '/ecommerce/sales/returns'
                    },
                    {
                        label: 'Discount Coupons',
                        icon: 'pi pi-fw pi-pencil',
                        to: '/ecommerce/sales/discount-coupons'
                    }
                ]
            },
            {
                label: 'Products',
                icon: 'pi pi-fw pi-shop',
                items: [
                    {
                        label: 'Products',
                        icon: 'pi pi-fw pi-shop',
                        to: '/ecommerce/products/list'
                    },
                    {
                        label: 'Add New Product',
                        icon: 'pi pi-fw pi-plus',
                        to: '/ecommerce/products/add'
                    },
                    {
                        label: 'Product Questions',
                        icon: 'pi pi-fw pi-question',
                        to: '/product-questions'
                    },
                    {
                        label: 'Product Reviews',
                        icon: 'pi pi-fw pi-star',
                        to: '/product-reviews'
                    },
                    {
                        label: 'Tags',
                        icon: 'pi pi-fw pi-tags',
                        to: '/ecommerce/products-tags'
                    },
                    {
                        label: 'Attributes',
                        icon: 'pi pi-fw pi-list',
                        to: '/ecommerce/attributes'
                    },
                    {
                        label: 'Options',
                        icon: 'pi pi-fw pi-list',
                        to: '/ecommerce/options'
                    },
                    {
                        label: 'Finishes',
                        icon: 'pi pi-fw pi-tags',
                        to: '/ecommerce/products-finishes'
                    },
                    {
                        label: 'Categories',
                        icon: 'pi pi-fw pi-tags',
                        to: '/ecommerce/products-categories'
                    },
                    {
                        label: 'Manufacturers',
                        icon: 'pi pi-fw pi-pencil',
                        to: '/ecommerce/products-manufacturers'
                    },
                    {
                        label: 'Vendors',
                        icon: 'pi pi-fw pi-pencil',
                        to: '/ecommerce/products-vendors'
                    },
                    {
                        label: 'Import Products',
                        icon: 'pi pi-fw pi-upload',
                        to: '/product-import'
                    },
                    {
                        label: 'Import Setup',
                        icon: 'pi pi-fw pi-upload',
                        to: '/product-setup-import'
                    }
                    
                ]
            },
            {
                label: 'Projects',
                icon: 'pi pi-fw pi-sparkles',
                items: [
                    {
                        label: 'Projects',
                        icon: 'pi pi-fw pi-sparkles',
                        to: '/ecommerce/projects'
                    },
                    {
                        label: 'Add New Project',
                        icon: 'pi pi-fw pi-plus',
                        to: '/ecommerce/projects/add'
                    },
                    {
                        label: 'Import',
                        icon: 'pi pi-fw pi-upload',
                        to: '/tools/project-import'
                    }
                ]
            },
            {
                label: 'Showrooms',
                icon: 'pi pi-fw pi-sparkles',
                to: '/showrooms/list'
            },
        ]
    },
    { separator: true },
    {
        label: 'CONFIGURATION',
        icon: 'pi pi-fw pi-cog',
        items: [
            {
                label: 'Plugins',
                icon: 'pi pi-fw pi-wrench',
                items: [
                    {
                        label: 'Installed Plugins',
                        icon: 'pi pi-fw pi-wrench',
                        to: '/configuration/plugins/installed-plugins'
                    },
                    {
                        label: 'Add New Plugin',
                        icon: 'pi pi-fw pi-plus',
                        to: '/configuration/plugins/add-new-plugin'
                    },
                    {
                        label: 'Code Editor',
                        icon: 'pi pi-fw pi-pencil',
                        to: '/configuration/plugins/code-editor'
                    },
                    {
                        label: 'Contact Form',
                        icon: 'pi pi-fw pi-envelope',
                        to: '/configuration/plugins/contact-form'
                    },
                    {
                        label: 'GraphQL',
                        icon: 'pi pi-fw pi-chart-line',
                        to: '/configuration/plugins/graphql'
                    },
                    {
                        label: 'Insert Scripts',
                        icon: 'pi pi-fw pi-code',
                        to: '/configuration/plugins/insert-scripts'
                    },
                    {
                        label: 'Open AI',
                        icon: 'pi pi-fw pi-database',
                        items: [
                            {
                                label: 'Stop Light',
                                icon: 'pi pi-fw pi-database',
                                to: '/configuration/plugins/openai/stop-light'
                            },
                            {
                                label: 'Swagger',
                                icon: 'pi pi-fw pi-database',
                                to: '/configuration/plugins/openai/swagger'
                            }
                            
                        ]
                    },
                    {
                        label: 'SEO',
                        icon: 'pi pi-fw pi-search',
                        to: '/configuration/plugins/seo'
                    }
                ]
            },
            {
                label: 'Themes',
                icon: 'pi pi-fw pi-palette',
                items: [
                    {
                        label: 'Installed Themes',
                        icon: 'pi pi-fw pi-palette',
                        to: '/configuration/themes/installed-themes'
                    },
                    {
                        label: 'Add New Theme',
                        icon: 'pi pi-fw pi-plus',
                        to: '/configuration/themes/add-theme'
                    },
                    {
                        label: 'Code Editor',
                        icon: 'pi pi-fw pi-pencil',
                        to: '/configuration/themes/code-editor'
                    }
                    
                ]
            },
            {
                label: 'Settings',
                icon: 'pi pi-fw pi-cog',
                items: [
                    {
                        label: 'Sites',
                        icon: 'pi pi-fw pi-palette',
                        items: [
                            {
                                label: 'Sites',
                                icon: 'pi pi-fw pi-palette',
                                to: '/configuration/settings/site-list'
                            },
                            {
                                label: 'Add New',
                                icon: 'pi pi-fw pi-plus',
                                to: '/configuration/settings/add-site'
                            }
                        ]
                    },
                    {
                        label: 'Admin Users',
                        icon: 'pi pi-fw pi-users',
                        items: [
                            {
                                label: 'Users',
                                icon: 'pi pi-fw pi-users',
                                to: '/configuration/settings/admin-list'
                            },
                            {
                                label: 'Add New User',
                                icon: 'pi pi-fw pi-plus',
                                to: '/configuration/settings/admin-add'
                            },
                            {
                                label: 'Manage Roles',
                                icon: 'pi pi-fw pi-user-edit',
                                to: '/configuration/settings/manage-roles'
                            },
                            {
                                label: 'Add New Role',
                                icon: 'pi pi-fw pi-plus',
                                to: '/configuration/settings/add-role'
                            }
                        ]
                    },
                    {
                        label: 'Content',
                        icon: 'pi pi-fw pi-file',
                        items: [
                            {
                                label: 'Taxonomies',
                                icon: 'pi pi-fw pi-tags',
                                to: '/configuration/settings/taxonomies'
                            },
                            {
                                label: 'Post Types',
                                icon: 'pi pi-fw pi-file',
                                to: '/configuration/settings/post-types'
                            },
                            {
                                label: 'Product Types',
                                icon: 'pi pi-fw pi-box',
                                to: '/configuration/settings/product-types'
                            },
                            { // attribute groups menu item 
                                label: 'Attribute Groups',
                                icon: 'pi pi-fw pi-box',
                                to: '/configuration/settings/attribute-groups'
                            }
                        ]
                    },
                    {
                        label: 'Ecommerce',
                        icon: 'pi pi-fw pi-shopping-cart',
                        items: [
                            {
                                label: 'Subscriptions Plans',
                                icon: 'pi pi-fw pi-users',
                                to: '/configuration/settings/subscriptions-plans'
                            },
                            {
                                label: 'Taxes',
                                icon: 'pi pi-fw pi-money-bill',
                                items: [
                                    {
                                        label: 'Tax Types',
                                        icon: 'pi pi-fw pi-tag',
                                        to: '/configuration/settings/tax-types'
                                    },
                                    {
                                        label: 'Tax Rates',
                                        icon: 'pi pi-fw pi-percent',
                                        to: '/configuration/settings/tax-rates'
                                    },
                                    
                                ]
                            },
                            {
                                label: 'Statuses',
                                icon: 'pi pi-fw pi-user-edit',
                                items: [
                                    {
                                        label: 'Stock',
                                        icon: 'pi pi-fw pi-box',
                                        to: '/configuration/settings/stock-statuses'
                                    },
                                    {
                                        label: 'Subscription',
                                        icon: 'pi pi-fw pi-bell',
                                        to: '/configuration/settings/subscription-statuses'
                                    },{
                                        label: 'Order',
                                        icon: 'pi pi-fw pi-shopping-cart',
                                        to: '/configuration/settings/order-statuses'
                                    },
                                    {
                                        label: 'Payment',
                                        icon: 'pi pi-fw pi-credit-card',
                                        to: '/configuration/settings/payment-statuses'
                                    },
                                    {
                                        label: 'Shipping',
                                        icon: 'pi pi-fw pi-truck',
                                        to: '/configuration/settings/shipping-statuses'
                                    },
                                    {
                                        label: 'Return Status',
                                        icon: 'pi pi-fw pi-info',
                                        to: '/configuration/settings/return-statuses'
                                    },
                                    {
                                        label: 'Return Resolution',
                                        icon: 'pi pi-fw pi-check',
                                        to: '/configuration/settings/return-resolutions'
                                    },
                                    {
                                        label: 'Return Reasons',
                                        icon: 'pi pi-fw pi-mars',
                                        to: '/configuration/settings/return-reasons'
                                    },
                                    
                                ]
                            },
                            {
                                label: 'Measurements',
                                icon: 'pi pi-fw pi-sliders-h',
                                items: [
                                    {
                                        label: 'Length',
                                        icon: 'pi pi-fw pi-arrows-h',
                                        to: '/configuration/settings/length'
                                    },
                                    {
                                        label: 'Weight',
                                        icon: 'pi pi-fw pi-arrows-v',
                                        to: '/configuration/settings/weight'
                                    },
                                    
                                ]
                            }
                        ]
                    },
                    {
                        label: 'Localization',
                        icon: 'pi pi-fw pi-globe',
                        items: [
                            {
                                label: 'Languages',
                                icon: 'pi pi-fw pi-language',
                                to: '/configuration/settings/languages'
                            },
                            {
                                label: 'Currencies',
                                icon: 'pi pi-fw pi-dollar',
                                to: '/configuration/settings/currencies'
                            },
                            {
                                label: 'Geo Location',
                                icon: 'pi pi-fw pi-map-marker',
                                items: [
                                    {
                                        label: 'Countries',
                                        icon: 'pi pi-fw pi-flag',
                                        to: '/configuration/settings/countries'
                                    },
                                    {
                                        label: 'Regions',
                                        icon: 'pi pi-fw pi-flag',
                                        to: '/configuration/settings/regions'
                                    },
                                    {
                                        label: 'Region Groups',
                                        icon: 'pi pi-fw pi-flag',
                                        to: '/configuration/settings/region-groups'
                                    }
                                ]
                            },
                            
                        ]
                    },
                    {
                        label: 'System',
                        icon: 'pi pi-fw pi-sitemap',
                        items: [
                            {
                                label: 'Email Settings',
                                icon: 'pi pi-fw pi-envelope',
                                to: '/configuration/settings/email-settings'
                            }
                        ]
                    }
                    
                ]
            },
            {
                label: 'Tools',
                icon: 'pi pi-fw pi-wrench',
                items: [
                    {
                        label: 'Cache',
                        icon: 'pi pi-fw pi-refresh',
                        to: '/tools/cache'
                    },
                    {
                        label: 'Backup',
                        icon: 'pi pi-fw pi-save',
                        to: '/tools/backup'
                    },
                    {
                        label: 'Cron Job',
                        icon: 'pi pi-fw pi-clock',
                        to: '/tools/cron-job'
                    },
                    {
                        label: 'Import/Export',
                        icon: 'pi pi-fw pi-upload',
                        items: [
                            {
                                label: 'Import Content',
                                icon: 'pi pi-fw pi-upload',
                                to: '/tools/import-content'
                            },
                            {
                                label: 'Export Content',
                                icon: 'pi pi-fw pi-download',
                                to: '/tools/export-content'
                            }
                        ]
                    },
                    {
                        label: 'System Info',
                        icon: 'pi pi-fw pi-info',
                        items: [
                            {
                                label: 'System Info',
                                icon: 'pi pi-fw pi-info',
                                to: '/tools/system-info'
                            },
                            {
                                label: 'Error Log',
                                icon: 'pi pi-fw pi-exclamation-triangle',
                                to: '/tools/error-log'
                            }
                        ]
                    },
                    
                ]
            },
            {
                label: 'GraphQL',
                icon: 'pi pi-fw pi-chart-line',
                to: '/graphql'
            },
            {
                label: 'Open AI',
                icon: 'pi pi-fw pi-database',
                items: [
                    {
                        label: 'Stop Light',
                        icon: 'pi pi-fw pi-database',
                        to: '/openai/stop-light'
                    },
                    {
                        label: 'Swagger',
                        icon: 'pi pi-fw pi-database',
                        to: '/openai/swagger'
                    }
                    
                ]
            },
            {
                label: 'SEO',
                icon: 'pi pi-fw pi-search',
                to: '/seo'
            }
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <AppMenuItem v-if="!item.separator" :item="item" root :index="i" />

            <li v-else class="menu-separator" />
        </template>
    </ul>
</template>
