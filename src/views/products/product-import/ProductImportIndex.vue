<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router';
const router = useRouter();

//Define local variables here
const items = ref([
  { route: `/import-products/products`, label: 'Products', icon: 'pi pi-home' },
  { route: `/import-products/products-meta`, label: 'Meta', icon: 'pi pi-home' },
  { route: `/import-products/related-products`, label: 'Related Products', icon: 'pi pi-home' },
  { route: `/import-products/products-attributes`, label: 'Attributes', icon: 'pi pi-home' },
  { route: `/import-products/products-variants`, label: 'Variants', icon: 'pi pi-home' },
  { route: `/import-products/products-options`, label: 'Options', icon: 'pi pi-home' },
  { route: `/import-products/products-gallery`, label: 'Gallery', icon: 'pi pi-home' },
  { route: `/import-products/products-digital-assets`, label: 'Digital Assets', icon: 'pi pi-home' },
  // tag
  { route: `/import-products/products-tags`, label: 'Tags', icon: 'pi pi-home' },
  // manufacturer
  { route: `/import-products/products-manufacturer`, label: 'Manufacturer', icon: 'pi pi-home' },
 // vendor
  { route: `/import-products/products-vendor`, label: 'Vendor', icon: 'pi pi-home' },
  // certificate
  { route: `/import-products/products-certificate`, label: 'Certificate', icon: 'pi pi-home' },
  // related projects
  { route: `/import-products/products-related-projects`, label: 'Related Projects', icon: 'pi pi-home' },
]);
const currentRoute = computed(() => {
  return router.currentRoute.value.path;
});


</script>

<template>
  <div class="product-import-index card relative">
    <!-- <Button v-if="showSaveButton" :label="saveLabel" :icon="renderIcon('pi pi-save')"  class="p-button-md" @click="handleSave" 
    :disabled="fb.loading['attribute.update.'+attribute.attribute_id]" /> -->
    <Tabs :value="currentRoute" scrollable>
      <TabList>
        <template v-for="tab in items" :key="tab.label">
          <router-link v-if="tab.route" v-slot="{ href, navigate }" :to="tab.route" custom>
            <Tab :active="currentRoute === tab.route" :key="tab.label" :value="tab.route" @click="navigate">
              <a v-ripple :href="href" @click="navigate" class="flex items-center gap-2 text-inherit">
                <i :class="tab.icon" />
                <span>{{ tab.label }}</span>
              </a>
            </Tab>
          </router-link>
        </template>
      </TabList>
      <div class="py-6">
        <router-view />
      </div>
    </Tabs>
  </div>
</template>

<style scoped>
</style>