<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useCouponStore } from '@/stores/coupon';


const emit = defineEmits(['update:coupon', 'saved', 'editTabUnmunted', 'editTabMounted']);

const route = useRoute();
const couponStore = useCouponStore();
const { coupon } = storeToRefs(couponStore);

onMounted(async () => {
  emit('editTabMounted');
  if (route.params.id) {
    await couponStore.fetchCouponById(route.params.id as string);//string data type
  }
});

onUnmounted(() => {
  emit('editTabUnmunted');
});
</script>

<template>
  <div class="quote-table-wrapper">
    <!-- Mode Indicator -->
    <div style="margin-bottom: 8px; font-size: 0.9rem; color: #666;">
      Mode: {{ isEditMode ? 'Edit' : 'Create' }}
      <span v-if="isEditMode">({{ tableItems.length }} products loaded)</span>
    </div>

    <!-- Custom Search and Dropdown -->
    <div style="position: relative; width: 300px; margin-bottom: 16px;">
      <input v-model="search" :suggestions="productSuggestions" @input="onProductInput" @focus="showDropdown = true"
        @blur="handleBlur" placeholder="Type to search items" class="custom-search-input"
        style="width: 100%; padding: 8px;" />
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

    <DataTable :value="tableItems" dataKey="item_name" v-model:editingRows="editingRows" editMode="row"
      @row-edit-save="updateCouponItem" class="quote-table">
      <Column field="item_name" header="Item">
        <template #body="slotProps">
          <td class="item-img"><img src="https://cdn-icons-png.flaticon.com/512/1048/1048953.png" alt="Item" /></td>
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
          <td class="item-total">${{ ((slotProps.data.item_quantity * 1 || 0) * (slotProps.data.item_unit_price * 1 ||
            0)).toFixed(2) }}</td>
        </template>
      </Column>
      <Column header="Actions">
        <template #body="slotProps">
          <td class="item-action">
            <button class="icon-btn" title="Remove" @click="removeItem(slotProps.index)">
              <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12h8" />
              </svg>
            </button>
          </td>
        </template>
      </Column>
    </DataTable>

    <!-- Section Total -->
    <!-- <div class="section-row">
        <div class="section-label">Items</div>
        <div class="section-total">${{ sectionTotal.toFixed(2) }}</div>
      </div> -->
  </div>
</template>

<style scoped>
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
</style>
