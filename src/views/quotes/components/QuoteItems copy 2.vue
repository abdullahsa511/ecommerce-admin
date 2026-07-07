<script setup lang="ts">
import { defineEmits, onMounted, ref, computed } from 'vue';
import { debounce } from 'lodash';
import { storeToRefs } from 'pinia';
import { useQuoteItemStore } from '@/stores/quoteItem';




const quoteItemStore = useQuoteItemStore();
const { quoteitems, fb } = storeToRefs(quoteItemStore);

const emit = defineEmits(['update:quote']);
const editingRows = ref([]);
const search = ref('');
const productSuggestions = ref<VariantItem[]>([]);
const searchProducts = (e: any) => {
    const query = e.target.value?.toLowerCase();
    if (query?.length > 0) {
        quoteStore.getProductList(query).then(results => {
            console.log("results", results);
            productSuggestions.value = results;
        });
    } else {
        productSuggestions.value = [];
    }
}
const onProductInput = debounce(searchProducts, 300);
const showDropdown = ref(false);
function handleBlur() {
    setTimeout(() => showDropdown.value = false, 200);
}





type VariantItem = {
    product_id: number;
    name: string;
    description: string;
    price: number;
    image?: string;
};







function selectItem(item: VariantItem) {
    if (!(props.quote?.items || []).find(i => i.item_name === item.name)) {
        const newQuote = { ...props.quote };
        const newQuoteItem = {
            quote_id: props.quote.quote_id,
            product_id: item.product_id,
            item_name: item.name,
            item_description: item.description || '',
            item_quantity: 1,
            item_unit_price: item.price || 0,
            item_total: item.price || 0
        };
        if (!newQuote.items) {
            newQuote.items = [];
        }
        newQuote.items.push(newQuoteItem);
        emit('update:quote', newQuote);
    }
    search.value = '';
    showDropdown.value = false;
}



const updateQuoteItem = (e: any) => {
    const newQuote = { ...props.quote };
    if (!newQuote.items) {
        newQuote.items = [];
    }
    const itemIndex = newQuote.items.findIndex(i => i === e.data);
    if (itemIndex !== -1) {
        const updatedItem = { ...e.data };
        updatedItem.item_total = (updatedItem.item_quantity || 0) * (updatedItem.item_unit_price || 0);
        newQuote.items[itemIndex] = updatedItem;
        emit('update:quote', newQuote);
    }
}

function removeItem(index: number) {
    const newQuote = { ...props.quote };
    if (newQuote.items) {
        newQuote.items.splice(index, 1);
        emit('update:quote', newQuote);
    }
}

// const sectionTotal = computed(() =>
//     (props.quote?.items || []).reduce((sum, item) => sum + ((item.item_quantity || 0) * (item.item_unit_price || 0)), 0)
// );

function updateQuantity(item: any, newQty: number) {
    if (newQty > 0) {
        const newQuote = { ...props.quote };
        if (!newQuote.items) {
            newQuote.items = [];
        }
        const itemIndex = newQuote.items.findIndex(i => i === item);
        if (itemIndex !== -1) {
            const updatedItem = { ...item };
            updatedItem.item_quantity = newQty;
            updatedItem.item_total = newQty * (updatedItem.item_unit_price || 0);
            newQuote.items[itemIndex] = updatedItem;
            emit('update:quote', newQuote);
        }
    }
}

onMounted(() => {
    quoteStore.getProductList('a');
});

</script>

<template>
    <div class="quote-table-wrapper">
        <!-- Custom Search and Dropdown -->
        <div style="position: relative; width: 300px; margin-bottom: 16px;">
            <input v-model="search" :suggestions="productSuggestions" @input="onProductInput"
                @focus="showDropdown = true" @blur="handleBlur" placeholder="Type to search items"
                class="custom-search-input" style="width: 100%; padding: 8px;" />
            <ul v-if="showDropdown && productSuggestions.length" class="custom-dropdown"
                style="position: absolute; z-index: 10; width: 100%; background: #fff; border: 1px solid #ddd; max-height: 200px; overflow-y: auto; margin: 0; padding: 0; list-style: none;">
                <li v-for="item in productSuggestions" :key="item.product_id" @mousedown.prevent="selectItem(item)"
                    style="display: flex; align-items: center; padding: 8px; cursor: pointer;">
                    <img :src="item.image || 'https://cdn-icons-png.flaticon.com/512/1048/1048953.png'" alt=""
                        style="width: 32px; height: 32px; margin-right: 8px;" />
                    <span>{{ item.name }}</span>
                </li>
            </ul>
        </div>

        <DataTable :value="quote?.items || []" dataKey="item_name" v-model:editingRows="editingRows" editMode="row"
            @row-edit-save="updateQuoteItem" class="quote-table">
            <Column field="item_name" header="Item">
                <template #body="slotProps">
                    <td class="item-img"><img src="https://cdn-icons-png.flaticon.com/512/1048/1048953.png"
                            alt="Item" /></td>
                </template>
            </Column>
            <Column field="item_description" header="Description">
                <template #body="slotProps">
                    <td class="item-desc">{{ slotProps.data.item_description }}</td>
                </template>
            </Column>
            <Column field="item_quantity" header="QTY">
                <template #body="slotProps">
                    <td class="item-qty">
                        <InputNumber v-model="slotProps.data.item_quantity" :min="1"
                            @update:modelValue="(val) => updateQuantity(slotProps.data, val)" class="qty-input" />
                    </td>
                </template>
            </Column>
            <Column field="item_price" header="Unit Price">
                <template #body="slotProps">
                    <td class="item-unit">${{ (slotProps.data.item_unit_price * 1 || 0).toFixed(2) }}</td>
                </template>
            </Column>
            <Column header="Item Total">
                <template #body="slotProps">
                    <td class="item-total">${{ ((slotProps.data.item_quantity * 1 || 0) *
                        (slotProps.data.item_unit_price * 1 ||
                            0)).toFixed(2) }}</td>
                </template>
            </Column>
            <Column header="Actions">
                <template #body="slotProps">
                    <td class="item-action">
                        <button class="icon-btn" title="Remove" @click="removeItem(slotProps.index)">
                            <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M8 12h8" />
                            </svg>
                        </button>
                    </td>
                </template>
            </Column>
        </DataTable>

        <!-- Section Total -->
        <div class="section-row">
            <!-- <div class="section-label">Items</div> -->
            <!-- <div class="section-total">${{ sectionTotal.toFixed(2) }}</div> -->
        </div>

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
                                <h4 class="">Account:: <span>Org</span>
                                </h4>
                                <h4 class="">Amount: <span>$260</span>
                                </h4>
                                <h4 class="">Created date: <span>June 11th, 2024</span>
                                </h4>
                            </div>
                            <div class="th-doc-actions flex justify-between w-100">
                                <Button class="th-btn-gray text-capitalize" label="Accept Quote" outlined />
                                <Button class="th-btn-primary text-capitalize" label="Accept Quote" />
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
                        <div class="th-row-wrapper">
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
                                <img src="/demo/images/logo/primevue.svg" alt="Comment Icon" width="30" height="30" />
                            </div>
                        </div>
                        <div class="th-row-wrapper">
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
                                <img src="/demo/images/logo/primevue.svg" alt="Comment Icon" width="30" height="30" />
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
                                <img src="/demo/images/logo/primevue.svg" alt="Comment Icon" width="30" height="30" />
                            </div>
                        </div>
                    </div>

                    <!-- Table Footer -->
                    <div class="th-footer-wrapper">
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

                
                <div class="row th-mar th-members-row th-quote-member">
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
                            <!-- Button -->
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
                </div>
            </div>
        </div>
        <!-- End here -->
    </div>
</template>

<!-- <style scoped>
.quote-table-wrapper {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    padding: 8px;
    margin: 0 auto;
}

.quote-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    font-family: inherit;
    background: #fff;
}

.quote-table th,
.quote-table td {
    padding: 16px 12px;
    text-align: left;
    font-size: 1rem;
}

.quote-table th {
    background: #fafafa;
    font-weight: 700;
    border-bottom: 2px solid #eee;
}

.quote-table td {
    border-bottom: 1px solid #f3f3f3;
    vertical-align: middle;
}

.section-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fafafa;
    font-weight: 600;
    font-size: 1.08rem;
    border-bottom: 1px solid #eee;
    padding: 18px 12px;
    margin-top: 8px;
    border-radius: 4px;
}

.section-label {
    text-align: left;
}

.section-total {
    text-align: right;
    font-weight: 700;
    font-size: 1.15rem;
}

.item-row td {
    background: #fff;
    border-bottom: 6px solid #fafafa;
}

.item-img img {
    width: 56px;
    height: 56px;
    object-fit: contain;
    display: block;
    margin: 0 auto;
}

.item-desc {
    font-size: 1rem;
    color: #222;
}

.item-qty,
.item-unit,
.item-total {
    text-align: right;
    font-variant-numeric: tabular-nums;
}

.item-action {
    text-align: center;
}

.icon-btn {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: border 0.2s;
}

.icon-btn:hover {
    border: 1.5px solid #888;
    background: #f5f5f5;
}

.qty-input {
    width: 100px !important;
    min-width: 40px;
    max-width: 100px;
    padding: 0 4px;
    text-align: right;
}

@media (max-width: 900px) {

    .quote-table th,
    .quote-table td {
        padding: 10px 6px;
        font-size: 0.95rem;
    }

    .item-img img {
        width: 40px;
        height: 40px;
    }

    .qty-input {
        width: 80px !important;
        min-width: 40px;
        max-width: 80px;
        padding: 0 4px;
        text-align: right;
    }
}

@media (max-width: 600px) {

    .quote-table th,
    .quote-table td {
        padding: 8px 2px;
        font-size: 0.92rem;
    }

    .item-desc {
        font-size: 0.95rem;
    }
}

:deep(.p-datatable) {
    .p-datatable-header {
        display: none;
    }

    .p-datatable-thead>tr>th {
        padding: 0;
        border: none;
    }

    .p-datatable-tbody>tr>td {
        padding: 0;
        border: none;
    }
}
</style> -->