import AppLayout from '@/layout/AppLayout.vue';
import AuthLayout from '@/layout/AuthLayout.vue';
import BlankPage from '@/views/BlankPage.vue';
import FolderView from '@/views/FolderView.vue';
import FolderDetailsView from '@/views/media/FolderDetailsView.vue';
import {
    buildUnauthorized401Redirect,
    consumeCodeFromRouteQuery,
    validateSession
} from '@/services/authSessionService';
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
                component: () => import('@/views/dashboard/index.vue')
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
                path: '/debug/datatable-reorder',
                name: 'debug-datatable-reorder',
                meta: {
                    breadcrumb: ['Debug', 'DataTable Reorder']
                },
                component: () => import('@/views/debug/DatatableReorderDebug.vue')
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

            //contact request routes start here
            {
                path: '/meeting-requests',
                name: 'meeting-requests',
                props: true,
                component: () => import('@/views/contact-requests/ContactRequestIndex.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "contact-requests-list" },
                        name: 'contact-requests-main'
                    },
                    {
                        path: 'list',
                        name: 'contact-requests-list',
                        component: () => import('@/views/contact-requests/components/ContactRequestList.vue')
                    },
                    // {
                    //     path: 'add',
                    //     name: 'customers-add',
                    //     component: () => import('@/views/customer/components/CustomerAdd.vue')
                    // },
                    {
                        path: 'edit/:id',
                        name: 'contact-requests-edit',
                        props: true,
                        component: () => import('@/views/contact-requests/components/ContactRequestEdit.vue')
                    },
                    {
                        path: 'import',
                        name: 'contact-requests-import',
                        component: () => import('@/views/contact-requests/components/ContactRequestImport.vue')
                    },
                ]
            },
            {
                path: '/subscribe-requests',
                name: 'subscribe-requests',
                props: true,
                component: () => import('@/views/subscription/SubscribeRequestsIndex.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "subscribe-requests-list" },
                        name: 'subscribe-requests-main'
                    },
                    {
                        path: 'list',
                        name: 'subscribe-requests-list',
                        component: () => import('@/views/subscription/components/SubscribeRequestList.vue')
                    }
                ]
            },
            // booking requests routes start here
            {
                path: '/booking-management',
                name: 'booking-management',
                props: true,
                component: () => import('@/views/booking-management/BookingManagementIndex.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "booking-management-list" },
                        name: 'booking-management-main'
                    },
                    {
                        path: 'list',
                        name: 'booking-management-list',
                        component: () => import('@/views/booking-management/components/BookingManagementList.vue')
                    }
                ]
            },



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
                        component: () => import('@/views/showrooms/pages/ShowroomImport.vue')
                    },
                ]
            },
            {
                path: '/showroom-contact',
                name: 'showroom-contact',
                props: true,
                component: () => import('@/views/showroom-contact/ShowroomContact.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "showroom-contact-list" },
                        name: 'showroom-contact-main'
                    },
                    {
                        path: 'list',
                        name: 'showroom-contact-list',
                        component: () => import('@/views/showroom-contact/components/ShowroomContactList.vue')
                    },
                    {
                        path: 'add',
                        name: 'showroom-contact-add',
                        component: () => import('@/views/showroom-contact/components/ShowroomContactAdd.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'showroom-contact-edit',
                        props: true,
                        component: () => import('@/views/showroom-contact/components/ShowroomContactEdit.vue')
                    },
                    {
                        path: 'import',
                        name: 'showroom-contact-import',
                        component: () => import('@/views/showroom-contact/components/ShowroomContactImport.vue')
                    },
                ]
            },
            
            /**
             * Showroom Route end here
             */

            // old posts routes 
            // {
            //     path: '/posts/list',
            //     name: 'Post List',
            //     component: () => import('@/views/PostsIndex.vue')
            // },
            // {
            //     path: '/post-import',
            //     name: 'Post Import',
            //     component: () => import('@/views/PostImport.vue')
            // },
            // end old posts routes
            // {
            //     path: '/posts/add',
            //     name: 'add-post',
            //     component: () => import('@/views/posts/PostAdd.vue'),
            //     children: [
            //         {
            //             path: "",
            //             redirect: { name: "post-general-add" },
            //             name: 'post-add-main'
            //         },
            //         {
            //             path: 'general',
            //             name: 'post-general-add',
            //             component: () => import('@/views/posts/components/PostGeneral.vue')
            //         },
            //         {
            //             path: 'seo',
            //             name: 'post-seo-add',
            //             component: () => import('@/views/posts/components/PostSeo.vue')
            //         }
            //     ]
            // },
            // old posts routes end here
            // new posts routes start here
            {
                path: '/posts',
                name: 'Posts',
                component: () => import('@/views/posts/PostIndex.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "posts-list" },
                        name: 'posts-main'
                    },
                    // list
                    {
                        path: 'list',
                        name: 'posts-list',
                        component: () => import('@/views/posts/components/PostList.vue')
                    },
                    {
                        path: 'add',
                        name: 'posts-add',
                        component: () => import('@/views/posts/PostAdd.vue'),
                        children: [
                            {
                                path: "",
                                redirect: { name: "posts-general-add" },
                                name: 'posts-add-main'
                            },
                            {
                                path: 'general',
                                name: 'posts-general-add',
                                component: () => import('@/views/posts/components/PostGeneral.vue')
                            },
                            {
                                path: 'seo',
                                name: 'posts-seo-add',
                                component: () => import('@/views/posts/components/PostSeo.vue')
                            }
                        ]
                    },
                    {
                        path: 'edit/:id',
                        name: 'posts-edit',
                        props: true,
                        component: () => import('@/views/posts/PostEdit.vue'),
                        children: [
                            {
                                path: "",
                                redirect: { name: "posts-general-edit" },
                                name: 'posts-edit-main'
                            },
                            {
                                path: 'general',
                                name: 'posts-general-edit',
                                component: () => import('@/views/posts/components/PostGeneral.vue')
                            },
                            {
                                path: 'seo',
                                name: 'posts-seo-edit',
                                component: () => import('@/views/posts/components/PostSeo.vue')
                            },
                            {
                                path: 'images',
                                name: 'posts-images-edit',
                                component: () => import('@/views/posts/components/PostImages.vue')
                            }
                        ]
                    },
                    // import
                    {
                        path: 'import',
                        name: 'posts-import',
                        component: () => import('@/views/posts/components/PostImport.vue')
                    }
                ]
            },
            // end post route
            // {
            //     path: '/posts/:id',
            //     name: 'edit-post',
            //     props: true,
            //     component: () => import('@/views/posts/PostEdit.vue'),
            //     children: [
            //         {
            //             path: "",
            //             redirect: { name: "post-general-edit" },
            //             name: 'post-edit-main'
            //         },
            //         {
            //             path: 'general',
            //             name: 'post-general-edit',
            //             component: () => import('@/views/posts/components/PostGeneral.vue')
            //         },
            //         {
            //             path: 'seo',
            //             name: 'post-seo-edit',
            //             component: () => import('@/views/posts/components/PostSeo.vue')
            //         },
            //         {
            //             path: 'images',
            //             name: 'post-image-gallery-add',
            //             component: () => import('@/views/posts/components/PostImages.vue')
            //         }
            //     ]
            // },
            // start old page routes
            // { 
            //     path: '/pages/list',
            //     name: 'page-list',
            //     component: () => import('@/views/PageIndex.vue')
            // },
            // {
            //     path: '/page-import',
            //     name: 'Page Import',
            //     component: () => import('@/views/PageImport.vue')
            // },
            // {
            //     path: '/pages/add',
            //     name: 'add-page',
            //     component: () => import('@/views/pages/PageAdd.vue'),
            //     children: [
            //         {
            //             path: "",
            //             redirect: { name: "page-general-add" },
            //             name: 'page-add-main'
            //         },
            //         {
            //             path: 'general',
            //             name: 'page-general-add',
            //             component: () => import('@/views/pages/components/PageGeneral.vue')
            //         },
            //         {
            //             path: 'seo',
            //             name: 'page-seo-add',
            //             component: () => import('@/views/pages/components/PageSeo.vue')
            //         },
            //     ]
            // },
            // end page route
            // start new page routes
            {
                path: '/pages',
                name: 'Pages',
                component: () => import('@/views/pages/PageIndex.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "pages-list" },
                        name: 'pages-main'
                    },
                    {
                        path: 'list',
                        name: 'pages-list',
                        component: () => import('@/views/pages/components/PageList.vue')
                    },
                    {
                        path: 'add',
                        name: 'pages-add',
                        component: () => import('@/views/pages/PageAdd.vue'),
                        children: [
                            {
                                path: "",
                                redirect: { name: "pages-general-add" },
                                name: 'pages-add-main'
                            },
                            {
                                path: 'general',
                                name: 'pages-general-add',
                                component: () => import('@/views/pages/components/PageGeneral.vue')
                            },
                            {
                                path: 'seo',
                                name: 'pages-seo-add',
                                component: () => import('@/views/pages/components/PageSeo.vue')
                            }
                        ]
                    },
                    {
                        path: 'edit/:id',
                        name: 'pages-edit',
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
                    { // import
                        path: 'import',
                        name: 'pages-import',
                        component: () => import('@/views/pages/components/PageImport.vue')
                    },
                ]
            },
            // end new page routes


            // { // page edit 
            //     path: '/pages/:id',
            //     name: 'edit-page',
            //     props: true,
            //     component: () => import('@/views/pages/PageEdit.vue'),
            //     children: [
            //         {
            //             path: "",
            //             redirect: { name: "page-general-edit" },
            //             name: 'page-edit-main'
            //         },
            //         { // edit
            //             path: 'general',
            //             name: 'page-general-edit',
            //             component: () => import('@/views/pages/components/PageGeneral.vue')
            //         },
            //         { // seo
            //             path: 'seo',
            //             name: 'page-seo-edit',
            //             component: () => import('@/views/pages/components/PageSeo.vue')
            //         },
            //     ]
            // },
            // old jobs routes
            // {
            //     path: '/jobs/:job_id',
            //     name: 'Job Details',
            //     component: () => import('@/views/jobs/JobDetails.vue')
            // },
            // {
            //     path: '/jobs/list',
            //     name: 'Job List',
            //     component: () => import('@/views/jobs/JobList.vue')
            // },
            // new jobs routes
            {
                path: '/jobs',
                name: 'Jobs List',
                component: () => import('@/views/jobs/JobIndex.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "jobs-list" },
                        name: 'jobs-main'
                    },
                    // list
                    {
                        path: 'list',
                        name: 'jobs-list',
                        component: () => import('@/views/jobs/components/JobList.vue')
                    },
                    // add
                    {
                        path: 'add',
                        name: 'jobs-add',
                        component: () => import('@/views/jobs/components/JobAdd.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'jobs-edit',
                        props: true,
                        component: () => import('@/views/jobs/components/JobEdit.vue')
                    },
                    // details
                    {
                        path: 'details/:id',
                        name: 'jobs-details',
                        props: true,
                        component: () => import('@/views/jobs/components/JobDetails.vue')
                    },
                    {
                        path: 'import',
                        name: 'jobs-import',
                        component: () => import('@/views/jobs/components/JobImport.vue')
                    },
                ]
            },
            // =========================== start pin board route ===========================
            // { 
            //     path: '/pinboards',
            //     name: 'pinboards',
            //     props: true,
            //     component: () => import('@/views/pin-boards/PinboardIndex.vue'),
            //     children: [
            //         {
            //             path: "",
            //             redirect: { name: "length-list" },
            //             name: 'length-main'
            //         },
            //         {
            //             path: 'list',
            //             name: 'pinboard-list',
            //             component: () => import('@/views/pin-boards/components/PinboardList.vue')
            //         },
            //         {
            //             path: 'add',
            //             name: 'pinboard-add',
            //             component: () => import('@/views/pin-boards/components/PinboardAdd.vue')
            //         },
            //         {
            //             path: 'edit/:id',
            //             name: 'pinboard-edit',
            //             props: true,
            //             component: () => import('@/views/pin-boards/components/PinboardEdit.vue')
            //         },
            //         {
            //             path: 'import',
            //             name: 'pinboard-import',
            //             component: () => import('@/views/pin-boards/components/PinboardImport.vue')
            //         },
            //     ]
            // },

            // {
            //     path: '/pinboards/list',
            //     name: 'Pinboard List',
            //     component: () => import('@/views/pinboards/PinboardIndex.vue')
            // },
            {
                path: '/pinboards',
                name: 'add-pinboard',
                component: () => import('@/views/pinboards/Pinboard.vue'),
                // component: () => import('@/views/pinboards/PinboardAdd.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "pinboard-overview-add" },
                        name: 'pinboard-add-main'
                    },
                    // list
                    {
                        path: 'list',
                        name: 'pinboard-list',
                        component: () => import('@/views/pinboards/components/PinboardList.vue')
                    },
                    // add
                    {
                        path: 'overview',
                        name: 'pinboard-overview-add',
                        component: () => import('@/views/pinboards/components/PinboardOverview.vue')
                    },
                    {
                        path: 'item/:id',
                        name: 'pinboard-item-view',
                        props: true,
                        component: () => import('@/views/pinboards/components/PinboardItems.vue')
                    },
                    {
                        path: 'import',
                        name: 'pinboard-import-items',
                        component: () => import('@/views/pinboards/components/PinboardImport.vue')
                    },
                    {
                        path: 'temporary-pinboards',
                        name: 'temporary-pinboards',
                        component: () => import('@/views/pinboards/components/TemporaryPinboardList.vue')
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
                        props: true,
                        component: () => import('@/views/pinboards/components/PinboardOverview.vue')
                    },
                    {
                        path: 'pinboard-temporary-overview',
                        name: 'pinboard-temporary-overview-edit',
                        props: true,
                        component: () => import('@/views/pinboards/components/TemporaryPinboardOverview.vue')
                    },
                    {
                        path: 'items',
                        name: 'pinboard-items-edit',
                        props: true,
                        component: () => import('@/views/pinboards/components/PinboardItems.vue')
                    },
                ]
            },

            // =========================== end pin board route ===========================




            // =========================== start post tag route ===========================
            { // base setup content post tags routes start
                path: '/posts/tags',
                name: 'post-tags',
                props: true,
                component: () => import('@/views/post-tag/PostTagIndex.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "post-tags-list" },
                        name: 'post-tag-main'
                    },
                    {
                        path: 'list',
                        name: 'post-tags-list',
                        component: () => import('@/views/post-tag/components/PostTagList.vue')
                    },
                    {
                        path: 'add',
                        name: 'post-tags-add',
                        component: () => import('@/views/post-tag/components/PostTagAdd.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'post-tags-edit',
                        props: true,
                        component: () => import('@/views/post-tag/components/PostTagEdit.vue')
                    },
                    {
                        path: 'import',
                        name: 'post-tags-import',
                        component: () => import('@/views/post-tag/components/PostTagImport.vue')
                    },
                ]
            },


            // {
            //     path: '/posts/tags',
            //     name: 'Posts Tags',
            //     component: () => import('@/views/PostTagIndex.vue')
            // },
            // {
            //     path: '/posts/add-tag',
            //     name: 'Add Post Tag',
            //     component: () => import('@/views/PostTagAdd.vue')
            // },
            // {
            //     path: '/posts/edit-tag/:id',
            //     name: 'Edit Post Tag',
            //     component: () => import('@/views/PostTagEdit.vue')
            // },

            // =========================== end post tag route ===========================
            // {
            //     path: '/posts/categories',
            //     name: 'Posts Categories',
            //     component: () => import('@/views/CategoryIndex.vue')
            // },
            { // base setup content atribute groups routes start
                path: '/posts/categories',
                name: 'post-categories',
                props: true,
                component: () => import('@/views/post-category/PostCategoryIndex.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "post-categories-list" },
                        name: 'post-categories-main'
                    },
                    {
                        path: 'list',
                        name: 'post-categories-list',
                        component: () => import('@/views/post-category/components/PostCategoryList.vue')
                    },
                    {
                        path: 'add',
                        name: 'post-categories-add',
                        component: () => import('@/views/post-category/components/PostCategoryAdd.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'post-categories-edit',
                        props: true,
                        component: () => import('@/views/post-category/components/PostCategoryEdit.vue')
                    },
                    {
                        path: 'import',
                        name: 'post-categories-import',
                        component: () => import('@/views/post-category/components/PostCategoryImport.vue')
                    },
                ]
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
            // {
            //     path: '/pages/list',
            //     name: 'Pages List',
            //     component: () => import('@/views/PageIndex.vue')
            // },
            {
                path: '/pages/menus',
                name: 'Pages Menus',
                component: () => import('@/views/MenuIndex.vue')
            },
            {
                path: '/files-folders',
                name: 'files-folders',
                component: () => import('@/views/MediaLibrary.vue')
            },
            {
                path: '/files-folders/folder',
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
                        path: ':id/:breadcrumb(.*)',
                        name: 'folder-view-id-sub',
                        component: () => import('@/views/media/FolderDetailsView.vue'),
                        props: true
                    },
                    {
                        path: ':id',
                        name: 'folder-view-id',
                        component: () => import('@/views/media/FolderDetailsView.vue'),
                        props: true
                    },

                ]
            },
            // =========================== start user route ===========================
            { // base setup content atribute groups routes start
                path: '/users',
                name: 'Users',
                props: true,
                component: () => import('@/views/users/user/UserIndex.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "users-list" },
                        name: 'users-main'
                    },
                    {
                        path: 'list',
                        name: 'users-list',
                        component: () => import('@/views/users/user/components/UserList.vue')
                    },
                    {
                        path: 'add',
                        name: 'users-add',
                        component: () => import('@/views/users/user/components/UserAdd.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'users-edit',
                        props: true,
                        component: () => import('@/views/users/user/components/UserEdit.vue')
                    },
                    {
                        path: 'import',
                        name: 'users-import',
                        component: () => import('@/views/users/user/components/UserImport.vue')
                    },
                ]
            },
            // =========================== end user route ===========================
            // {
            //     path: '/users/list',
            //     name: 'Users List',
            //     component: () => import('@/views/UserIndex.vue')
            // },
            // {
            //     path: '/user/add-user',
            //     name: 'Add User',
            //     component: () => import('@/views/UserAdd.vue')
            // },
            // {
            //     path: '/users/edit-user/:id',
            //     name: 'Edit User',
            //     component: () => import('@/views/UserEdit.vue')
            // },

            { // base setup content atribute groups routes start
                path: '/users/groups',
                name: 'users-groups',
                props: true,
                component: () => import('@/views/users/group/UserGroupIndex.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "users-groups-list" },
                        name: 'users-groups-main'
                    },
                    {
                        path: 'list',
                        name: 'users-groups-list',
                        component: () => import('@/views/users/group/components/UserGroupList.vue')
                    },
                    {
                        path: 'add',
                        name: 'users-groups-add',
                        component: () => import('@/views/users/group/components/UserGroupAdd.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'users-groups-edit',
                        props: true,
                        component: () => import('@/views/users/group/components/UserGroupEdit.vue')
                    },
                    {
                        path: 'import',
                        name: 'users-groups-import',
                        component: () => import('@/views/users/group/components/UserGroupImport.vue')
                    },
                ]
            },
            // {
            //     path: '/users/groups',
            //     name: 'Users Groups',
            //     component: () => import('@/views/UserGroupIndex.vue')
            // },
            // {
            //     path: '/users/add-groups',
            //     name: 'Add User Group',
            //     component: () => import('@/views/UserGroupAdd.vue')
            // },
            // {
            //     path: '/users/edit-groups/:id',
            //     name: 'Edit User Group',
            //     component: () => import('@/views/UserGroupEdit.vue')
            // },

            {
                path: '/service-requests',
                name: 'service-requests',
                props: true,
                component: () => import('@/views/service-requests/ServiceRequestIndex.vue'),
                children: [
                    {
                        path: '',
                        redirect: { name: 'service-requests-list' },
                        name: 'service-requests-main'
                    },
                    {
                        path: 'list',
                        name: 'service-requests-list',
                        component: () => import('@/views/service-requests/components/ServiceRequestList.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'service-requests-edit',
                        props: true,
                        component: () => import('@/views/service-requests/components/ServiceRequestEdit.vue')
                    },
                    {
                        path: 'import',
                        name: 'service-requests-import',
                        component: () => import('@/views/service-requests/components/ServiceRequestImport.vue')
                    }
                ]
            },

            // =========================== start quotes route ===========================
            {
                path: '/ecommerce/sales/quotes',
                name: 'quotes',
                props: true,
                component: () => import('@/views/quotes/QuoteIndex.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "quotes-list" },
                        name: 'quotes-main'
                    },
                    {
                        path: 'list',
                        name: 'quotes-list',
                        component: () => import('@/views/quotes/components/QuoteList.vue')
                    },
                    {
                        path: 'add',
                        name: 'quotes-add',
                        component: () => import('@/views/quotes/components/QuoteAdd.vue')
                    },
                    {
                        path: 'item/:id',
                        name: 'quotes-items',
                        props: true,
                        component: () => import('@/views/quotes/components/QuoteItems.vue')
                    },

                    {
                        path: 'edit/:id',
                        name: 'quotes-edit',
                        props: true,
                        component: () => import('@/views/quotes/components/QuoteEdit.vue')
                    },
                    {
                        path: 'import',
                        name: 'quotes-type-import',
                        component: () => import('@/views/quotes/components/QuoteImport.vue')
                    },
                ]
            },



            // {
            //     path: '/quotes/list',
            //     name: 'Quote List',
            //     component: () => import('@/views/quotes/QuoteIndex.vue')
            // },
            // {
            //     path: '/quotes/add',
            //     name: 'add-quote',
            //     component: () => import('@/views/quotes/QuoteAdd.vue'),
            //     children: [
            //         {
            //             path: "",
            //             redirect: { name: "quote-overview-add" },
            //             name: 'quote-add-main'
            //         },
            //         {
            //             path: 'overview',
            //             name: 'quote-overview-add',
            //             component: () => import('@/views/quotes/components/QuoteOverview.vue')
            //         },
            //         {
            //             path: 'items',
            //             name: 'quote-items-add',
            //             component: () => import('@/views/quotes/components/QuoteItems.vue')
            //         },
            //     ]
            // },
            // {
            //     path: '/quotes/:id',
            //     name: 'edit-quote',
            //     props: true,
            //     component: () => import('@/views/quotes/QuoteEdit.vue'),
            //     children: [
            //         {
            //             path: "",
            //             redirect: { name: "quote-overview-edit" },
            //             name: 'quote-edit-main'
            //         },
            //         {
            //             path: 'overview',
            //             name: 'quote-overview-edit',
            //             component: () => import('@/views/quotes/components/QuoteOverview.vue')
            //         },
            //         {
            //             path: 'items',
            //             name: 'quote-items-edit',
            //             component: () => import('@/views/quotes/components/QuoteItems.vue')
            //         },
            //     ]
            // },
            // ============== end quotes route ===================



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
            // ================== start orders route ===========================

            {
                path: '/ecommerce/sales/orders',
                name: 'order',
                props: true,
                component: () => import('@/views/order/OrderIndex.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "order-list" },
                        name: 'order-main'
                    },
                    {
                        path: 'list',
                        name: 'order-list',
                        component: () => import('@/views/order/components/OrderList.vue')
                    },
                    {
                        path: 'add',
                        name: 'order-add',
                        component: () => import('@/views/order/components/OrderAdd.vue'),
                        children: [
                            {
                                path: "",
                                redirect: { name: "order-overview-add" },
                                name: 'order-add-main'
                            },
                            {
                                path: 'overview',
                                name: 'order-overview-add',
                                component: () => import('@/views/order/components/OrderOverview.vue')
                            },
                            {
                                path: 'items',
                                name: 'order-items-add',
                                component: () => import('@/views/order/components/OrderItems.vue')
                            },
                        ],
                    },

                    {
                        path: ':id/edit',
                        name: 'order-edit',
                        props: true,
                        component: () => import('@/views/order/components/OrderEdit.vue'),
                        children: [
                            {
                                path: "",
                                redirect: { name: "order-edit-overview" },
                                name: 'order-edit-main'
                            },
                            {
                                path: 'overview',
                                name: 'order-edit-overview',
                                component: () => import('@/views/order/components/OrderOverview.vue')
                            },
                            {
                                path: 'items',
                                name: 'order-edit-items',
                                component: () => import('@/views/order/components/OrderItems.vue')
                            },
                        ]
                    },
                    {
                        path: 'import',
                        name: 'order-type-import',
                        component: () => import('@/views/order/components/OrderImport.vue')
                    },
                ]
            },



            // {
            //     path: '/orders/list',
            //     name: 'Orders',
            //     component: () => import('@/views/orders/OrderIndex.vue')

            // },
            // {
            //     path: '/orders/add',
            //     name: 'add-order',
            //     component: () => import('@/views/orders/OrderAdd.vue'),
            //     children: [
            //         {
            //             path: "",
            //             redirect: { name: "order-overview-add" },
            //             name: 'order-add-main'
            //         },
            //         {
            //             path: 'overview',
            //             name: 'order-overview-add',
            //             component: () => import('@/views/orders/components/OrderOverview.vue')
            //         },
            //         {
            //             path: 'items',
            //             name: 'order-items-add',
            //             component: () => import('@/views/orders/components/OrderItems.vue')
            //         },
            //     ]
            // },
            // {
            //     path: '/orders/:id',
            //     name: 'edit-order',
            //     props: true,
            //     component: () => import('@/views/orders/OrderEdit.vue'),
            //     children: [
            //         {
            //             path: "",
            //             redirect: { name: "order-overview-edit" },
            //             name: 'order-edit-main'
            //         },
            //         {
            //             path: 'overview',
            //             name: 'order-overview-edit',
            //             component: () => import('@/views/orders/components/OrderOverview.vue')
            //         },
            //         {
            //             path: 'items',
            //             name: 'order-items-edit',
            //             component: () => import('@/views/orders/components/OrderItems.vue')
            //         },
            //     ]
            // },



            // {
            //     path: '/orders/list',
            //     name: 'Orders',
            //     component: () => import('@/views/orders/OrderIndex.vue')
            // },
            // {
            //     path: '/orders/add',
            //     name: 'add-order',
            //     component: () => import('@/views/orders/OrderAdd.vue'),
            //     children: [
            //         {
            //             path: "",
            //             redirect: { name: "order-overview-add" },
            //             name: 'order-add-main'
            //         },
            //         {
            //             path: 'overview',
            //             name: 'order-overview-add',
            //             component: () => import('@/views/orders/components/OrderOverview.vue')
            //         },
            //         {
            //             path: 'items',
            //             name: 'order-items-add',
            //             component: () => import('@/views/orders/components/OrderItems.vue')
            //         },
            //     ]
            // },
            // {
            //     path: '/orders/:id',
            //     name: 'edit-order',
            //     props: true,
            //     component: () => import('@/views/orders/OrderEdit.vue'),
            //     children: [
            //         {
            //             path: "",
            //             redirect: { name: "order-overview-edit" },
            //             name: 'order-edit-main'
            //         },
            //         {
            //             path: 'overview',
            //             name: 'order-overview-edit',
            //             component: () => import('@/views/orders/components/OrderOverview.vue')
            //         },
            //         {
            //             path: 'items',
            //             name: 'order-items-edit',
            //             component: () => import('@/views/orders/components/OrderItems.vue')
            //         },
            //     ]
            // },
            // ================== end orders route ===========================


            // =========================== start coupons route ===========================
            {
                path: '/coupons',
                name: 'coupon',
                props: true,
                component: () => import('@/views/coupons/CouponIndex.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "coupon-list" },
                        name: 'coupon-main'
                    },
                    {
                        path: 'list',
                        name: 'coupon-list',
                        component: () => import('@/views/coupons/components/CouponList.vue')
                    },
                    {
                        path: 'add',
                        name: 'coupon-add',
                        component: () => import('@/views/coupons/components/CouponAdd.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'coupon-edit',
                        props: true,
                        component: () => import('@/views/coupons/pages/CouponEdit.vue'),
                        children: [
                            {
                                path: "",
                                redirect: { name: "coupon-overview-add" },
                                name: 'coupon-overview-main'
                            },
                            {
                                path: 'overview',
                                name: 'coupon-overview-add',
                                component: () => import('@/views/coupons/components/CouponOverviewEdit.vue')
                            },
                            {
                                path: 'products',
                                name: 'coupon-products-add',
                                component: () => import('@/views/discount-coupons/components/CouponProducts.vue')
                            },
                        ]
                    },
                    {
                        path: 'import',
                        name: 'coupon-import',
                        component: () => import('@/views/coupons/components/CouponImport.vue')
                    },
                ]
            },



            // {
            //     path: '/coupons/list',
            //     name: 'Coupon List',
            //     component: () => import('@/views/discount-coupons/CouponIndex.vue')
            // },
            // {
            //     path: '/coupons/add',
            //     name: 'add-coupon',
            //     component: () => import('@/views/discount-coupons/CouponAdd.vue'),
            //     children: [
            //         {
            //             path: "",
            //             redirect: { name: "coupon-overview-add" },
            //             name: 'coupon-add-main'
            //         },
            //         {
            //             path: 'overview',
            //             name: 'coupon-overview-add',
            //             component: () => import('@/views/discount-coupons/components/CouponOverview.vue')
            //         },
            //         {
            //             path: 'products',
            //             name: 'coupon-products-add',
            //             component: () => import('@/views/discount-coupons/components/CouponProducts.vue')
            //         },
            //     ]
            // },
            // {
            //     path: '/coupons/:id',
            //     name: 'edit-coupon',
            //     props: true,
            //     component: () => import('@/views/discount-coupons/CouponEdit.vue'),
            //     children: [
            //         {
            //             path: "",
            //             redirect: { name: "coupon-overview-edit" },
            //             name: 'coupon-edit-main'
            //         },
            //         {
            //             path: 'overview',
            //             name: 'coupon-overview-edit',
            //             component: () => import('@/views/discount-coupons/components/CouponOverview.vue')
            //         },
            //         {
            //             path: 'products',
            //             name: 'coupon-products-edit',
            //             component: () => import('@/views/discount-coupons/components/CouponProducts.vue')
            //         },
            //     ]
            // },
            // =========================== end coupons route ===========================


            // =========================== start product discount route ===========================
            {
                path: '/product-discounts',
                name: 'product discount',
                props: true,
                component: () => import('@/views/product-discount/ProductDiscountIndex.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "product-discount-list" },
                        name: 'product-discount-main'
                    },
                    {
                        path: 'list',
                        name: 'product-discount-list',
                        component: () => import('@/views/product-discount/components/ProductDiscountList.vue')
                    },
                    {
                        path: 'add',
                        name: 'product-discount-add',
                        component: () => import('@/views/product-discount/components/ProductDiscountAdd.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'product-discount-edit',
                        props: true,
                        component: () => import('@/views/product-discount/components/ProductDiscountEdit.vue')
                    },
                    {
                        path: 'import',
                        name: 'product-discount-import',
                        component: () => import('@/views/product-discount/components/ProductDiscountImport.vue')
                    },
                ]
            },
            // =========================== end product discount route ===========================





            // =========================== start subscription route ===========================
            {
                path: '/ecommerce/sales/subscriptions',
                name: 'Subscriptions',
                props: true,
                component: () => import('@/views/subscription/SubscriptionIndex.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "subscriptions-list" },
                        name: 'subscriptions-main'
                    },
                    {
                        path: 'list',
                        name: 'subscriptions-list',
                        component: () => import('@/views/subscription/components/SubscriptionList.vue')
                    },
                    {
                        path: 'add',
                        name: 'subscriptions-add',
                        component: () => import('@/views/subscription/components/SubscriptionAdd.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'subscriptions-edit',
                        props: true,
                        component: () => import('@/views/subscription/components/SubscriptionEdit.vue')
                    },
                    {
                        path: 'import',
                        name: 'subscriptions-import',
                        component: () => import('@/views/subscription/components/SubscriptionImport.vue')
                    },
                ]
            },
            // {
            //     path: '/ecommerce/sales/subscriptions',
            //     name: 'Subscriptions',
            //     component: () => import('@/views/SubscriptionIndex.vue')
            // },
            // {
            //     path: '/ecommerce/sales/subscriptions/add',
            //     name: 'Add Subscription',
            //     component: () => import('@/views/SubscriptionAdd.vue')
            // },
            // {
            //     path: '/ecommerce/sales/subscriptions/edit/:id',
            //     name: 'Edit Subscription',
            //     component: () => import('@/views/SubscriptionEdit.vue')
            // },

            // =========================== end subscription route ===========================



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

            // =========================== start projects route ===========================
            {
                path: '/ecommerce/projects',
                name: 'projects',
                props: true,
                component: () => import('@/views/projects/Project.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "projects-list" },
                        name: 'projects-main'
                    },
                    {
                        path: 'list',
                        name: 'projects-list',
                        component: () => import('@/views/projects/pages/ProjectIndex.vue')
                    },
                    {
                        path: 'add',
                        name: 'projects-add',
                        component: () => import('@/views/projects/pages/ProjectAdd.vue'),
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
                        path: 'edit/:id',
                        name: 'projects-edit',
                        props: true,
                        component: () => import('@/views/projects/pages/ProjectEdit.vue'),
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
                        path: 'import',
                        name: 'projects-import',
                        component: () => import('@/views/ProjectImport.vue')
                    },
                ]
            },
            // ============== end projects route ===================

            // =========================== start design resource Document route ===========================
            {
                path: '/design-resource-documents',
                name: 'design-resource-documents',
                props: true,
                component: () => import('@/views/design-resources/documents/DocumentIndex.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "document-list" },
                        name: 'document-main'
                    },
                    {
                        path: 'list',
                        name: 'document-list',
                        component: () => import('@/views/design-resources/documents/components/DocumentList.vue')
                    },
                    {
                        path: 'add',
                        name: 'document-add',
                        component: () => import('@/views/design-resources/documents/components/DocumentAdd.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'document-edit',
                        props: true,
                        component: () => import('@/views/design-resources/documents/components/DocumentEdit.vue')
                    },
                    {
                        path: 'attach/:id',
                        name: 'document-attach',
                        props: true,
                        component: () => import('@/views/design-resources/documents/components/DocumentAttach.vue')
                    },
                    {
                        path: 'import',
                        name: 'document-import',
                        component: () => import('@/views/design-resources/documents/components/DocumentImport.vue')
                    },
                ]
            },
            // ============== end design resource Document route ===================

            // =========================== start design resource Finishes route ===========================
            {
                path: '/design-resource-finishes',
                name: 'design-resource-finishes',
                props: true,
                component: () => import('@/views/design-resources/finishes/FinishesIndex.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "finish-list" },
                        name: 'finish-main'
                    },
                    {
                        path: 'list',
                        name: 'finish-list',
                        component: () => import('@/views/design-resources/finishes/components/FinishList.vue')
                    },
                    {
                        path: 'add',
                        name: 'finish-add',
                        component: () => import('@/views/design-resources/finishes/components/FinishAdd.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'finish-edit',
                        props: true,
                        component: () => import('@/views/design-resources/finishes/components/FinishEdit.vue')
                    },
                    {
                        path: 'import',
                        name: 'finish-import',
                        component: () => import('@/views/design-resources/finishes/components/FinishImport.vue')
                    },
                ]
            },
            // ============== end design resource finishes route ===================

            // =========================== start design resource models route ===========================
            {
                path: '/design-resource-models',
                name: 'design-resource-models',
                props: true,
                component: () => import('@/views/design-resources/models/ModelIndex.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "model-list" },
                        name: 'model-main'
                    },
                    {
                        path: 'list',
                        name: 'model-list',
                        component: () => import('@/views/design-resources/models/components/ModelList.vue')
                    },
                    {
                        path: 'add',
                        name: 'model-add',
                        component: () => import('@/views/design-resources/models/components/ModelAdd.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'model-edit',
                        props: true,
                        component: () => import('@/views/design-resources/models/components/ModelEdit.vue')
                    },
                    {
                        path: 'attach/:id',
                        name: 'model-attach',
                        props: true,
                        component: () => import('@/views/design-resources/models/components/ModelAttach.vue')
                    },
                    {
                        path: 'import',
                        name: 'model-import',
                        component: () => import('@/views/design-resources/models/components/ModelImport.vue')
                    },
                ]
            },
            // ============== end design resource models route ===================

            // =========================== start design resource textiles route ===========================
            {
                path: '/design-resource-textiles',
                name: 'design-resource-textiles',
                props: true,
                component: () => import('@/views/design-resources/textiles/TextileIndex.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "design-resource-textiles-list" },
                        name: 'design-resource-textiles-main'
                    },
                    {
                        path: 'list',
                        name: 'design-resource-textiles-list',
                        component: () => import('@/views/design-resources/textiles/components/TextileList.vue')
                    },
                    {
                        path: 'add',
                        name: 'textile-add',
                        component: () => import('@/views/design-resources/textiles/components/TextileAdd.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'textile-edit',
                        props: true,
                        component: () => import('@/views/design-resources/textiles/components/TextileEdit.vue')
                    },
                    {
                        path: 'import',
                        name: 'textile-import',
                        component: () => import('@/views/design-resources/textiles/components/TextileImport.vue')
                    },
                ]
            },
            // ============== end design resource textiles route ===================

            {
                path: '/design-resource-import',
                name: 'Design Resource Import',
                component: () => import('@/views/DesignResourceImport.vue')
            },
            // {
            //     path: '/product-import',
            //     name: 'Product Import',
            //     component: () => import('@/views/products/product-import/ProductImportIndex.vue')
            // },
            {
                path: '/import-products',
                name: 'Import Products',
                component: () => import('@/views/products/product-import/ProductImportIndex.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "import-products-products" },
                        name: 'import-products-main'
                    },
                    {
                        path: 'products',
                        name: 'import-products-products',
                        component: () => import('@/views/products/product-import/components/ProductImport.vue')
                    },
                    {
                        path: 'products-meta',
                        name: 'import-products-products-meta',
                        component: () => import('@/views/products/product-import/components/ProductMetaImport.vue')
                    },
                    {
                        path: 'related-products',
                        name: 'import-products-related-products',
                        component: () => import('@/views/products/product-import/components/RelatedProductImport.vue')
                    },
                    {
                        path: 'products-attributes',
                        name: 'import-products-products-attributes',
                        component: () => import('@/views/products/product-import/components/ProductAttributeImport.vue')
                    },
                    {
                        path: 'products-variants',
                        name: 'import-products-products-variants',
                        component: () => import('@/views/products/product-import/components/ProductVariantImport.vue')
                    },
                    {
                        path: 'products-options',
                        name: 'import-products-products-options',
                        component: () => import('@/views/products/product-import/components/ProductOptionImport.vue')
                    },
                    {
                        path: 'products-gallery',
                        name: 'import-products-products-gallery',
                        component: () => import('@/views/products/product-import/components/ProductImageImport.vue')
                    },
                    {
                        path: 'products-digital-assets',
                        name: 'import-products-products-digital-assets',
                        component: () => import('@/views/products/product-import/components/ProductDigitalAssetImport.vue')
                    },
                    {
                        path: 'products-tags',
                        name: 'import-products-products-tags',
                        component: () => import('@/views/products/product-import/components/ProductTagImport.vue')
                    },
                    {
                        path: 'products-manufacturer',
                        name: 'import-products-products-manufacturer',
                        component: () => import('@/views/products/product-import/components/ProductManufacturerImport.vue')
                    },
                    {
                        path: 'products-vendor',
                        name: 'import-products-products-vendor',
                        component: () => import('@/views/products/product-import/components/ProductVendorImport.vue')
                    },
                    {
                        path: 'products-certificate',
                        name: 'import-products-products-certificate',
                        component: () => import('@/views/products/product-import/components/ProductCertificateImport.vue')
                    },
                    {
                        path: 'products-related-projects',
                        name: 'import-products-products-related-projects',
                        component: () => import('@/views/products/product-import/components/ProductRelatedProjectsImport.vue')
                    },
                ],
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
                        component: () => import('@/views/products/components/ProductDownload.vue')
                    },
                    // {
                    //     path: 'download',
                    //     name: 'product-download-add',
                    //     component: () => import('@/views/products/components/ProductDownload.vue')
                    // },
                    // {
                    //     path: 'certificate',
                    //     name: 'product-certificate-add',
                    //     component: () => import('@/views/products/components/ProductCertificate.vue')
                    // },
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
                path: '/ecommerce/items',
                name: 'items',
                props: true,
                component: () => import('@/views/items/ItemIndex.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "items-list" },
                        name: 'textile-main'
                    },
                    {
                        path: 'list',
                        name: 'items-list',
                        component: () => import('@/views/items/components/ItemList.vue')
                    },
                    {
                        path: 'add',
                        name: 'items-add',
                        component: () => import('@/views/items/components/ItemAdd.vue')
                    },
                    // {
                    //     path: 'edit/:id',
                    //     name: 'items-edit',
                    //     props: true,
                    //     component: () => import('@/views/items/components/ItemEdit.vue')
                    // },
                    {
                        path: 'edit/:id',
                        name: 'items-edit',
                        props: true,
                        component: () => import('@/views/items/components/ItemEdit.vue'),
                        children: [
                            {
                                path: "",
                                redirect: { name: "items-general-edit" },
                                name: 'items-edit-main'
                            },
                            {
                                path: 'general',
                                name: 'items-general-edit',
                                component: () => import('@/views/items/components/ItemGeneral.vue')
                            },
                            // inventory
                            {
                                path: 'inventory',
                                name: 'items-inventory-edit',
                                component: () => import('@/views/items/components/ItemInventory.vue')
                            },
                            // weight & dimension
                            {
                                path: 'weight-dimension',
                                name: 'items-weight-dimension-edit',
                                component: () => import('@/views/items/components/ItemWeightDimension.vue')
                            },
                            // invoice & billing
                            {
                                path: 'invoice-billing',
                                name: 'items-invoice-billing-edit',
                                component: () => import('@/views/items/components/ItemInvoiceBilling.vue')
                            },
                            // vendor
                            {
                                path: 'vendor',
                                name: 'items-vendor-edit',
                                component: () => import('@/views/items/components/ItemVendor.vue')
                            },
                            {
                                path: 'variant-option',
                                name: 'items-variant-option-edit',
                                component: () => import('@/views/items/components/ItemVariantOption.vue')
                            }
                        ]
                    },
                    {
                        path: 'import',
                        name: 'items-import',
                        component: () => import('@/views/items/components/ItemImport.vue')
                    },
                ]
            },
            // end item route
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
                        path: 'varients-options',
                        name: 'product-varients-options-edit',
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
                        path: 'download',
                        name: 'product-download-edit',
                        component: () => import('@/views/products/components/ProductDownload.vue')
                    },
                    {
                        path: 'certificate',
                        name: 'product-certificate-edit',
                        component: () => import('@/views/products/components/ProductCertificate.vue')
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
                    },
                    {
                        path: 'instagram',
                        name: 'product-instagram-edit',
                        component: () => import('@/views/products/components/ProductInstagram.vue')
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
            // {
            //     path: '/ecommerce/products-tags',
            //     name: 'Products Tags',
            //     component: () => import('@/views/ProductTagIndex.vue')
            // },

             // product variants routes
             {
                path: '/product-accessories',
                name: 'product-accessories',
                props: true,
                component: () => import('@/views/products/product-accessories/ProductAccessories.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "product-accessories-list" },
                        name: 'product-accessories-main'
                    },
                    {
                        path: 'list',
                        name: 'product-accessories-list',
                        component: () => import('@/views/products/product-accessories/components/ProductAccessoriesList.vue')
                    },
                    {
                        path: 'add',
                        name: 'product-accessories-add',
                        component: () => import('@/views/products/product-accessories/components/ProductAccessoriesAdd.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'product-accessories-edit',
                        props: true,
                        component: () => import('@/views/products/product-accessories/components/ProductAccessoriesEdit.vue')
                    },
                    {
                        path: 'import',
                        name: 'product-accessories-import',
                        component: () => import('@/views/products/product-accessories/components/ProductAccessoriesImport.vue')
                    },
                ]
            },

            {
                path: '/ecommerce/products-tags',
                name: 'products-tags',
                props: true,
                component: () => import('@/views/products/tags/ProductTagIndex.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "products-tags-list" },
                        name: 'products-tags-main'
                    },
                    {
                        path: 'list',
                        name: 'products-tags-list',
                        component: () => import('@/views/products/tags/components/ProductTagList.vue')
                    },
                    {
                        path: 'add',
                        name: 'products-tags-add',
                        component: () => import('@/views/products/tags/components/ProductTagAdd.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'products-tags-edit',
                        props: true,
                        component: () => import('@/views/products/tags/components/ProductTagEdit.vue')
                    },
                    {
                        path: 'import',
                        name: 'products-tags-import',
                        component: () => import('@/views/products/tags/components/ProductTagImport.vue')
                    },
                ]
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
            // product variants routes
            {
                path: '/ecommerce/products-variants',
                name: 'products-variants',
                props: true,
                component: () => import('@/views/products/product-variant/ProductVariant.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "products-variants-list" },
                        name: 'products-variants-main'
                    },
                    {
                        path: 'list',
                        name: 'products-variants-list',
                        component: () => import('@/views/products/product-variant/components/ProductVariantList.vue')
                    },
                    {
                        path: 'add',
                        name: 'products-variants-add',
                        component: () => import('@/views/products/product-variant/components/ProductVariantAdd.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'products-variants-edit',
                        props: true,
                        component: () => import('@/views/products/product-variant/components/ProductVariantEdit.vue')
                    },
                    {
                        path: 'import',
                        name: 'products-variants-import',
                        component: () => import('@/views/products/product-variant/components/ProductVariantImport.vue')
                    },
                    {
                        path: 'export',
                        name: 'products-variants-export',
                        component: () => import('@/views/products/product-variant/components/ProductVariantExport.vue')
                    },
                ]
            },
            // product variants routes
            {
                path: '/ecommerce/product-options',
                name: 'product-options',
                props: true,
                component: () => import('@/views/products/product-option/ProductOption.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "product-options-list" },
                        name: 'product-options-main'
                    },
                    {
                        path: 'list',
                        name: 'product-options-list',
                        component: () => import('@/views/products/product-option/components/ProductOptionList.vue')
                    },
                    {
                        path: 'add',
                        name: 'product-options-add',
                        component: () => import('@/views/products/product-option/components/ProductOptionAdd.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'product-options-edit',
                        props: true,
                        component: () => import('@/views/products/product-option/components/ProductOptionEdit.vue')
                    },
                    {
                        path: 'import',
                        name: 'product-options-import',
                        component: () => import('@/views/products/product-option/components/ProductOptionImport.vue')
                    },
                ]
            },
            {
                path: '/ecommerce/products-option-groups',
                name: 'products-option-groups',
                props: true,
                component: () => import('@/views/products/product-option-group/ProductOptionGroup.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "products-option-groups-list" },
                        name: 'products-option-groups-main'
                    },
                    {
                        path: 'list',
                        name: 'products-option-groups-list',
                        component: () => import('@/views/products/product-option-group/components/ProductOptionGroupList.vue')
                    },
                    {
                        path: 'add',
                        name: 'products-option-groups-add',
                        component: () => import('@/views/products/product-option-group/components/ProductOptionGroupAdd.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'products-option-groups-edit',
                        props: true,
                        component: () => import('@/views/products/product-option-group/components/ProductOptionGroupEdit.vue')
                    },
                    {
                        path: 'import',
                        name: 'products-option-groups-import',
                        component: () => import('@/views/products/product-option-group/components/ProductOptionGroupImport.vue')
                    },
                    {
                        path: 'export',
                        name: 'products-option-groups-export',
                        component: () => import('@/views/products/product-option-group/components/ProductOptionGroupExport.vue')
                    },
                ]
            },

            // =========================== start product variant items route ===========================
            {
                path: '/ecommerce/products/variants-item',
                name: 'variants item',
                props: true,
                component: () => import('@/views/items/variants-item/VariantsItemIndex.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "variants-item-list" },
                        name: 'variants-item-main'
                    },
                    {
                        path: 'list',
                        name: 'variants-item-list',
                        component: () => import('@/views/items/variants-item/components/VariantsItemList.vue')
                    },
                    {
                        path: 'add',
                        name: 'variants-item-add',
                        component: () => import('@/views/items/variants-item/components/VariantsItemAdd.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'variants-item-edit',
                        props: true,
                        component: () => import('@/views/items/variants-item/components/VariantsItemEdit.vue')
                    },
                    {
                        path: 'import',
                        name: 'variants-item-import',
                        component: () => import('@/views/items/variants-item/components/VariantsItemImport.vue')
                    },
                ]
            },
            // ============== end product variant items route ===================
            // =========================== start product option items route ===========================
            {
                path: '/ecommerce/items/item-options',
                name: 'item-options',
                props: true,
                component: () => import('@/views/items/item-option/ItemOptionIndex.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "item-option-list" },
                        name: 'item-option-main'
                    },
                    {
                        path: 'list',
                        name: 'item-option-list',
                        component: () => import('@/views/items/item-option/components/ItemOptionList.vue')
                    },
                    {
                        path: 'add',
                        name: 'item-option-add',
                        component: () => import('@/views/items/item-option/components/ItemOptionAdd.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'item-option-edit',
                        props: true,
                        component: () => import('@/views/items/item-option/components/ItemOptionEdit.vue')
                    },
                    {
                        path: 'import',
                        name: 'item-option-import',
                        component: () => import('@/views/items/item-option/components/ItemOptionImport.vue')
                    },
                ]
            },
            // =========================== end product option items route ===========================

            {
                path: '/configuration/settings/attributes',
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

            {
                path: '/configuration/settings/companies',
                name: 'companies',
                props: true,
                component: () => import('@/views/company/Company.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "companies-list" },
                        name: 'companies-main'
                    },
                    {
                        path: 'list',
                        name: 'companies-list',
                        component: () => import('@/views/company/components/CompanyList.vue')
                    },
                    {
                        path: 'add',
                        name: 'companies-add',
                        component: () => import('@/views/company/components/CompanyAdd.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'companies-edit',
                        props: true,
                        component: () => import('@/views/company/components/CompanyEdit.vue')
                    },
                    {
                        path: 'import',
                        name: 'companies-import',
                        component: () => import('@/views/company/components/CompanyImport.vue')
                    },
                ]
            },
            // =========================== start products categories route ===========================
            {
                path: '/ecommerce/categories',
                name: 'products-categories',
                props: true,
                component: () => import('@/views/categories/Category.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "products-categories-list" },
                        name: 'products-categories-main'
                    },
                    {
                        path: 'list',
                        name: 'products-categories-list',
                        component: () => import('@/views/categories/components/CategoriesList.vue')
                    },
                    {
                        path: 'import',
                        name: 'products-categories-import',
                        component: () => import('@/views/categories/components/CategoriesImport.vue')
                    },
                ]
            },
            // =========================== end products categories route ===========================
            {
                path: '/configuration/settings/customers',
                name: 'customers',
                props: true,
                component: () => import('@/views/customer/Customer.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "customers-list" },
                        name: 'customers-main'
                    },
                    {
                        path: 'list',
                        name: 'customers-list',
                        component: () => import('@/views/customer/components/CustomerList.vue')
                    },
                    {
                        path: 'add',
                        name: 'customers-add',
                        component: () => import('@/views/customer/components/CustomerAdd.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'customers-edit',
                        props: true,
                        component: () => import('@/views/customer/components/CustomerEdit.vue')
                    },
                    {
                        path: 'import',
                        name: 'customers-import',
                        component: () => import('@/views/customer/components/CustomerImport.vue')
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
                path: '/configuration/settings/options',
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
            { // base setup content type routes start
                path: '/configuration/settings/types',
                name: 'types',
                props: true,
                component: () => import('@/views/type/Type.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "types-list" },
                        name: 'types-main'
                    },
                    {
                        path: 'list',
                        name: 'types-list',
                        component: () => import('@/views/type/components/TypeList.vue')
                    },
                    {
                        path: 'add',
                        name: 'types-add',
                        component: () => import('@/views/type/components/TypeAdd.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'types-edit',
                        props: true,
                        component: () => import('@/views/type/components/TypeEdit.vue')
                    },
                    {
                        path: 'import',
                        name: 'types-import',
                        component: () => import('@/views/type/components/TypeImport.vue')
                    },
                ]
            },
            { // base setup content variant routes start
                path: '/configuration/settings/variants',
                name: 'variants',
                props: true,
                component: () => import('@/views/variant/Variant.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "variants-list" },
                        name: 'variants-main'
                    },
                    {
                        path: 'list',
                        name: 'variants-list',
                        component: () => import('@/views/variant/components/VariantList.vue')
                    },
                    {
                        path: 'add',
                        name: 'variants-add',
                        component: () => import('@/views/variant/components/VariantAdd.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'variants-edit',
                        props: true,
                        component: () => import('@/views/variant/components/VariantEdit.vue')
                    },
                    {
                        path: 'import',
                        name: 'variants-import',
                        component: () => import('@/views/variant/components/VariantImport.vue')
                    },
                    {
                        path: 'export',
                        name: 'variants-export',
                        component: () => import('@/views/variant/components/VariantExport.vue')
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
            // old admin routes. delete this after new design is complete
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
            // end old admin routes
            // new admin routes start
            { // 
                path: '/configuration/settings/admin-users',
                name: 'admin-users',
                props: true,
                component: () => import('@/views/admin-user/AdminUser.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "admin-user-list" },
                        name: 'admin-user-main'
                    },
                    {
                        path: 'list',
                        name: 'admin-user-list',
                        component: () => import('@/views/admin-user/components/AdminUserList.vue')
                    },
                    {
                        path: 'add',
                        name: 'admin-user-add',
                        component: () => import('@/views/admin-user/components/AdminUserAdd.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'admin-user-edit',
                        props: true,
                        component: () => import('@/views/admin-user/components/AdminUserEdit.vue')
                    },
                    {
                        path: 'import',
                        name: 'admin-user-import',
                        component: () => import('@/views/admin-user/components/AdminUserImport.vue')
                    },
                ]
            },
            // end new admin routes
            // old admin roles routes start
            // {
            //     path: '/configuration/settings/manage-roles',
            //     name: 'Manage Roles',
            //     component: () => import('@/views/RolesIndex.vue')
            // },
            // {
            //     path: '/configuration/settings/add-role',
            //     name: 'Add Role',
            //     component: () => import('@/views/RoleAdd.vue')
            // },
            // {
            //     path: '/configuration/settings/edit-role/:id',
            //     name: 'Edit Role',
            //     component: () => import('@/views/RoleEdit.vue')
            // },
            // end old admin roles routes
            // new admin roles routes start
            { // 
                path: '/configuration/settings/manage-roles',
                name: 'manage-roles',
                props: true,
                component: () => import('@/views/admin-manage-role/AdminRole.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "manage-role-list" },
                        name: 'manage-role-main'
                    },
                    {
                        path: 'list',
                        name: 'manage-role-list',
                        component: () => import('@/views/admin-manage-role/components/AdminRoleList.vue')
                    },
                    {
                        path: 'add',
                        name: 'manage-role-add',
                        component: () => import('@/views/admin-manage-role/components/AdminRoleAdd.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'manage-role-edit',
                        props: true,
                        component: () => import('@/views/admin-manage-role/components/AdminRoleEdit.vue')
                    },
                    {
                        path: 'import',
                        name: 'manage-role-import',
                        component: () => import('@/views/admin-manage-role/components/AdminRoleImport.vue')
                    },
                ]
            },
            // end new admin roles routes


            // ============= start taxonomies route =============

            {
                path: '/configuration/settings/taxonomies',
                name: 'taxonomies',
                props: true,
                component: () => import('@/views/taxonomies/TaxonomyIndex.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "taxonomies-list" },
                        name: 'taxonomies-main'
                    },
                    {
                        path: 'list',
                        name: 'taxonomies-list',
                        component: () => import('@/views/taxonomies/components/TaxonomyList.vue')
                    },
                    {
                        path: 'add',
                        name: 'taxonomies-add',
                        component: () => import('@/views/taxonomies/components/TaxonomyAdd.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'taxonomies-edit',
                        props: true,
                        component: () => import('@/views/taxonomies/components/TaxonomyEdit.vue')
                    },
                    {
                        path: 'import',
                        name: 'taxonomies-type-import',
                        component: () => import('@/views/taxonomies/components/TaxonomyImport.vue')
                    },
                ]
            },

            // {
            //     path: '/configuration/settings/taxonomies',
            //     name: 'Taxonomies',
            //     component: () => import('@/views/TaxonomyIndex.vue')
            // },
            // {
            //     path: '/configuration/settings/add-taxonomy',
            //     name: 'Add Taxonomy',
            //     component: () => import('@/views/TaxonomyAdd.vue')
            // },
            // {
            //     path: '/configuration/settings/edit-taxonomy/:id',
            //     name: 'Edit Taxonomy',
            //     component: () => import('@/views/TaxonomyEdit.vue')
            // },
            // ============= end taxonomies route =============


            // {
            //     path: '/configuration/settings/post-types',
            //     name: 'Post Types',
            //     component: () => import('@/views/PostTypesIndex.vue')
            // },
            {
                path: '/configuration/settings/post-types',
                name: 'post-types',
                props: true,
                component: () => import('@/views/post-type/PostTypeIndex.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "post-types-list" },
                        name: 'post-types-main'
                    },
                    {
                        path: 'list',
                        name: 'post-types-list',
                        component: () => import('@/views/post-type/components/PostTypeList.vue')
                    },
                    {
                        path: 'add',
                        name: 'post-types-add',
                        component: () => import('@/views/post-type/components/PostTypeAdd.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'post-types-edit',
                        props: true,
                        component: () => import('@/views/post-type/components/PostTypeEdit.vue')
                    },
                    {
                        path: 'import',
                        name: 'post-types-type-import',
                        component: () => import('@/views/post-type/components/PostTypeImport.vue')
                    },
                ]
            },
            // {
            //     path: '/configuration/settings/add-post-type',
            //     name: 'Add Post Type',
            //     component: () => import('@/views/PostTypeAdd.vue')
            // },
            // {
            //     path: '/configuration/settings/edit-post-type/:id',
            //     name: 'Edit Post Type',
            //     component: () => import('@/views/PostTypeEdit.vue')
            // },
            // {
            //     path: '/configuration/settings/product-types',
            //     name: 'Product Types',
            //     component: () => import('@/views/ProductTypeIndex.vue')
            // },

            {
                path: '/configuration/settings/product-types',
                name: 'product-types',
                props: true,
                component: () => import('@/views/product-type/ProductTypeIndex.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "product-types-list" },
                        name: 'product-types-main'
                    },
                    {
                        path: 'list',
                        name: 'product-types-list',
                        component: () => import('@/views/product-type/components/ProductTypeList.vue')
                    },
                    {
                        path: 'add',
                        name: 'product-types-add',
                        component: () => import('@/views/product-type/components/ProductTypeAdd.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'product-types-edit',
                        props: true,
                        component: () => import('@/views/product-type/components/ProductTypeEdit.vue')
                    },
                    {
                        path: 'import',
                        name: 'product-types-type-import',
                        component: () => import('@/views/product-type/components/ProductTypeImport.vue')
                    },
                ]
            },

            // {
            //     path: '/configuration/settings/add-product-type',
            //     name: 'Add Product Type',
            //     component: () => import('@/views/ProductTypeAdd.vue')
            // },
            // {
            //     path: '/configuration/settings/edit-product-type/:id',
            //     name: 'Edit Product Type',
            //     component: () => import('@/views/ProductTypeEdit.vue')
            // },
            // {
            //     path: '/configuration/settings/subscriptions-plans',
            //     name: 'Subscriptions Plans',
            //     component: () => import('@/views/SubscriptionPlanIndex.vue')
            // },
            {
                path: '/configuration/settings/subscriptions-plans',
                name: 'subscriptions-plans',
                props: true,
                component: () => import('@/views/subscription-plan/SubscriptionPlanIndex.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "subscriptions-plans-list" },
                        name: 'subscriptions-plans-main'
                    },
                    {
                        path: 'list',
                        name: 'subscriptions-plans-list',
                        component: () => import('@/views/subscription-plan/components/SubscriptionPlanList.vue')
                    },
                    {
                        path: 'add',
                        name: 'subscriptions-plans-add',
                        component: () => import('@/views/subscription-plan/components/SubscriptionPlanAdd.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'subscriptions-plans-edit',
                        props: true,
                        component: () => import('@/views/subscription-plan/components/SubscriptionPlanEdit.vue')
                    }
                ]
            },
            // {
            //     path: '/configuration/settings/add-subscription-plan',
            //     name: 'Add Subscription Plan',
            //     component: () => import('@/views/SubscriptionPlanAdd.vue')
            // },
            // {
            //     path: '/configuration/settings/edit-subscription-plan/:id',
            //     name: 'Edit Subscription Plan',
            //     component: () => import('@/views/SubscriptionPlanEdit.vue')
            // },
            // old tax type routes
            // {
            //     path: '/configuration/settings/tax-types',
            //     name: 'Tax Types',
            //     component: () => import('@/views/TaxTypesIndex.vue')
            // },
            // {
            //     path: '/configuration/settings/add-tax-types',
            //     name: 'Add Tax Type',
            //     component: () => import('@/views/TaxTypeAdd.vue')
            // },
            // {
            //     path: '/configuration/settings/edit-tax-types/:id',
            //     name: 'Edit Tax Type',
            //     component: () => import('@/views/TaxTypeEdit.vue')
            // },
            // end old tax type routes
            // new tax type routes start
            { // 
                path: '/configuration/settings/tax-types',
                name: 'tax-types',
                props: true,
                component: () => import('@/views/tax-type/TaxType.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "tax-types-list" },
                        name: 'tax-types-main'
                    },
                    {
                        path: 'list',
                        name: 'tax-types-list',
                        component: () => import('@/views/tax-type/components/TaxTypeList.vue')
                    },
                    {
                        path: 'add',
                        name: 'tax-types-add',
                        component: () => import('@/views/tax-type/components/TaxTypeAdd.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'tax-types-edit',
                        props: true,
                        component: () => import('@/views/tax-type/components/TaxTypeEdit.vue')
                    },
                    {
                        path: 'import',
                        name: 'tax-types-import',
                        component: () => import('@/views/tax-type/components/TaxTypeImport.vue')
                    },
                ]
            },
            // end new tax type routes
            // old tax rate routes
            // {
            //     path: '/configuration/settings/tax-rates',
            //     name: 'Tax Rates',
            //     component: () => import('@/views/TaxRateIndex.vue')
            // },
            // {
            //     path: '/configuration/settings/add-tax-rates',
            //     name: 'Add Tax Rate',
            //     component: () => import('@/views/TaxRateAdd.vue')
            // },
            // {
            //     path: '/configuration/settings/edit-tax-rates/:id',
            //     name: 'Edit Tax Rate',
            //     component: () => import('@/views/TaxRateEdit.vue')
            // },
            // end old tax rate routes
            // new tax rate routes start
            { // 
                path: '/configuration/settings/tax-rates',
                name: 'tax-rates',
                props: true,
                component: () => import('@/views/tax-rate/TaxRate.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "tax-rate-list" },
                        name: 'tax-rate-main'
                    },
                    {
                        path: 'list',
                        name: 'tax-rate-list',
                        component: () => import('@/views/tax-rate/components/TaxRateList.vue')
                    },
                    {
                        path: 'add',
                        name: 'tax-rate-add',
                        component: () => import('@/views/tax-rate/components/TaxRateAdd.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'tax-rate-edit',
                        props: true,
                        component: () => import('@/views/tax-rate/components/TaxRateEdit.vue')
                    },
                    {
                        path: 'import',
                        name: 'tax-rate-import',
                        component: () => import('@/views/tax-rate/components/TaxRateImport.vue')
                    },
                ]
            },
            // end new tax rate routes
            {
                path: '/configuration/settings/stock-statuses',
                name: 'stock-statuses',
                props: true,
                component: () => import('@/views/statuses/stock/StockStatus.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "stock-statuses-list" },
                        name: 'stock-statuses-main'
                    },
                    {
                        path: 'list',
                        name: 'stock-statuses-list',
                        component: () => import('@/views/statuses/stock/components/StockStatusList.vue')
                    },
                    {
                        path: 'add',
                        name: 'stock-statuses-add',
                        component: () => import('@/views/statuses/stock/components/StockStatusAdd.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'stock-statuses-edit',
                        props: true,
                        component: () => import('@/views/statuses/stock/components/StockStatusEdit.vue')
                    },
                    {
                        path: 'import',
                        name: 'stock-statuses-import',
                        component: () => import('@/views/statuses/stock/components/StockStatusImport.vue')
                    },
                ]
            },
            {
                path: '/configuration/settings/subscription-statuses',
                name: 'Subscription Statuses',
                props: true,
                component: () => import('@/views/statuses/subscription/SubscriptionStatus.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "subscription-statuses-list" },
                        name: 'subscription-statuses-main'
                    },
                    {
                        path: 'list',
                        name: 'subscription-statuses-list',
                        component: () => import('@/views/statuses/subscription/components/SubscriptionStatusList.vue')
                    },
                    {
                        path: 'add',
                        name: 'subscription-statuses-add',
                        component: () => import('@/views/statuses/subscription/components/SubscriptionStatusAdd.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'subscription-statuses-edit',
                        props: true,
                        component: () => import('@/views/statuses/subscription/components/SubscriptionStatusEdit.vue')
                    },
                    {
                        path: 'import',
                        name: 'subscription-statuses-import',
                        component: () => import('@/views/statuses/subscription/components/SubscriptionStatusImport.vue')
                    },
                ]
            },
            {
                path: '/configuration/settings/order-statuses',
                name: 'Order Statuses',
                props: true,
                component: () => import('@/views/statuses/order/OrderStatus.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "order-statuses-list" },
                        name: 'order-statuses-main'
                    },
                    {
                        path: 'list',
                        name: 'order-statuses-list',
                        component: () => import('@/views/statuses/order/components/OrderStatusList.vue')
                    },
                    {
                        path: 'add',
                        name: 'order-statuses-add',
                        component: () => import('@/views/statuses/order/components/OrderStatusAdd.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'order-statuses-edit',
                        props: true,
                        component: () => import('@/views/statuses/order/components/OrderStatusEdit.vue')
                    },
                    {
                        path: 'import',
                        name: 'order-statuses-import',
                        component: () => import('@/views/statuses/order/components/OrderStatusImport.vue')
                    },
                ]
            },
            {
                path: '/configuration/settings/payment-statuses',
                name: 'Payment Statuses',
                props: true,
                component: () => import('@/views/statuses/payment/PaymentStatus.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "payment-statuses-list" },
                        name: 'payment-statuses-main'
                    },
                    {
                        path: 'list',
                        name: 'payment-statuses-list',
                        component: () => import('@/views/statuses/payment/components/PaymentStatusList.vue')
                    },
                    {
                        path: 'add',
                        name: 'payment-statuses-add',
                        component: () => import('@/views/statuses/payment/components/PaymentStatusAdd.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'payment-statuses-edit',
                        props: true,
                        component: () => import('@/views/statuses/payment/components/PaymentStatusEdit.vue')
                    },
                    {
                        path: 'import',
                        name: 'payment-statuses-import',
                        component: () => import('@/views/statuses/payment/components/PaymentStatusImport.vue')
                    },
                ]
            },
            // {
            //     path: '/configuration/settings/add-payment-statuses',
            //     name: 'Add Payment Status',
            //     component: () => import('@/views/PaymentStatusAdd.vue')
            // },
            // {
            //     path: '/configuration/settings/edit-payment-statuses/:id',
            //     name: 'Update Payment Status',
            //     component: () => import('@/views/PaymentStatusEdit.vue')
            // },
            // old shipping status routes
            // {
            //     path: '/configuration/settings/shipping-statuses',
            //     name: 'Shipping Statuses',
            //     component: () => import('@/views/ShippingStatusIndex.vue')
            // },
            // {
            //     path: '/configuration/settings/add-shipping-statuses',
            //     name: 'Add Shipping Status',
            //     component: () => import('@/views/ShippingStatusAdd.vue')
            // },
            // {
            //     path: '/configuration/settings/edit-shipping-statuses/:id',
            //     name: 'Update Shipping Status',
            //     component: () => import('@/views/ShippingStatusEdit.vue')
            // },
            // end old shipping status routes
            // new shipping status routes start
            {
                path: '/configuration/settings/shipping-statuses',
                name: 'Shipping Statuses',
                props: true,
                component: () => import('@/views/statuses/shipping/ShippingStatus.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "shipping-statuses-list" },
                        name: 'shipping-statuses-main'
                    },
                    {
                        path: 'list',
                        name: 'shipping-statuses-list',
                        component: () => import('@/views/statuses/shipping/components/ShippingStatusList.vue')
                    },
                    {
                        path: 'add',
                        name: 'shipping-statuses-add',
                        component: () => import('@/views/statuses/shipping/components/ShippingStatusAdd.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'shipping-statuses-edit',
                        props: true,
                        component: () => import('@/views/statuses/shipping/components/ShippingStatusEdit.vue')
                    },
                    {
                        path: 'import',
                        name: 'shipping-statuses-import',
                        component: () => import('@/views/statuses/shipping/components/ShippingStatusImport.vue')
                    },
                ]
            },
            // end new shipping status routes
            // old return status routes
            // {
            //     path: '/configuration/settings/return-statuses',
            //     name: 'Return Statuses',
            //     component: () => import('@/views/ReturnStatusIndex.vue')
            // },
            // {
            //     path: '/configuration/settings/add-return-statuses',
            //     name: 'Add Return Status',
            //     component: () => import('@/views/ReturnStatusAdd.vue')
            // },
            // {
            //     path: '/configuration/settings/edit-return-statuses/:id',
            //     name: 'Update Return Status',
            //     component: () => import('@/views/ReturnStatusEdit.vue')
            // },
            // end old return status routes
            // new return status routes start
            {
                path: '/configuration/settings/return-statuses',
                name: 'Return Statuses',
                props: true,
                component: () => import('@/views/statuses/return-status/ReturnStatus.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "return-statuses-list" },
                        name: 'return-statuses-main'
                    },
                    {
                        path: 'list',
                        name: 'return-statuses-list',
                        component: () => import('@/views/statuses/return-status/components/ReturnStatusList.vue')
                    },
                    {
                        path: 'add',
                        name: 'return-statuses-add',
                        component: () => import('@/views/statuses/return-status/components/ReturnStatusAdd.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'return-statuses-edit',
                        props: true,
                        component: () => import('@/views/statuses/return-status/components/ReturnStatusEdit.vue')
                    },
                    {
                        path: 'import',
                        name: 'return-statuses-import',
                        component: () => import('@/views/statuses/return-status/components/ReturnStatusImport.vue')
                    },
                ]
            },
            // end new return status routes
            // old return resolution routes
            // {
            //     path: '/configuration/settings/return-resolutions',
            //     name: 'Return Resolutions',
            //     component: () => import('@/views/ReturnResolutionIndex.vue')
            // },
            // {
            //     path: '/configuration/settings/add-return-resolutions',
            //     name: 'Add Return Resolution',
            //     component: () => import('@/views/ReturnResolutionAdd.vue')
            // },
            // {
            //     path: '/configuration/settings/edit-return-resolutions/:id',
            //     name: 'Update Return Resolution',
            //     component: () => import('@/views/ReturnResolutionEdit.vue')
            // },
            // end old return resolution routes
            // new return resolution routes start
            {
                path: '/configuration/settings/return-resolutions',
                name: 'Return Resolutions',
                props: true,
                component: () => import('@/views/statuses/return-resolution/ReturnResolution.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "return-resolutions-list" },
                        name: 'return-resolutions-main'
                    },
                    {
                        path: 'list',
                        name: 'return-resolutions-list',
                        component: () => import('@/views/statuses/return-resolution/components/ReturnResolutionList.vue')
                    },
                    {
                        path: 'add',
                        name: 'return-resolutions-add',
                        component: () => import('@/views/statuses/return-resolution/components/ReturnResolutionAdd.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'return-resolutions-edit',
                        props: true,
                        component: () => import('@/views/statuses/return-resolution/components/ReturnResolutionEdit.vue')
                    },
                    {
                        path: 'import',
                        name: 'return-resolutions-import',
                        component: () => import('@/views/statuses/return-resolution/components/ReturnResolutionImport.vue')
                    },
                ]
            },
            // end new return resolution routes
            // old return reason routes
            // {
            //     path: '/configuration/settings/return-reasons',
            //     name: 'Return Reasons',
            //     component: () => import('@/views/ReturnReasonIndex.vue')
            // },
            // end old return reason routes
            // new return reason routes start
            {
                path: '/configuration/settings/return-reasons',
                name: 'Return Reasons',
                props: true,
                component: () => import('@/views/statuses/return-reason/ReturnReason.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "return-reasons-list" },
                        name: 'return-reasons-main'
                    },
                    {
                        path: 'list',
                        name: 'return-reasons-list',
                        component: () => import('@/views/statuses/return-reason/components/ReturnReasonList.vue')
                    },
                    {
                        path: 'add',
                        name: 'return-reasons-add',
                        component: () => import('@/views/statuses/return-reason/components/ReturnReasonAdd.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'return-reasons-edit',
                        props: true,
                        component: () => import('@/views/statuses/return-reason/components/ReturnReasonEdit.vue')
                    },
                    {
                        path: 'import',
                        name: 'return-reasons-import',
                        component: () => import('@/views/statuses/return-reason/components/ReturnReasonImport.vue')
                    },
                ]
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


            // =========================== start length type route ===========================
            {
                path: '/configuration/settings/length',
                name: 'length',
                props: true,
                component: () => import('@/views/measurment/length/LengthTypeIndex.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "length-list" },
                        name: 'length-main'
                    },
                    {
                        path: 'list',
                        name: 'length-list',
                        component: () => import('@/views/measurment/length/components/LengthTypeList.vue')
                    },
                    {
                        path: 'add',
                        name: 'length-add',
                        component: () => import('@/views/measurment/length/components/LengthTypeAdd.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'length-edit',
                        props: true,
                        component: () => import('@/views/measurment/length/components/LengthTypeEdit.vue')
                    },
                    {
                        path: 'import',
                        name: 'length-type-import',
                        component: () => import('@/views/measurment/length/components/LengthTypeImport.vue')
                    },
                ]
            },
            // ============== end length ===================



            // ============== start weight ===================
            {
                path: '/configuration/settings/weight',
                name: 'weight',
                props: true,
                component: () => import('@/views/measurment/weight/WeightTypeIndex.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "weight-list" },
                        name: 'weight-main'
                    },
                    {
                        path: 'list',
                        name: 'weight-list',
                        component: () => import('@/views/measurment/weight/components/WeightTypeList.vue')
                    },
                    {
                        path: 'add',
                        name: 'weight-add',
                        component: () => import('@/views/measurment/weight/components/WeightTypeAdd.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'weight-edit',
                        props: true,
                        component: () => import('@/views/measurment/weight/components/WeightTypeEdit.vue')
                    },
                    {
                        path: 'import',
                        name: 'weight-type-import',
                        component: () => import('@/views/measurment/weight/components/WeightTypeImport.vue')
                    },
                ]
            },


            // ============== end weight type ===================



            // ============== start way point route ===================

            {
                path: '/configuration/settings/media-way-points',
                name: 'Way Points',
                component: () => import('@/views/media/components/MediaWayPoint.vue')
            },

            // ============== end way point route ===================


             // =========================== start vendor route ===========================
             {
                path: '/ecommerce/products-vendors',
                name: 'vendors',
                props: true,
                component: () => import('@/views/vendor/VendorIndex.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "vendors-list" },
                        name: 'vendors-main'
                    },
                    {
                        path: 'list',
                        name: 'vendors-list',
                        component: () => import('@/views/vendor/components/VendorList.vue')
                    },
                    {
                        path: 'add',
                        name: 'vendors-add',
                        component: () => import('@/views/vendor/components/VendorAdd.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'vendors-edit',
                        props: true,
                        component: () => import('@/views/vendor/components/VendorEdit.vue')
                    },
                    {
                        path: 'import',
                        name: 'vendors-import',
                        component: () => import('@/views/vendor/components/VendorImport.vue')
                    },
                ]
            },

            // {
            //     path: '/ecommerce/products-vendors',
            //     name: 'Products Vendors',
            //     component: () => import('@/views/VendorIndex.vue')
            // },
            // {
            //     path: '/ecommerce/products-vendors/add',
            //     name: 'Add Vendor',
            //     component: () => import('@/views/VendorAdd.vue')
            // },
            // {
            //     path: '/ecommerce/products-vendors/edit/:id',
            //     name: 'Edit Vendor',
            //     component: () => import('@/views/VendorEdit.vue')
            // },
            // ============== end vendor route ===================



             // =========================== start manufacturer route ===========================
             {
                path: '/ecommerce/products-manufacturers',
                name: 'Products Manufacturers',
                props: true,
                component: () => import('@/views/manufacturer/ManufacturerIndex.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "manufacturers-list" },
                        name: 'manufacturers-main'
                    },
                    {
                        path: 'list',
                        name: 'manufacturers-list',
                        component: () => import('@/views/manufacturer/components/ManufacturerList.vue')
                    },
                    {
                        path: 'add',
                        name: 'manufacturers-add',
                        component: () => import('@/views/manufacturer/components/ManufacturerAdd.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'manufacturers-edit',
                        props: true,
                        component: () => import('@/views/manufacturer/components/ManufacturerEdit.vue')
                    },
                    {
                        path: 'import',
                        name: 'manufacturers-import',
                        component: () => import('@/views/manufacturer/components/ManufacturerImport.vue')
                    },
                ]
            },

            // {
            //     path: '/ecommerce/products-manufacturers',
            //     name: 'Products Manufacturers',
            //     component: () => import('@/views/ManufacturerIndex.vue')
            // },
            // {
            //     path: '/ecommerce/products-manufacturers/add',
            //     name: 'Add Manufacturer',
            //     component: () => import('@/views/ManufacturerAdd.vue')
            // },
            // {
            //     path: '/ecommerce/products-manufacturers/edit/:id',
            //     name: 'Edit Manufacturer',
            //     component: () => import('@/views/ManufacturerEdit.vue')
            // },
            // ============== end vendor route ===================


            // {
            //     path: '/configuration/settings/weight',
            //     name: 'Weight',
            //     component: () => import('@/views/WeightTypeIndex.vue')
            // },
            // {
            //     path: '/configuration/settings/add-weight-types',
            //     name: 'Add Weight Type',
            //     component: () => import('@/views/WeightTypeAdd.vue')
            // },
            // {
            //     path: '/configuration/settings/edit-weight-types/:id',
            //     name: 'Edit Weight Type',
            //     component: () => import('@/views/WeightTypeEdit.vue')
            // },

            // {
            //     path: '/configuration/settings/languages',
            //     name: 'Languages',
            //     component: () => import('@/views/LanguageIndex.vue')
            // },

            {
                path: '/configuration/settings/languages',
                name: 'Languages',
                props: true,
                component: () => import('@/views/localization/language/LanguageIndex.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "languages-list" },
                        name: 'languages-main'
                    },
                    {
                        path: 'list',
                        name: 'languages-list',
                        component: () => import('@/views/localization/language/components/LanguageList.vue')
                    },
                    {
                        path: 'add',
                        name: 'languages-add',
                        component: () => import('@/views/localization/language/components/LanguageAdd.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'languages-edit',
                        props: true,
                        component: () => import('@/views/localization/language/components/LanguageEdit.vue')
                    }
                ]
            },

            // {
            //     path: '/configuration/settings/add-languages',
            //     name: 'Add Language',
            //     component: () => import('@/views/LanguageAdd.vue')
            // },
            // {
            //     path: '/configuration/settings/edit-languages/:id',
            //     name: 'Edit Language',
            //     component: () => import('@/views/LanguageEdit.vue')
            // },
            // {
            //     path: '/configuration/settings/currencies',
            //     name: 'Currencies',
            //     component: () => import('@/views/CurrencyIndex.vue')
            // },
            {
                path: '/configuration/settings/currencies',
                name: 'Currencies',
                props: true,
                component: () => import('@/views/localization/currency/CurrencyIndex.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "currencies-list" },
                        name: 'currencies-main'
                    },
                    {
                        path: 'list',
                        name: 'currencies-list',
                        component: () => import('@/views/localization/currency/components/CurrencyList.vue')
                    },
                    {
                        path: 'add',
                        name: 'currencies-add',
                        component: () => import('@/views/localization/currency/components/CurrencyAdd.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'currencies-edit',
                        props: true,
                        component: () => import('@/views/localization/currency/components/CurrencyEdit.vue')
                    }
                ]
            },
            // {
            //     path: '/configuration/settings/edit-currencies/:id',
            //     name: 'Edit Currency',
            //     component: () => import('@/views/CurrencyEdit.vue')
            // },
            // {
            //     path: '/configuration/settings/add-currencies',
            //     name: 'Add Currency',
            //     component: () => import('@/views/CurrencyAdd.vue')
            // },
            // {
            //     path: '/configuration/settings/countries',
            //     name: 'Countries',
            //     component: () => import('@/views/CountryIndex.vue')
            // },
            {
                path: '/configuration/settings/countries',
                name: 'Countries',
                props: true,
                component: () => import('@/views/localization/country/CountryIndex.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "countries-list" },
                        name: 'countries-main'
                    },
                    {
                        path: 'list',
                        name: 'countries-list',
                        component: () => import('@/views/localization/country/components/CountryList.vue')
                    },
                    {
                        path: 'add',
                        name: 'countries-add',
                        component: () => import('@/views/localization/country/components/CountryAdd.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'countries-edit',
                        props: true,
                        component: () => import('@/views/localization/country/components/CountryEdit.vue')
                    },
                    {
                        path: 'import',
                        name: 'countries-import',
                        component: () => import('@/views/localization/country/components/CountryImport.vue')
                    },
                ]
            },
            // {
            //     path: '/configuration/settings/add-countries',
            //     name: 'Add Country',
            //     component: () => import('@/views/CountryAdd.vue')
            // },
            // {
            //     path: '/configuration/settings/edit-countries/:id',
            //     name: 'Edit Country',
            //     component: () => import('@/views/CountryEdit.vue')
            // },
            {
                path: '/configuration/settings/regions',
                name: 'Regions',
                props: true,
                component: () => import('@/views/localization/region/RegionIndex.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "regions-list" },
                        name: 'regions-main'
                    },
                    {
                        path: 'list',
                        name: 'regions-list',
                        component: () => import('@/views/localization/region/components/RegionList.vue')
                    },
                    {
                        path: 'add',
                        name: 'regions-add',
                        component: () => import('@/views/localization/region/components/RegionAdd.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'regions-edit',
                        props: true,
                        component: () => import('@/views/localization/region/components/RegionEdit.vue')
                    },
                    {
                        path: 'import',
                        name: 'regions-import',
                        component: () => import('@/views/localization/region/components/RegionImport.vue')
                    },
                ]
            },
            // {
            //     path: '/configuration/settings/region-groups',
            //     name: 'Region Groups',
            //     component: () => import('@/views/RegionGroupIndex.vue')
            // },
            {
                path: '/configuration/settings/region-groups',
                name: 'Region Groups',
                props: true,
                component: () => import('@/views/localization/region-group/RegionGroupIndex.vue'),
                children: [
                    {
                        path: "",
                        redirect: { name: "region-groups-list" },
                        name: 'region-groups-main'
                    },
                    {
                        path: 'list',
                        name: 'region-groups-list',
                        component: () => import('@/views/localization/region-group/components/RegionGroupList.vue')
                    },
                    {
                        path: 'add',
                        name: 'region-groups-add',
                        component: () => import('@/views/localization/region-group/components/RegionGroupAdd.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'region-groups-edit',
                        props: true,
                        component: () => import('@/views/localization/region-group/components/RegionGroupEdit.vue')
                    },
                    {
                        path: 'import',
                        name: 'region-groups-import',
                        component: () => import('@/views/localization/region-group/components/RegionGroupImport.vue')
                    },
                ]
            },
            // {
            //     path: '/configuration/settings/add-region-groups',
            //     name: 'Add Region Group',
            //     component: () => import('@/views/RegionGroupAdd.vue')
            // },
            // {
            //     path: '/configuration/settings/edit-region-groups/:id',
            //     name: 'Edit Region Group',
            //     component: () => import('@/views/RegionGroupEdit.vue')
            // },
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
                path: '401',
                name: 'unauthorized-401',
                component: () => import('@/views/errors/401.vue')
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
        path: '/errors/400',
        name: 'error-400',
        component: () => import('@/views/errors/400.vue')
    },
    {
        path: '/errors/401',
        name: 'error-401',
        component: () => import('@/views/errors/401.vue')
    },
    {
        path: '/errors/403',
        name: 'error-403',
        component: () => import('@/views/errors/403.vue')
    },
    {
        path: '/errors/404',
        name: 'error-404',
        component: () => import('@/views/errors/404.vue')
    },
    {
        path: '/errors/409',
        name: 'error-409',
        component: () => import('@/views/errors/409.vue')
    },
    {
        path: '/errors/410',
        name: 'error-410',
        component: () => import('@/views/errors/410.vue')
    },
    {
        path: '/errors/426',
        name: 'error-426',
        component: () => import('@/views/errors/426.vue')
    },
    {
        path: '/errors/500',
        name: 'error-500',
        component: () => import('@/views/errors/500.vue')
    },
    {
        path: '/errors/503',
        name: 'error-503',
        component: () => import('@/views/errors/503.vue')
    },
    {
        path: '/pages/notfound',
        name: 'notfound',
        component: () => import('@/views/errors/404.vue')
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: { name: 'error-404' }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        return { left: 0, top: 0 };
    }
});

const PUBLIC_ROUTE_NAMES = new Set([
    'login',
    'register',
    'verification',
    'forgot-password',
    'new-password',
    'lock-screen',
    'access',
    'unauthorized-401',
    'error-400',
    'error-401',
    'error-403',
    'error-404',
    'error-409',
    'error-410',
    'error-426',
    'error-500',
    'error-503',
    'oops',
    'notfound'
]);

router.beforeEach(async (to) => {
    const codeExchangeResult = await consumeCodeFromRouteQuery(to);
    if (codeExchangeResult.handled) {
        return codeExchangeResult.redirect;
    }

    if (PUBLIC_ROUTE_NAMES.has(to.name)) {
        return true;
    }

    const isSessionValid = await validateSession();
    if (!isSessionValid) {
        return buildUnauthorized401Redirect(to);
    }

    return true;
});

export default router;
