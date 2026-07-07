<script setup lang="ts">
import { ref, computed, defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { Showroom } from '@/models/Showroom';
import { useToast } from 'primevue/usetoast';
import { useShowroomStore } from '@/stores/showroom';
import { storeToRefs } from 'pinia';
import ShowroomGeneral from '../components/ShowroomGeneral.vue';

defineComponent({
  components: {
    ShowroomGeneral,
  },
});

const router = useRouter();
const toast = useToast();
const showroomStore = useShowroomStore();
const { fb, showroom } = storeToRefs(showroomStore);

const items = ref([{ route: '/showrooms/add/general', label: 'General', icon: 'pi pi-home' }]);

const currentRoute = computed(() => router.currentRoute.value.path);

const onShowroomSaved = async () => {
  try {
    const createdShowroom = await showroomStore.createShowrooms(showroom.value);
    router.push(`/showrooms/edit/${createdShowroom.showrooms_id}/general`);
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Showroom created successfully',
      life: 3000
    });
  } catch (error: any) {
    // validation errors
    let errorMsg = 'Failed to save showroom';
    if (error.response?.data) {
      const data = error.response.data;
      if (data.errors) {
        // If multiple field errors
        errorMsg = Object.values(data.errors).flat().join(', ');
      } else if (data.message) {
        errorMsg = data.message;
      }
    } else if (error.message) {
      errorMsg = error.message;
    }

    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: errorMsg || 'Validation error! Failed to save showroom',
      life: 5000
    });
  }
};

</script>
<template>
  <div class=" relative">
    <Button icon="pi pi-save" label="Save" severity="primary" :loading="fb.loading['showroom.create']"
      @click="onShowroomSaved" class="p-button-md pt-0" />
    <Tabs :value="currentRoute" scrollable>
      <TabList>
        <template v-for="tab in items" :key="tab.label">
          <router-link v-if="tab.route" v-slot="{ href, navigate }" :to="tab.route" custom>
            <Tab :active="currentRoute === tab.route" :key="tab.label" :value="tab.route" @click="navigate">
              <a v-ripple :href="href" class="flex items-center gap-2 text-inherit">
                <i :class="tab.icon" />
                <span>{{ tab.label }}</span>
              </a>
            </Tab>
          </router-link>
        </template>
      </TabList>
      <div class="py-6">
        <ShowroomGeneral />
      </div>
    </Tabs>
  </div>
</template>

<style scoped>
.p-button-md {
  position: absolute;
  top: 0px;
  right: 20px;
  z-index: 1000;
}

/* .p-button-md-bottom {
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
} */
</style>
