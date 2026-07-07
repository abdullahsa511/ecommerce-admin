<script setup lang="ts">
import { resolveMediaImage, hasMediaImage } from '@/utils/mediaUrl';
import { onMounted, ref } from 'vue';
// import { Form, FormField } from '@primevue/forms';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Message from 'primevue/message';

import { useShowroomStore } from '@/stores/showroom';
import { useToast } from 'primevue/usetoast';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { ShowroomSection } from '@/models/Showroom';

const Form = (props: any, { slots }: any) => slots.default?.();
const FormField = (props: any, { slots }: any) => slots.default?.();

const router = useRouter();
const toast = useToast();
const showroomStore = useShowroomStore();
const { fb, sections, showroom } = storeToRefs(showroomStore);

const props = defineProps({
  id: {
    type: String,
    required: true
  }
});

const showAddShowroomSectionModal = ref(false);
const newShowroomSection = ref(new ShowroomSection({
  showroom_id: Number(props.id)
}));

const onTitleChange = () => {
  newShowroomSection.value.slug = slugify(newShowroomSection.value.title);
};

const onSectionCodeChange = (e: any) => {
  newShowroomSection.value.section_code = slugify(e.target.value);
};

const slugify = (value: string) => {
  return value
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')        // replace spaces with -
        .replace(/[^a-z0-9-]/g, '')  // remove all special chars except -
        .replace(/-+/g, '-');        // remove duplicate -
}

onMounted(() => {
  showroomStore.getSections(props.id);
  // console
});

const renderIcon = (icon: string, action: string, id: number) => {
    const loadingKey = `showroom.${action}.${id}`;
    return fb.value.loading[loadingKey] ? 'pi pi-spinner pi-spin' : icon;
};


const editSection = async (data: ShowroomSection) => {
  try {
    router.push(`/showroom/${showroom.value.slug}/section/${data.slug}/general`);
  } catch (error) {
    console.error('Error fetching showroom details:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load showroom details. Please try again later.',
      life: 3000
    });
  }
};

const deleteSection = async (data: ShowroomSection) => {
  try {
    await showroomStore.deleteSection(data.project_sections_id);
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Showroom deleted successfully',
      life: 3000
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to delete showroom. Please try again later.',
      life: 3000
    });
  }
};

const showAddShowroomSection = () => {
  showAddShowroomSectionModal.value = true;
};

const addShowroomSection = async (e: any) => {
  try {
    const requestData = {
      section_code: newShowroomSection.value.section_code,
      title: newShowroomSection.value.title,
      slug: newShowroomSection.value.slug,
      description: newShowroomSection.value.description,
      status: "Active",
      showroom_id: Number(props.id)
    };
    const newSection = await showroomStore.addSection(requestData);
    // If newSection is returned and has an id, route to its page, else stay
    if (newSection && newSection.slug) {
      router.push(`/showroom/${showroom.value.slug}/section/${newSection.slug}/general`);
    }
    // else stay on this page (do nothing)
  } catch (error: any) {
    const backendMessage = error?.response?.data?.message || 'Failed to add showroom section. Please try again later.';

    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: backendMessage, // show the actual backend message
      life: 4000
    });

    console.error('Add section error:', error);
  }
};
</script>

<template>
  <div>
    <div class="flex align-center gap-5 mb-10">
      <h2 class="text-xl font-semibold mb-4">Showroom Sections</h2>
      <Button icon="pi pi-plus" rounded outlined size="small" @click="showAddShowroomSection" />
    </div>

    <!-- Loading state -->
    <div class="loading-overlay" v-if="fb.loading?.['showroom.show.sections']">
      <div class="flex justify-center items-center h-full spinner">
          <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
          <p class="mt-2">Loading sections...</p>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="!sections.length" class="text-center py-10 text-gray-500">
      No sections found.
    </div>

    <!-- Card grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div v-for="item in sections" :key="item.project_sections_id"
        class="relative bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition">
        <!-- Thumbnail -->
        <div class="h-40 w-full bg-gray-100 flex items-center justify-center overflow-hidden">
          <img v-if="hasMediaImage(item.image)" :src="resolveMediaImage(item.image)" :alt="item.image[0].name || 'Thumbnail'"
            class="w-full h-full object-cover" />
          <span v-else class="text-gray-400">No Image</span>
        </div>

        <!-- Card content -->
        <div class="p-4 space-y-2 relative">
          <!-- Edit/Delete buttons top-right -->
          <div class="absolute top-2 right-2 flex gap-1 z-10">
            <Button :icon="renderIcon('pi pi-pencil', 'edit', item.project_sections_id)" rounded outlined severity="success" size="small" @click="editSection(item)" />
            <Button :icon="renderIcon('pi pi-trash', 'delete', item.project_sections_id)" rounded outlined severity="danger" size="small" @click="deleteSection(item)" />
          </div>
          <div class="text-lg font-semibold text-gray-700">{{ item.title }}</div>
          <div class="text-gray-500 text-sm">{{ item.description }}</div>
          <div class="flex justify-between items-center text-sm">
            <span class="font-semibold">Section Code:</span>
            <span>{{ item.section_code }}</span>
          </div>
          <div class="flex justify-between items-center text-sm">
            <span class="font-semibold">Slug:</span>
            <span>{{ item.slug }}</span>
          </div>
          <div class="flex justify-between items-center text-sm">
            <span class="font-semibold">Status:</span>
            <span>{{ item.status || '—' }}</span>
          </div>
          <div class="flex justify-between items-center text-sm">
            <span class="font-semibold">Created:</span>
            <span>{{ item.created_at ? new Date(item.created_at).toLocaleDateString() : '—' }}</span>
          </div>
        </div>
      </div>
    </div>

    <Dialog v-model:visible="showAddShowroomSectionModal" header="Add Showroom Section" modal
      class="mx-4 sm:mx-0 sm:w-full md:w-3/12 lg:w-3/12"
      contentClass="rounded-b border-t border-surface-200 dark:border-surface-700 p-0">
      <div class="flex flex-col gap-4 p-5">
        <Form class="flex flex-col gap-4 w-full p-5">
          <FormField v-slot="$field" name="section_code" class="flex flex-col gap-1 w-full">
            <InputText type="text" placeholder="Section Code" v-model="newShowroomSection.section_code"
              class="w-full" @input="onSectionCodeChange" />
            <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
              fb.error?.showroom?.add?.section?.section_code }}</Message>
          </FormField>
          <FormField v-slot="$field" name="title" class="flex flex-col gap-1 w-full">
            <InputText type="text" placeholder="Section Title" v-model="newShowroomSection.title" class="w-full"
              @input="onTitleChange" />
            <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
              fb.error?.showroom?.add?.section?.title }}</Message>
          </FormField>
          <FormField v-slot="$field" name="slug" class="flex flex-col gap-1 w-full">
            <InputText type="text" placeholder="Slug" v-model="newShowroomSection.slug" disabled />
            <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
              fb.error?.showroom?.add?.section?.slug }}</Message>
          </FormField>
          <FormField v-slot="$field" name="description" class="flex flex-col gap-1 w-full">
            <Textarea placeholder="Description" v-model="newShowroomSection.description" :autoResize="true" rows="3"
              cols="30" />
            <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{
              fb.error?.showroom?.add?.section?.description }}</Message>
          </FormField>
          <Button type="submit" severity="primary" label="Add" @click="addShowroomSection" />
        </Form>
      </div>
    </Dialog>
  </div>
</template>