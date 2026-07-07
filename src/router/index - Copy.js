import AppLayout from '@/layout/AppLayout.vue';
import AuthLayout from '@/layout/AuthLayout.vue';
import BlankPage from '@/views/BlankPage.vue';
import FolderView from '@/views/FolderView.vue';
import FolderDetailsView from '@/views/media/FolderDetailsView.vue';
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        component: AppLayout,
        children: [
            {
                path: '/',
                name: 'e-commerce',
                meta: {
                    breadcrumb: ['E-Commerce Dashboard']
                },
                component: () => import('@/views/BlankPage.vue')
            },
            {
                path: '/dashboard-banking',
                name: 'dashboard-banking',
                meta: {
                    breadcrumb: ['Banking Dashboard']
                },
                component: () => import('@/views/BlankPage.vue')
            },
            {
                path: '/dashboard-marketing',
                name: 'dashboard-marketing',
                meta: {
                    breadcrumb: ['Marketing Dashboard']
                },
                component: () => import('@/views/BlankPage.vue')
            },
            {
                path: '/edit',
                name: 'Edit Website',
                meta: {
                    breadcrumb: ['Edit Website']
                },
                component: () => import('@/views/BlankPage.vue')
            },
            {
                path: '/post-import',
                name: 'Post Import',
                component: () => import('@/views/PostImport.vue')
            },
            {
                path: '/category-import',
                name: 'Category Import',
                component: () => import('@/views/CategoryImport.vue')
            },
            /**
             * Showroom Routes start here
             */
            // // {
            // //     path: '/showrooms/list',
            // //     name: 'showroom-list',
            // //     component: () => import('@/views/ShowroomIndex.vue')
            // // },
            // // {
            // //     path: '/showrooms/add',
            // //     name: 'add-showroom',
            // //     component: () => import('@/views/showrooms/ShowroomAdd.vue'),
            // //     children: [
            // //         {
            // //             path: "",
            // //             redirect: { name: "showroom-general-add" },
            // //             name: 'showroom-add-main'
            // //         },
            // //         {
            // //             path: 'general',
            // //             name: 'showroom-general-add',
            // //             component: () => import('@/views/showrooms/components/ShowroomGeneral.vue')
            // //         }
            // //     ]
            // // },
            // {
            //     path: '/showrooms/:id',
            //     name: 'edit-showroom',
            //     props: true,
            //     component: () => import('@/views/showrooms/ShowroomEdit.vue'),
            //     children: [
            //         {
            //             path: "",
            //             redirect: { name: "showroom-general-edit" },
            //             name: 'showroom-edit-main'
            //         },
            //         {
            //             path: 'general',
            //             name: 'showroom-general-edit',
            //             component: () => import('@/views/showrooms/components/ShowroomGeneral.vue')
            //         },
            //         {
            //             path: 'sections',
            //             name: 'showroom-section-edit',
            //             // component: () => import('@/views/showrooms/components/ShowroomSections.vue')
            //             component: () => import('@/views/showrooms/components/ShowroomSections.vue')
            //         },
            //     ]
            // },
            {
                path: '/showroom/:showroomSlug/section/:id',
                name: 'edit-showroom-section',
                props: true,
                component: () => import('@/views/showrooms/ShowroomSectionEdit.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "showroom-section-general-edit" },
                        name: 'showroom-section-edit-main'
                    },
                    {
                        path: 'general',
                        name: 'showroom-section-general-edit',
                        component: () => import('@/views/showrooms/components/ShowroomSectionGeneral.vue')

                    },
                    {
                        path: 'products',
                        name: 'showroom-section-products-edit',
                        component: () => import('@/views/showrooms/components/ShowroomSectionProducts.vue')
                    },
                    {
                        path: 'images',
                        name: 'showroom-section-images-edit',
                        component: () => import('@/views/showrooms/components/ShowroomSectionImages.vue')
                    },
                ]
            },
            // {
            //     path: '/tools/showroom-import',
            //     name: 'Showroom Section Image Product Import',
            //     component: () => import('@/views/ShowroomImport.vue')
            // },
            /////////////////////

            { // base setup content atribute groups routes start
                path: '/showrooms',
                name: 'showrooms',
                props: true,
                component: () => import('@/views/showrooms/Showroom.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "showrooms-list" },
                        name: 'showrooms-main'
                    },
                    {
                        path: 'list',
                        name: 'showrooms-list',
                        component: () => import('@/views/showrooms/pages/ShowroomList.vue')
                    },
                    {
                        path: 'add',
                        name: 'showrooms-add',
                        component: () => import('@/views/showrooms/pages/ShowroomAdd.vue'),
                        children: [
                            {
                                path: "",
                                redirect: { name: "showroom-general-add" },
                                name: 'showroom-add-main'
                            },
                            {
                                path: 'general',
                                name: 'showroom-general-add',
                                component: () => import('@/views/showrooms/components/ShowroomGeneral.vue')
                            }
                        ]
                    },
                    {
                        path: 'edit/:id',
                        name: 'showrooms-edit',
                        props: true,
                        component: () => import('@/views/showrooms/pages/ShowroomEdit.vue'),
                        children: [
                            {
                                path: "",
                                redirect: { name: "showroom-general-edit" },
                                name: 'showroom-edit-main'
                            },
                            {
                                path: 'general',
                                name: 'showroom-general-edit',
                                component: () => import('@/views/showrooms/components/ShowroomGeneral.vue')
                            },
                            {
                                path: 'sections',
                                name: 'showroom-section-edit',
                                component: () => import('@/views/showrooms/components/ShowroomSections.vue')
                            }
                        ]
                    },
                    {
                        path: 'import',
                        name: 'showrooms-import',
                        component: () => import('@/views/attribute-group/components/AttributeGroupImport.vue')
                    },
                ]
            },
            /**
             * Showroom Route end here
             */
            {
                path: '/posts/list',
                name: 'Post List',
                component: () => import('@/views/PostsIndex.vue')
            },
            {
                path: '/posts/add',
                name: 'add-post',
                component: () => import('@/views/posts/PostAdd.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "post-general-add" },
                        name: 'post-add-main'
                    },
                    {
                        path: 'general',
                        name: 'post-general-add',
                        component: () => import('@/views/posts/components/PostGeneral.vue')
                    },
                    {
                        path: 'seo',
                        name: 'post-seo-add',
                        component: () => import('@/views/posts/components/PostSeo.vue')
                    }
                ]
            },
            {
                path: '/posts/:id',
                name: 'edit-post',
                props: true,
                component: () => import('@/views/posts/PostEdit.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "post-general-edit" },
                        name: 'post-edit-main'
                    },
                    {
                        path: 'general',
                        name: 'post-general-edit',
                        component: () => import('@/views/posts/components/PostGeneral.vue')
                    },
                    {
                        path: 'seo',
                        name: 'post-seo-edit',
                        component: () => import('@/views/posts/components/PostSeo.vue')
                    },
                    {
                        path: 'images',
                        name: 'post-image-gallery-add',
                        component: () => import('@/views/posts/components/PostImages.vue')
                    }
                ]
            },
            { // page list
                path: '/pages/list',
                name: 'page-list',
                component: () => import('@/views/PageIndex.vue')
            },
            {
                path: '/page-import',
                name: 'Page Import',
                component: () => import('@/views/PageImport.vue')
            },
            { // page add 
                path: '/pages/add',
                name: 'add-page',
                component: () => import('@/views/pages/PageAdd.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "page-general-add" },
                        name: 'page-add-main'
                    },
                    {
                        path: 'general',
                        name: 'page-general-add',
                        component: () => import('@/views/pages/components/PageGeneral.vue')
                    },
                    {
                        path: 'seo',
                        name: 'page-seo-add',
                        component: () => import('@/views/pages/components/PageSeo.vue')
                    },
                ]
            },
            { // page edit 
                path: '/pages/:id',
                name: 'edit-page',
                props: true,
                component: () => import('@/views/pages/PageEdit.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "page-general-edit" },
                        name: 'page-edit-main'
                    },
                    { // edit
                        path: 'general',
                        name: 'page-general-edit',
                        component: () => import('@/views/pages/components/PageGeneral.vue')
                    },
                    { // seo
                        path: 'seo',
                        name: 'page-seo-edit',
                        component: () => import('@/views/pages/components/PageSeo.vue')
                    },
                ]
            },
            {
                path: '/jobs/:job_id',
                name: 'Job Details',
                component: () => import('@/views/jobs/JobDetails.vue')
            },
            {
                path: '/jobs/list',
                name: 'Job List',
                component: () => import('@/views/jobs/JobList.vue')
            },
            {
                path: '/pinboards/list',
                name: 'Pinboard List',
                component: () => import('@/views/pinboards/PinboardIndex.vue')
            },
            {
                path: '/pinboards/add',
                name: 'add-pinboard',
                component: () => import('@/views/pinboards/PinboardAdd.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "pinboard-overview-add" },
                        name: 'pinboard-add-main'
                    },
                    {
                        path: 'overview',
                        name: 'pinboard-overview-add',
                        component: () => import('@/views/pinboards/components/PinboardOverview.vue')
                    },
                    {
                        path: 'items',
                        name: 'pinboard-items-add',
                        component: () => import('@/views/pinboards/components/PinboardItems.vue')
                    },
                ]
            },
            {
                path: '/pinboards/:id',
                name: 'edit-pinboard',
                props: true,
                component: () => import('@/views/pinboards/PinboardEdit.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "pinboard-overview-edit" },
                        name: 'pinboard-edit-main'
                    },
                    {
                        path: 'overview',
                        name: 'pinboard-overview-edit',
                        component: () => import('@/views/pinboards/components/PinboardOverview.vue')
                    },
                    {
                        path: 'items',
                        name: 'pinboard-items-edit',
                        component: () => import('@/views/pinboards/components/PinboardItems.vue')
                    },
                ]
            },
            {
                path: '/posts/tags',
                name: 'Posts Tags',
                component: () => import('@/views/PostTagIndex.vue')
            },
            {
                path: '/posts/add-tag',
                name: 'Add Post Tag',
                component: () => import('@/views/PostTagAdd.vue')
            },
            {
                path: '/posts/edit-tag/:id',
                name: 'Edit Post Tag',
                component: () => import('@/views/PostTagEdit.vue')
            },
            {
                path: '/posts/categories',
                name: 'Posts Categories',
                component: () => import('@/views/CategoryIndex.vue')
            },
            {
                path: '/posts/comments',
                name: 'Posts Comments',
                component: () => import('@/views/CommentIndex.vue')
            },
            {
                path: '/posts/add-comment',
                name: 'Add Comment',
                component: () => import('@/views/CommentAdd.vue')
            },
            {
                path: '/posts/edit-comments/:id',
                name: 'Edit Comment',
                component: () => import('@/views/CommentEdit.vue')
            },
            {
                path: '/pages/list',
                name: 'Pages List',
                component: () => import('@/views/PageIndex.vue')
            },
            {
                path: '/pages/menus',
                name: 'Pages Menus',
                component: () => import('@/views/MenuIndex.vue')
            },
            {
                path: '/media-library',
                name: 'Media Library',
                component: () => import('@/views/MediaLibrary.vue')
            },
            {
                path: '/media-library/folder',
                name: 'folder-view',
                component: () => import('@/views/FolderView.vue'),
                props: true,
                children: [
                    {
                        path: "",
                        redirect: { name: "folder-view-id" },
                        name: 'folder-view-main'
                    },
                    {
                        path: ':id',
                        name: 'folder-view-id',
                        component: () => import('@/views/media/FolderDetailsView.vue'),
                        props: true
                    }

                ]
            },
            {
                path: '/users/list',
                name: 'Users List',
                component: () => import('@/views/UserIndex.vue')
            },
            {
                path: '/user/add-user',
                name: 'Add User',
                component: () => import('@/views/UserAdd.vue')
            },
            {
                path: '/users/edit-user/:id',
                name: 'Edit User',
                component: () => import('@/views/UserEdit.vue')
            },
            {
                path: '/users/groups',
                name: 'Users Groups',
                component: () => import('@/views/UserGroupIndex.vue')
            },
            {
                path: '/users/add-groups',
                name: 'Add User Group',
                component: () => import('@/views/UserGroupAdd.vue')
            },
            {
                path: '/users/edit-groups/:id',
                name: 'Edit User Group',
                component: () => import('@/views/UserGroupEdit.vue')
            },

            {
                path: '/messages',
                name: 'Messages',
                component: () => import('@/views/messages/MessageIndex.vue')
            },
            {
                path: '/add-message',
                name: 'Add Message',
                component: () => import('@/views/messages/MessageAdd.vue')
            },
            {
                path: '/edit-message/:id',
                name: 'Edit Message',
                component: () => import('@/views/messages/MessageEdit.vue')
            },
            {
                path: '/quotes/list',
                name: 'Quote List',
                component: () => import('@/views/quotes/QuoteIndex.vue')
            },
            {
                path: '/quotes/add',
                name: 'add-quote',
                component: () => import('@/views/quotes/components/QuoteAdd.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "quote-overview-add" },
                        name: 'quote-add-main'
                    },
                    {
                        path: 'overview',
                        name: 'quote-overview-add',
                        component: () => import('@/views/quotes/components/QuoteOverview.vue')
                    },
                    {
                        path: 'items',
                        name: 'quote-items-add',
                        component: () => import('@/views/quotes/components/QuoteItems.vue')
                    },
                ]
            },
            {
                path: '/quotes/:id',
                name: 'edit-quote',
                props: true,
                component: () => import('@/views/quotes/components/QuoteEdit.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "quote-overview-edit" },
                        name: 'quote-edit-main'
                    },
                    {
                        path: 'overview',
                        name: 'quote-overview-edit',
                        component: () => import('@/views/quotes/components/QuoteOverview.vue')
                    },
                    {
                        path: 'items',
                        name: 'quote-items-edit',
                        component: () => import('@/views/quotes/components/QuoteItems.vue')
                    },
                ]
            },
            {
                path: '/components',
                name: 'component-index',
                component: () => import('@/views/components/ComponentIndex.vue'),
            },
            {
                path: '/components/add',
                name: 'component-add',
                component: () => import('@/views/components/ComponentAdd.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "component-add-overview" },
                        name: 'component-add-main'
                    },
                    {
                        path: 'overview',
                        name: 'component-add-overview',
                        component: () => import('@/views/components/components/ComponentOverview.vue')
                    }
                ]
            },
            {
                path: '/components/:id',
                name: 'component-edit',
                props: true,
                component: () => import('@/views/components/ComponentEdit.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "component-overview" },
                        name: 'component-edit-main'
                    },
                    {
                        path: 'overview',
                        name: 'component-overview',
                        component: () => import('@/views/components/components/ComponentOverview.vue')
                    },
                    {
                        path: 'items',
                        name: 'component-items',
                        props: true,
                        component: () => import('@/views/components/components/ComponentItems.vue')
                    }
                ]
            },
            {
                path: '/orders/list',
                name: 'Orders',
                component: () => import('@/views/orders/OrderIndex.vue')
            },
            {
                path: '/orders/add',
                name: 'add-order',
                component: () => import('@/views/orders/OrderAdd.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "order-overview-add" },
                        name: 'order-add-main'
                    },
                    {
                        path: 'overview',
                        name: 'order-overview-add',
                        component: () => import('@/views/orders/components/OrderOverview.vue')
                    },
                    {
                        path: 'items',
                        name: 'order-items-add',
                        component: () => import('@/views/orders/components/OrderItems.vue')
                    },
                ]
            },
            {
                path: '/orders/:id',
                name: 'edit-order',
                props: true,
                component: () => import('@/views/orders/OrderEdit.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "order-overview-edit" },
                        name: 'order-edit-main'
                    },
                    {
                        path: 'overview',
                        name: 'order-overview-edit',
                        component: () => import('@/views/orders/components/OrderOverview.vue')
                    },
                    {
                        path: 'items',
                        name: 'order-items-edit',
                        component: () => import('@/views/orders/components/OrderItems.vue')
                    },
                ]
            },
            {
                path: '/coupons/list',
                name: 'Coupon List',
                component: () => import('@/views/discount-coupons/CouponIndex.vue')
            },
            {
                path: '/coupons/add',
                name: 'add-coupon',
                component: () => import('@/views/discount-coupons/CouponAdd.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "coupon-overview-add" },
                        name: 'coupon-add-main'
                    },
                    {
                        path: 'overview',
                        name: 'coupon-overview-add',
                        component: () => import('@/views/discount-coupons/components/CouponOverview.vue')
                    },
                    {
                        path: 'products',
                        name: 'coupon-products-add',
                        component: () => import('@/views/discount-coupons/components/CouponProducts.vue')
                    },
                ]
            },
            {
                path: '/coupons/:id',
                name: 'edit-coupon',
                props: true,
                component: () => import('@/views/discount-coupons/CouponEdit.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "coupon-overview-edit" },
                        name: 'coupon-edit-main'
                    },
                    {
                        path: 'overview',
                        name: 'coupon-overview-edit',
                        component: () => import('@/views/discount-coupons/components/CouponOverview.vue')
                    },
                    {
                        path: 'products',
                        name: 'coupon-products-edit',
                        component: () => import('@/views/discount-coupons/components/CouponProducts.vue')
                    },
                ]
            },
            {
                path: '/ecommerce/sales/subscriptions',
                name: 'Subscriptions',
                component: () => import('@/views/SubscriptionIndex.vue')
            },
            {
                path: '/ecommerce/sales/subscriptions/add',
                name: 'Add Subscription',
                component: () => import('@/views/SubscriptionAdd.vue')
            },
            {
                path: '/ecommerce/sales/subscriptions/edit/:id',
                name: 'Edit Subscription',
                component: () => import('@/views/SubscriptionEdit.vue')
            },
            {
                path: '/ecommerce/sales/returns',
                name: 'Returns',
                component: () => import('@/views/ReturnIndex.vue')
            },
            {
                path: '/ecommerce/sales/add-return',
                name: 'Add Return',
                component: () => import('@/views/ReturnAdd.vue')
            },
            {
                path: '/ecommerce/sales/edit-return/:id',
                name: 'Edit Return',
                component: () => import('@/views/ReturnEdit.vue')
            },
            
            {
                path: '/ecommerce/projects',
                name: 'projects-list',
                component: () => import('@/views/projects/ProjectIndex.vue')
            },
            {
                path: '/ecommerce/projects/add',
                name: 'add-project',
                component: () => import('@/views/projects/ProjectAdd.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "project-general-add" },
                        name: 'project-add-main'
                    },
                    {
                        path: 'general',
                        name: 'project-general-add',
                        component: () => import('@/views/projects/components/ProjectGeneral.vue')
                    },
                    {
                        path: 'images',
                        name: 'project-image-gallery-add',
                        component: () => import('@/views/projects/components/ProjectImages.vue')
                    },
                ]
            },
            {
                path: '/ecommerce/projects/:id',
                name: 'edit-project',
                props: true,
                component: () => import('@/views/projects/ProjectEdit.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "project-general-edit" },
                        name: 'project-edit-main'
                    },
                    {
                        path: 'general',
                        name: 'project-general-edit',
                        component: () => import('@/views/projects/components/ProjectGeneral.vue')
                    },
                    {
                        path: 'images',
                        name: 'project-image-gallery-edit',
                        component: () => import('@/views/projects/components/ProjectImages.vue')
                    },
                ]
            },
            {
                path: '/tools/project-import',
                name: 'Project Import',
                component: () => import('@/views/ProjectImport.vue')
            },
            {
                path: '/design-resource-import',
                name: 'Design Resource Import',
                component: () => import('@/views/DesignResourceImport.vue')
            },
            {
                path: '/product-import',
                name: 'Product Import',
                component: () => import('@/views/ProductImport.vue')
            },
            {
                path: '/product-setup-import',
                name: 'Product Setup Import',
                component: () => import('@/views/ProductSetupImport.vue')
            },
            {
                path: '/ecommerce/products/list',
                name: 'Products List',
                component: () => import('@/views/ProductIndex.vue')
            },
            {
                path: '/ecommerce/products/add',
                name: 'add-product',
                component: () => import('@/views/products/ProductAdd.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "product-general-add" },
                        name: 'product-add-main'
                    },
                    {
                        path: 'general',
                        name: 'product-general-add',
                        component: () => import('@/views/products/components/ProductGeneral.vue')
                    },
                    {
                        path: 'relations',
                        name: 'product-relations-add',
                        component: () => import('@/views/products/components/ProductRelations.vue')
                    },
                    {
                        path: 'attribute',
                        name: 'product-attribute-add',
                        component: () => import('@/views/products/components/ProductAttribute.vue')
                    },
                    {
                        path: 'option',
                        name: 'product-option-add',
                        component: () => import('@/views/products/components/ProductVariantOption.vue')
                    },
                    {
                        path: 'uploader',
                        name: 'product-uploader-add',
                        component: () => import('@/views/products/components/ProductUploader.vue')
                    },
                    {
                        path: 'configuration',
                        name: 'product-configuration-add',
                        component: () => import('@/views/products/components/ProductConfiguration.vue')
                    },
                    {
                        path: 'variant',
                        name: 'product-variant-add',
                        component: () => import('@/views/products/components/ProductVariant.vue')
                    },
                    {
                        path: 'inventory',
                        name: 'product-inventory-add',
                        component: () => import('@/views/products/components/ProductInventory.vue')
                    },
                    {
                        path: 'shipping',
                        name: 'product-shipping-add',
                        component: () => import('@/views/products/components/ProductShipping.vue')
                    },
                    {
                        path: 'image-gallery',
                        name: 'product-image-gallery-add',
                        component: () => import('@/views/products/components/ProductImageGallery.vue')
                    },
                    {
                        path: 'promotion',
                        name: 'product-promotion-add',
                        component: () => import('@/views/products/components/ProductPromotion.vue')
                    },
                    {
                        path: 'seo',
                        name: 'product-seo-add',
                        component: () => import('@/views/products/components/ProductSeo.vue')
                    }
                ]
            },
            {
                path: '/ecommerce/products/:id',
                name: 'edit-product',
                props: true,
                component: () => import('@/views/products/ProductEdit.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "product-general-edit" },
                        name: 'product-edit-main'
                    },
                    {
                        path: 'general',
                        name: 'product-general-edit',
                        component: () => import('@/views/products/components/ProductGeneral.vue')
                    },
                    {
                        path: 'relations',
                        name: 'product-relations-edit',
                        component: () => import('@/views/products/components/ProductRelations.vue')
                    },
                    {
                        path: 'attribute',
                        name: 'product-attribute-edit',
                        component: () => import('@/views/products/components/ProductAttribute.vue')
                    },
                    {
                        path: 'option',
                        name: 'product-option-edit',
                        component: () => import('@/views/products/components/ProductVariantOption.vue')
                    },
                    {
                        path: 'uploader',
                        name: 'product-uploader-edit',
                        component: () => import('@/views/products/components/ProductUploader.vue')
                    },
                    {
                        path: 'configuration',
                        name: 'product-configuration-edit',
                        component: () => import('@/views/products/components/ProductConfiguration.vue')
                    },
                    {
                        path: 'variant',
                        name: 'product-variant-edit',
                        component: () => import('@/views/products/components/ProductVariant.vue')
                    },
                    {
                        path: 'inventory',
                        name: 'product-inventory-edit',
                        component: () => import('@/views/products/components/ProductInventory.vue')
                    },
                    {
                        path: 'shipping',
                        name: 'product-shipping-edit',
                        component: () => import('@/views/products/components/ProductShipping.vue')
                    },
                    {
                        path: 'image-gallery',
                        name: 'product-image-gallery-edit',
                        component: () => import('@/views/products/components/ProductImageGallery.vue')
                    },
                    {
                        path: 'promotion',
                        name: 'product-promotion-edit',
                        component: () => import('@/views/products/components/ProductPromotion.vue')
                    },
                    {
                        path: 'seo',
                        name: 'product-seo-edit',
                        component: () => import('@/views/products/components/ProductSeo.vue')
                    }
                ]
            },
            {
                path: '/product-questions',
                name: 'Product Questions',
                component: () => import('@/views/product-questions/ProductQuestionIndex.vue')
            },
            {
                path: '/product-reviews',
                name: 'Product Reviews',
                component: () => import('@/views/product-reviews/ProductReviewIndex.vue')
            },
            {
                path: '/ecommerce/products-tags',
                name: 'Products Tags',
                component: () => import('@/views/ProductTagIndex.vue')
            },
            {
                path: '/ecommerce/products-tags/add',
                name: 'Add Tag',
                component: () => import('@/views/ProductTagAdd.vue')
            },
            {
                path: '/ecommerce/products-tags/:id',
                name: 'Edit Tag',
                component: () => import('@/views/ProductTagEdit.vue')
            },
            {
                path: '/ecommerce/attributes',
                name: 'attributes',
                props: true,
                component: () => import('@/views/attribute/Attribute.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "attributes-list" },
                        name: 'attributes-main'
                    },
                    {
                        path: 'list',
                        name: 'attributes-list',
                        component: () => import('@/views/attribute/components/AttributeList.vue')
                    },
                    {
                        path: 'add',
                        name: 'attributes-add',
                        component: () => import('@/views/attribute/components/AttributeAdd.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'attributes-edit',
                        props: true,
                        component: () => import('@/views/attribute/components/AttributeEdit.vue')
                    },
                    {
                        path: 'import',
                        name: 'attributes-import',
                        component: () => import('@/views/attribute/components/AttributeImport.vue')
                    },
                ]
            },
            { // base setup content atribute groups routes start
                path: '/configuration/settings/attribute-groups',
                name: 'attribute-groups',
                props: true,
                component: () => import('@/views/attribute-group/AttributeGroup.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "attribute-groups-list" },
                        name: 'attribute-groups-main'
                    },
                    {
                        path: 'list',
                        name: 'attribute-groups-list',
                        component: () => import('@/views/attribute-group/components/AttributeGroupList.vue')
                    },
                    {
                        path: 'add',
                        name: 'attribute-groups-add',
                        component: () => import('@/views/attribute-group/components/AttributeGroupAdd.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'attribute-groups-edit',
                        props: true,
                        component: () => import('@/views/attribute-group/components/AttributeGroupEdit.vue')
                    },
                    {
                        path: 'import',
                        name: 'attribute-groups-import',
                        component: () => import('@/views/attribute-group/components/AttributeGroupImport.vue')
                    },
                ]
            },
            // end base setup attribute groups  
            // option routes
            {
                path: '/ecommerce/options',
                name: 'options',
                props: true,
                component: () => import('@/views/option/Option.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "options-list" },
                        name: 'options-main'
                    },
                    {
                        path: 'list',
                        name: 'options-list',
                        component: () => import('@/views/option/components/OptionList.vue')
                    },
                    {
                        path: 'add',
                        name: 'options-add',
                        component: () => import('@/views/option/components/OptionAdd.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'options-edit',
                        props: true,
                        component: () => import('@/views/option/components/OptionEdit.vue')
                    },
                    {
                        path: 'import',
                        name: 'options-import',
                        component: () => import('@/views/option/components/OptionImport.vue')
                    },
                ]
            },
            {
                path: '/ecommerce/products-attributes/add',
                name: 'Add Attribute',
                component: () => import('@/views/ProductAttributeIndex.vue')
            },
            {
                path: '/ecommerce/products-attributes/:id',
                name: 'Edit Attribute',
                component: () => import('@/views/attribute/Attribute.vue')
            },
            {
                path: '/ecommerce/products-finishes',
                name: 'Products Finishes',
                component: () => import('@/views/ProductFinishIndex.vue')
            },
            {
                path: '/ecommerce/products-finishes/add',
                name: 'Add Finish',
                component: () => import('@/views/ProductFinishAdd.vue')
            },
            {
                path: '/ecommerce/products-finishes/:id',
                name: 'Edit Finish',
                component: () => import('@/views/ProductFinishEdit.vue')
            },
            {
                path: '/ecommerce/products-categories',
                name: 'Products Categories',
                component: () => import('@/views/CategoryIndex.vue')
            },
            {
                path: '/ecommerce/products-manufacturers',
                name: 'Products Manufacturers',
                component: () => import('@/views/ManufacturerIndex.vue')
            },
            {
                path: '/ecommerce/products-manufacturers/add',
                name: 'Add Manufacturer',
                component: () => import('@/views/ManufacturerAdd.vue')
            },
            {
                path: '/ecommerce/products-manufacturers/edit/:id',
                name: 'Edit Manufacturer',
                component: () => import('@/views/ManufacturerEdit.vue')
            },
            {
                path: '/ecommerce/products-vendors',
                name: 'Products Vendors',
                component: () => import('@/views/VendorIndex.vue')
            },
            {
                path: '/ecommerce/products-vendors/add',
                name: 'Add Vendor', 
                component: () => import('@/views/VendorAdd.vue')
            },
            {
                path: '/ecommerce/products-vendors/edit/:id',
                name: 'Edit Vendor',
                component: () => import('@/views/VendorEdit.vue')
            },
            {
                path: '/configuration/plugins/installed-plugins',
                name: 'Installed Plugins',
                component: () => import('@/views/InstalledPluginIndex.vue')
            },
            {
                path: '/configuration/plugins/add-new-plugin',
                name: 'Add New Plugin',
                component: () => import('@/views/PluginAdd.vue')
            },
            {
                path: '/configuration/plugins/code-editor',
                name: 'Plugin Code Editor',
                component: () => import('@/views/BlankPage.vue')
            },
            {
                path: '/configuration/plugins/contact-form',
                name: 'Contact Form',
                component: () => import('@/views/BlankPage.vue')
            },
            {
                path: '/configuration/plugins/graphql',
                name: 'Plugin GraphQL',
                component: () => import('@/views/BlankPage.vue')
            },
            {
                path: '/configuration/plugins/insert-scripts',
                name: 'Insert Scripts',
                component: () => import('@/views/BlankPage.vue')
            },
            {
                path: '/configuration/plugins/openai/stop-light',
                name: 'Plugin OpenAI Stop Light',
                component: () => import('@/views/BlankPage.vue')
            },
            {
                path: '/configuration/plugins/openai/swagger',
                name: 'Plugin OpenAI Swagger',
                component: () => import('@/views/BlankPage.vue')
            },
            {
                path: '/configuration/plugins/seo',
                name: 'Plugin SEO',
                component: () => import('@/views/BlankPage.vue')
            },
            {
                path: '/configuration/themes/installed-themes',
                name: 'Installed Themes',
                component: () => import('@/views/BlankPage.vue')
            },
            {
                path: '/configuration/themes/add-theme',
                name: 'Add Theme',
                component: () => import('@/views/BlankPage.vue')
            },
            {
                path: '/configuration/themes/code-editor',
                name: 'Code Editor',
                component: () => import('@/views/BlankPage.vue')
            },
            {
                path: '/configuration/settings/site-list',
                name: 'site-add',
                component: () => import('@/views/SitesIndex.vue')
            },
            {
                path: '/configuration/settings/add-site',
                name: 'Add Site',
                component: () => import('@/views/site/SiteAdd.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "general-settings" },
                        name: 'site-add-main'
                    },
                    {
                        path: '/configuration/settings/add-site/general-settings',
                        name: 'general-settings',
                        component: () => import('@/views/site/components/SiteGeneralSettings.vue')
                    },
                    {
                        path: '/configuration/settings/add-site/local-settings',
                        name: 'Local Settings',
                        component: () => import('@/views/site/components/SiteLocalSettings.vue')
                    },
                    {
                        path: '/configuration/settings/add-site/media-settings',
                        name: 'Media Settings',
                        component: () => import('@/views/site/components/SiteMediaSettings.vue')
                    },
                    {
                        path: '/configuration/settings/add-site/comment-settings',
                        name: 'Comment Settings',
                        component: () => import('@/views/site/components/SiteCommentSettings.vue')
                    },
                    {
                        path: '/configuration/settings/add-site/order-settings',
                        name: 'Order Settings',
                        component: () => import('@/views/site/components/SiteOrderSettings.vue')
                    },
                    {
                        path: '/configuration/settings/add-site/seo-settings',
                        name: 'SEO Settings',
                        component: () => import('@/views/site/components/SiteSeoSettings.vue')
                    },
                    {
                        path: '/configuration/settings/add-site/other-settings',
                        name: 'Other Settings',
                        component: () => import('@/views/site/components/SiteOtherSettings.vue')
                    }
                ]
            },
            {
                path: '/configuration/settings/sites/:id',
                name: 'Edit Site',
                props: true,
                component: () => import('@/views/site/SiteEdit.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "general-settings-edit" },
                        name: 'site-edit-main'
                    },
                    {
                        path: 'general-settings',
                        name: 'general-settings-edit',
                        component: () => import('@/views/site/components/SiteGeneralSettings.vue')
                    },
                    {
                        path: 'local-settings',
                        name: 'local-settings-edit',
                        component: () => import('@/views/site/components/SiteLocalSettings.vue')
                    },
                    {
                        path: 'media-settings',
                        name: 'media-settings-edit',
                        component: () => import('@/views/site/components/SiteMediaSettings.vue')
                    },
                    {
                        path: 'comment-settings',
                        name: 'comment-settings-edit',
                        component: () => import('@/views/site/components/SiteCommentSettings.vue')
                    },
                    {
                        path: 'order-settings',
                        name: 'order-settings-edit',
                        component: () => import('@/views/site/components/SiteOrderSettings.vue')
                    },
                    {
                        path: 'seo-settings',
                        name: 'seo-settings-edit',
                        component: () => import('@/views/site/components/SiteSeoSettings.vue')
                    },
                    {
                        path: 'other-settings',
                        name: 'other-settings-edit',
                        component: () => import('@/views/site/components/SiteOtherSettings.vue')
                    }
                ]
            },
            {
                path: '/configuration/settings/admin-list',
                name: 'Admin List',
                component: () => import('@/views/AdminsIndex.vue')
            },
            {
                path: '/configuration/settings/admin-add',
                name: 'Add Admin',
                component: () => import('@/views/AdminAdd.vue')
            },
            {
                path: '/configuration/settings/admin-edit/:id',
                name: 'Edit Admin',
                component: () => import('@/views/AdminEdit.vue')
            },
            {
                path: '/configuration/settings/manage-roles',
                name: 'Manage Roles',
                component: () => import('@/views/RolesIndex.vue')
            },
            {
                path: '/configuration/settings/add-role',
                name: 'Add Role',
                component: () => import('@/views/RoleAdd.vue')
            },
            {
                path: '/configuration/settings/edit-role/:id',
                name: 'Edit Role',
                component: () => import('@/views/RoleEdit.vue')
            },
            {
                path: '/configuration/settings/taxonomies',
                name: 'Taxonomies',
                component: () => import('@/views/TaxonomyIndex.vue')
            },
            {
                path: '/configuration/settings/add-taxonomy',
                name: 'Add Taxonomy',
                component: () => import('@/views/TaxonomyAdd.vue')
            },
            {
                path: '/configuration/settings/edit-taxonomy/:id',
                name: 'Edit Taxonomy',
                component: () => import('@/views/TaxonomyEdit.vue')
            },
            {
                path: '/configuration/settings/post-types',
                name: 'Post Types',
                component: () => import('@/views/PostTypesIndex.vue')
            },
            {
                path: '/configuration/settings/add-post-type',
                name: 'Add Post Type',
                component: () => import('@/views/PostTypeAdd.vue')
            },
            {
                path: '/configuration/settings/edit-post-type/:id',
                name: 'Edit Post Type',
                component: () => import('@/views/PostTypeEdit.vue')
            },
            {
                path: '/configuration/settings/product-types',
                name: 'Product Types',
                component: () => import('@/views/ProductTypeIndex.vue')
            },
            {
                path: '/configuration/settings/add-product-type',
                name: 'Add Product Type',
                component: () => import('@/views/ProductTypeAdd.vue')
            },
            {
                path: '/configuration/settings/edit-product-type/:id',
                name: 'Edit Product Type',
                component: () => import('@/views/ProductTypeEdit.vue')
            },
            {
                path: '/configuration/settings/subscriptions-plans',
                name: 'Subscriptions Plans',
                component: () => import('@/views/SubscriptionPlanIndex.vue')
            },
            {
                path: '/configuration/settings/add-subscription-plan',
                name: 'Add Subscription Plan',
                component: () => import('@/views/SubscriptionPlanAdd.vue')
            },
            {
                path: '/configuration/settings/edit-subscription-plan/:id',
                name: 'Edit Subscription Plan',
                component: () => import('@/views/SubscriptionPlanEdit.vue')
            },
            {
                path: '/configuration/settings/tax-types',
                name: 'Tax Types',
                component: () => import('@/views/TaxTypesIndex.vue')
            },
            {
                path: '/configuration/settings/add-tax-types',
                name: 'Add Tax Type',
                component: () => import('@/views/TaxTypeAdd.vue')
            },
            {
                path: '/configuration/settings/edit-tax-types/:id',
                name: 'Edit Tax Type',
                component: () => import('@/views/TaxTypeEdit.vue')
            },
            {
                path: '/configuration/settings/tax-rates',
                name: 'Tax Rates',
                component: () => import('@/views/TaxRateIndex.vue')
            },
            {
                path: '/configuration/settings/add-tax-rates',
                name: 'Add Tax Rate',
                component: () => import('@/views/TaxRateAdd.vue')
            },
            {
                path: '/configuration/settings/edit-tax-rates/:id',
                name: 'Edit Tax Rate',
                component: () => import('@/views/TaxRateEdit.vue')
            },
            {
                path: '/configuration/settings/stock-statuses',
                name: 'Stock Statuses',
                component: () => import('@/views/StockStatusIndex.vue')
            },
            {
                path: '/configuration/settings/add-stock-statuses',
                name: 'Add Stock Status',
                component: () => import('@/views/StockStatusAdd.vue')
            },
            {
                path: '/configuration/settings/edit-stock-statuses/:id',
                name: 'Update Stock Status',
                component: () => import('@/views/StockStatusUpdate.vue'),
                // props: true
            },
            {
                path: '/configuration/settings/subscription-statuses',
                name: 'Subscription Statuses',
                component: () => import('@/views/SubscriptionStatusIndex.vue')
            },
            {
                path: '/configuration/settings/add-subscription-statuses',
                name: 'Add Subscription Status',
                component: () => import('@/views/SubscriptionStatusAdd.vue')
            },
            {
                path: '/configuration/settings/edit-subscription-statuses/:id',
                name: 'Update Subscription Status',
                component: () => import('@/views/SubscriptionStatusEdit.vue')
            },
            {
                path: '/configuration/settings/order-statuses',
                name: 'Order Statuses',
                component: () => import('@/views/OrderStatusIndex.vue')
            },
            {
                path: '/configuration/settings/add-order-statuses',
                name: 'Add Order Status',
                component: () => import('@/views/OrderStatusAdd.vue')
            },
            {
                path: '/configuration/settings/edit-order-statuses/:id',
                name: 'Update Order Status',
                component: () => import('@/views/OrderStatusEdit.vue')
            },
            {
                path: '/configuration/settings/payment-statuses',
                name: 'Payment Statuses',
                component: () => import('@/views/PaymentStatusIndex.vue')
            },
            {
                path: '/configuration/settings/add-payment-statuses',
                name: 'Add Payment Status',
                component: () => import('@/views/PaymentStatusAdd.vue')
            },
            {
                path: '/configuration/settings/edit-payment-statuses/:id',
                name: 'Update Payment Status',
                component: () => import('@/views/PaymentStatusEdit.vue')
            },
            {
                path: '/configuration/settings/shipping-statuses',
                name: 'Shipping Statuses',
                component: () => import('@/views/ShippingStatusIndex.vue')
            },
            {
                path: '/configuration/settings/add-shipping-statuses',
                name: 'Add Shipping Status',
                component: () => import('@/views/ShippingStatusAdd.vue')
            },
            {
                path: '/configuration/settings/edit-shipping-statuses/:id',
                name: 'Update Shipping Status',
                component: () => import('@/views/ShippingStatusEdit.vue')
            },
            {
                path: '/configuration/settings/return-statuses',
                name: 'Return Statuses',
                component: () => import('@/views/ReturnStatusIndex.vue')
            },
            {
                path: '/configuration/settings/add-return-statuses',
                name: 'Add Return Status',
                component: () => import('@/views/ReturnStatusAdd.vue')
            },
            {
                path: '/configuration/settings/edit-return-statuses/:id',
                name: 'Update Return Status',
                component: () => import('@/views/ReturnStatusEdit.vue')
            },
            {
                path: '/configuration/settings/return-resolutions',
                name: 'Return Resolutions',
                component: () => import('@/views/ReturnResolutionIndex.vue')
            },
            {
                path: '/configuration/settings/add-return-resolutions',
                name: 'Add Return Resolution',
                component: () => import('@/views/ReturnResolutionAdd.vue')
            },
            {
                path: '/configuration/settings/edit-return-resolutions/:id',
                name: 'Update Return Resolution',
                component: () => import('@/views/ReturnResolutionEdit.vue')
            },
            {
                path: '/configuration/settings/return-reasons',
                name: 'Return Reasons',
                component: () => import('@/views/ReturnReasonIndex.vue')
            },
            {
                path: '/configuration/settings/add-return-reasons',
                name: 'Add Return Reason',
                component: () => import('@/views/ReturnReasonAdd.vue')
            },
            {
                path: '/configuration/settings/edit-return-reasons/:id',
                name: 'Update Return Reason',
                component: () => import('@/views/ReturnReasonEdit.vue')
            },
            {
                path: '/configuration/settings/length',
                name: 'Length',
                component: () => import('@/views/LengthTypeIndex.vue')
            },
            {
                path: '/configuration/settings/add-length-types',
                name: 'Add Length Type',
                component: () => import('@/views/LengthTypeAdd.vue')
            },
            {
                path: '/configuration/settings/edit-length-types/:id',
                name: 'Edit Length Type',
                component: () => import('@/views/LengthTypeEdit.vue')
            },
            {
                path: '/configuration/settings/weight',
                name: 'Weight',
                component: () => import('@/views/WeightTypeIndex.vue')
            },
            {
                path: '/configuration/settings/add-weight-types',
                name: 'Add Weight Type',
                component: () => import('@/views/WeightTypeAdd.vue')
            },
            {
                path: '/configuration/settings/edit-weight-types/:id',
                name: 'Edit Weight Type',
                component: () => import('@/views/WeightTypeEdit.vue')
            },
            {
                path: '/configuration/settings/languages',
                name: 'Languages',
                component: () => import('@/views/LanguageIndex.vue')
            },
            {
                path: '/configuration/settings/add-languages',
                name: 'Add Language',
                component: () => import('@/views/LanguageAdd.vue')
            },
            {
                path: '/configuration/settings/edit-languages/:id',
                name: 'Edit Language',
                component: () => import('@/views/LanguageEdit.vue')
            },
            {
                path: '/configuration/settings/currencies',
                name: 'Currencies',
                component: () => import('@/views/CurrencyIndex.vue')
            },
            {
                path: '/configuration/settings/edit-currencies/:id',
                name: 'Edit Currency',
                component: () => import('@/views/CurrencyEdit.vue')
            },
            {
                path: '/configuration/settings/add-currencies',
                name: 'Add Currency',
                component: () => import('@/views/CurrencyAdd.vue')
            },
            {
                path: '/configuration/settings/countries',
                name: 'Countries',
                component: () => import('@/views/CountryIndex.vue')
            },
            {
                path: '/configuration/settings/add-countries',
                name: 'Add Country',
                component: () => import('@/views/CountryAdd.vue')
            },
            {
                path: '/configuration/settings/edit-countries/:id',
                name: 'Edit Country',
                component: () => import('@/views/CountryEdit.vue')
            },
            {
                path: '/configuration/settings/regions',
                name: 'Regions',
                component: () => import('@/views/RegionIndex.vue')
            },
            {
                path: '/configuration/settings/add-regions',
                name: 'Add Region',
                component: () => import('@/views/RegionAdd.vue')
            },
            {
                path: '/configuration/settings/edit-regions/:id',
                name: 'Edit Region',
                component: () => import('@/views/RegionEdit.vue')
            },
            {
                path: '/configuration/settings/region-groups',
                name: 'Region Groups',
                component: () => import('@/views/RegionGroupIndex.vue')
            },
            {
                path: '/configuration/settings/add-region-groups',
                name: 'Add Region Group',
                component: () => import('@/views/RegionGroupAdd.vue')
            },
            {
                path: '/configuration/settings/edit-region-groups/:id',
                name: 'Edit Region Group',
                component: () => import('@/views/RegionGroupEdit.vue')
            },
            {
                path: '/configuration/settings/email-settings',
                name: 'Email Settings',
                component: () => import('@/views/EmailSettingsIndex.vue')
            },
            {
                path: '/tools/cache',
                name: 'Cache',
                component: () => import('@/views/BlankPage.vue')
            },
            {
                path: '/tools/backup',
                name: 'Backup',
                component: () => import('@/views/BlankPage.vue')
            },
            {
                path: '/tools/cron-job',
                name: 'Cron Job',
                component: () => import('@/views/BlankPage.vue')
            },
            {
                path: '/tools/import-content',
                name: 'Import Content',
                component: () => import('@/views/ImportContentIndex.vue')
            },
            {
                path: '/tools/export-content',
                name: 'Export Content',
                component: () => import('@/views/ExportContentIndex.vue')
            },
            {
                path: '/tools/system-info',
                name: 'System Info',
                component: () => import('@/views/BlankPage.vue')
            },
            {
                path: '/tools/error-log',
                name: 'Error Log',
                component: () => import('@/views/BlankPage.vue')
            },
            {
                path: '/graphql',
                name: 'GraphQL',
                component: () => import('@/views/BlankPage.vue')
            },
            {
                path: '/openai/stop-light',
                name: 'Stop Light',
                component: () => import('@/views/BlankPage.vue')
            },
            {
                path: '/openai/swagger',
                name: 'Swagger',
                component: () => import('@/views/BlankPage.vue')
            },
            {
                path: '/seo',
                name: 'SEO',
                component: () => import('@/views/BlankPage.vue')
            }
            
        ]
    },
    {
        path: '/landing',
        component: BlankPage,
        children: [
            {
                path: '',
                name: 'landing',
                component: () => import('@/views/BlankPage.vue')
            },
            {
                path: 'features',
                name: 'features',
                component: () => import('@/views/BlankPage.vue')
            },
            {
                path: 'pricing',
                name: 'pricing',
                component: () => import('@/views/BlankPage.vue')
            },
            {
                path: 'contact',
                name: 'contact',
                component: () => import('@/views/BlankPage.vue')
            }
        ],
        meta: { scrollToTop: true }
    },
    {
        path: '/auth',
        component: AuthLayout,
        children: [
            {
                path: 'login',
                name: 'login',
                component: () => import('@/views/BlankPage.vue')
            },
            {
                path: 'register',
                name: 'register',
                component: () => import('@/views/BlankPage.vue')
            },
            {
                path: 'verification',
                name: 'verification',
                component: () => import('@/views/BlankPage.vue')
            },
            {
                path: 'forgot-password',
                name: 'forgot-password',
                component: () => import('@/views/BlankPage.vue')
            },
            {
                path: 'new-password',
                name: 'new-password',
                component: () => import('@/views/BlankPage.vue')
            },
            {
                path: 'lock-screen',
                name: 'lock-screen',
                component: () => import('@/views/BlankPage.vue')
            },
            {
                path: 'access',
                name: 'access',
                component: () => import('@/views/BlankPage.vue')
            },
            {
                path: 'oops',
                name: 'oops',
                component: () => import('@/views/BlankPage.vue')
            }
        ],
        meta: { scrollToTop: true }
    },

    {
        path: '/pages/notfound',
        name: 'notfound',
        component: () => import('@/views/BlankPage.vue')
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'notfound',
        component: () => import('@/views/BlankPage.vue')
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        return { left: 0, top: 0 };
    }
});

export default router;
