<script setup lang="ts">
import { onMounted } from 'vue';
import PostSidebar from './PostSidebar.vue';


import { usePostStore } from '@/stores/post';
import { storeToRefs } from 'pinia';

const postStore = usePostStore();
const {fb, post} = storeToRefs(postStore)

onMounted(() => {
  console.log(post);
});
</script>
<template>
  <!-- Seo Tab -->
  <div class="flex flex-col gap-8">
    <div class="flex flex-col md:flex-row gap-6">
        <!-- Left column -->
        <div class="sm:w-full md:w-3/5 space-y-4">
            <!-- Open Graph Section -->
            <div class="space-y-6">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Open Graph</h3>
                
                <!-- Open Graph Title -->
                <div class="grid grid-cols-12 gap-2">
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Open Graph Title</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="post.metadata.openGraph.openGraphTitle" class="w-full" />
                    </div>
                </div>

                <!-- Open Graph Description -->
                <div class="grid grid-cols-12 gap-2">
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Open Graph Description</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <Textarea v-model="post.metadata.openGraph.openGraphDescription" rows="3" class="w-full" />
                    </div>
                </div>
            </div>

            <!-- Twitter Section -->
            <div class="space-y-6">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Twitter</h3>
                
                <!-- Twitter Title -->
                <div class="grid grid-cols-12 gap-2">
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Twitter Title</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="post.metadata.twitter.twitterTitle" class="w-full" />
                    </div>
                </div>

                <!-- Twitter Description -->
                <div class="grid grid-cols-12 gap-2">
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Twitter Description</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <Textarea v-model="post.metadata.twitter.twitterDescription" rows="3" class="w-full" />
                    </div>
                </div>

                <!-- Twitter Label 1 -->
                <div class="grid grid-cols-12 gap-2">
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Twitter label 1</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="post.metadata.twitter.twitterLabel1" class="w-full" />
                    </div>
                </div>

                <!-- Twitter Data 1 -->
                <div class="grid grid-cols-12 gap-2">
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Twitter data 1</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="post.metadata.twitter.twitterData1" class="w-full" />
                    </div>
                </div>

                <!-- Twitter Label 2 -->
                <div class="grid grid-cols-12 gap-2">
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Twitter label 2</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="post.metadata.twitter.twitterLabel2" class="w-full" />
                    </div>
                </div>

                <!-- Twitter Data 2 -->
                <div class="grid grid-cols-12 gap-2">
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Twitter data 21</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="post.metadata.twitter.twitterData2" class="w-full" />
                    </div>
                </div>
            </div>
        </div>
        <!-- Right column -->
        <PostSidebar  />
    </div> 
  </div>
</template>