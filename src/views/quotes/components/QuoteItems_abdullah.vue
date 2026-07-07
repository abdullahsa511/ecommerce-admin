<script setup lang="ts">
import { defineProps, onMounted } from 'vue';

import { storeToRefs } from 'pinia';
const props = defineProps({ id: { type: String, required: true } });
import { useQuoteStore } from '@/stores/quote';
const quoteStore = useQuoteStore();
const { quoteItems, fb } = storeToRefs(quoteStore);
const emit = defineEmits(['update:quote']);

onMounted(async() => {
    await quoteStore.showQuoteItems(props.id);
    console.log('quote items', quoteItems.value);
});

</script>

<template>
    <div class="quote-table-wrapper">
        <!-- Start here -->
        <div id="account-db-active-quotes">
            <div id="account-active-quotes" class="col-12 col-md-9 th-dashboard-main">
                <div class="row">
                    <div class="col-md-12">
                        <h2 class="th-dashboard-header">Recent Orders</h2>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-12">
                        <div class="th-dashboard-doc-summary">
                            <div class="th-doc-info">
                                <h4 class="th-doc-title">Quote Title</h4>
                                <h1 class="th-doc-id">#907526</h1>
                                <p class="th-doc-details">
                                    Lorem ipsum dolor sit amet will nec consectetur. Quis ut
                                    consectetur sed nec cursus orci
                                </p>
                            </div>

                            <div class="th-doc-details">
                                <h4 class="flex flex-col">Account:: <span>Org</span>
                                </h4>
                                <h4 class="flex flex-col">Amount: <span>$260</span>
                                </h4>
                                <h4 class="flex flex-col">Created date: <span>June 11th, 2024</span>
                                </h4>
                            </div>
                            <div class="th-doc-actions" data-v-quote-summary-actions="">
                                <a href="contact.html" class="th-btn-gray text-capitalize"
                                    data-v-quote-summary-action="" data-bs-toggle="modal" data-bs-target="#myModal">
                                    <span class="">Accept Quote</span>
                                </a>
                                <a href="contact.html" class="th-btn-primary text-capitalize"
                                    data-v-quote-summary-action="" data-bs-toggle="modal" data-bs-target="#myModal">
                                    <span class="">Accept Quote</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
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
                            <!-- You can span multiple columns by styling or a separate approach -->
                            <div class="th-cell" style="grid-column: 1 / 8; font-weight: bold;">Items</div>
                            <div class="th-cell text-end" style="font-weight: bold;">$9,821.00</div>
                        </div>
                    </div>


                    <!-- Table Body -->
                    <div class="th-body-wrapper">

                        <template>
                            <div class="th-row-wrapper" v-for="(item, idx) in quoteItems" :key="idx">
                                <div class="th-cell" data-label="Item">
                                    <img v-if="item.photo" :src="item.photo" alt="Miro" width="56" />
                                    <span v-else class="text-gray-400 text-sm">No Image</span>
                                </div>
                                <div class="th-cell th-col-span-3" data-label="Description">
                                    <span>{{ item.item_description }}</span>
                                </div>
                                <div class="th-cell text-end" data-label="QTY">{{ item.quantity }}</div>
                                <div class="th-cell text-end" data-label="Unit Price">${{ item.unit_price.toFixed(2) }}</div>
                                <div class="th-cell text-end" data-label="Item Total">${{ item.total_price.toFixed(2) }}</div>
                                <div class="th-cell text-end align-items-end" data-label="">
                                    <img src="/layout/images/comment-icon.png" alt="Comment Icon" width="30"
                                        height="30" />
                                </div>
                            </div>

                        </template>


                        <div
                            class="th-row-wrapper"
                            v-for="item in quoteItems"
                            :key="item.quote_item_id"
                            >
                            <div class="th-cell" data-label="Item">
                                <!-- You can dynamically use item.photo if available -->
                                <img
                                :src="`/demo/images/galleria/galleria1.jpg`"
                                alt="Item Image"
                                width="56"
                                />
                            </div>
                            <div class="th-cell th-col-span-3" data-label="Description">
                                <span>{{ item.description }}</span>
                            </div>
                            <div class="th-cell text-end" data-label="QTY">
                                {{ item.quantity }}
                            </div>
                            <div class="th-cell text-end" data-label="Unit Price">
                                ${{ item.unit_price.toFixed(2) }}
                            </div>
                            <div class="th-cell text-end" data-label="Item Total">
                                ${{ item.total_price.toFixed(2) }}
                            </div>
                            <div class="th-cell text-end align-items-end" data-label="">
                                <img
                                src="/layout/images/comment-icon.png"
                                alt="Comment Icon"
                                width="30"
                                height="30"
                                />
                            </div>
                        </div>
                            





                        <!-- <div class="th-row-wrapper" v-for="item in quoteItems" :key="item.quote_item_id">

                            <div class="th-cell" data-label="Item">
                                <img v-if="item.photo" :src="`/demo/images/galleria/${item.photo}`"
                                    :alt="item.description" width="56" />
                                <span v-else class="text-gray-400 text-sm">No Image</span>
                            </div>

                            <div class="th-cell th-col-span-3" data-label="Description">
                                <span>{{ item.description }}</span>
                            </div>

                            <div class="th-cell text-end" data-label="QTY">
                                {{ item.quantity }}
                            </div>

                            <div class="th-cell text-end" data-label="Unit Price">
                                ${{ item.unit_price.toFixed(2) }}
                            </div>

                            <div class="th-cell text-end" data-label="Item Total">
                                ${{ item.total_price.toFixed(2) }}
                            </div>

                            <div class="th-cell text-end align-items-end" data-label="">
                                <img src="/layout/images/comment-icon.png" alt="Comment Icon" width="30" height="30" />
                            </div>

                        </div> -->





                        <!-- <div class="th-row-wrapper">
                            <div class="th-cell" data-label="Item">
                                <img src="/demo/images/galleria/galleria1.jpg" alt="Miro" width="56" />
                            </div>
                            <div class="th-cell th-col-span-3" data-label="Description">
                                <span>Miro Task Chair Black Fabric Seat / Black Mesh Black</span>
                            </div>
                            <div class="th-cell text-end" data-label="QTY">2</div>
                            <div class="th-cell text-end" data-label="Unit Price">$143.21</div>
                            <div class="th-cell text-end" data-label="Item Total">$286.42</div>
                            <div class="th-cell text-end align-items-end" data-label="">
                                <img src="/layout/images/comment-icon.png" alt="Comment Icon" width="30" height="30" />
                            </div>
                        </div> -->


                        <!-- <div class="th-row-wrapper">
                            <div class="th-cell" data-label="Item">
                                <img src="/demo/images/galleria/galleria2.jpg" alt="Miro" width="56" />
                            </div>
                            <div class="th-cell th-col-span-3" data-label="Description">Black Fabric Seat / Black Mesh
                                Black
                            </div>
                            <div class="th-cell text-end" data-label="QTY">2</div>
                            <div class="th-cell text-end" data-label="Unit Price">$143.21</div>
                            <div class="th-cell text-end" data-label="Item Total">$286.42</div>
                            <div class="th-cell text-end align-items-end" data-label="">
                                <img src="/layout/images/comment-icon.png" alt="Comment Icon" width="30" height="30" />
                            </div>
                        </div>

                        <div class="th-row-wrapper">
                            <div class="th-cell" data-label="Item">
                                <img src="/demo/images/galleria/galleria3.jpg" alt="Miro" width="56" />
                            </div>
                            <div class="th-cell th-col-span-3" data-label="Description">Black Fabric Seat / Black Mesh
                                Black
                            </div>
                            <div class="th-cell text-end" data-label="QTY">2</div>
                            <div class="th-cell text-end" data-label="Unit Price">$143.21</div>
                            <div class="th-cell text-end" data-label="Item Total">$286.42</div>
                            <div class="th-cell text-end align-items-end" data-label="">
                                <img src="/layout/images/comment-icon.png" alt="Comment Icon" width="30" height="30" />
                            </div>
                        </div> -->
                    </div>

                    <!-- Table Footer -->
                    <div class="th-footer-wrapper">
                        <div class=" pb-5 " style="grid-column: 1 / 6;">
                            <div class="col-md-12">
                                <Button label="Add item..." v-if="!showQuoteItemAutocomplete"
                                    class="p-button-text text-blue-600 hover:text-blue-800"
                                    @click="initiateQuoteItemAutocomplete" />

                                <AutoComplete v-if="showQuoteItemAutocomplete" :suggestions="relatedQuoteItemSuggestions"
                                    @input="onRelatedquoteItemsInput" @item-select="addRelatedQuoteItem" optionLabel="name"
                                    placeholder="Type for autocomplete" class="w-full related-quote-items-autocomplete"
                                    inputClass="w-full !rounded-md !border !border-gray-200 !shadow-none !focus:ring-0" />
                            </div>
                        </div>
                        <div class="th-row-wrapper">
                            <div class="th-cell mt-70" style="grid-column: 6 / 9; font-weight: bold;">
                                <p>
                                    <span class="font-weight-600">Sub Total:<span>$8,561.00</span></span>
                                </p>
                                <p>
                                    <span class="font-weight-600">GST:<span>$987.00</span></span>
                                </p>
                                <div class="border-bottom"></div>
                                <p>
                                    <span class="font-weight-600">Total Inc GST:<span>$9,821.00</span></span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>







                <!-- <div class="row th-mar th-members-row th-quote-member">
                    <h2 class="title th-member-title">Team Managers</h2>
                    <div class="row th-mar th-members-row th-quote-member" data-v-team-managers>
                        <div class="col-sm-6 col-lg-3">
                            <div class="th-member" data-v-team-member data-bg-src="/img/contact/member-1.png">
                                <div class="th-member-icons">
                                    <span>
                                        <i data-v-team-member-phone-icon class="fa-solid fa-phone"></i>
                                    </span>
                                    <span>
                                        <i data-v-team-member-email-icon class="fa-solid fa-envelope"></i>
                                    </span>
                                </div>
                                <div class="th-member-info-container gr-bg6">
                                    <div class="th-member-info">
                                        <p data-v-team-member-name class="th-member-name">Devon Lane</p>
                                        <p data-v-team-member-position class="th-member-position">Software Developer</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6 col-lg-3">
                            <div class="th-member" data-bg-src="/img/contact/member-avatar.png">
                                <div class="th-member-icons">
                                    <span>
                                        <i class="fa-solid fa-phone"></i>
                                    </span>
                                    <span>
                                        <i class="fa-solid fa-envelope"></i>
                                    </span>
                                </div>
                                <div class="th-member-info-container gr-bg6">
                                    <div class="th-member-info">
                                        <p class="th-member-name">Devon Lane</p>
                                        <p class="th-member-position">Software Developer</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row d-flex justify-content-center my-60">
                    <div class="col-md-10 border-bottom"></div>
                </div>

                <div class="row th-mar th-quotes-carg-gap">
                    <div class="col-12 col-sm-12 col-md-5 text-center text-md-start bg-black">
                        <div class="recent-order-img th-quotes-card">
                            <div class="quote-info">
                                <div class="quote-content text-center text-white">
                                    <h4>Quote Title</h4>
                                    <p class="qute-number font-weight-500">#907526</p>
                                    <p class="quote-para font-weight-400">
                                        Lorem ipsum dolor sit amet will nec consectetur. Quis ut
                                        consectetur sed nec cursus orci
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-12 col-sm-12 col-md-7">
                        <div class="card-body th-ordercard-info th-quote-oredr-info">
                            <div class="th-reccard-heading">
                                <h5 class="fw-bold">Order Number</h5>
                                <h2 class="th-order-number fw-light">#907526</h2>
                            </div>
                            <div class="th-rs-card-text">
                                <h4 class="th-code-gap th-rs-text">
                                    Account: <span>org</span>
                                </h4>
                                <h4 class="th-color-gap th-rs-text">
                                    Amount: <span>$260</span>
                                </h4>
                                <h4 class="th-rs-text">
                                    created date: <span>June 11th, 2024</span>
                                </h4>
                            </div>
                            <div class="th-qoute-comment-btn">
                                <a href="contact.html" class="th-btn text-capitalize bg-transparent border">
                                    <span class="me-2">Add Comment</span>
                                    <i class="fa-solid fa-comment"></i>
                                </a>
                            </div>

                            <div class="th-card-btn th-qout-dubblebtn d-flex flex-wrap gap-2 mt-2">
                                <a href="contact.html" class="th-btn text-capitalize">
                                    <span class="me-2">View quote</span>
                                    <i class="fa-solid fa-arrow-up degree-60"></i>
                                </a>
                                <a href="contact.html" class="th-btn text-capitalize bg-black text-white">
                                    <span>Accept Quote</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div> -->
            </div>
        </div>
        <!-- End here -->
    </div>
</template>
