import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import ProductService from '../service/ProductService';
import FeedbackHandler from '../utils/FeedbackHandler';
// import Product, { DigitalAsset } from '../models/Product.ts';
import Product, { ProductOption, ProductOptionGroup, ProductVariant } from '@/models/Product.ts';
import { ProductImage } from '../models/Product.ts';
import { FileModel } from '@/models/Media';
import ProductImportResponse from '@/models/ProductImportResponse';
import ProductMetaImportResponse from '@/models/ProductMetaImportResponse';
import VariantService from '@/service/VariantService';
import ProductOptionService from '@/service/ProductOptionService';
import ListService from '@/service/ListService';
import ProductOptionGroupService from '@/service/ProductOptionGroupService';
import ItemOptionService from '@/service/ItemOptionService';
import { WayPoint } from '@/models/WayPoint';
import { mediaUrl } from '@/utils/mediaUrl';

export const useProductStore = defineStore('product', () => {
    /**
     * @type {import('vue').Ref<Product[]>}
     */
    const products = ref([]);
    const product = ref(new Product());

    const productVariants = ref([]);
    const productOptionGroups = ref([]);
    const productOptions = ref([]);

    const importExport = ref(new ProductImportResponse());
    const metaImportExport = ref(new ProductMetaImportResponse());
    /**
     * @type {import('vue').Ref<FeedbackHandler>}
     */
    const fb = ref(new FeedbackHandler());
    const model = 'product';
    const categories = ref([]);
    const productLists = ref([]);
    const server = import.meta.env.VITE_API_BASE_URL;

    const fetchProducts = async () => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const response = await ProductService.getProducts();
            products.value = response.map(product => new Product(product));
            fb.value.showSuccess(model);
        } catch (err) {
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };
    
    // =============================== start product variant section ===============================
    const listProductVariants = async (query, productId) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const response = await ProductService.listVariants(query, productId);
           
           return response.data;
        } catch (err) {
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const listProductOptionGroups = async (query, productId) => {

        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const response = await ProductService.listVariantGroups(query, productId);
            console.log('response group', response);
            return response;
        } catch (err) {
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const listProductOptions = async (query, productId) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const response = await ProductService.listVariantGroupOptions(query, productId);
            return response.productOptions;
        } catch (err) {
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const listItemOptions = async (query, productId) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const response = await ProductService.listItemOptions(query, productId);
            return response.productOptions;
        } catch (err) {
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const createProductVariant = async (data) => {
        fb.value.clearError(model + '.variant.create');
        fb.value.removeSuccess(model + '.variant.create');
        fb.value.startLoading(model + '.variant.create');
        try {
            const variants = await ProductService.createProductVariant(data);
            // Reset selection flags without replacing the array
            productVariants.value = variants.map(v => {
                if(v.product_variant_id === variants.product_variant_id){
                    v.selected = true;
                }else{
                    v.selected = false;
                }
                return new ProductVariant(v);
            });
            console.log('productVariants.value from store data: ', productVariants.value);
            return productVariants.value;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.variant.create');
        } finally {
            fb.value.finishLoading(model + '.variant.create');
        }
    };

    const createItemVariant = async (data) => {
        fb.value.clearError(model + '.variant.create');
        fb.value.removeSuccess(model + '.variant.create');
        fb.value.startLoading(model + '.variant.create');
        try {
            const variants = await ProductService.createItemVariant(data);
            // Reset selection flags without replacing the array
            productVariants.value = variants.map(v => {
                if(v.product_variant_id === variants.product_variant_id){
                    v.selected = true;
                }else{
                    v.selected = false;
                }
                return new ProductVariant(v);
            });
            console.log('productVariants.value from store data: ', productVariants.value);
            return productVariants.value;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.variant.create');
        } finally {
            fb.value.finishLoading(model + '.variant.create');
        }
    };

    const updateProductVariant = async (data) => {
        fb.value.clearError(model + '.variant.update.' + data.product_variant_id);
        fb.value.removeSuccess(model + '.variant.update.' + data.product_variant_id);
        fb.value.startLoading(model + '.variant.update.' + data.product_variant_id);
        try {
            const response = await ProductService.updateProductVariant(data);
            const updatedVariant = new ProductVariant(response[0]);
            updatedVariant.selected = true;
            productVariants.value = productVariants.value.map(variant => {
                if(variant.product_variant_id === updatedVariant.product_variant_id){
                    return updatedVariant;
                }else{
                    variant.selected = false;
                    return variant;
                }
            });
            fb.value.showSuccess(model + '.variant.update.' + data.product_variant_id);
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.variant.update.' + data.product_variant_id);
        } finally {
            fb.value.finishLoading(model + '.variant.update.' + data.product_variant_id);
        }
    };

    const uploadProductVariantImage = async (files, productVariantId) => {
        fb.value.clearError(model + '.variant.update.image.' + productVariantId);
        fb.value.removeSuccess(model + '.variant.update.image.' + productVariantId);
        fb.value.startLoading(model + '.variant.update.image.' + productVariantId);
        try {
            const response = await ProductService.uploadProductVariantImage(files, productVariantId);
            response.files = response.files.map(file => {
                if(!file?.ObjectURL && file?.file && typeof file.file === 'string') {
                    file = JSON.parse(file.file);
                }
                // Create the image object
                const imageObject = new FileModel(file);
                
                // Make sure the image path is fully qualified
                if (file.objectURL) {
                    imageObject.objectURL = mediaUrl(file.objectURL);
                }
                console.log(imageObject);
                return imageObject;
            });
            productVariants.value = productVariants.value.map(variant => {
                if(variant.product_variant_id === productVariantId){
                    variant.image = response.files;
                    variant.imagePreview = response.files[0].objectURL;
                }
                return variant;
            });
            fb.value.showSuccess('Files uploaded successfully', model+'.variant.update.image.'+productVariantId);
            console.log('response.files', response.files);
            return response.files;
        } catch (err) {
            fb.value.setError(err, '.variant.update.image.'+productVariantId);
            throw err;
        } finally {
            fb.value.finishLoading('.variant.update.image.'+productVariantId);
        }
    };

    const deleteProductVariant = async (productVariantId) => {
        fb.value.clearError(model + '.variant.delete.' + productVariantId);
        fb.value.removeSuccess(model + '.variant.delete.' + productVariantId);
        fb.value.startLoading(model + '.variant.delete.' + productVariantId);
        try {
            const response = await ProductService.deleteProductVariant(productVariantId);
            productVariants.value = productVariants.value.filter(variant => variant.product_variant_id !== productVariantId);
            return response.data;
        } catch (err) {
            fb.value.setError(err, model + '.variant.delete.' + productVariantId);
        } finally {
            fb.value.finishLoading(model + '.variant.delete.' + productVariantId);
        }
    };
    const deleteProductOption = async (id) => {
        fb.value.clearError(model + '.delete.' + id);
        fb.value.removeSuccess(model + '.delete.' + id);
        fb.value.startLoading(model + '.delete.' + id);
        try {
            const response = await ProductOptionService.deleteProductOption(id);
            fb.value.showSuccess(model + '.delete.' + id);
            return response.data;
        } catch (err) {
            fb.value.setError(err, model + '.delete.' + id);
            throw err;
        } finally {
            fb.value.finishLoading(model + '.delete.' + id);
        }
    };
    const uploadProductVariantGroupOptionImage = async (files, productOptionId) => {
        fb.value.clearError(model + '.variant.update.optionImage.' + productOptionId);
        fb.value.removeSuccess(model + '.variant.update.optionImage.' + productOptionId);
        fb.value.startLoading(model + '.variant.update.optionImage.' + productOptionId);
        try {
            const response = await VariantService.uploadProductVariantGroupOptionImage(files, productOptionId);
            response.files = response.files.map(file => {
                if(!file?.ObjectURL && file?.file && typeof file.file === 'string') {
                    file = JSON.parse(file.file);
                }
                // Create the image object
                const imageObject = new FileModel(file);
                if (file.objectURL) {
                    imageObject.objectURL = mediaUrl(file.objectURL);
                }
                console.log(imageObject);
                return imageObject;
            });
            fb.value.showSuccess('Files uploaded successfully', model+'.variant.update.optionImage.'+productOptionId);
            console.log('response.files', response.files);
            return response.files;
        } catch (err) {
            fb.value.setError(err, model + '.variant.update.optionImage.' + productOptionId);
        }
    }

    const deleteProductVariantImage = async (productVariantId) => { // send
        fb.value.clearError(model + '.variant.update.optionImage.' + productVariantId);
        fb.value.removeSuccess(model + '.variant.update.optionImage.' + productVariantId);
        fb.value.startLoading(model + '.variant.update.optionImage.' + productVariantId);
        try {
            const response = await ProductService.deleteProductVariantImage(productVariantId);
            fb.value.showSuccess('Image deleted successfully', model+'.variant.update.optionImage.'+productVariantId);
            return response.data;
        } catch (err) {
            fb.value.setError(err, model + '.variant.update.optionImage.' + productVariantId);
        }
    };

    const deleteProductVariantOptionImage = async (productVariantOptionId) => { // send
        fb.value.clearError(model + '.variant.update.optionImage.' + productVariantOptionId);
        fb.value.removeSuccess(model + '.variant.update.optionImage.' + productVariantOptionId);
        fb.value.startLoading(model + '.variant.update.optionImage.' + productVariantOptionId);
        try {
            const response = await ProductService.deleteProductVariantOptionImage(productVariantOptionId);
            fb.value.showSuccess('Image deleted successfully', model+'.variant.update.optionImage.'+productVariantOptionId);
            return response.data;
        } catch (err) {
            fb.value.setError(err, model + '.variant.update.optionImage.' + productVariantOptionId);
        }
    };


    // =============================== end product variant section ===============================

    const productNames = computed(() => {
        return products.value.map(product => product.name);
    });

    const fetchProductById = async (productId) => {
        fb.value.clearError(model+'.edit.'+productId);
        fb.value.removeSuccess(model+'.edit.'+productId);
        fb.value.startLoading(model+'.edit.'+productId);

        fb.value.clearError(model + '.show');
        fb.value.removeSuccess(model + '.show');
        fb.value.startLoading(model + '.show');

        try {
            const product = await ProductService.getProductById(productId);
            product.value = new Product(product);
            if(product.value.banner_way_points.length <= 0) {
                product.value.banner_way_points = [
                    new WayPoint({
                        id: 1,
                        leftPx: 0,
                        topPx: 0,
                        leftPercent: 2,
                        topPercent: 2,
                        linkActive: false,
                        label: "Point 1",
                    }),
                ];
            }

            fb.value.showSuccess(model+'.edit.'+productId);
            fb.value.showSuccess(model + '.show');

            return product.value;
        } catch (err) {
            fb.value.setError(err, model+'.edit.'+productId);
            fb.value.setError(err, model + '.show');
        } finally {
            fb.value.finishLoading(model+'.edit.'+productId);
            fb.value.finishLoading(model + '.show');
        }
    };

    const createProduct = async (newProduct) => {
        fb.value.clearError(model+'.create');
        fb.value.removeSuccess(model+'.create');
        fb.value.startLoading(model+'.create');
        try {
            const createdProduct = await ProductService.createProduct(newProduct);
            let product = new Product(createdProduct);
            products.value.push(product);
            fb.value.showSuccess(model+'.create');
            return product;
        } catch (err) {
            fb.value.setError(err, model+'.create');
        } finally {
            fb.value.finishLoading(model+'.create');
        }
    };

    const updateProduct = async (updatedProduct) => {
        console.log('updatedProduct', updatedProduct);
        fb.value.clearError(model+'.update');
        fb.value.removeSuccess(model+'.update');
        fb.value.startLoading(model+'.update');
        try {
            const product = await ProductService.updateProduct(updatedProduct);
            fb.value.showSuccess(model+'.update');
            return new Product(product);
        } catch (err) {
            fb.value.setError(err, model+'.update');
        } finally {
            fb.value.finishLoading(model+'.update');
        }
    };

    const deleteProduct = async (productId) => {
        fb.value.clearError(model + '.delete.' + productId);
        fb.value.removeSuccess(model + '.delete.' + productId);
        fb.value.startLoading(model + '.delete.' + productId);
        try {
            await ProductService.deleteProduct(productId);
            products.value = products.value.filter(p => p.product_id !== productId);
            fb.value.showSuccess(model + '.delete.' + productId);
        } catch (err) {
            fb.value.setError(err, model + '.delete.' + productId);
        } finally {
            fb.value.finishLoading(model + '.delete.' + productId);
        }
    };

    const createProductImport = async (newImport) => {
        fb.value.clearError(model+'.import');
        fb.value.removeSuccess(model+'.import');
        fb.value.startLoading(model+'.import');
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }
            const response = await ProductService.createProductImport(newImport);
            fb.value.showSuccess(model+'.import');
            return response;
        } catch (err) {
            // console.error('Import error:', err);
            // fb.value.setError(err, model+'.import');
            // throw err;

            const responseData = err.response?.data;
            const extractedErrors = typeof responseData?.errors === 'object' ? { ...responseData.errors } : {};
            if (!extractedErrors.global_message) {
                if (responseData?.global_message) {
                    extractedErrors.global_message = Array.isArray(responseData.global_message)
                        ? responseData.global_message
                        : [responseData.global_message];
                } else if (responseData?.message) {
                    extractedErrors.global_message = [responseData.message];
                } else if (err.message) {
                    extractedErrors.global_message = [err.message];
                } else {
                    extractedErrors.global_message = ['Failed to import products.'];
                }
            }
            fb.value.setError(extractedErrors, model + '.import');
            throw extractedErrors;

        } finally {
            fb.value.finishLoading(model+'.import');
        }
    };
    const importProductsMeta = async (newImport) => {
        fb.value.clearError(model + '.importMeta');
        fb.value.removeSuccess(model + '.importMeta');
        fb.value.startLoading(model + '.importMeta');
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }
            const response = await ProductService.importProductsMeta(newImport);
            metaImportExport.value = new ProductMetaImportResponse(response);
            fb.value.showSuccess(model + '.importMeta');
            return metaImportExport.value;
        } catch (err) {
            console.error('Import error:', err);
            fb.value.setError(err, model + '.importMeta');
            throw err;
        } finally {
            fb.value.finishLoading(model + '.importMeta');
        }
    };

    const createProductRelationalTableDataImport = async (newImport, property) => {
        fb.value.clearError(model+'.import');
        fb.value.removeSuccess(model+'.import');
        fb.value.startLoading(model+'.import');
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }

            const response = await ProductService.createProductRelationalTableDataImport(newImport, property);
            console.log('Store received response:', response);
            fb.value.showSuccess(model+'.import');
            return response;
        } catch (err) {
            console.error('Import error:', err);
            fb.value.setError(err, model+'.import');
            throw err;
        } finally {
            fb.value.finishLoading(model+'.import');
        }
    };
    const importProductsSortOrderByCategory = async (newImport) => {
        fb.value.clearError(model+'.import');
        fb.value.removeSuccess(model+'.import');
        fb.value.startLoading(model+'.import');
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }

            const response = await ProductService.importProductsSortOrderByCategory(newImport);
            console.log('Store received response:', response);
            fb.value.showSuccess(model+'.import');
            return response;
        } catch (err) {
            console.error('Import error:', err);
            fb.value.setError(err, model+'.import');
            throw err;
        } finally {
            fb.value.finishLoading(model+'.import');
        }
    };
    const createProductSetupImport = async (newImport, property) => {
        fb.value.clearError(model+'.import');
        fb.value.removeSuccess(model+'.import');
        fb.value.startLoading(model+'.import');
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }

            const response = await ProductService.createProductRelationalTableDataImport(newImport, property);
            console.log('Store received response:', response);
            fb.value.showSuccess(model+'.import');
            return response;
        } catch (err) {
            console.error('Import error:', err);
            fb.value.setError(err, model+'.import');
            throw err;
        } finally {
            fb.value.finishLoading(model+'.import');
        }
    };

    const getCategories = async () => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const response = await ProductService.getCategories();
            categories.value = response;
            fb.value.showSuccess(model);
        } catch (err) {
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const productList = async () => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const response = await ProductService.getProductList();
            productLists.value = response;
            fb.value.showSuccess(model);
        } catch (err) {
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const searchProducts = async (query) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const response = await ProductService.searchProducts(query);
            fb.value.showSuccess(model);
            return response;
        } catch (err) {
            fb.value.setError(err, model);
            return [];
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const searchProjects = async (query) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const response = await ProductService.searchProjects(query);
            fb.value.showSuccess(model);
            return response;
        } catch (err) {
            fb.value.setError(err, model);
            return [];
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const searchResources = async (query) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
    
        try {
            const response = await ProductService.searchResources(query);
            fb.value.showSuccess(model);
            return response;
        } catch (err) {
            fb.value.setError(err, model);
            return [];
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const searchProductVariants = async (query) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const response = await ProductService.searchProductVariants(query);
            fb.value.showSuccess(model);
            return response;
        } catch (err) {
            fb.value.setError(err, model);
            return [];
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const searchDigitalAssets = async (query) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const response = await ProductService.searchDigitalAssets(query);
            fb.value.showSuccess(model);
            return response.map(asset => new DigitalAsset(asset));
        } catch (err) {
            fb.value.setError(err, model);
            return [];
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const getOptionList = async () => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const response = await ProductService.getOptionList();
            const data = response.map(item => ({
                ...item,
                type: JSON.parse(item.type)
            }));
            fb.value.showSuccess(model);
            return data;
        } catch (err) {
            fb.value.setError(err, model);
            return [];
        }
    }

    const uploadProductImages = async (files, property, productId) => {
        fb.value.clearError('media.files.upload');
        fb.value.removeSuccess('media.files.upload');
        fb.value.startLoading('media.files.upload');
        try {
            const response = await ProductService.uploadProductImages(files, property, productId);
            console.log('response', response);
            response.files = response.files.map(file => {
                if(!file?.ObjectURL && file?.file && typeof file.file === 'string') {
                    file = JSON.parse(file.file);
                }
                // Create the image object
                const imageObject = new ProductImage(file);
                
                // Make sure the image path is fully qualified
                if (file.objectURL) {
                    imageObject.objectURL = mediaUrl(file.objectURL);
                }
                console.log(imageObject);
                return imageObject;
            });
            fb.value.showSuccess('Files uploaded successfully', model+'.files.upload.'+property);
            console.log('response.files', response.files);
            return response.files;
        } catch (err) {
            fb.value.setError(err, 'media.files.upload');
            throw err;
        } finally {
            fb.value.finishLoading('media.files.upload');
        }
    };

    const deleteProductImage = async (imageId) => {
        fb.value.clearError(model+'.delete-image');
        fb.value.removeSuccess(model+'.delete-image');
        fb.value.startLoading(model+'.delete-image');
        try {
            await ProductService.deleteProductImage(imageId);
            product.value.images = product.value.images.filter(img => img.product_image_id !== imageId);
            fb.value.showSuccess(model+'.delete-image');
        } catch (err) {
            fb.value.setError(err, model+'.delete-image');
        } finally {
            fb.value.finishLoading(model+'.delete-image');
        }
    };
    const deleteProductDownload = async (design_resource_document_id) => {
        fb.value.clearError(model+'.delete-download');
        fb.value.removeSuccess(model+'.delete-download');
        fb.value.startLoading(model+'.delete-download');
        try {
            await ProductService.deleteProductDownload(design_resource_document_id);
            product.value.downloads = product.value.downloads.filter(download => download.design_resource_document_id !== design_resource_document_id);
            fb.value.showSuccess(model+'.delete-download');
        } catch (err) {
            fb.value.setError(err, model+'.delete-download');
        } finally {
            fb.value.finishLoading(model+'.delete-download');
        }
    };


    const deleteImageByFilePath = async (filepath) => {
        fb.value.clearError('media.files.delete');
        fb.value.removeSuccess('media.files.delete');
        fb.value.startLoading('media.files.delete');
        try {
            const response = await ProductService.deleteImageByFilePath(filepath);
            fb.value.showSuccess('Image deleted successfully');
            return response;
        } catch (err) {
            fb.value.setError(err, 'media.files.delete');
            throw err;
        } finally {
            fb.value.finishLoading('media.files.delete');
        }
    };
    const importProductsImages = async (newImport) => {
        fb.value.clearError(model+'.import');
        fb.value.removeSuccess(model+'.import');
        fb.value.startLoading(model+'.import');
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }

            const response = await ProductService.createProductImport(newImport);
            console.log('Store received response:', response);
            fb.value.showSuccess(model+'.import');
            return response;
        } catch (err) {
            console.error('Import error:', err);
            fb.value.setError(err, model+'.import');
            throw err;
        } finally {
            fb.value.finishLoading(model+'.import');
        }
    };
    const importRelatedProducts = async (newImport) => {
        fb.value.clearError(model+'.import');
        fb.value.removeSuccess(model+'.import');
        fb.value.startLoading(model+'.import');
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }

            const response = await ProductService.createProductImport(newImport);
            console.log('Store received response:', response);
            fb.value.showSuccess(model+'.import');
            return response;
        } catch (err) {
            console.error('Import error:', err);
            fb.value.setError(err, model+'.import');
            throw err;
        } finally {
            fb.value.finishLoading(model+'.import');
        }
    };
    const importProductOptions = async (newImport) => {
        fb.value.clearError(model+'.import');
        fb.value.removeSuccess(model+'.import');
        fb.value.startLoading(model+'.import');
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }

            const response = await ProductService.createProductImport(newImport);
            console.log('Store received response:', response);
            fb.value.showSuccess(model+'.import');
            return response;
        } catch (err) {
            console.error('Import error:', err);
            fb.value.setError(err, model+'.import');
            throw err;
        } finally {
            fb.value.finishLoading(model+'.import');
        }
    };
    const importProductVariants = async (newImport) => {
        fb.value.clearError(model+'.import');
        fb.value.removeSuccess(model+'.import');
        fb.value.startLoading(model+'.import');
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }

            const response = await ProductService.createProductImport(newImport);
            console.log('Store received response:', response);
            fb.value.showSuccess(model+'.import');
            return response;
        } catch (err) {
            console.error('Import error:', err);
            fb.value.setError(err, model+'.import');
            throw err;
        } finally {
            fb.value.finishLoading(model+'.import');
        }
    };
     // product related product delete
     const deleteRelatedProduct = async (productId, relatedProductId) => {
        fb.value.clearError(model+'.delete-related-product');
        fb.value.removeSuccess(model);
        fb.value.startLoading(model+'.delete-related-product');
        try {
            await ProductService.deleteRelatedProduct(productId, relatedProductId);
            fb.value.showSuccess(model+'.delete-related-product');
        }catch (err) {
            fb.value.setError(err, model+'.delete-related-product');
        } finally {
            fb.value.finishLoading(model+'.delete-related-product');
        }
     };

     //Remove product from family
     const removeProductFromFamily = async (productId, relatedProductId) => {
        fb.value.clearError(model+'.remove-product-from-family');
        fb.value.removeSuccess(model);
        fb.value.startLoading(model+'.remove-product-from-family');
        try {
            await ProductService.removeProductFromFamily(productId, relatedProductId);
            fb.value.showSuccess(model+'.remove-product-from-family');
        }catch (err) {
            fb.value.setError(err, model+'.remove-product-from-family');
        } finally {
            fb.value.finishLoading(model+'.remove-product-from-family');
        }
     };
     
     //Remove product from family
     const removeRelatedProject = async (productId, projectId) => {
        fb.value.clearError(model+'.remove-product-from-family');
        fb.value.removeSuccess(model);
        fb.value.startLoading(model+'.remove-product-from-family');
        try {
            await ProductService.removeRelatedProject(productId, projectId);
            fb.value.showSuccess(model+'.remove-product-from-family');
        }catch (err) {
            fb.value.setError(err, model+'.remove-product-from-family');
        } finally {
            fb.value.finishLoading(model+'.remove-product-from-family');
        }
     };

     // Remove related resource
    const removeRelatedResource = async (productId, resourceId) => {
        fb.value.clearError(model + '.remove-related-resource');
        fb.value.removeSuccess(model);
        fb.value.startLoading(model + '.remove-related-resource');

        try {
            await ProductService.removeRelatedResource(productId, resourceId);
            fb.value.showSuccess(model + '.remove-related-resource');
        } catch (err) {
            fb.value.setError(err, model + '.remove-related-resource');
        } finally {
            fb.value.finishLoading(model + '.remove-related-resource');
        }
    };

     // getvariantbyProductId
     const getVariantsOptionsByProductId = async (productId) => {
        fb.value.clearError(model+'.variants-options');
        fb.value.removeSuccess(model+'.variants-options');
        fb.value.startLoading(model+'.variants-options');
        try {
            const response = await ProductService.getVariantsByProductId(productId);
            productVariants.value = response.map(variant => new ProductVariant(variant));
            fb.value.showSuccess(model+'.variants-options');
            return productVariants.value;
        }
        catch (err) {
            fb.value.setError(err, model+'.variants-options');
            throw err;
        } finally {
            fb.value.finishLoading(model+'.variants-options');
        }
     }
     const getVariantById = async (variantId) => {
        fb.value.clearError(model+'.variants-options');
        fb.value.removeSuccess(model+'.variants-options');
        fb.value.startLoading(model+'.variants-options');
        try {
            const response = await ProductService.getVariantById(variantId);
            productVariants.value = response.map(variant => new ProductVariant(variant));
            // console.log('productVariants on store', productVariants.value);
            fb.value.showSuccess(model+'.variants-options');
            return productVariants.value;
        }
        catch (err) {
            fb.value.setError(err, model+'.variants-options');
            throw err;
        } finally {
            fb.value.finishLoading(model+'.variants-options');
        }
     }
     const listTypes = async (query) => {
        fb.value.clearError(model+'.list.types');
        fb.value.removeSuccess(model+'.list.type');
        fb.value.startLoading(model+'.list.type');
        try {
            const response = await ListService.getList('types');
            return response;
        }
        catch (err) {
            fb.value.setError(err, model+'.list.type');
            throw err;
        } finally {
            fb.value.finishLoading(model+'.list.type');
        }
     }

     const deleteProductOptionGroup = async (productOptionGroupId) => {
        fb.value.clearError(model + '.option-group.delete.'+productOptionGroupId);
        fb.value.removeSuccess(model + '.option-group.delete.'+productOptionGroupId);
        fb.value.startLoading(model + '.option-group.delete.'+productOptionGroupId);
        try {
            await ProductOptionGroupService.deleteOptionGroup(productOptionGroupId);
            productOptionGroups.value = productOptionGroups.value.filter(p => p.product_option_group_id !== productOptionGroupId);
            fb.value.showSuccess(model + '.option-group.delete.'+productOptionGroupId);
            return productOptionGroupId;
        } catch (err) {
            fb.value.setError(err, model + '.option-group.delete.'+productOptionGroupId);
            throw err;
        } finally {
            fb.value.finishLoading(model + '.option-group.delete.'+productOptionGroupId);
        }
    };
    // get item variant option by product id and item id
    const getItemVariantOptionByItemId = async (itemId) => {
        fb.value.clearError(model+'.variants-options');
        fb.value.removeSuccess(model+'.variants-options');
        fb.value.startLoading(model+'.variants-options');
        try {
            const response = await ProductService.getItemVariantOptionByItemId(itemId);
            productVariants.value = response.map(variant => new ProductVariant(variant));
            // console.log('productVariants on store', productVariants.value);
            fb.value.showSuccess(model+'.variants-options');
            return productVariants.value;
        }
        catch (err) {
            fb.value.setError(err, model+'.variants-options');
            throw err;
        } finally {
            fb.value.finishLoading(model+'.variants-options');
        }
     }
     // end get item variant option by product id and item id
     // update item variant
     const updateItemVariant = async (data) => {
        console.log('data on updateItemVariant', data.product_variant_id);
        fb.value.clearError(model + '.variant.update.' + data.product_variant_id);
        fb.value.removeSuccess(model + '.variant.update.' + data.product_variant_id);
        fb.value.startLoading(model + '.variant.update.' + data.product_variant_id);
        try {
            const response = await ProductService.updateItemVariant(data);
            productVariants.value = response.map(variant => {
                if(variant.product_variant_id === data.product_variant_id){
                    variant.selected = true;
                }else{
                    variant.selected = false;
                }
                new ProductVariant(variant)
            });
            fb.value.showSuccess(model + '.variant.update.' + data.product_variant_id);
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model + '.variant.update.' + data.product_variant_id);
        } finally {
            fb.value.finishLoading(model + '.variant.update.' + data.product_variant_id);
        }
    };
    // end update item variant

    const deleteItemOption = async (itemOptionId, groupId) => { // send
        fb.value.clearError(model + '.delete.' + itemOptionId);
        fb.value.removeSuccess(model + '.delete.' + itemOptionId);
        fb.value.startLoading(model + '.delete.' + itemOptionId);
        try {
            const response = await ItemOptionService.deleteItemOption(itemOptionId);
            productOptionGroups.value = productOptionGroups.value.filter(p => p.product_option_group_id !== groupId);
            fb.value.showSuccess(model + '.delete.' + itemOptionId);
            return response.data;
        } catch (err) {
            fb.value.setError(err, model + '.delete.' + itemOptionId);
            throw err;
        } finally {
            fb.value.finishLoading(model + '.delete.' + itemOptionId);
        }
    };

    const deleteItemOptionGroup = async (group) => { // send
        console.log('group on deleteItemOption', group);
        fb.value.clearError(model + '.option-group.delete.'+group.product_option_group_id);
        fb.value.removeSuccess(model + '.option-group.delete.'+group.product_option_group_id);
        fb.value.startLoading(model + '.option-group.delete.'+group.product_option_group_id);
        try {
            await ItemOptionService.deleteItemOptionGroup(group);
            productOptionGroups.value = productOptionGroups.value.filter(p => p.product_option_group_id !== group.product_option_group_id);
            fb.value.showSuccess(model + '.option-group.delete.'+group.product_option_group_id);
            return group.product_option_group_id;
        } catch (err) {
            fb.value.setError(err, model + '.option-group.delete.'+group.product_option_group_id);
            throw err;
        } finally {
            fb.value.finishLoading(model + '.option-group.delete.'+group.product_option_group_id);
        }
    };

    const updateProductWayPoints = async (productId, wayPoints) => {
        fb.value.clearError(model+'.wayPoints.'+productId);
        fb.value.removeSuccess(model+'.wayPoints.'+productId);
        fb.value.startLoading(model+'.wayPoints.'+productId);
        try {
            const property = 'product';
            const response = await ProductService.updateProductWayPoints(productId, property, wayPoints);
            
            let updatedWayPoints = [];
            if (Array.isArray(response)) {
                updatedWayPoints = response;
            } else if (response && Array.isArray(response.way_points)) {
                updatedWayPoints = response.way_points;
            } else {
                updatedWayPoints = wayPoints;
            }

            product.value.banner_way_points = updatedWayPoints;
            fb.value.showSuccess(model+'.way-points.'+productId);
            // product.value.banner_way_points = response;
            // fb.value.showSuccess(model+'.wayPoints.'+productId);
            return response;
        } catch (err) {
            fb.value.setError(err, model+'.wayPoints.'+productId);
            throw err;
        } finally {
            fb.value.finishLoading(model+'.wayPoints.'+productId);
        }
    };

    const getWayPointSuggestions = async (query) => {
        fb.value.clearError(model+'.way-points-suggestions.'+query);
        fb.value.removeSuccess(model+'.way-points-suggestions.'+query);
        fb.value.startLoading(model+'.way-points-suggestions.'+query);
        try {
            const response = await ProductService.getWayPointSuggestions(query);

            return response;
        } catch (err) {
            fb.value.setError(err, model+'.way-points-suggestions.'+query);
            throw err;
        } finally {
            fb.value.finishLoading(model+'.way-points-suggestions.'+query);
        }
    };


    const removeProductWayPoint = async (productId, pointId) => {
        fb.value.clearError(model+'.way-points.remove.'+productId);
        fb.value.removeSuccess(model+'.way-points.remove.'+productId);
        fb.value.startLoading(model+'.way-points.remove.'+productId);
        try {
            const response = await ProductService.removeProductWayPoint(productId, pointId);
            if(response.success) {
                fb.value.showSuccess(model+'.way-points.remove.'+productId);
                return response;
            } else {
                fb.value.setError(response.message, model+'.way-points.remove.'+productId);
                throw new Error(response.message);
            }
        }
        catch (err) {
            fb.value.setError(err, model+'.way-points.remove.'+productId);
            throw err;
        } finally {
            fb.value.finishLoading(model+'.way-points.remove.'+productId);
        }
    };

    // gallery image delete 
    const deleteGalleryImage = async (files, property = 'images') => {
        try {
            const productImagIds = files.map(file => file.product_image_id);
            const response = await ProductService.deleteGalleryImage(productImagIds, property);
            return response;
        } catch (err) {
            console.error('Error deleting product image gallery:', err);
            throw err;
        }
    }

    const deleteResources = async (files, property = 'downloads') => {
        try {
            const productResourceIds = files.map(file => file.design_resource_document_id);
            const response = await ProductService.deleteResources(productResourceIds, property);
            return response;
        } catch (err) {
            console.error('Error deleting product image gallery:', err);
            throw err;
        }
    }

    const updateDocumentFormat = async (file) => {
        try {
            const response = await ProductService.updateProductDocumentFormat(file);
            return response;
        } catch (err) {
            console.error('Error updating document format:', err);
            throw err;
        }
    };

    const deleteCertificates = async (files, property = 'certificates', productId) => {
        try {
            const productCertificateIds = files.map(file => file.product_certificate_id);
            const response = await ProductService.deleteCertificates(files, property, productId);
            return response;
        } catch (err) {
            console.error('Error deleting product image gallery:', err);
            throw err;
        }
    }

    return { 
        products, 
        product,
        importExport,
        metaImportExport,
        fb, 
        productNames, 
        categories, 
        productLists, 
        productVariants,
        productOptionGroups,
        productOptions,        
        listProductVariants,
        listProductOptionGroups,
        listProductOptions,
        createProductVariant,
        updateProductVariant,
        uploadProductVariantImage,
        updateItemVariant,
        deleteProductVariant,
        deleteProductOption,
        uploadProductVariantGroupOptionImage,
        deleteProductVariantImage,
        deleteProductVariantOptionImage,
        fetchProducts, 
        fetchProductById, 
        createProduct, 
        updateProduct, 
        deleteProduct, 
        createProductImport,
        importProductsMeta,
        createProductRelationalTableDataImport,
        createProductSetupImport,
        getCategories, 
        productList,
        listTypes,
        searchProducts,
        searchProjects,
        searchResources,
        searchProductVariants,
        searchDigitalAssets,
        getOptionList,
        uploadProductImages,
        deleteImageByFilePath,
        deleteProductImage,
        deleteProductDownload,
        importProductsImages,
        importRelatedProducts,
        importProductsSortOrderByCategory,
        importProductOptions,
        importProductVariants,
        deleteRelatedProduct,
        removeProductFromFamily,
        removeRelatedProject,
        removeRelatedResource,
        getVariantsOptionsByProductId,
        getVariantById,
        deleteProductOptionGroup,
        listItemOptions,
        getItemVariantOptionByItemId,
        deleteItemOption,
        createItemVariant,
        deleteItemOptionGroup,
        updateProductWayPoints,
        getWayPointSuggestions,
        removeProductWayPoint,
        deleteGalleryImage,
        deleteCertificates,
        deleteResources,
        updateDocumentFormat
    };
}); 