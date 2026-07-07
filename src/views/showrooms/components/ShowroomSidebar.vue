<script setup lang="ts">
import { resolveMediaImage, hasMediaImage } from '@/utils/mediaUrl';
import { ref, onMounted, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useMediaStore } from '@/stores/media';
import { useShowroomStore } from '@/stores/showroom';
import { storeToRefs } from 'pinia';
import { useListStore } from '@/stores/list';
import WayPoint from '@/views/wayPoint/WayPoint.vue';

const toast = useToast();
const mediaStore = useMediaStore();
const mediaFb = mediaStore.fb;
const showroomStore = useShowroomStore();
const { fb, statuses, showroom } = storeToRefs(showroomStore);
const listStore = useListStore();
const { fb: sites } = storeToRefs(listStore);

const featuredMediaExpanded = ref(true);
const postOptionsExpanded = ref(true);
const sitesExpanded = ref(true);
const templateExpanded = ref(true);


const visible = ref(false);
const wayPointSuggestions = ref<any[]>([]);

const bannerWayPointsData = computed(() => {
    return showroom.value?.banner_way_points ? showroom.value?.banner_way_points : [];
});

onMounted(() => {
  if(!statuses.value.length) {
    showroomStore.getStatuses();
  }
  if (!sites.value.length) {
    listStore.fetchSites();
  }
});

const toggleFeaturedMedia = () => {
  featuredMediaExpanded.value = !featuredMediaExpanded.value;
};

const togglePostOptions = () => {
  postOptionsExpanded.value = !postOptionsExpanded.value;
};

// const toggleSites = () => {
//   sitesExpanded.value = !sitesExpanded.value;
// };

// const toggleTemplate = () => {
//   templateExpanded.value = !templateExpanded.value;
// };

const activeSectionOptions = [
  { label: 'Active', value: 1 },
  { label: 'Inactive', value: 0 }
];

const uploadSidebarMediaImage = async (event: any, property: string) => {
  try {
    await showroomStore.uploadShowroomImage(event.files, property, showroom.value.showrooms_id, showroom.value.showrooms_id);
  } catch (error) {
    console.error('Error uploading site logo:', error);
  }
};

const deleteSidebarMediaImage = async ( property: string) => {
  try {
    await showroomStore.deleteShowroomImageByProperty(showroom.value.showrooms_id, property, 'showroom');
    // showroom.value.image = [];
    (showroom.value as any)[property] = [];
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Image deleted successfully',
      life: 3000
    });
  } catch (error) {
    console.error('Error deleting site logo:', error);
  }
};


const updateWayPoints = async (wayPoints: any) => {
    let response: any = await showroomStore.updateShowroomWayPoints(showroom.value.showrooms_id as number, wayPoints);
    if (response) {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Way Points saved successfully',
        life: 3000
      });
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save way points: ' + (response?.message || ''), life: 5000 });
    }
};

// WAY POINT SUGGESTIONS
const searchWayPointSuggestions = async (query: any) => {
    // dummy data for suggestions
    const suggestions: any = await showroomStore.getWayPointSuggestions(query);
    wayPointSuggestions.value = suggestions;
};
</script>

<template>
  <div class="sm:w-full md:w-3/5 space-y-4">
    <!-- Showroom Image -->
    <div class="bg-white rounded-lg shadow-sm">
      <button
        @click="toggleFeaturedMedia"
        class="w-full px-6 py-4 text-left text-lg flex justify-between items-center text-primary"
      >
        Showroom Image
        <i :class="['pi', featuredMediaExpanded ? 'pi-chevron-up' : 'pi-chevron-down']"></i>
      </button>

      <div v-if="featuredMediaExpanded" class="p-6 border-t">
        <!-- Image Preview -->
        <UploadFileFeature
          v-model:uploadedFilesData="showroom.image"
          :fb="mediaFb"
          :property="'image'"
          @upload="uploadSidebarMediaImage($event, 'showroom')"
          @removeUploadedFile="deleteSidebarMediaImage('image')"
        />

        <Divider />
      </div>
    </div>
    <div class="bg-white rounded-lg shadow-sm">
      <button
        @click="toggleFeaturedMedia"
        class="w-full px-6 py-4 text-left text-lg flex justify-between items-center text-primary"
      >
        Showroom Banner Image
        <i :class="['pi', featuredMediaExpanded ? 'pi-chevron-up' : 'pi-chevron-down']"></i>
      </button>

      <div v-if="featuredMediaExpanded" class="p-6 border-t  banner-media-container">
        <!-- Image Preview -->
        <UploadFileFeature
          v-model:uploadedFilesData="showroom.banner_image"
          :fb="mediaFb"
          :property="'banner_image'"
          @upload="uploadSidebarMediaImage($event, 'banner_image')"
          @removeUploadedFile="deleteSidebarMediaImage('banner_image')"
        />

        <div class="way-points-button">
            <Button v-if="showroom.banner_image.length > 0" label="Setup Way-Points" @click="visible = true" />
        </div>

        <Divider />
      </div>
    </div>
    <div class="bg-white rounded-lg shadow-sm">
      <button
        @click="toggleFeaturedMedia"
        class="w-full px-6 py-4 text-left text-lg flex justify-between items-center text-primary"
      >
        Showroom Overview Image
        <i :class="['pi', featuredMediaExpanded ? 'pi-chevron-up' : 'pi-chevron-down']"></i>
      </button>

      <div v-if="featuredMediaExpanded" class="p-6 border-t">
        <!-- Image Preview -->
        <UploadFileFeature
          v-model:uploadedFilesData="showroom.overview_image"
          :fb="mediaFb"
          :property="'overview_image'"
          @upload="uploadSidebarMediaImage($event, 'overview_image')"
          @removeUploadedFile="deleteSidebarMediaImage('overview_image')"
        />

        <Divider />
      </div>
    </div>
     <div class="bg-white rounded-lg shadow-sm">
      <!-- Showroom Options Section -->
      <div class="space-y-6">
        <button
          @click="togglePostOptions"
          class="w-full text-left text-primary text-lg flex justify-between items-center"
        >
          Showroom options
          <i :class="['pi', postOptionsExpanded ? 'pi-chevron-up' : 'pi-chevron-down']"></i>
        </button>

        <div v-if="postOptionsExpanded" class="space-y-6">
          <!-- Status -->
          <div class="form-group">
            <label class="block text-gray-700 mb-2">Status</label>
            <Select
              v-model="showroom.status"
              :options="statuses"
              optionLabel="name"
              optionValue="name"
              placeholder="Select status"
              class="w-full"
              filter
            />
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm">
      <!-- Showroom Options Section -->
      <div class="space-y-6">
        <button
          @click="togglePostOptions"
          class="w-full text-left text-primary text-lg flex justify-between items-center"
        >
          Showroom Section Active
          <i :class="['pi', postOptionsExpanded ? 'pi-chevron-up' : 'pi-chevron-down']"></i>
        </button>

        <div v-if="postOptionsExpanded" class="space-y-6">
          <!-- Status -->
          <div class="form-group">
            <label class="block text-gray-700 mb-2">Section Activation</label>
            <Select v-model="showroom.is_section_active" :options="activeSectionOptions" optionLabel="label" optionValue="value" placeholder="Select status" class="w-full" />
          </div>
        </div>
      </div>
    </div>
      

    <Dialog v-model:visible="visible" modal header="Setup Way-Points" maximizable :maximized="true"
        :style="{ width: '100vw', maxHeight: '100%', height: '100%' }">

        <div class="body-container">

                <WayPoint 
                :wayPointSuggestions="wayPointSuggestions"
                :imageSrc="resolveMediaImage(showroom.banner_image)"
                :wayPoints="bannerWayPointsData"
                :modelId="showroom.showrooms_id as number"
                :fb="fb"
                @update:wayPoints="updateWayPoints"
                @search:way-points-suggestions="searchWayPointSuggestions"     
                />

        </div>
    </Dialog>

    <!-- Sites Section -->
    <!-- <div class="bg-white rounded-lg shadow-sm">
      <button
        @click="toggleSites"
        class="w-full px-6 py-4 text-left text-primary text-lg flex justify-between items-center"
      >
        Sites
        <i :class="['pi', sitesExpanded ? 'pi-chevron-up' : 'pi-chevron-down']"></i>
      </button>

      <div v-if="sitesExpanded" class="p-6 border-t">
        <template v-for="(site, index) in sites" :key="index">
          <RadioButton v-model="showroom.site_id" :value="site.site_id" class="scale-110" />
          <label class="ml-2">{{ site.name }}</label>
        </template>
      </div>
    </div> -->

    <!-- Template Section -->
    <!-- <div class="bg-white rounded-lg shadow-sm">
      <button
        @click="toggleTemplate"
        class="w-full px-6 py-4 text-left text-primary text-lg flex justify-between items-center"
      >
        Template
        <i :class="['pi', templateExpanded ? 'pi-chevron-up' : 'pi-chevron-down']"></i>
      </button>

      <div v-if="templateExpanded" class="p-6 border-t">
        <Select v-model="formData.template" :options="['-- Default template --']" class="w-full" />
      </div>
    </div> -->
  </div>
</template>

<style scoped>
/* ======= way points button css =======  */
.banner-media-container {
    position: relative;
}

.way-points-button {
    position: absolute;
    bottom: 55px;
    left: 20px;
}
@media screen and (max-width: 768px) {
    .way-points-button {
        display: none;
        bottom: 10px;
        left: 20px;
    }
    .banner-media-container {
        padding: 10px;
    }
}
@media screen and (max-width: 1200px) {
    .way-points-button {
        position: absolute;
        bottom: 55px;
        left: 20px;
    }
}
</style>