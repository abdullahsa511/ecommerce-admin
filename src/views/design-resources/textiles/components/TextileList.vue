<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useToast } from 'primevue/usetoast';
import { useTextileStore } from '@/stores/designResourceTextile';
import DocumentFilter from '@/filters/DesignResourceFilter';
import { mediaUrl } from '@/utils/mediaUrl';

const router = useRouter();
const textileStore = useTextileStore();
const { textiles, fb } = storeToRefs(textileStore);
const filters = ref({ ...new DocumentFilter() });
const toast = useToast();

const editDocument = (data: any) => {
  router.push(`/design-resource-textiles/edit/${data.design_resource_id}`);
};

const deleteDocument = async (data: any) => {
  try {
    await textileStore.deleteTextile(data.design_resource_id);
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Textile deleted successfully',
      life: 3000
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to delete textile.',
      life: 3000
    });
  }
};

const clearFilter = () => {
  filters.value = { ...new DocumentFilter() };
};

const getTextileThumbUrl = (data: { image_thumb_url?: string | null }) => {
  return mediaUrl(data?.image_thumb_url ?? '');
};

// download image
const downloadImage = async (urlOrFirst?: string | string[], maybeSecond?: string) => {
  // normalize to array of URLs
  const urls: string[] = Array.isArray(urlOrFirst)
    ? urlOrFirst
    : (maybeSecond ? [urlOrFirst as string, maybeSecond] : (urlOrFirst ? [urlOrFirst as string] : []));

  for (const rawUrl of urls) {
    const url = mediaUrl(rawUrl);
    if (!url) continue;
    // try fetch first (to enable automatic download via blob)
    try {
      // handle data URI directly
      if (url.startsWith('data:')) {
        const a = document.createElement('a');
        a.href = url;
        a.download = 'image';
        document.body.appendChild(a);
        a.click();
        a.remove();
        toast.add({ severity: 'success', summary: 'Download', detail: 'Image download started.', life: 2000 });
        continue;
      }

      const response = await fetch(url, { mode: 'cors' });
      if (!response.ok) throw new Error(`Failed to fetch ${url} (${response.status})`);
      const blob = await response.blob();

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      // derive filename from URL or fallback to 'download'
      const parts = url.split('/').filter(Boolean);
      let filename = parts.length ? parts[parts.length - 1].split('?')[0] : 'download';
      if (!filename.includes('.') && blob.type) {
        const ext = blob.type.split('/')[1];
        if (ext) filename = `${filename}.${ext}`;
      }
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(link.href);
      toast.add({ severity: 'success', summary: 'Download', detail: `Downloading ${filename}`, life: 2000 });
    } catch (err) {
      // common cause: CORS or network error; fallback to opening in new tab
      console.warn('downloadImage fetch failed, falling back to open in new tab', err);
      try {
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        // set download attribute only for same-origin resources
        let isSameOrigin = false;
        try {
          const urlObj = new URL(url, window.location.href);
          isSameOrigin = urlObj.origin === window.location.origin;
        } catch {}
        if (isSameOrigin) a.download = url.split('/').pop() || 'download';
        document.body.appendChild(a);
        a.click();
        a.remove();
        toast.add({
          severity: 'info',
          summary: 'Opened image',
          detail: isSameOrigin ? 'Download started.' : 'Opened image in new tab — right click to save.',
          life: 4000
        });
      } catch (err2) {
        console.error('downloadImage fallback failed', err2);
        toast.add({
          severity: 'error',
          summary: 'Download failed',
          detail: 'Could not download or open the image. Try right-clicking the image and choose "Save image as..."',
          life: 5000
        });
      }
    }
  }
}

watch(textiles.value, () => { });

onMounted(() => {
  textileStore.fetchTextiles();
  console.log('textiles', textiles.value);
});
const renderIcon = (icon: string, action: string, id: number) => {
  return fb.value.loading[`textile.${action}.${id}`] ? 'pi pi-spinner pi-spin' : icon;
};
</script>

<template>
  <div class="document-index">
    <DataTable v-model:filters="filters" :value="textiles" paginator :rows="10" dataKey="design_resource_id"
      filterDisplay="menu" :loading="fb.loading['textile.list']"
      :globalFilterFields="['title', 'grade', 'image', 'image_alt', 'link_text', 'action']" selectionMode="multiple"
      class="th-table">
      <template #header>
        <div class="flex justify-between items-center">
          <div class="flex gap-2">
            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
          </div>
          <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
        </div>
      </template>
      <template #empty> No textile to display! </template>
      <template #loading> Loading textile data. Please wait. </template>
      <Column selectionMode="multiple" headerStyle="width: 3rem" />

      <Column field="image_thumb_url" header="Image" style="min-width: 12rem">
        <template #body="{ data }">
          <img :src="getTextileThumbUrl(data)" :alt="data.image_alt || data.title || 'Textile'" style="width: 50px; height: 50px; object-fit: cover;"
            class="shadow-2 border-round" />
        </template>
      </Column>

      <Column field="title" header="Title" style="min-width: 10rem" sortable>
        <template #body="{ data }">
          <a @click="editDocument(data)" class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline">
            {{ data.title }}
          </a>
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter"
            placeholder="Search by name" />
        </template>
      </Column>

      <Column field="brand" header="Brand" style="min-width: 12rem" sortable>
        <template #body="{ data }">
          {{ data.brand }}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter"
            placeholder="Search by Brand" />
        </template>
      </Column>
      <Column field="type" header="Type" style="min-width: 12rem" sortable>
        <template #body="{ data }">
          {{ data.type }}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter"
            placeholder="Search by Type" />
        </template>
      </Column>
      <Column field="img" header="Download" style="min-width: 12rem">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button icon="pi pi-download" rounded outlined severity="primary"
            @click="downloadImage(mediaUrl(data.image))" />
          </div>
        </template>
      </Column>
      <Column header="Actions" :exportable="false" style="min-width: 8rem">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button rounded outlined severity="success"
              :icon="renderIcon('pi pi-pencil', 'edit', data.design_resource_id)" class="mr-2"
              @click="editDocument(data)" />
            <Button rounded outlined severity="danger"
              :icon="renderIcon('pi pi-trash', 'delete', data.design_resource_id)" @click="deleteDocument(data)" />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
.discount-document-index {
  padding: 2rem;
}

.p-datatable .p-datatable-tbody>tr>td {
  padding: 1rem;
}
</style>
