<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { storeToRefs } from 'pinia'
import { usePinboardStore } from '@/stores/pinboard'
import { CommentBubbleButton, PinboardCommentDrawer } from './comment'
import type { PinboardCommentContext } from '@/models/PinboardComment'

const props = defineProps({
  id: { type: String, required: true }
})
const WEB_URL = import.meta.env.VITE_WEB_BASE_URL;
const pinboardStore = usePinboardStore()

const { pinboard, pinboardItems, fb } = storeToRefs(pinboardStore)

const emit = defineEmits(['editTabUnmunted'])

const acceptPinboardStatus = ref(false)
const toast = useToast()
const commentDrawerVisible = ref(false)
const activeCommentContext = ref<PinboardCommentContext | null>(null)
const modalImage = ref<{ src: string; alt: string } | null>(null)

function openImageModal(item: Record<string, any>) {
  if (!item.photo || item.imageError) return
  modalImage.value = {
    src: item.photo,
    alt: item.title || 'Item image',
  }
}

function closeImageModal() {
  modalImage.value = null
}

function openCommentPanel(item: Record<string, any>) {
  activeCommentContext.value = {
    modelId: item.pinboard_item_id,
    modelUuid: String(item.pinboard_item_id),
    modelRef: pinboard.value?.pinboardDetails?.referenceNumber || props.id,
    modelType: 'PinboardItem',
    title: item.title || item.item_name,
  }
  commentDrawerVisible.value = true
}

onMounted(async () => {
  // const id = route.params.id as string
  // console.log('id', id);
  // console.log('props.id', props.id);
  // console.log('pinboardItems', pinboardItems.value);

  await pinboardStore.showPinboardItems(props.id)
  // console.log('pinboard items', pinboardItems[0]);

  if (pinboardItems.value?.pinboard_status_id > 0) {
    acceptPinboardStatus.value = true
  }

  emit('editTabUnmunted')
})

async function acceptPinboard(id: number) {
  try {
    const response = await pinboardStore.acceptPinboard(id)

    if (response.success) {
      acceptPinboardStatus.value = true

      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Pinboard accepted successfully',
        life: 3000
      })
    } else {
      acceptPinboardStatus.value = false

      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to accept pinboard',
        life: 3000
      })
    }
  } catch (error) {
    console.error('Error accepting pinboard:', error)
    acceptPinboardStatus.value = false
  }
}

function formatDate(dateString: string) {
  if (!dateString) return ''

  const date = new Date(dateString)

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function productUrl(item: any) {
  return WEB_URL + item.product_url
}

function stripHtml(html: string): string {
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || div.innerText || ''
}
</script>

<template>
  <section id="account-db-active-quotes">
    <div class="container th-container">
      <div class="section-body">
        <div class="row">


          <!-- Main Content -->
          <div id="account-show-quote" class="col-12 col-md-9 th-dashboard-main">
            <!-- Table -->
            <div class="th-table th-table-col-8">

              <!-- Header -->
              <div class="th-header-wrapper">
                <div class="th-row-wrapper">
                  <div class="th-cell">Item</div>
                  <div class="th-cell th-col-span-3">Name</div>
                  <div class="th-cell th-col-span-3">Note</div>
                  <div class="th-cell text-center">Comment</div>
                </div>
              </div>

              <!-- Section -->
              <div class="th-section-wrapper">
                <div class="th-row-wrapper">
                  <div class="th-cell" style="grid-column: 1 / 8; font-weight: bold;">
                    Items
                  </div>

                  <div class="th-cell items-center text-center">
                    <img src="/layout/images/comment-icon.png" width="30" height="30" />
                  </div>

                </div>
              </div>

              <!-- Body -->
              <div class="th-body-wrapper">

                <div class="th-row-wrapper" v-for="item in pinboardItems?.pinboardItems" :key="item.pinboard_item_id">

                  <div class="th-cell ">
                    <button
                      v-if="!item.imageError"
                      type="button"
                      class="item-image-btn border-none bg-transparent p-0 cursor-pointer"
                      :aria-label="`View image for ${item.title || 'item'}`"
                      @click="openImageModal(item)"
                    >
                      <img
                        :src="item.photo"
                        :alt="item.title"
                        width="56"
                        @error="item.imageError = true"
                      />
                    </button>

                    <div
                      v-else
                      class="image-placeholder"
                    >
                      {{ item.title?.charAt(0)?.toUpperCase() }}
                    </div>
                  </div>
                  <div class="th-cell th-col-span-3">
                    <a :href="productUrl(item)" target="_blank">
                      <span>
                        {{ item.title }}
                      </span>
                      <!-- <span v-if="item.title && item.description">
                        {{ item.title }} - {{ stripHtml(item.description) }}
                      </span>
                      <span v-else-if="item.title">
                        {{ item.title }}
                      </span>
                      <span v-else-if="item.description">
                        {{ item.description }}
                      </span> -->
                    </a>
                  </div>

                  <div class="th-cell th-col-span-3">
                    <span v-if="item.comments?.[0]">{{ item.comments[0] }}</span>
                  </div>

                  <div class="th-cell items-center">
                    <CommentBubbleButton
                      :count="item.comment_count"
                      :aria-label="`Open comments for ${item.title || 'item'}`"
                      @click="openCommentPanel(item)"
                    />
                  </div>

                </div>

              </div>

              <!-- Footer -->
              <div class="th-footer-wrapper">

                <div class="th-row-wrapper">

                 
                </div>

              </div>

            </div>

          </div>
        </div>
      </div>
    </div>

    <PinboardCommentDrawer
      v-model:visible="commentDrawerVisible"
      :context="activeCommentContext"
    />

    <div
      v-if="modalImage"
      class="image-modal"
      @click="closeImageModal"
    >
      <div class="image-modal-content" @click.stop>
        <button
          type="button"
          class="image-modal-close"
          aria-label="Close image preview"
          @click="closeImageModal"
        >
          <i class="pi pi-times" />
        </button>
        <img
          :src="modalImage.src"
          :alt="modalImage.alt"
          class="image-modal-img"
        />
      </div>
    </div>
  </section>
</template>

<style>
.th-disabled {
  position: relative;
  z-index: 2;
  border: none;
  text-transform: uppercase;
  text-align: center;
  background-color: #4b4949;
  color: #231f20;
  font-family: #fffafa;
  font-size: 17px;
  font-weight: 500;
  line-height: 1;
  padding: 16px 30px;
  min-width: 144px;
  border-radius: 1px;
  transition: background-color 0.4s ease, text-shadow 0.3s ease;
  cursor: pointer;
  z-index: 0;
  padding: 15px 30px;
  cursor: not-allowed;
  pointer-events: none;
  opacity: 0.5;

}

#th-documents-list {
  .th-mar {
    margin-left: 26px;
    gap: 40px;

    @media (max-width: 992px) {
      margin-left: 0px;
    }
  }

  .th-ordercard-info {
    color: var(--theme-primary);

    .th-document-actions {
      width: 390px;
    }

    .th-card-btn {
      margin-top: 22px !important;

      a {
        flex: 1;
      }
    }

    .th-quotes-carg-gap {
      margin-bottom: 212px;
      gap: 40px;
      column-gap: 40px;
    }

    @media (max-width: 768px) {
      padding: 0px !important;

      .th-document-actions {
        width: 100%;

        .th-card-btn {
          a {
            padding: 15px 25px;
          }
        }
      }

      .th-quotes-carg-gap {
        gap: 0px;
        column-gap: 0px;
        margin-right: 0 !important;
      }
    }
  }
}

#account-db-active-quotes {
  @media (max-width: 992px) {
    padding-top: 4px;
  }

  .th-reccard-heading {
    margin-bottom: 18px;

    h5 {
      color: var(--theme-primary);
      margin-bottom: 2px;
    }

    h2 {
      color: var(--theme-primary);
    }
  }

  .th-mior {
    color: var(--theme-primary);
  }

  .th-code-gap {
    margin: 17px 0;
    color: var(--theme-primary);
  }

  .th-rs-text {
    color: var(--theme-primary);

    span {
      color: var(--theme-primary);
      opacity: 0.7;
    }
  }

  .recent-order-img {
    border-radius: 0px !important;

    img {
      @media (max-width: 992px) {
        width: 100%;
      }
    }
  }

  .th-qute-title-gap {
    @media (max-width: 992px) {
      margin: 30px 0 0 0;
    }
  }

  .th-color-gap {
    margin-bottom: 17px;
  }


  /* active quote css */
  .th-rs-card-text {
    h6 {
      span.th-order-item-data {
        color: var(--theme-primary);
        opacity: 0.7;
        font-weight: 400;
        padding-left: 10px;
      }
    }

  }


  /* active quote css */


  .profile-info {
    .profile-pic {
      display: flex;
      justify-content: center;
      margin-bottom: 19px;

      img {
        width: 133px;
        height: 133px;
      }
    }
  }

  .th-sidebard {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    text-align: center;
  }

  .th-left-margin {
    margin-left: 26px;
  }

  .profile-text {
    margin-bottom: 63px;
    color: var(--theme-primary);

    h6 {
      margin-bottom: 6px;
    }

    p {
      color: var(--theme-primary);
    }

    @media (max-width: 768px) {
      margin-bottom: 10px;
    }
  }

  .th-bg-dark {
    background-color: var(--black-color);
    color: var(--white-color);
  }

  .offcanvas {
    padding-left: 29px;
    padding-right: 21px;
    padding-top: 14px;
  }

  .sidebar {
    padding: 0px 0 0 46px;
    border-radius: 8px;

    @media (max-width: 768px) {
      padding-left: 0px;
    }

    .sidebar-nav {
      list-style: none;
      padding: 0;
      margin: 0;

      .sidebar-nav-item {
        .nav-link {
          display: flex;
          align-items: center;
          font-size: 20px;
          padding: 12px 15px;
          color: var(--gray-darker);
          font-weight: 400;
          text-decoration: none;
          transition: 0.3s ease-in-out;

          i {
            margin-right: 10px;
            /* Gap between icon & text */
            font-size: 18px;
          }

          &:hover,
          &.active {
            color: var(--black-color);
            font-weight: 700;
          }
        }
      }
    }
  }

  /* Active body */
  .th-quote-padding {
    padding-top: 32px;
  }

  .quote-amount-info {
    display: flex;
    margin-top: 10px;
    margin-bottom: 5px;

    h4 {
      margin-right: 86px;
    }

    .th-smount-mr {
      margin-bottom: 0;
    }

    @media (max-width: 992px) {
      display: block;
    }
  }

  .quote-content {
    padding: 42px 0;
    height: 259px;

    h4 {
      color: var(--white-color) !important;
      margin-bottom: 0;
    }

    .quote-para {
      font-size: 14px;
    }

    .qute-number {
      font-size: 60px;
      line-height: 149%;
      margin: 5px 0;
    }
  }

  .th-quote-total-wraper {
    display: flex;
    justify-content: end;

    .quote-total-gst {
      width: 38%;
      background-color: #eaeaec80;
      padding: 32px 84px 42px 47px;
      text-align: end;

      .th-gst-my {
        margin: 30px 0;
      }

      .th-total-mt {
        margin-top: 30px;
      }

      @media (max-width: 992px) {
        width: 100%;
      }

      @media (max-width: 1200px) {
        padding: 0 20px 0 30px;
        text-align: left;
      }

      @media (max-width: 1200px) {
        padding: 0 20px 0 30px;
        text-align: left;
      }

      @media (max-width: 1400px) {
        padding: 0 20px 0 30px;
        text-align: left;
      }
    }
  }

  .th-quotes-card {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  .th-quote-oredr-info {
    padding: 80px 0;
  }

  .th-quote-member {
    margin-top: 74px;
  }


  .th-quote-total {
    margin-top: 74px;
  }

  /* table grid */
  .th-quote-table {
    margin-top: 50px;
  }

  .th-table-header {
    background-color: var(--gray-color) !important;
  }

  .container-table-grid {
    display: grid;
    grid-template-columns: repeat(17, 1fr);
    gap: 10px !important;
    justify-content: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    background-color: white;
    align-items: center;

    .th-qoute-table-gap {
      font-size: 14px;
      font-weight: 600;
      color: #5a5a5a;
    }

    .grid-col-span-2 {
      grid-column: span 2;
      padding-left: 10px;
    }

    .grid-col-span-5 {
      grid-column: span 8;
    }

    .grid-col-span-1 {
      grid-column: span 1;
    }

    .grid-col-span-3 {
      grid-column: span 2;
    }

    .grid-item {
      padding: 37px 0;
      background: transparent;
    }
  }

  .th-quote-actions {
    display: flex;
    margin-top: 15px;
  }
}

/* disabled button */
#account-show-quote,
#account-show-order {
  @media (max-width: 768px) {
    padding-left: 12px !important;
  }

  .th-dashboard-doc-summary {
    .th-doc-info {
      margin-bottom: 27px;
    }

    .th-doc-details {
      gap: 85px !important;
      justify-content: unset !important;

      h4 {
        span {
          font-weight: 400;
          color: var(--gray-darker);
          opacity: 0.7;
          font-size: 20px;
        }
      }
    }

    @media (max-width: 768px) {
      gap: 10px !important;

      .th-doc-details {
        gap: 10px !important;
        justify-content: space-between !important;
      }

      .th-title-20 {
        display: flex;
        flex-direction: column;
      }
    }
  }

  .th-table-col-8 {
    .th-footer-wrapper {
      .total-calculation-title {
        color: var(--theme-secondary);
        margin-left: 13px;
        opacity: 0.7;
      }
    }
  }


}

.item-image-btn {
  line-height: 0;
}

.item-image-btn:hover {
  opacity: 0.85;
}

.image-placeholder {
  width: 56px;
  height: 56px;
  border-radius: 4px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 600;
}

</style>
