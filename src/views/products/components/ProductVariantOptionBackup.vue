<script setup lang="ts">
import { nextTick, ref, onMounted } from 'vue';
import Product, { ProductOption, ProductOptionGroup, ProductVariant } from '@/models/Product.ts';
import { useProductStore } from '@/stores/product';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import VariantForm from '@/views/products/components/variant-option/VariantForm.vue';
import Variant from '@/views/products/components/variant-option/Variant.vue';
import OptionGroupForm from '@/views/products/components/variant-option/OptionGroupForm.vue';
import OptionGroupList from '@/views/products/components/variant-option/OptionGroupList.vue';
const emit = defineEmits(['update:product', 'saved']);

const toast = useToast();
const productStore = useProductStore();
const { fb, product, productVariants, productOptionGroups } = storeToRefs(productStore);

const props = defineProps({
  product: {
    type: Product,
    required: true,
    default: () => new Product({})
  }
});

const showOptionGroupCard = ref(false);
const showVariantCard = ref(false);
const variantObjects = ref<ProductVariant[]>([]);
const optionGroupsHeadingRef = ref<HTMLElement | null>(null);
const productVariantSuggestions = ref<any[]>([]);
const optionGroup = ref<ProductOptionGroup>(new ProductOptionGroup({}));
const optionGroupSuggestions = ref<ProductOptionGroup[]>([]);
const optionSuggestions = ref<any[]>([]);
let selectedVariant = ref<ProductVariant | null>(null);

const variants = ref([
  {
    product_variant_id: 1,
    product_id: 1,
    variant_name: 'Extra High',
    sort_order: 5,
    active_status: true,
    variant_description: 'Lorem ipsum dolor sit amet.',
    variant_code: 'EH001',
    productVariantImage: [
      {
        "id": null,
        "name": "Miro_Image.jpg",
        "size": 98436,
        "type": "image/jpeg",
        "image": "/media/Products/image/Miro_Image.jpg",
        "status": {
          "name": "Uploaded",
          "severity": "success"
        },
        "media_id": null,
        "objectURL": "http://localhost:8089/media/design-resource/finishes/Antico-Oak_WM.jpg",
        "created_at": "",
        "description": "",
        "post_image_id": null,
        "project_image_id": null
      }
    ],
    productVariantImagePreview: '',
    productOptionGroups: [
      {
        product_option_group_id: 1,
        description: 'Color group image',
        product_id: 1,
        product_variant_id: 1,
        option_group_name: 'Locker Finish',
        sort_order: 1,
        active_status: 1,
        optionGroupImage: [
          {
            "id": null,
            "name": "ColorPalette.png",
            "size": 20480,
            "type": "image/png",
            "image": "/media/Products/image/ColorPalette.png",
            "status": {
              "name": "Uploaded",
              "severity": "success"
            },
            "media_id": null,
            "objectURL": "http://localhost:8089/media/design-resource/finishes/Antico-Oak_WM.jpg",
            "created_at": "",
            "description": "Color group image",
            "post_image_id": null,
            "project_image_id": null
          }
        ],
        optionGroupImagePreview: '',
        productOptions: [
          {
            index: 1,
            product_option_id: 1,
            description: 'Red option',
            product_id: 1,
            product_variant_id: 1,
            product_option_group_id: 1,
            option_id: 1,
            required: 1,
            value: 'Red',
            name: 'Red',
            type: 'Colour',
            image: [],
            imagePreview: '',
            price: 100,
            "textureFile": [
              {
                "id": null,
                "name": "TextureSample.jpg",
                "size": 15000,
                "type": "image/jpeg",
                "image": "/media/Products/textures/TextureSample.jpg",
                "status": {
                  "name": "Uploaded",
                  "severity": "success"
                },
                "media_id": null,
                "objectURL": "http://localhost:8089/media/design-resource/finishes/Antico-Oak_WM.jpg",
                "created_at": "",
                "description": "Sample texture image",
                "post_image_id": null,
                "project_image_id": null
              }
            ],
            texturePreview: '',
            colourHex: '#FF0000',
            metadata: '',
            sort_order: 1
          },
          {
            index: 2,
            product_option_id: 2,
            description: 'Green option',
            product_id: 1,
            product_variant_id: 1,
            product_option_group_id: 1,
            option_id: 2,
            required: 1,
            value: 'Green',
            name: 'Green',
            type: 'Colour',
            image: [],
            imagePreview: '',
            price: 100,
            "textureFile": [
              {
                "id": null,
                "name": "TextureSample.jpg",
                "size": 15000,
                "type": "image/jpeg",
                "image": "/media/Products/textures/TextureSample.jpg",
                "status": {
                  "name": "Uploaded",
                  "severity": "success"
                },
                "media_id": null,
                "objectURL": "http://localhost:8089/media/design-resource/finishes/Antico-Oak_WM.jpg",
                "created_at": "",
                "description": "Sample texture image",
                "post_image_id": null,
                "project_image_id": null
              }
            ],
            texturePreview: '',
            colourHex: '#FF0000',
            metadata: '',
            sort_order: 1
          }
        ]
      },
      {
        product_option_group_id: 2,
        description: 'Color group image',
        product_id: 1,
        product_variant_id: 1,
        option_group_name: 'Worktop Finish',
        sort_order: 1,
        active_status: 1,
        optionGroupImage: [],
        optionGroupImagePreview: '',
        productOptions: [
          {
            index: 1,
            product_option_id: 3,
            description: 'Blue option',
            product_id: 1,
            product_variant_id: 1,
            product_option_group_id: 2,
            option_id: 3,
            required: 1,
            value: 'Blue',
            name: 'Blue',
            type: 'Colour',
            image: [],
            imagePreview: '',
            price: 100,
            textureFile: [],
            texturePreview: '',
            colourHex: '#0000FF',
            metadata: '',
            sort_order: 1
          },
          {
            index: 2,
            product_option_id: 4,
            description: 'Yellow option',
            product_id: 1,
            product_variant_id: 1,
            product_option_group_id: 2,
            option_id: 4,
            required: 1,
            value: 'Yellow',
            name: 'Yellow',
            type: 'Colour',
            image: [],
            imagePreview: '',
            price: 100,
            textureFile: [],
            texturePreview: '',
            colourHex: '#FFFF00',
            metadata: '',
            sort_order: 1
          }
        ]
      }
    ]
  },

  {
    product_variant_id: 2,
    product_id: 1,
    variant_name: 'Medium',
    sort_order: 2,
    active_status: 1,
    variant_description: 'Medium height variant.',
    variant_code: 'MDM-001',
    productVariantImage: [
      {
        "id": null,
        "name": "Miro_A.jpg",
        "size": 99312,
        "type": "image/jpeg",
        "image": "/media/Products/main-image-one/Miro_A.jpg",
        "status": {
          "name": "Uploaded",
          "severity": "success"
        },
        "media_id": null,
        "objectURL": "http://localhost:8089/media/design-resource/finishes/Antico-Oak_WM.jpg",
        "created_at": "",
        "description": "",
        "post_image_id": null,
        "project_image_id": null
      }
    ],
    productVariantImagePreview: '',
    productOptionGroups: [
      {
        product_option_group_id: 2,
        product_id: 1,
        product_variant_id: 2,
        option_group_name: 'Worktop Finish',
        sort_order: 1,
        active_status: 1,
        optionGroupImage: [
          {
            "id": null,
            "name": "GroupA_Color.jpg",
            "size": 50240,
            "type": "image/jpeg",
            "image": "/media/Products/group-images/GroupA_Color.jpg",
            "status": {
              "name": "Uploaded",
              "severity": "success"
            },
            "media_id": null,
            "objectURL": "http://localhost:8089/media/design-resource/finishes/Antico-Oak_WM.jpg",
            "created_at": "",
            "description": "",
            "post_image_id": null,
            "project_image_id": null
          }
        ],
        optionGroupImagePreview: '',
        productOptions: [
          {
            index: 1,
            product_option_id: 2,
            product_id: 1,
            product_variant_id: 2,
            product_option_group_id: 2,
            option_id: 2,
            required: 1,
            value: 'Blue',
            name: 'Blue',
            type: 'Colour',
            image: [],
            imagePreview: '',
            price: 80,
            textureFile: [
              {
                "id": null,
                "name": "Blue_Texture.jpg",
                "size": 20480,
                "type": "image/jpeg",
                "image": "/media/Products/textures/Blue_Texture.jpg",
                "status": {
                  "name": "Uploaded",
                  "severity": "success"
                },
                "media_id": null,
                "objectURL": "http://localhost:8089/media/design-resource/finishes/Antico-Oak_WM.jpg",
                "created_at": "",
                "description": "Texture image for Blue option",
                "post_image_id": null,
                "project_image_id": null
              }
            ],
            texturePreview: '',
            colourHex: '#0000FF',
            metadata: '',
            sort_order: 1
          }
        ]
      }
    ]
  },

  {
    product_variant_id: 3,
    product_id: 1,
    variant_name: 'Low Height',
    sort_order: 1,
    active_status: true,
    variant_description: 'Low height version for compact use.',
    variant_code: 'LOW-100',
    productVariantImage: [
      {
        "id": null,
        "name": "MiroS_Image.jpg",
        "size": 98164,
        "type": "image/jpeg",
        "image": "/media/Products/image/MiroS_Image.jpg",
        "status": {
          "name": "Uploaded",
          "severity": "success"
        },
        "media_id": null,
        "objectURL": "http://localhost:8089/media/design-resource/finishes/Antico-Oak_WM.jpg",
        "created_at": "",
        "description": "",
        "post_image_id": null,
        "project_image_id": null
      }
    ],
    productVariantImagePreview: '',
    productOptionGroups: [
      {
        product_option_group_id: 3,
        product_id: 1,
        product_variant_id: 3,
        option_group_name: 'Texture',
        sort_order: 1,
        active_status: true,
        optionGroupImage: [
          {
            "id": null,
            "name": "TextureSamples.jpg",
            "size": 20480,
            "type": "image/jpeg",
            "image": "/media/Products/image/TextureSamples.jpg",
            "status": {
              "name": "Uploaded",
              "severity": "success"
            },
            "media_id": null,
            "objectURL": "http://localhost:8089/media/design-resource/finishes/Antico-Oak_WM.jpg",
            "created_at": "",
            "description": "Sample texture image",
            "post_image_id": null,
            "project_image_id": null
          }
        ],
        optionGroupImagePreview: '',
        productOptions: [
          {
            index: 1,
            product_option_id: 3,
            product_id: 1,
            product_variant_id: 3,
            product_option_group_id: 3,
            option_id: 3,
            required: 0,
            value: 'Smooth',
            name: 'Smooth',
            type: 'Texture',
            image: [],
            imagePreview: '',
            price: 50,
            textureFile: [
              {
                "id": null,
                "name": "SmoothTexture.jpg",
                "size": 12345,
                "type": "image/jpeg",
                "image": "/media/Products/textures/SmoothTexture.jpg",
                "status": {
                  "name": "Uploaded",
                  "severity": "success"
                },
                "media_id": null,
                "objectURL": "http://localhost:8089/media/design-resource/finishes/Antico-Oak_WM.jpg",
                "created_at": "",
                "description": "Smooth texture sample image",
                "post_image_id": null,
                "project_image_id": null
              }
            ],
            texturePreview: '',
            colourHex: '',
            metadata: '',
            sort_order: 1
          }
        ]
      }
    ]
  },

  {
    product_variant_id: 4,
    product_id: 1,
    variant_name: 'Premium Glossy',
    sort_order: 3,
    active_status: true,
    variant_description: 'Glossy premium finish.',
    variant_code: 'PRG-500',
    productVariantImage: [
      {
        "id": null,
        "name": "Kove_Image.jpg",
        "size": 91792,
        "type": "image/jpeg",
        "image": "/media/Products/image/Kove_Image.jpg",
        "status": {
          "name": "Uploaded",
          "severity": "success"
        },
        "media_id": null,
        "objectURL": "http://localhost:8089/media/design-resource/finishes/Antico-Oak_WM.jpg",
        "created_at": "",
        "description": "",
        "post_image_id": null,
        "project_image_id": null
      }
    ],
    productVariantImagePreview: '',
    productOptionGroups: [
      {
        product_option_group_id: 4,
        product_id: 1,
        product_variant_id: 4,
        option_group_name: 'Finish',
        sort_order: 1,
        active_status: 1,
        optionGroupImage: [
          {
            "id": null,
            "name": "PremiumGlossy_Finish.png",
            "size": 25400,
            "type": "image/png",
            "image": "/media/Products/image/PremiumGlossy_Finish.png",
            "status": {
              "name": "Uploaded",
              "severity": "success"
            },
            "media_id": null,
            "objectURL": "http://localhost:8089/media/design-resource/finishes/Antico-Oak_WM.jpg",
            "created_at": "",
            "description": "Finish example image",
            "post_image_id": null,
            "project_image_id": null
          }
        ],
        optionGroupImagePreview: '',
        productOptions: [
          {
            index: 1,
            product_option_id: 4,
            product_id: 1,
            product_variant_id: 4,
            product_option_group_id: 4,
            option_id: 4,
            required: 1,
            value: 'Glossy',
            name: 'Glossy',
            type: 'Finish',
            image: [],
            imagePreview: '',
            price: 150,
            textureFile: [
              {
                "id": null,
                "name": "Glossy_Texture.png",
                "size": 21000,
                "type": "image/png",
                "image": "/media/Products/textures/Glossy_Texture.png",
                "status": {
                  "name": "Uploaded",
                  "severity": "success"
                },
                "media_id": null,
                "objectURL": "http://localhost:8089/media/design-resource/finishes/Antico-Oak_WM.jpg",
                "created_at": "",
                "description": "Texture for Glossy finish option",
                "post_image_id": null,
                "project_image_id": null
              }
            ],
            texturePreview: '',
            colourHex: '',
            metadata: '',
            sort_order: 1
          }
        ]
      }
    ]
  },

  {
    product_variant_id: 5,
    product_id: 1,
    variant_name: 'Matte Classic',
    sort_order: 4,
    active_status: true,
    variant_description: 'Matte finish with classic appearance.',
    variant_code: 'MAT-300',
    productVariantImage: [
      {
        "id": null,
        "name": "Cortex_Image.jpg",
        "size": 132831,
        "type": "image/jpeg",
        "image": "/media/Products/image/Cortex_Image.jpg",
        "status": {
          "name": "Uploaded",
          "severity": "success"
        },
        "media_id": null,
        "objectURL": "http://localhost:8089/media/design-resource/finishes/Antico-Oak_WM.jpg",
        "created_at": "",
        "description": "",
        "post_image_id": null,
        "project_image_id": null
      }
    ],
    productVariantImagePreview: '',
    productOptionGroups: [
      {
        product_option_group_id: 5,
        product_id: 1,
        product_variant_id: 5,
        option_group_name: 'Dimensions',
        sort_order: 1,
        active_status: 1,
        optionGroupImage: [
          {
            "id": null,
            "name": "MattePalette.png",
            "size": 16384,
            "type": "image/png",
            "image": "/media/Products/image/MattePalette.png",
            "status": {
              "name": "Uploaded",
              "severity": "success"
            },
            "media_id": null,
            "objectURL": "http://localhost:8089/media/design-resource/finishes/Antico-Oak_WM.jpg",
            "created_at": "",
            "description": "Matte color palette image",
            "post_image_id": null,
            "project_image_id": null
          }
        ],
        optionGroupImagePreview: '',
        productOptions: [
          {
            index: 1,
            product_option_id: 5,
            product_id: 1,
            product_variant_id: 5,
            product_option_group_id: 5,
            option_id: 5,
            required: 1,
            value: 'Black',
            name: 'Black',
            type: 'Colour',
            image: [],
            imagePreview: '',
            price: 90,
            textureFile: [
              {
                "id": null,
                "name": "BlackTexture.jpg",
                "size": 17890,
                "type": "image/jpeg",
                "image": "/media/Products/textures/BlackTexture.jpg",
                "status": {
                  "name": "Uploaded",
                  "severity": "success"
                },
                "media_id": null,
                "objectURL": "http://localhost:8089/media/design-resource/finishes/Antico-Oak_WM.jpg",
                "created_at": "",
                "description": "Texture image for Black option",
                "post_image_id": null,
                "project_image_id": null
              }
            ],
            texturePreview: '',
            colourHex: '#000000',
            metadata: '',
            sort_order: 1
          }
        ]
      }
    ]
  }
])


variantObjects.value = variants.value.map((variant: any) => {
  return new ProductVariant(variant);
});
selectedVariant.value = variantObjects.value[0];
selectedVariant.value.selected = true;
variantObjects.value[0].selected = true;

function toggleVariantForm($event: any, item: any) {
  showVariantCard.value = !showVariantCard.value;
}

function toggleVariant(item: any) {
  item.selected = true;
  selectedVariant.value = item;
  variantObjects.value.forEach((variant: ProductVariant) => {
    variant.selected = false;
  });
  const index = variantObjects.value.findIndex((variant: ProductVariant) => variant.product_variant_id === item.product_variant_id);
  variantObjects.value[index].selected = true;
  scrollToOptionGroupsHeading();
}

const handleDeleteVariant = async (data: any) => {
  const variant = new ProductVariant(data);
  variantObjects.value = variantObjects.value.filter((v: ProductVariant) => v.product_variant_id !== variant.product_variant_id);
}

function toggleOptionGroup() {
  showOptionGroupCard.value = !showOptionGroupCard.value;
}


const uploadMainImage = async (event: any, property: ProductVariant) => {
  // // alert('uploadMainImage');
  // try {
  //     // const response: any = await mediaStore.uploadFiles(event.files, property);
  //     let productId = props.product.product_id ? props.product.product_id : 0; // 0 is for new products
  //     const response: any = await productStore.uploadProductImages(event.files, property, productId);
  //     props.product[property] = response.files;
  // } catch (error) {
  //     console.error('Error uploading site logo:', error);
  // }
}

const deleteMainImage = async (file: any, property: ProductVariant) => {
  // try {
  //     await mediaStore.deleteImageByFilePath(file.objectURL, property);
  //     props.product[property] = [];
  //     toast.add({
  //         severity: 'success',
  //         summary: 'Success',
  //         detail: 'Image deleted successfully',
  //         life: 3000
  //     });
  // } catch (error) {
  //     console.error('Error deleting site logo:', error);
  // }
}

const handleSaveOptionGroup = async (group: ProductOptionGroup) => {
  //   const updatedGroup = await productStore.updateProductOptionGroup(group);
  //   let index = selectedVariant.value?.productOptionGroups?.findIndex((g: ProductOptionGroup) => g.product_option_group_id === group.product_option_group_id);
  //   if (index !== -1 && index !== undefined) {
  //     if(selectedVariant.value) {
  //       selectedVariant.value.productOptionGroups[index] = new ProductOptionGroup(updatedGroup);
  //     }
  //   }
}

const searchVariants = async (event: any) => {
  if (product.value.product_id !== null && product.value.product_id !== undefined) {
    productVariantSuggestions.value = await productStore.listProductVariants(event, product.value.product_id);
  } else {
    productVariantSuggestions.value = [];
  }
}
// const searchOptionGroups = async (event: any) => {
//   if (selectedVariant?.value?.product_variant_id !== null && selectedVariant?.value?.product_variant_id !== undefined) {
//     const variantGroups = await productStore.listProductOptionGroups(event, selectedVariant.value.product_variant_id);
//   }
// }

const searchOptionGroups = async (event: any) => {
  if (selectedVariant.value?.product_variant_id) {
    const data = await productStore.listProductOptionGroups(event, selectedVariant.value?.product_variant_id);
    optionGroupSuggestions.value = data;
  } else {
    optionGroupSuggestions.value = [];
  }
}

const searchOptions = async (data: { event: any, optionGroupId: number }) => {
  const { event, optionGroupId } = data;
  if (optionGroupId !== undefined && optionGroupId !== null) {
    optionSuggestions.value = await productStore.listProductOptions(event, optionGroupId);
  } else {
    optionSuggestions.value = [];
  }
}

const handleSaveVariant = async (data: any) => {
  try {
    if (data.product_variant_id) {
      const updatedVariant = await productStore.updateProductVariant(data);
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Variant updated successfully',
        life: 3000
      });
    } else {

      const newVariant = await productStore.createProductVariant(data);
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Variant created successfully',
        life: 3000
      });
    }
  } catch (error) {
    console.error('Error saving variant:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An error occurred while saving the variant.',
      life: 5000
    });
  }
}

const handleAddVariant = async (data: any) => {
  selectedVariant.value = new ProductVariant(data);
  variantObjects.value.forEach((variant: ProductVariant) => {
    variant.selected = false;
  });
  selectedVariant.value.selected = true;
}
const handleAddOptionGroup = async (data: any) => {
  const group = new ProductOptionGroup(data.value);
  // Check if a variant with the same option group name already exists for this variant
  const existingGroup = selectedVariant.value?.productOptionGroups.find(
    (g: ProductOptionGroup) => g.option_group_name.trim().toLowerCase() === group.option_group_name.trim().toLowerCase()
  );
  if (existingGroup) {
    toast.add({
      severity: 'warn',
      summary: 'Duplicate Option Group',
      detail: `An option group named "${group.option_group_name}" already exists for this variant.`,
      life: 4000
    });
    return;
  }
  if (data.index !== undefined && data.index !== null && data.index > -1) {
    if (selectedVariant.value) {
      selectedVariant.value.productOptionGroups[data.index] = group;
    }
  } else {
    group.active = true;
    selectedVariant.value?.productOptionGroups.push(group);
    showOptionGroupCard.value = false;
    // Smooth scroll to the newly added/activated option group
    await nextTick();
    if (optionGroupsHeadingRef.value) {
      // Scroll the main heading into view first
      optionGroupsHeadingRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // Then, try scrolling to the active group panel if it exists
    // Look for active group DOM node by index (last in array is the new one)
    const idx = selectedVariant.value?.productOptionGroups.length
      ? selectedVariant.value.productOptionGroups.length - 1
      : null;
    if (idx !== null) {
      // Try finding the accordion panel for the group - Panel index == idx by v-for
      // class name from OptionGroupList.vue: ".product-option-panel"
      // Add a small delay to let any transition finish
      setTimeout(() => {
        const panels = document.querySelectorAll('.product-option-panel');
        if (panels && panels[idx]) {
          (panels[idx] as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Optionally, focus header for accessibility
          const header = panels[idx].querySelector('.product-option-header');
          if (header) (header as HTMLElement).focus?.({ preventScroll: true });
        }
      }, 350); // matches opening transition duration
    }
  }
}

const handleAddOption = async (data: any) => {
  const option = new ProductOption(data);
  const groupIndex = selectedVariant.value?.productOptionGroups.findIndex(g => g.product_option_group_id === option.product_option_group_id);
  if (groupIndex !== undefined && groupIndex !== null && groupIndex > -1) {
    const existingOption = selectedVariant.value?.productOptionGroups[groupIndex].productOptions.find(
      (g: any) => g.option_name.trim().toLowerCase() === option.option_name.trim().toLowerCase()
    );
    if (existingOption) {
      toast.add({
        severity: 'warn',
        summary: 'Duplicate Option',
        detail: `An option named "${option.option_name}" already exists for this group.`,
        life: 4000
      });
      return;
    }
  }

  if (data.index !== undefined && data.index !== null && data.index > -1) {
    if (groupIndex !== undefined && selectedVariant?.value?.productOptionGroups?.[groupIndex]?.productOptions?.[data.index]) {
      selectedVariant.value.productOptionGroups[groupIndex].productOptions[data.index] = option;
    }
  } else {
    if (groupIndex !== undefined && selectedVariant?.value?.productOptionGroups?.[groupIndex]?.productOptions) {
      option.active = true;
      selectedVariant.value.productOptionGroups[groupIndex].productOptions.push(option);
    }
    // Smooth scroll to the newly added/activated option
    await nextTick();
    setTimeout(() => {
      const panels = document.querySelectorAll('.product-option-panel');
      if (panels && panels.length > 0) {
        (panels[panels.length - 1] as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Optionally, focus header for accessibility
        const header = panels[panels.length - 1].querySelector('.product-option-header');
        if (header) (header as HTMLElement).focus?.({ preventScroll: true });
      }
    }, 350); // matches opening transition duration
  }
}

const handleDeleteOption = async (data: any) => {
  const option = new ProductOption(data);
  const groupIndex = selectedVariant.value?.productOptionGroups.findIndex(g => g.product_option_group_id === option.product_option_group_id);
  if (groupIndex !== undefined && groupIndex !== null && groupIndex > -1) {
    if (selectedVariant.value) {
      selectedVariant.value.productOptionGroups[groupIndex].productOptions =
        selectedVariant.value.productOptionGroups[groupIndex].productOptions.filter((o: ProductOption) => o.product_option_id !== option.product_option_id);
    }
  }
}


const scrollToOptionGroupsHeading = async () => {
  await nextTick();
  if (optionGroupsHeadingRef.value) {
    optionGroupsHeadingRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
    optionGroupsHeadingRef.value.focus({ preventScroll: true });
  }
};

onMounted(async () => {
  await productStore.getVariantByProductId(261);
  console.log('productVariants onMounted', productVariants.value);
});
</script>
<template>
  <div class="flex flex-col md:flex-row gap-2">
    <div class="loading-overlay border-2" v-if="fb.loading['product.show']">
      <div class="flex justify-center items-center h-full spinner">
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
        <p class="mt-2">Loading product productOptions data. Please wait.</p>
      </div>
    </div>
    <!-- Left Column -->
    <div
      class="w-full sm:w-full md:w-full lg:w-full xl:w-1/2 bg-white rounded-xl shadow lg:p-6 flex flex-col gap-6 border border-gray-200"
      v-if="!fb.loading['product.show']">
      <div class="border-2 p-3">
        <div class="flex items-center justify-between w-full">
          <h3 class="font-medium text-lg">Variants</h3>
          <Button label="Add" :icon="showVariantCard ? 'pi pi-minus' : 'pi pi-plus'" severity="secondary" rounded
            @click="toggleVariantForm" />
        </div>
      </div>

      <VariantForm v-show="showVariantCard" :productVariants="productVariants"
        :productVariantSuggestions="productVariantSuggestions" :variant="selectedVariant ?? new ProductVariant({})"
        @searchVariant=searchVariants @add:variant="handleAddVariant" @submit="(data) => handleSaveVariant(data)" />

      <Variant v-for="(item, i) in variantObjects" :key="item.product_variant_id" :index="i + 1" :variant="item"
        @delete:variant="handleDeleteVariant" @edit:variant="toggleVariant(item)" />

    </div>

    <!-- Right column -->
    <div ref="optionGroupsHeadingRef"
      class="w-full sm:w-full md:w-full lg:w-full xl:w-1/2 bg-white rounded-xl shadow lg:p-6 border border-gray-200 flex flex-col gap-6">

      <div class="border-2 p-3">
        <div class="flex items-center justify-between w-full">
          <h3 class="font-medium text-lg focus:outline-none" tabindex="-1">
            Options
          </h3>
          <Button :icon="showOptionGroupCard ? 'pi pi-minus' : 'pi pi-plus'" label="Add Group" severity="secondary"
            rounded @click="toggleOptionGroup" />
        </div>
      </div>

      <OptionGroupForm v-show="showOptionGroupCard" :optionGroupData="productOptionGroups" :optionGroup="optionGroup"
        :optionGroupSuggestions="optionGroupSuggestions" :optionSuggestions="optionSuggestions" :showOptionList="true"
        @searchOptionGroups="searchOptionGroups($event)" @add:optionGroup="handleAddOptionGroup"
        @searchOptions="searchOptions($event)" @add:option="handleAddOption" @delete:option="handleDeleteOption" />
      <!-- <OptionGroupList :selectedVariant="selectedVariant" /> -->
      <OptionGroupList :variant="selectedVariant ?? new ProductVariant({})"
        :optionGroupSuggestions="optionGroupSuggestions" :optionSuggestions="optionSuggestions"
        @add:optionGroup="handleAddOptionGroup" @save="handleSaveOptionGroup($event)"
        @searchOptionGroups="searchOptionGroups($event)" @searchOptions="searchOptions($event)"
        @add:option="handleAddOption" @delete:option="handleDeleteOption" />

    </div>
  </div>
</template>


<style>
/* Slide Down Animation */
.slide-down-enter-from {
  max-height: 0;
  opacity: 0;
}

.slide-down-enter-to {
  max-height: 1000px;
  opacity: 1;
}

.slide-down-leave-from {
  max-height: 1000px;
  opacity: 1;
}

.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
}

.p-accordioncontent-content {
  padding: 1rem !important;
  border: none !important;
}

.p-accordioncontent-content>.optionGroup-form {
  border: none !important;
}
</style>