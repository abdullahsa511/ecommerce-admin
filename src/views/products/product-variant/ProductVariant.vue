<script setup lang="ts">
import { ref, watch, computed, shallowRef } from 'vue'
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import { useProductStore } from '@/stores/product';

const router = useRouter();
const productStore = useProductStore();
const { fb } = storeToRefs(productStore);

type VariantTabItem = { route: string; label: string; icon: string };

const BASE_TABS: VariantTabItem[] = [
  { route: `/ecommerce/products-variants/list`, label: 'Variants', icon: 'pi pi-home' },
  { route: `/ecommerce/products-variants/add`, label: 'Add', icon: 'pi pi-link' },
  { route: `/ecommerce/products-variants/import`, label: 'Import', icon: 'pi pi-link' },
  { route: `/ecommerce/products-variants/export`, label: 'Download CSV', icon: 'pi pi-file-excel' },
];

const items = ref<VariantTabItem[]>([...BASE_TABS]);

/** Child add/edit page exposes submitFromParent() for the header Save button */
const variantPageRef = shallowRef<{ submitFromParent?: () => Promise<void> } | null>(null);

const currentRoute = computed(() => router.currentRoute.value.path);

const editVariantId = computed(() => {
  const id = router.currentRoute.value.params.id;
  return (Array.isArray(id) ? id[0] : id) ?? '';
});

const showSaveButton = computed(() => {
  const path = currentRoute.value || '';
  return path.includes('/add') || path.includes('/edit');
});

const saveLabel = computed(() =>
  currentRoute.value.includes('/edit') ? 'Save and Update' : 'Save'
);

const isSaving = computed(() => {
  if (currentRoute.value.includes('/edit') && editVariantId.value) {
    return !!fb.value.loading['product.variant.update.' + editVariantId.value];
  }
  return !!fb.value.loading['product.variant.create'];
});

const refreshTabs = () => {
  const id = editVariantId.value;
  items.value = [
    ...BASE_TABS,
    ...(id
      ? [{ route: `/ecommerce/products-variants/edit/${id}`, label: 'Edit', icon: 'pi pi-list' }]
      : []),
  ];
};

watch(() => router.currentRoute.value.fullPath, () => refreshTabs(), { immediate: true });

const handleSave = async () => {
  await variantPageRef.value?.submitFromParent?.();
};

const renderSaveIcon = () => {
  return isSaving.value ? 'pi pi-spinner pi-spin' : 'pi pi-save';
};
</script>

<template>
  <div class="attriutes card relative">
    <Button
      v-if="showSaveButton"
      :label="isSaving ? 'Saving...' : saveLabel"
      :icon="renderSaveIcon()"
      :disabled="isSaving"
      class="p-button-md"
      @click="handleSave"
    />
    <Tabs :value="currentRoute" scrollable>
      <TabList>
        <template v-for="tab in items" :key="tab.route">
          <router-link v-if="tab.route" v-slot="{ href, navigate }" :to="tab.route" custom>
            <Tab :active="currentRoute === tab.route" :value="tab.route" @click="navigate">
              <a v-ripple :href="href" @click="navigate" class="flex items-center gap-2 text-inherit">
                <i :class="tab.icon" />
                <span>{{ tab.label }}</span>
              </a>
            </Tab>
          </router-link>
        </template>
      </TabList>
      <div class="py-6">
        <router-view v-slot="{ Component }">
          <component
            :is="Component"
            ref="variantPageRef"
            @editTabUnmunted="refreshTabs"
            @editTabMounted="refreshTabs"
          />
        </router-view>
      </div>
    </Tabs>
  </div>
</template>

<style scoped>
.p-button-md {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1000;
}
</style>