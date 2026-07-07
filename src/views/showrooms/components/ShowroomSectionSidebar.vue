<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useMediaStore } from '@/stores/media';
import { useShowroomStore } from '@/stores/showroom';
import { storeToRefs } from 'pinia';
import { useListStore } from '@/stores/list';

const toast = useToast();
const mediaStore = useMediaStore();
const mediaFb = mediaStore.fb;
const showroomStore = useShowroomStore();
const { fb, statuses, section } = storeToRefs(showroomStore);
const listStore = useListStore();
const { fb: listFb, sites } = storeToRefs(listStore);

const featuredMediaExpanded = ref(true);
const postOptionsExpanded = ref(true);

onMounted(() => {
  if(!statuses.value.length) {
    showroomStore.getStatuses();
  }
  setTimeout(() => {
    console.log(section.value);
  }, 1000);
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

const uploadSidebarMediaImage = async (event: any, property: string) => {
  console.log('section sidebar', section.value);
  try {
    await showroomStore.uploadShowroomImage(event.files, property, section.value.project_sections_id, section.value.showroom_id);
  } catch (error) {
    console.error('Error uploading site logo:', error);
  }
};

const deleteSidebarMediaImage = async ( property: string) => {
  try {
    await showroomStore.deleteShowroomImageByProperty(section.value.project_sections_id, property, 'section');
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Image deleted successfully',
      life: 3000
    });
    section.value.image = [];
  } catch (error) {
    console.error('Error deleting site logo:', error);
  }
};
</script>

<template>
  <div class="sm:w-full md:w-3/5 space-y-4">
    <!-- Section Image -->
    <div class="bg-white rounded-lg shadow-sm">
      <button
        @click="toggleFeaturedMedia"
        class="w-full px-6 py-4 text-left text-lg flex justify-between items-center text-primary"
      >
        Section Image
        <i :class="['pi', featuredMediaExpanded ? 'pi-chevron-up' : 'pi-chevron-down']"></i>
      </button>

      <div v-if="featuredMediaExpanded" class="p-6 border-t">
        <!-- Image Preview -->
        <UploadFileFeature
          v-model:uploadedFilesData="section.image"
          :fb="mediaFb"
          :property="'image'"
          @upload="uploadSidebarMediaImage($event, 'section')"
          @removeUploadedFile="deleteSidebarMediaImage('image')"
        />

        <Divider />

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
                v-model="section.status"
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
    </div>
  </div>
</template>
