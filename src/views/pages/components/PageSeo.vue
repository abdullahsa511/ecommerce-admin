<script setup lang="ts">
import { defineProps, onMounted } from 'vue';
import { Page } from '@/models/Page.ts';
import { usePageStore } from '@/stores/page';

const props = defineProps({
  id: {
    type: Number,
    required: true
  },
  page: {
    type: Page,
    required: true,
    default: () => new Page()
  }
});

const pageStore = usePageStore();

onMounted(async () => {
    console.log('props id : ', props.id);
    console.log('props page data: ', props.page);
  try {
    // Fetch the page data
    const fetchedPage = await pageStore.fetchPageById(props.id);

    // Assign fetched data into props.page's properties (safe)
    Object.assign(props.page, fetchedPage);

    console.log('Fetched page data:', props.page);
  } catch (err) {
    console.error('Failed to fetch page:', err);
  }
});
</script>


<template>
  <!-- Seo Tab -->
  <div class="flex flex-col gap-8">
    <div class="flex gap-6">
        <!-- Left column -->
        <div class="w-3/4 space-y-6">
            <!-- Open Graph Section -->
            <div class="space-y-6">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Open Graph</h3>
                
                <!-- Open Graph Title -->
                <div class="grid grid-cols-12 gap-2">
                    <label class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0 text-lg">Open Graph Title</label>
                    <div class="col-span-12 md:col-span-9">
                        <InputText v-model="props.page.metadata.openGraph.openGraphTitle" class="w-full" />
                    </div>
                </div>

                <!-- Open Graph Description -->
                <div class="grid grid-cols-12 gap-2">
                    <label class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0 text-lg">Open Graph Description</label>
                    <div class="col-span-12 md:col-span-9">
                        <Textarea v-model="props.page.metadata.openGraph.openGraphDescription" rows="3" class="w-full" />
                    </div>
                </div>
            </div>

            <!-- Twitter Section -->
            <div class="space-y-6">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Twitter</h3>
                
                <!-- Twitter Title -->
                <div class="grid grid-cols-12 gap-2">
                    <label class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0 text-lg">Twitter Title</label>
                    <div class="col-span-12 md:col-span-9">
                        <InputText v-model="props.page.metadata.twitter.twitterTitle" class="w-full" />
                    </div>
                </div>

                <!-- Twitter Description -->
                <div class="grid grid-cols-12 gap-2">
                    <label class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0 text-lg">Twitter Description</label>
                    <div class="col-span-12 md:col-span-9">
                        <Textarea v-model="props.page.metadata.twitter.twitterDescription" rows="3" class="w-full" />
                    </div>
                </div>

                <!-- Twitter Label 1 -->
                <div class="grid grid-cols-12 gap-2">
                    <label class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0 text-lg">Twitter label 1</label>
                    <div class="col-span-12 md:col-span-9">
                        <InputText v-model="props.page.metadata.twitter.twitterLabel1" class="w-full" />
                    </div>
                </div>

                <!-- Twitter Data 1 -->
                <div class="grid grid-cols-12 gap-2">
                    <label class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0 text-lg">Twitter data 1</label>
                    <div class="col-span-12 md:col-span-9">
                        <InputText v-model="props.page.metadata.twitter.twitterData1" class="w-full" />
                    </div>
                </div>

                <!-- Twitter Label 2 -->
                <div class="grid grid-cols-12 gap-2">
                    <label class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0 text-lg">Twitter label 2</label>
                    <div class="col-span-12 md:col-span-9">
                        <InputText v-model="props.page.metadata.twitter.twitterLabel2" class="w-full" />
                    </div>
                </div>

                <!-- Twitter Data 2 -->
                <div class="grid grid-cols-12 gap-2">
                    <label class="flex items-center col-span-12 mb-2 md:col-span-3 md:mb-0 text-lg">Twitter data 21</label>
                    <div class="col-span-12 md:col-span-9">
                        <InputText v-model="props.page.metadata.twitter.twitterData2" class="w-full" />
                    </div>
                </div>
            </div>
        </div>
    </div> 
  </div>
</template>