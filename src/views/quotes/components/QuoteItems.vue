<script setup lang="ts">
import { defineProps, onMounted, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { storeToRefs } from 'pinia';
const props = defineProps({ id: { type: String, required: true } });

import { useQuoteStore } from '@/stores/quote';
const quoteStore = useQuoteStore();
const { quoteItems, fb } = storeToRefs(quoteStore);
const emit = defineEmits(['update:quote']);
const acceptQuoteStatus = ref(false);
const toast = useToast();

onMounted(async () => {
   const quoteItemsData = await quoteStore.showQuoteItems(props.id);
    // console.log('quote items', quoteItems.value);

    if (quoteItemsData?.quote_summary?.quote_status_id > 0) {
        acceptQuoteStatus.value = true;
    }
    console.log('acceptQuoteStatus', acceptQuoteStatus.value);
});


async function acceptQuote(id: number) {
    try {
        const response = await quoteStore.acceptQuote(id);
        console.log('response', response);
        if (response.success) {
            acceptQuoteStatus.value = true;
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Quote accepted successfully',
                life: 3000
            });
        } else {
            acceptQuoteStatus.value = false;
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to accept quote',
                life: 3000
            });
        }
    } catch (error) {
        console.error('Error accepting quote:', error);
        acceptQuoteStatus.value = false;
    }
    console.log('acceptQuoteStatus', acceptQuoteStatus.value);
}

</script>

<template>
    <section id="account-db-active-quotes">
        <div class="container th-container">
            <div class="section-body">
                <div class="row">
                    <div id="account-navigation" class="col-12 col-md-3 border-right-gray th-remove-border pt-30"
                        data-v-component-accountnavigation>
                        <div class="row th-sidebard">
                        </div>
                    </div>
                    <div id="account-show-quote" class="col-12 col-md-9 th-dashboard-main">
                        <!-- Page Title -->
                        <!-- <div class="row">
                            <div class="col-md-12">
                               
                            </div>
                        </div> -->

                        <!-- Quote Summary -->
                        <div class="row">
                            <div class="col-md-12">
                                <div class="th-dashboard-doc-summary">
                                    <div class="th-doc-info">
                                        <h4 class="th-doc-title">{{ quoteItems.quote_summary?.title }}</h4>
                                        <h1 class="th-doc-id">{{ quoteItems.quote_summary?.id }}</h1>
                                        <p class="th-doc-details">{{ quoteItems.quote_summary?.description }}</p>
                                    </div>

                                    <div class="th-doc-details">
                                        <h4 class="th-title-20">
                                            Account: <span>{{ quoteItems.quote_summary?.account }}</span>
                                        </h4>
                                        <h4 class="th-title-20">
                                            Amount: <span>{{ quoteItems.quote_summary?.amount }}</span>
                                        </h4>
                                        <h4 class="th-title-20">
                                            Created date: <span>{{ quoteItems.quote_summary?.created_date }}</span>
                                        </h4>
                                    </div>

                                    <div class="th-quote-actions">
                                        <a class="th-btn-gray text-capitalize quote-track-btn mr-5">
                                            <span class="accept-quote-text mr-5">Show Less</span>
                                        </a>
                                        <a class="th-btn-primary text-capitalize quote-track-btn ml-5" @click="acceptQuote(quoteItems.quote_summary?.quote_id)"
                                            :class="acceptQuoteStatus ? 'th-disabled' : ''" :disabled="acceptQuoteStatus">
                                            <i :class="fb.loading['quote.accept-quote.' + quoteItems.quote_summary?.quote_id] ? 'pi pi-spinner pi-spin' : ''" class="mr-2"></i>
                                            <span class="accept-quote-text mr-5">{{ acceptQuoteStatus ? 'Accepted' : 'Accept Quote' }}</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Table -->
                        <div class="th-table th-table-col-8">
                            <!-- Table Header -->
                            <div class="th-header-wrapper">
                                <div class="th-row-wrapper">
                                    <div class="th-cell">Item</div>
                                    <div class="th-cell th-col-span-3">Description</div>
                                    <div class="th-cell text-end">QTY</div>
                                    <div class="th-cell text-end">Unit Price</div>
                                    <div class="th-cell text-end">Item Total</div>
                                    <div class="th-cell text-end">Section Total</div>
                                </div>
                            </div>

                            <!-- Table Section -->
                            <div class="th-section-wrapper">
                                <div class="th-row-wrapper">
                                    <div class="th-cell" style="grid-column: 1 / 8; font-weight: bold;">
                                        {{ quoteItems.table?.section_title }}
                                    </div>
                                    <div class="th-cell text-end" style="font-weight: bold;">
                                        {{ quoteItems.table?.section_total }}
                                    </div>
                                </div>
                            </div>

                            <!-- Table Body -->
                            <div class="th-body-wrapper">
                                <div class="th-row-wrapper" v-for="(item, index) in quoteItems.table?.items" :key="index">
                                    <div class="th-cell">
                                        <img :src="item.image" :alt="item.alt" width="56" />
                                    </div>
                                    <div class="th-cell th-col-span-3">
                                        {{ item.description }}
                                    </div>
                                    <div class="th-cell text-end">{{ item.quantity }}</div>
                                    <div class="th-cell text-end">{{ item.unit_price }}</div>
                                    <div class="th-cell text-end">{{ item.item_total }}</div>
                                    <div class="th-cell text-end">
                                        <img :src="`/layout/images/comment-icon.png`" alt="Comment Icon" width="30" height="30" />
                                    </div>
                                </div>
                            </div>

                            <!-- Table Footer -->
                            <div class="th-footer-wrapper">
                                <div class="th-row-wrapper">
                                    <div class="th-cell mt-70" style="grid-column: 6 / 9; font-weight: bold;">
                                        <p class="th-description-20 th-footer-title">
                                            <span class="font-weight-400">Sub Total:
                                                <span>{{ quoteItems.footer?.sub_total }}</span>
                                            </span>
                                        </p>
                                        <p class="th-description-20 th-footer-title">
                                            <span class="font-weight-400">GST:
                                                <span>{{ quoteItems.footer?.gst }}</span>
                                            </span>
                                        </p>
                                        <div class="border-bottom"></div>
                                        <p class="th-description-20 th-footer-title">
                                            <span class="font-weight-400">Total Inc GST:
                                                <span>{{ quoteItems.footer?.total_inc_gst }}</span>
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    </section>
</template>

<style>
.th-disabled {
    position: relative;
    z-index: 2;
    border: none;
    text-transform: uppercase;
    text-align: center;
    background-color: #4b4949;
    color: #231f20;
    font-family: #fffafa;
    font-size: 17px;
    font-weight: 500;
    line-height: 1;
    padding: 16px 30px;
    min-width: 144px;
    border-radius: 1px;
    transition: background-color 0.4s ease, text-shadow 0.3s ease;
    cursor: pointer;
    z-index: 0;
    padding: 15px 30px;
    cursor: not-allowed;
    pointer-events: none;
    opacity: 0.5;

}
#th-documents-list {
    .th-mar {
        margin-left: 26px;
        gap: 40px;

        @media (max-width: 992px) {
            margin-left: 0px;
        }
    }

    .th-ordercard-info {
        color: var(--theme-primary);

        .th-document-actions {
            width: 390px;
        }

        .th-card-btn {
            margin-top: 22px !important;

            a {
                flex: 1;
            }
        }

        .th-quotes-carg-gap {
            margin-bottom: 212px;
            gap: 40px;
            column-gap: 40px;
        }

        @media (max-width: 768px) {
            padding: 0px !important;

            .th-document-actions {
                width: 100%;

                .th-card-btn {
                    a {
                        padding: 15px 25px;
                    }
                }
            }

            .th-quotes-carg-gap {
                gap: 0px;
                column-gap: 0px;
                margin-right: 0 !important;
            }
        }
    }
}

#account-db-active-quotes {
    @media (max-width: 992px) {
        padding-top: 4px;
    }

    .th-reccard-heading {
        margin-bottom: 18px;

        h5 {
            color: var(--theme-primary);
            margin-bottom: 2px;
        }

        h2 {
            color: var(--theme-primary);
        }
    }

    .th-mior {
        color: var(--theme-primary);
    }

    .th-code-gap {
        margin: 17px 0;
        color: var(--theme-primary);
    }

    .th-rs-text {
        color: var(--theme-primary);

        span {
            color: var(--theme-primary);
            opacity: 0.7;
        }
    }

    .recent-order-img {
        border-radius: 0px !important;

        img {
            @media (max-width: 992px) {
                width: 100%;
            }
        }
    }

    .th-qute-title-gap {
        @media (max-width: 992px) {
            margin: 30px 0 0 0;
        }
    }

    .th-color-gap {
        margin-bottom: 17px;
    }


    /* active quote css */
    .th-rs-card-text {
        h6 {
            span.th-order-item-data {
                color: var(--theme-primary);
                opacity: 0.7;
                font-weight: 400;
                padding-left: 10px;
            }
        }

    }


    /* active quote css */


    .profile-info {
        .profile-pic {
            display: flex;
            justify-content: center;
            margin-bottom: 19px;

            img {
                width: 133px;
                height: 133px;
            }
        }
    }

    .th-sidebard {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
        text-align: center;
    }

    .th-left-margin {
        margin-left: 26px;
    }

    .profile-text {
        margin-bottom: 63px;
        color: var(--theme-primary);

        h6 {
            margin-bottom: 6px;
        }

        p {
            color: var(--theme-primary);
        }

        @media (max-width: 768px) {
            margin-bottom: 10px;
        }
    }

    .th-bg-dark {
        background-color: var(--black-color);
        color: var(--white-color);
    }

    .offcanvas {
        padding-left: 29px;
        padding-right: 21px;
        padding-top: 14px;
    }

    .sidebar {
        padding: 0px 0 0 46px;
        border-radius: 8px;

        @media (max-width: 768px) {
            padding-left: 0px;
        }

        .sidebar-nav {
            list-style: none;
            padding: 0;
            margin: 0;

            .sidebar-nav-item {
                .nav-link {
                    display: flex;
                    align-items: center;
                    font-size: 20px;
                    padding: 12px 15px;
                    color: var(--gray-darker);
                    font-weight: 400;
                    text-decoration: none;
                    transition: 0.3s ease-in-out;

                    i {
                        margin-right: 10px;
                        /* Gap between icon & text */
                        font-size: 18px;
                    }

                    &:hover,
                    &.active {
                        color: var(--black-color);
                        font-weight: 700;
                    }
                }
            }
        }
    }

    /* Active body */
    .th-quote-padding {
        padding-top: 32px;
    }

    .quote-amount-info {
        display: flex;
        margin-top: 10px;
        margin-bottom: 5px;

        h4 {
            margin-right: 86px;
        }

        .th-smount-mr {
            margin-bottom: 0;
        }

        @media (max-width: 992px) {
            display: block;
        }
    }

    .quote-content {
        padding: 42px 0;
        height: 259px;

        h4 {
            color: var(--white-color) !important;
            margin-bottom: 0;
        }

        .quote-para {
            font-size: 14px;
        }

        .qute-number {
            font-size: 60px;
            line-height: 149%;
            margin: 5px 0;
        }
    }

    .th-quote-total-wraper {
        display: flex;
        justify-content: end;

        .quote-total-gst {
            width: 38%;
            background-color: #eaeaec80;
            padding: 32px 84px 42px 47px;
            text-align: end;

            .th-gst-my {
                margin: 30px 0;
            }

            .th-total-mt {
                margin-top: 30px;
            }

            @media (max-width: 992px) {
                width: 100%;
            }

            @media (max-width: 1200px) {
                padding: 0 20px 0 30px;
                text-align: left;
            }

            @media (max-width: 1200px) {
                padding: 0 20px 0 30px;
                text-align: left;
            }

            @media (max-width: 1400px) {
                padding: 0 20px 0 30px;
                text-align: left;
            }
        }
    }

    .th-quotes-card {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
    }

    .th-quote-oredr-info {
        padding: 80px 0;
    }

    .th-quote-member {
        margin-top: 74px;
    }


    .th-quote-total {
        margin-top: 74px;
    }

    /* table grid */
    .th-quote-table {
        margin-top: 50px;
    }

    .th-table-header {
        background-color: var(--gray-color) !important;
    }

    .container-table-grid {
        display: grid;
        grid-template-columns: repeat(17, 1fr);
        gap: 10px !important;
        justify-content: center;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        background-color: white;
        align-items: center;

        .th-qoute-table-gap {
            font-size: 14px;
            font-weight: 600;
            color: #5a5a5a;
        }

        .grid-col-span-2 {
            grid-column: span 2;
            padding-left: 10px;
        }

        .grid-col-span-5 {
            grid-column: span 8;
        }

        .grid-col-span-1 {
            grid-column: span 1;
        }

        .grid-col-span-3 {
            grid-column: span 2;
        }

        .grid-item {
            padding: 37px 0;
            background: transparent;
        }
    }

    .th-quote-actions {
        display: flex;
        margin-top: 15px;
    }
}

/* disabled button */
#account-show-quote,
#account-show-order {
    @media (max-width: 768px) {
        padding-left: 12px !important;
    }

    .th-dashboard-doc-summary {
        .th-doc-info {
            margin-bottom: 27px;
        }

        .th-doc-details {
            gap: 85px !important;
            justify-content: unset !important;

            h4 {
                span {
                    font-weight: 400;
                    color: var(--gray-darker);
                    opacity: 0.7;
                    font-size: 20px;
                }
            }
        }

        @media (max-width: 768px) {
            gap: 10px !important;

            .th-doc-details {
                gap: 10px !important;
                justify-content: space-between !important;
            }

            .th-title-20 {
                display: flex;
                flex-direction: column;
            }
        }
    }

    .th-table-col-8 {
        .th-footer-wrapper {
            .total-calculation-title {
                color: var(--theme-secondary);
                margin-left: 13px;
                opacity: 0.7;
            }
        }
    }


}
</style>
