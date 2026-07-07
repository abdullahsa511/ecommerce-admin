<script setup lang="ts">
import { ref, onMounted, reactive, nextTick, watch } from 'vue';
import ProductSidebar from './ProductSidebar.vue';
import Product, { ICategory, IProduct } from '@/models/Product.ts';
import { useProductStore } from '@/stores/product';
import { useListStore } from '@/stores/list';
import { storeToRefs } from 'pinia';
import { debounce } from 'lodash';
import { useToast } from 'primevue/usetoast';

const productStore = useProductStore();
const { categories, fb } = storeToRefs(productStore);
const listStore = useListStore();
const { manufacturers, vendors, productTags } = storeToRefs(listStore);
const toast = useToast();

const emit = defineEmits(['update:product', 'saved']);

const props = defineProps({
  product: {
    type: Product,
    required: true,
    default: () => new Product({})
  }
});


type ProductItem = { product_id: number | string, name: string };

type DigitalAssetItem = { digital_asset_id: number | string, name: string };

const relatedProductSuggestions = ref<any[]>([]);
const digitalAssetSuggestions = ref<DigitalAssetItem[]>([]);
const selectedCategoriesKeys = ref<Record<string, { checked: boolean; partialChecked: boolean }>>({});

// Resize handler for categories tree
const categoriesTreeHeight = ref(300); // Initial height in pixels
const isResizing = ref(false);
const resizeStartY = ref(0);
const resizeStartHeight = ref(0);

const startResize = (e: MouseEvent) => {
  isResizing.value = true;
  resizeStartY.value = e.clientY;
  resizeStartHeight.value = categoriesTreeHeight.value;
  document.addEventListener('mousemove', handleResize);
  document.addEventListener('mouseup', stopResize);
  e.preventDefault();
};

const handleResize = (e: MouseEvent) => {
  if (!isResizing.value) return;
  const deltaY = e.clientY - resizeStartY.value;
  const newHeight = Math.max(200, resizeStartHeight.value + deltaY); // Minimum height 200px
  categoriesTreeHeight.value = newHeight;
};

const stopResize = () => {
  isResizing.value = false;
  document.removeEventListener('mousemove', handleResize);
  document.removeEventListener('mouseup', stopResize);
};


const tagSuggestions = ref<string[]>([]);

const showProductAutocomplete = ref(false);
const showDigitalAssetAutocomplete = ref(false);

function initiateProductAutocomplete() {
  showProductAutocomplete.value = true;
  nextTick(() => {
    const input = document.querySelector('.related-products-autocomplete > .p-autocomplete-input');
    if (input instanceof HTMLElement) {
      input.focus();
    }
  });
}

function initiateDigitalAssetAutocomplete() {
  showDigitalAssetAutocomplete.value = true;
  nextTick(() => {
    const input = document.querySelector('.digital-assets-autocomplete > .p-autocomplete-input');
    if (input instanceof HTMLElement) {
      input.focus();
    }
  });
}

function searchTags(event: { query: string }) {
  const query = event.query.toLowerCase();
  tagSuggestions.value = productTags.value.filter(tag =>
    tag.name.toLowerCase().includes(query) && !props.product.tags.includes(tag.name)
  );
}

// Helper function to get category from node (handles PrimeVue Tree node structure)
const getCategoryFromNode = (node: any): any => {
  if (!node) return null;
  const categoryId = node.id || node.data?.id;
  const categoryKey = node.key;
  return categoryId ? findCategoryById(categories.value, categoryId) 
    : categoryKey ? findCategoryByKey(categories.value, categoryKey) : null;
};

// Helper function to find category by key
const findCategoryByKey = (categories: any[], key: string): any => {
  for (const cat of categories) {
    if (cat.key === key) return cat;
    if (cat.children) {
      const found = findCategoryByKey(cat.children, key);
      if (found) return found;
    }
  }
  return null;
};

// Global cache for descendants to improve performance
const descendantsCache = new Map<number, any[]>();

// Helper function to get all descendant categories recursively (with caching)
const getAllDescendants = (category: any): any[] => {
  if (!category.children?.length) return [];
  
  // Check cache first
  if (descendantsCache.has(category.id)) {
    return descendantsCache.get(category.id)!;
  }
  
  // Calculate and cache
  const descendants = category.children.flatMap((child: any) => [child, ...getAllDescendants(child)]);
  descendantsCache.set(category.id, descendants);
  return descendants;
};

// Clear cache when categories tree changes
watch(categories, () => {
  descendantsCache.clear();
}, { deep: true });

// Helper function to add category to product.categories if not already present
const addCategoryIfNotExists = (category: any) => {
  if (!props.product.categories.some((cat: ICategory) => cat.id === category.id)) {
    props.product.categories.push({ id: category.id, key: category.key, label: category.label, children: [] });
  }
};

// Helper function to expand category and its parents
const expandCategoryPath = (category: any) => {
  getParentKeys(category, categories.value).forEach(key => expandedKeys.value[key] = true);
  if (category.children?.length) expandedKeys.value[category.key] = true;
};

const addToCategories = (event: any) => {
  const category = getCategoryFromNode(event.node || event);
  if (!category) return;

  if (category.children?.length) {
    // Rule 1: Select parent and all descendants, expand them
    const allDescendants = getAllDescendants(category); // Calculate once, reuse
    addCategoryIfNotExists(category);
    allDescendants.forEach(addCategoryIfNotExists);
    expandedKeys.value[category.key] = true;
    allDescendants.forEach((d: any) => {
      if (d.children?.length) expandedKeys.value[d.key] = true;
    });
  } else {
    // Leaf node: add it and expand parents
    addCategoryIfNotExists(category);
    expandCategoryPath(category);
  }
};

const removeFromCategories = (event: any) => {
  const category = getCategoryFromNode(event.node || event);
  if (!category) return;

  // Remove category and all its descendants if it's a parent
  const idsToRemove = new Set([category.id]);
  if (category.children?.length) {
    const allDescendants = getAllDescendants(category); // Calculate once, reuse
    allDescendants.forEach((d: any) => idsToRemove.add(d.id));
  }
  props.product.categories = props.product.categories.filter((cat: ICategory) => !idsToRemove.has(cat.id));
}

// Helper function to find parent category in tree structure
const findParentCategory = (targetCategory: any, allCategories: any[], parent: any = null): any => {
  for (const category of allCategories) {
    if (category.id === targetCategory.id) return parent;
    if (category.children?.length) {
      const found = findParentCategory(targetCategory, category.children, category);
      if (found) return found;
    }
  }
  return null;
};

// Helper function to get all parent keys for a category
const getParentKeys = (category: any, allCategories: any[]): string[] => {
  const keys: string[] = [];
  let parent = category.parent_id 
    ? findCategoryById(allCategories, category.parent_id)
    : findParentCategory(category, allCategories);
  
  while (parent) {
    keys.unshift(parent.key);
    parent = parent.parent_id 
      ? findCategoryById(allCategories, parent.parent_id)
      : findParentCategory(parent, allCategories);
  }
  return keys;
};

// Calculate expanded keys based on selected categories
const calculateExpandedKeys = (selectedCategories: any[], allCategories: any[]): Record<string, boolean> => {
  const expanded: Record<string, boolean> = {};
  selectedCategories.forEach(selectedCategory => {
    const category = findCategoryById(allCategories, selectedCategory.id);
    if (category) {
      getParentKeys(category, allCategories).forEach(key => expanded[key] = true);
      if (category.children?.length) expanded[category.key] = true;
    }
  });
  return expanded;
};

const expandedKeys = ref<Record<string, boolean>>({});

// Helper function to find category by ID in the tree
const findCategoryById = (categories: any[], id: number): any => {
  for (const category of categories) {
    if (category.id === id) return category;
    if (category.children) {
      const found = findCategoryById(category.children, id);
      if (found) return found;
    }
  }
  return null;
};

const generateSelectionState = (selectedCategories: any[], allCategories: any[]) => {
  const selectionState: Record<string, { checked: boolean; partialChecked: boolean }> = {};
  const selectedIds = new Set(selectedCategories.map(cat => cat.id));

  // Check if any children/grandchildren are selected
  const hasSelectedChildren = (category: any): boolean => {
    return category.children?.some((child: any) => 
      selectedIds.has(child.id) || (child.children?.length && hasSelectedChildren(child))
    ) ?? false;
  };

  // Mark directly selected categories
  selectedCategories.forEach(selectedCategory => {
    const category = findCategoryById(allCategories, selectedCategory.id);
    if (category) {
      selectionState[category.key] = { checked: true, partialChecked: false };
    }
  });

  // Update parent states: fully checked if directly selected, partially if children selected
  const updateParents = (categories: any[]) => {
    categories.forEach(category => {
      if (category.children?.length) {
        const isDirectlySelected = selectedIds.has(category.id);
        if (isDirectlySelected) {
          selectionState[category.key] = { checked: true, partialChecked: false };
        } else if (hasSelectedChildren(category)) {
          selectionState[category.key] = { checked: false, partialChecked: true };
        }
      }
      if (category.children?.length) updateParents(category.children);
    });
  };

  updateParents(allCategories);
  return selectionState;
};

const updateSelectionAndExpansion = () => {
  if (!categories.value?.length) return;
  selectedCategoriesKeys.value = generateSelectionState(props.product.categories, categories.value);
  expandedKeys.value = calculateExpandedKeys(props.product.categories, categories.value);
};

const populateSelectedCategories = () => {
  setTimeout(() => updateSelectionAndExpansion(), 400);
};

// Watch for changes and update selection state and expanded keys
watch(() => props.product.categories, updateSelectionAndExpansion, { deep: true });
watch(categories, () => {
  if (categories.value?.length && props.product.categories.length) updateSelectionAndExpansion();
}, { deep: true });

onMounted(async () => {
  await listStore.fetchManufacturers();
  await listStore.fetchVendors();
  await listStore.fetchProductTags();
  await productStore.getCategories();
  await productStore.productList();

  console.log("mounted props product: ", props.product.relatedProducts);

  setTimeout(() => {
    populateSelectedCategories();
    console.log("props manf data: ", props.product.manufacturer_id);
  }, 400);
});



const searchRelatedProducts = (event: { query: string }) => {
  const {query} = event;
  if (query?.length > 0) {
    productStore.searchProducts(query).then(results => {
      console.log("results", results);
      relatedProductSuggestions.value = results;
    });
  } else {
    relatedProductSuggestions.value = [];
  }
}
const searchDigitalAssets = (e: any) => {
  const query = e.data?.toLowerCase();
  if (query?.length > 0) {
    productStore.searchDigitalAssets(query).then(results => {
      console.log("results", results);
      digitalAssetSuggestions.value = results;
    });
  } else {
    digitalAssetSuggestions.value = [];
  }
}


function addRelatedProduct(event: { value: IProduct }) {
  if (!props.product.relatedProducts.some(p => p.product_id === event.value.product_id)) {
    props.product.relatedProducts.push(event.value);
  }
  // Reset the autocomplete
  showProductAutocomplete.value = false;
  nextTick(() => {
    showProductAutocomplete.value = true;
    nextTick(() => {
      const input = document.querySelector('.related-products-autocomplete > .p-autocomplete-input');
      if (input instanceof HTMLElement) {
        input.focus();
      }
    });
  });
}
function removeRelatedProduct(idx: number) {
  // product id
  const productId = props.product.product_id;
  // related product id
  const relatedProductId = props.product.relatedProducts[idx].product_id;
  // must be use confirm dialog before delete
  const confirmed = window.confirm('Are you sure you want to delete this related product?');
  if (confirmed) {
    productStore.deleteRelatedProduct(productId as number, relatedProductId as number).then(response => {
      console.log("response", response);
      toast.add({ severity: 'success', summary: 'Success', detail: 'Related product deleted successfully', life: 3000 }); 
      props.product.relatedProducts.splice(idx, 1);
    }).catch(error => {
      console.log("error", error);
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete related product', life: 3000 });
    });
  } else {
    toast.add({ severity: 'info', summary: 'Info', detail: 'Deletion cancelled', life: 3000 });
  }
}

function addDigitalAsset(event: { value: DigitalAssetItem }) {
  console.log("event", event.value);
  if (!props.product.digitalAssets.some(p => p.digital_asset_id === event.value.digital_asset_id)) {
    props.product.digitalAssets.push(event.value);
  }
  showDigitalAssetAutocomplete.value = false;
  nextTick(() => {
    showDigitalAssetAutocomplete.value = true;
    nextTick(() => {
      const input = document.querySelector('.digital-assets-autocomplete > .p-autocomplete-input');
      if (input instanceof HTMLElement) {
        input.focus();
      }
    });
  });
}
function removeDigitalAsset(idx: number) {
  props.product.digitalAssets.splice(idx, 1);
}

const onRelatedProductsInput = debounce(searchRelatedProducts, 300);
const onDigitalAssetsInput = debounce(searchDigitalAssets, 300);

</script>

<template>
  <!-- Local Tab -->
  <div class="flex flex-col gap-6">
    <div class="loading-overlay" v-if="fb.loading['product.show' + product.product_id]">
        <div class="flex justify-center items-center h-full spinner">
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
        <p class="mt-2">Loading related products data. Please wait.</p>
      </div>
    </div>
    <div class="flex gap-6" v-if="!fb.loading['product.show' + product.product_id]">
      <!-- Left column -->
      <div class="w-3/4 space-y-6">
        <div class="space-y-4">
          <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Vendor Details</h3>

          <div class="grid grid-cols-12 gap-x-6 gap-y-4">
            <!-- Manufacturer -->
            <label class="col-span-12 flex items-center text-lg">Manufacturer</label>
            <div class="col-span-12">
              <Select v-model="product.manufacturer_id" :options="manufacturers" filter
                :optionLabel="(item) => `[${item.manufacturer_code}] ${item.name}`" optionValue="manufacturer_id"
                placeholder="Select a manufacturer" class="w-full text-lg" />
            </div>
            <!-- Vendor -->
            <label class="col-span-12 flex items-center text-lg">Vendor</label>
            <div class="col-span-12">
              <Select v-model="product.vendor_id" optionValue="vendor_id" :options="vendors" filter
                :optionLabel="(item) => `${item.vendor_code?'[]'+item.vendor_code+']':''} ${item.name}`" placeholder="Select a vendor"
                class="w-full text-lg" />
            </div>
          </div>
        </div>
        <!-- Categories -->
        <div class="space-y-2">
          <h3 class="text-lg font-medium">Categories</h3>
          <div class="categories-tree-wrapper" 
               :style="{ height: categoriesTreeHeight + 'px' }">
            <div id="categories-tree" class="overflow-y-auto p-2 h-full" 
                 :style="{ border: '1px solid #e5e7eb', borderRadius: '0.5rem' }">
              <Tree 
              v-model:selectionKeys="selectedCategoriesKeys" 
              v-model:expandedKeys="expandedKeys"
              :value="categories" 
              selectionMode="checkbox"
                @node-select="addToCategories" @node-unselect="removeFromCategories"
                class="w-full" style="border: none" />
            </div>
            <!-- Resize handle - positioned relative to wrapper, not scrollable content -->
            <div class="resize-handle" 
                 @mousedown="startResize"
                 :class="{ 'resizing': isResizing }">
              <div class="resize-handle-icon"></div>
            </div>
          </div>
        </div>

        <!-- Tags -->
        <div class="space-y-8">
          <div class="space-y-2 w-full">
            <h3 class="font-medium text-lg">Tags</h3>
            <AutoComplete ref="tagAutocomplete" v-model="product.tags" :suggestions="tagSuggestions" optionLabel="name"
              @complete="searchTags" multiple placeholder="Type to search or add tags" class="w-full text-lg"
              inputClass="w-full !rounded-md !border !border-gray-200 !shadow-none !focus:ring-0" />
          </div>

          <!-- start related products new design -->
          <div id="related-product" class="space-y-3">
            <!-- Header -->
            <div class="flex items-center justify-between w-full">
              <h3 class="font-medium text-lg text-gray-800">Related Products</h3>
              <Button label="Add" icon="pi pi-plus" class="p-button-text text-blue-600 hover:text-blue-800"
                @click="initiateProductAutocomplete" />
            </div>

            <!-- Autocomplete -->
            <AutoComplete v-if="showProductAutocomplete" ref="productAutocomplete"
              :suggestions="relatedProductSuggestions" @complete="searchRelatedProducts" @item-select="addRelatedProduct"
              optionLabel="name" placeholder="Type for autocomplete" class="w-full related-products-autocomplete"
              inputClass="w-full !rounded-md !border !border-gray-200 !shadow-none !focus:ring-0" />

            <!-- Related Product Cards -->
            <div class="bg-white border border-gray-200 rounded p-3" style="min-height: 48px;">
              <!-- Grid of Cards -->
              <div v-if="product.relatedProducts && product.relatedProducts.length"
                class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div v-for="(productItem, idx) in product.relatedProducts" :key="idx"
                  class="relative border border-gray-100 shadow-sm hover:shadow-md transition bg-white overflow-hidden">
                  <!-- Remove Button -->
                  <button @click="removeRelatedProduct(idx)"
                    class="absolute top-0 right-0 bg-gray-500 text-white hover:bg-black  w-6 h-6 flex items-center justify-center shadow-sm"
                    aria-label="Remove" type="button">
                    ×
                  </button>

                  <!-- Product Image -->
                  <div
                    class="w-full h-32 bg-gray-100 flex items-center justify-center overflow-hidden mt-3 mb-2 border-b border-gray-200">
                    <img v-if="productItem.image" :src="productItem.image" alt="Product Image"
                      class="object-cover w-full h-full" />
                    <span v-else class="text-gray-400 text-sm">No Image</span>
                  </div>

                  <!-- Product Info -->
                  <div class="p-3 text-left mb-3">
                    <p class="truncate text-lg">{{ productItem.name }}</p>
                    <p class="text-blue-900 font-medium truncate mt-2">
                      {{ productItem.description }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Empty State -->
              <div v-else class="text-gray-400 text-sm text-center py-4 border border-dashed border-gray-200 rounded">
                No related products selected.
              </div>
            </div>
          </div>
          <!-- end related products new design -->

          <!-- Digital Assets -->
          <div class="mt-6">
            <div class="flex items-center justify-between w-full">
              <h3 class="font-medium text-lg">Digital assets</h3>
              <Button label="Add" icon="pi pi-plus" class="p-button-text" @click="initiateDigitalAssetAutocomplete" />
            </div>
            <AutoComplete ref="digitalAssetAutocomplete" :suggestions="digitalAssetSuggestions"
              @input="onDigitalAssetsInput" @item-select="addDigitalAsset" optionLabel="name"
              placeholder="Type for autocomplete" class="w-full mb-2"
              inputClass="w-full !rounded-md !border !border-gray-200 !shadow-none !focus:ring-0"
              v-if="showDigitalAssetAutocomplete" />
            <div class="bg-white border border-gray-200 rounded max-h-48 overflow-y-auto p-2 flex flex-col gap-2"
              style="min-height: 48px;">
              <div v-for="(asset, idx) in product.digitalAssets" :key="asset.digital_asset_id"
                class="flex items-center justify-between px-3 py-2 rounded hover:bg-blue-50 border border-gray-100 shadow-sm transition">
                <span class="text-base text-blue-900 font-medium truncate">{{ asset.name }}</span>
                <button @click="removeDigitalAsset(idx)"
                  class="text-gray-400 hover:text-red-500 text-xl font-bold px-2 transition" aria-label="Remove"
                  type="button">×</button>
              </div>
              <div v-if="!product.digitalAssets.length" class="text-gray-400 text-sm text-center py-2">
                No digital assets selected.
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Right column -->
      <ProductSidebar :product="product" />
    </div>
  </div>
</template>

<style scoped>
label {
  font-size: 1.2rem;
}

:deep(.p-tree) {
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 1rem;
}

/* :deep(.p-tree-node-toggle-button) {
  display: none !important;
} */


/* Custom scrollbar styling */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #CBD5E0 #EDF2F7;
}

:deep(.p-autocomplete-input) {
  width: 100% !important;
  border-radius: 0 !important;
  border: none !important;
  border-bottom: 1px solid #e5e7eb !important;
  box-shadow: none !important;
}

/* Resize handle for categories tree */
.categories-tree-wrapper {
  position: relative;
}

#categories-tree {
  position: relative;
}

.resize-handle {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 20px;
  height: 20px;
  cursor: ns-resize;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 0 0 0.5rem 0;
  transition: background-color 0.2s;
  pointer-events: auto;
}

.resize-handle:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.resize-handle.resizing {
  background-color: rgba(59, 130, 246, 0.1);
}

.resize-handle-icon {
  width: 12px;
  height: 12px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4h8M2 6h8M2 8h8' stroke='%23666' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.6;
}

.resize-handle:hover .resize-handle-icon {
  opacity: 1;
}
</style>

