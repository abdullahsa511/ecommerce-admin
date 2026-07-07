import axios from 'axios';
import Product from '../models/Product';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/products';
const API_URL_WAY_POINTS = import.meta.env.VITE_API_BASE_URL + '/projects/update-way-points';
const API_URL_CATEGORIES = import.meta.env.VITE_API_BASE_URL + '/products-categories';
const API_URL_PRODUCT_LIST = import.meta.env.VITE_API_BASE_URL + '/products-list';
const API_URL_RELATED_SEARCH = import.meta.env.VITE_API_BASE_URL + '/products-related-search';
const API_URL_RELATED_PROJECT_SEARCH = import.meta.env.VITE_API_BASE_URL + '/products-related-project-search';
const API_URL_RELATED_RESOURCE_SEARCH = import.meta.env.VITE_API_BASE_URL + '/products-related-resource-search';
const API_URL_VARIANT_SEARCH = import.meta.env.VITE_API_BASE_URL + '/products-variant-search';
const API_URL_DIGITAL_ASSETS = import.meta.env.VITE_API_BASE_URL + '/digital-asset-search';
const API_URL_OPTION_LIST = import.meta.env.VITE_API_BASE_URL + '/product-options';
const MEDIA_API_URL = import.meta.env.VITE_API_BASE_URL + '/media';
const PRODUCT_IMPORT_URL = import.meta.env.VITE_API_BASE_URL + '/products-import';

// http://localhost:8089/api/variants/search?variant_name=bow&product_id=185

const API_URL_OPTION_GROUPS = import.meta.env.VITE_API_BASE_URL + '/product-option-groups/search?';
const API_URL_PRODUCT_VARIANT = import.meta.env.VITE_API_BASE_URL + '/product-variant';
const API_URL_VARIANT = import.meta.env.VITE_API_BASE_URL + '/variants';


const API_URL_PRODUCT_OPTION_GROUP_ID = (import.meta.env.VITE_API_BASE_URL || '') + '/product-option-groups';
const API_URL_PRODUCT_OPTION_ID = (import.meta.env.VITE_API_BASE_URL || '') + '/product-options/detail';
// ITEM
const API_URL_ITEM_OPTIONS = import.meta.env.VITE_API_BASE_URL + '/item-variant-option'; //item-variant-option/search
const API_URL_ITEM_VARIANTS = import.meta.env.VITE_API_BASE_URL + '/item-variants';
const API_URL_WAY_POINT_SUGGESTIONS = import.meta.env.VITE_API_BASE_URL + '/product-search-for-waypoints';

const vv = [
    {
        product_variant_id: 1,
        product_id: 1,
        variant_name: 'Variant 1',
        variant_code: 'V001',
        variant_description: 'This is variant 1',
        sort_order: 1,
        active_status: true,
    },
    {
        product_variant_id: 2,
        product_id: 1,
        variant_name: 'Variant 2',
        variant_code: 'V002',
        variant_description: 'This is variant 2',
        sort_order: 2,
        active_status: true,
    },
    {
        product_variant_id: 3,
        product_id: 1,
        variant_name: 'Variant 3',
        variant_code: 'V003',
        variant_description: 'This is variant 3',
        sort_order: 3,
        active_status: true,
    }
]

class ProductService {
    // Get all products
    static getProducts() {
        return new Promise((resolve, reject) => {
            axios.get(API_URL)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching products:', error);
                    reject(error);
                });
        });
    }


    // ====================== start product variant section ======================
    static listVariants(query, productId) {
        // return vv;
        return new Promise((resolve, reject) => {
            axios.get(API_URL_VARIANT + '/search?product_id=' + productId + '&variant_name=' + query)
                .then(response => {
                    resolve(response);
                })
                .catch(error => {
                    console.error('Error fetching product variants:', error);
                    reject(error);
                });
        });
        // return vv;

    }

    static listVariantGroups(query, productId) {
        // console.log("this is seach variant groups", query, variantId);
        return new Promise((resolve, reject) => {
            axios.get(API_URL_OPTION_GROUPS + 'option_group_name=' + query + '&product_id=' + productId)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching product option groups:', error);
                    reject(error);
                });
        });
    }

    static listVariantGroupOptions(query, productId) {
        console.log("this is seach variant group options", query, productId);
        return new Promise((resolve, reject) => {


            axios.get(API_URL_OPTION_LIST + '/search?option_name=' + query + '&product_id=' + productId)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching product options:', error);
                    reject(error);
                });
        });
    }

    static listItemOptions(query, productId) {
        console.log("this is seach item options", query, productId);
        return new Promise((resolve, reject) => {
            axios.get(API_URL_ITEM_OPTIONS + '/search?option_name=' + query + '&product_id=' + productId)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching item options:', error);
                    reject(error);
                });
        });
    }

    static createProductVariant(data) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL_VARIANT, data)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating product variant:', error);
                    reject(error);
                });
        });
    }

    static updateProductVariant(variant) {
        return new Promise((resolve, reject) => {
          axios.put(`${API_URL_VARIANT}/${variant.product_variant_id}`, variant, {
            headers: {'Content-Type': 'application/json'}
          })
          .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error updating variant:', error);
                reject(error);
            });
        });
    }
    static uploadProductVariantImage(files, productVariantId) {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            for (const file of files) {
                formData.append(file.index.toString(), file.file);
            }

            axios.post(`${API_URL_VARIANT}/${productVariantId}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error uploading images:', error);
                    reject(error);
                });
        });
    }

    
    static deleteProductVariant(productVariantId) {

        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL_VARIANT}/${productVariantId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error deleting product variant:', error);
                    reject(error);
                });
        });
    }

    static deleteProductVariantImage(productVariantId) {

        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL_VARIANT}/delete-image/${productVariantId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error deleting product variant:', error);
                    reject(error);
                });
        });
    }

    static deleteProductVariantOptionImage(productVariantId) {

        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL_VARIANT}/delete-option-image/${productVariantId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error deleting product variant:', error);
                    reject(error);
                });
        });
    }

    // ====================== end product variant section ======================


    // ====================== start product option group section ======================
    static async getProductOptionGroupById(id) {
        try {
          const response = await axios.get(`${API_URL_PRODUCT_OPTION_GROUP_ID}/${id}`);
          return response.data;
        } catch (error) {
          console.error('Error fetching product option group:', error);
          throw error;
        }
      }  
    // ====================== end product option group section ======================



    // ====================== start product option section ======================
    static async getProductOptionById(id) {
        try {
          const response = await axios.get(`${API_URL_PRODUCT_OPTION_ID}/${id}`);
          return response.data;
        } catch (error) {
          console.error('Error fetching product option:', error);
          throw error;
        }
      }  
    // ====================== end product option section ======================




    // Get a single product by ID
    static getProductById(productId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${productId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching product:', error);
                    reject(error);
                });
        });
    }

    // Create a new product
    static createProduct(newProduct) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL, { product: newProduct }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating product:', error);
                    reject(error);
                });
        });
    }

    // Update an existing product
    static updateProduct(updatedProduct) {
        console.log('updatedProductservice', updatedProduct);
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${updatedProduct.product_id}`, { product: updatedProduct }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error updating product:', error);
                    reject(error);
                });
        });
    }

    // Delete a product
    static deleteProduct(productId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${productId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error deleting product:', error);
                    reject(error);
                });
        });
    }

    static getCategories() {
        return new Promise((resolve, reject) => {
            axios.get(API_URL_CATEGORIES)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    return reject(error);
                });
        });
    }

    static getProductList() {
        return new Promise((resolve, reject) => {
            axios.get(API_URL_PRODUCT_LIST)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    return reject(error);
                });
        });
    }

    static searchProducts(query) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL_RELATED_SEARCH,
                { search: query },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error searching products:', error);
                    reject(error);
                });
        });
    }

    static searchProjects(query) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL_RELATED_PROJECT_SEARCH,
                { search: query },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error searching products:', error);
                    reject(error);
                });
        });
    }

    static searchResources(query) {
        return new Promise((resolve, reject) => {
            axios.post(
                API_URL_RELATED_RESOURCE_SEARCH,
                { search: query },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error searching resources:', error);
                reject(error);
            });
        });
    }
    
    static searchProductVariants(query, productId) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL_VARIANT_SEARCH,
                { variant_name: query, product_id: productId },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error searching products:', error);
                    reject(error);
                });
        });
    }

    static searchDigitalAssets(query) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL_DIGITAL_ASSETS, { search: query }, {
                headers: { 'Content-Type': 'application/json' }
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error searching digital assets:', error);
                    reject(error);
                });
        });
    }

    static getOptionList() {
        return new Promise((resolve, reject) => {
            axios.get(API_URL_OPTION_LIST)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    return reject(error);
                });
        });
    }

    static uploadProductImages(files, property, productId) {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            for (const file of files) {
                formData.append(file.index.toString(), file.file);
            }
            if (property) {
                formData.append('property', property);
            }

            axios.post(`${API_URL}/${productId}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error uploading images:', error);
                    reject(error);
                });
        });
    }
    static deleteProductImage(imageId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/delete-image/${imageId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error deleting product image:', error);
                    reject(error);
                });
        });
    }

    static deleteImageByFilePath(filepath) {
        return new Promise((resolve, reject) => {

            axios.post(`${MEDIA_API_URL}/delete-by-path`, { path: filepath })
                .then(response => {
                    console.log('Delete response:', response.data);
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error deleting image:', error);
                    reject(error);
                });
        });
    }

    static createProductImport(newImport) {
        return new Promise((resolve, reject) => {
            axios.post(PRODUCT_IMPORT_URL, newImport)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating Product Import:', error);
                    reject(error);
                });
        });
    }
    // Create a product relational tables data import
    static createProductRelationalTableDataImport(newImport, property) {
        const url = this.getImportUrl(property);
        return new Promise((resolve, reject) => {
            axios.post(url, newImport)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error(`Error creating ${property} Import:`, error);
                    reject(error);
                });
        });
    }

    // Helper function to get the correct import URL based on property
    static getImportUrl(property) {
        switch (property) {
            case 'product_related':
                return `${import.meta.env.VITE_API_BASE_URL}/import-products-related`;
            case 'product_attribute':
                return `${import.meta.env.VITE_API_BASE_URL}/import-products-attributes`;
            case 'product_variant':
                return `${import.meta.env.VITE_API_BASE_URL}/import-products-variants`;
            case 'product_option':
                return `${import.meta.env.VITE_API_BASE_URL}/import-products-options`;
            case 'product_image':
                return `${import.meta.env.VITE_API_BASE_URL}/import-products-images`;
            case 'product_to_digital_asset':
                return `${import.meta.env.VITE_API_BASE_URL}/import-products-digital-assets`;
            case 'product_to_taxonomy_item':
                return `${import.meta.env.VITE_API_BASE_URL}/import-products-tags`;
            case 'manufacturer_and_vandor':
                return `${import.meta.env.VITE_API_BASE_URL}/import-manufacturer-vendor`;
            case 'certificate':
                return `${import.meta.env.VITE_API_BASE_URL}/import-product-certificates`;
            case 'related_projects':
                return `${import.meta.env.VITE_API_BASE_URL}/import-product-related-projects`;
            case 'tags_categories_setup':
                return `${import.meta.env.VITE_API_BASE_URL}/import-manufacturer-vendor`;
            case 'attributes_setup':
                return `${import.meta.env.VITE_API_BASE_URL}/import-manufacturer-vendor`;
            case 'option_setup':
                return `${import.meta.env.VITE_API_BASE_URL}/import-manufacturer-vendor`;
            case 'digital_assets_setup':
                return `${import.meta.env.VITE_API_BASE_URL}/import-manufacturer-vendor`;
            default:
                return `${import.meta.env.VITE_API_BASE_URL}/products-import`;
        }
    }

    static importProductsImages(newImport) {
        return new Promise((resolve, reject) => {
            axios.post(PRODUCT_IMPORT_URL, newImport)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating Product Import:', error);
                    reject(error);
                });
        });
    }
    static importProductsDigitalAssets(newImport) {
        return new Promise((resolve, reject) => {
            axios.post(PRODUCT_IMPORT_URL, newImport)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating Product Import:', error);
                    reject(error);
                });
        });
    }
    static importRelatedProducts(newImport) {
        return new Promise((resolve, reject) => {
            axios.post(PRODUCT_IMPORT_URL, newImport)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating Product Import:', error);
                    reject(error);
                });
        });
    }
    static importProductsMeta(formData) {
        return new Promise((resolve, reject) => {
            axios.post(`${import.meta.env.VITE_API_BASE_URL}/import-products-meta`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error importing product meta:', error);
                    reject(error);
                });
        });
    }

    static importProductsSortOrderByCategory(formData) {
        return new Promise((resolve, reject) => {
            axios.post(`${import.meta.env.VITE_API_BASE_URL}/import-products-sort-by-category`, formData)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating Product Import:', error);
                    reject(error);
                });
        });
    }
    static importProductOptions(newImport) {
        return new Promise((resolve, reject) => {
            axios.post(PRODUCT_IMPORT_URL, newImport)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating Product Import:', error);
                    reject(error);
                });
        });
    }
    static importProductVariants(newImport) {
        return new Promise((resolve, reject) => {
            axios.post(PRODUCT_IMPORT_URL, newImport)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating Product Import:', error);
                    reject(error);
                });
        });
    }
    static importProductAttributes(newImport) {
        return new Promise((resolve, reject) => {
            axios.post(PRODUCT_IMPORT_URL, newImport)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating Product Import:', error);
                    reject(error);
                });
        });
    }
    // delete related product
    static deleteRelatedProduct(productId, relatedProductId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/delete-related-product/${productId}/${relatedProductId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error deleting related product:', error);
                    reject(error);
                });
        });
    }
    // delete related product
    static removeProductFromFamily(productId, relatedProductId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/remove-product-from-family/${productId}/${relatedProductId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error removing product from family:', error);
                    reject(error);
                });
        });
    }

    // delete related product
    static removeRelatedProject(productId, projectId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/remove-product-related-project/${productId}/${projectId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error removing product from family:', error);
                    reject(error);
                });
        });
    }

    // get variant by product id
    static getVariantsByProductId(productId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${productId}/variants`)
                .then(response => {
                    // console.log('getVariantsByProductId svc response', response.data);
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching product variants:', error);
                    reject(error);
                });
        });
    }

    static getVariantById(variantId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL_VARIANT}/${variantId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching product variants:', error);
                    reject(error);
                });
        });
    }

    static getItemVariantOptionByItemId(itemId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL_ITEM_VARIANTS}/${itemId}`)
                .then(response => {
                    // console.log('getVariantsByProductId svc response', response.data);
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching product variants:', error);
                    reject(error);
                });
        });
    }

    // update item variant
    static updateItemVariant(variant) {
        return new Promise((resolve, reject) => {
          axios.put(`${API_URL_ITEM_VARIANTS}/${variant.variant_item_id}`, variant, {
            headers: {'Content-Type': 'application/json'}
          })
          .then(response => {
                  resolve(response.data);
              })
              .catch(error => {
                  console.error('Error updating item variant:', error);
                  reject(error);
              });
          });
      }
    // end update item variant

    static createItemVariant(data) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL_ITEM_VARIANTS, data)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating item variant:', error);
                    reject(error);
                });
        });
    }

    static async updateProductWayPoints(productId, property, wayPoints) {
        return new Promise((resolve, reject) => {
            axios.post(`${API_URL_WAY_POINTS}`, {model_id: productId, model_type: property, way_points: wayPoints})
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error updating product way points:', error);
                reject(error);
            });
        });
    }
    static async getWayPointSuggestions(query) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL_WAY_POINT_SUGGESTIONS}?search=${query}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error getting way point suggestions:', error);
                reject(error);
            });
        });
    }

    static async removeProductWayPoint(productId, pointId) {
        return new Promise((resolve, reject) => {
            axios.post(`${API_URL}/remove-way-point`, {product_id: productId, point_id: pointId})
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error removing product way point:', error);
                reject(error);
            });
        });
    }

    static async deleteGalleryImage(productImagIds, property = 'images'){
        return new Promise((resolve, reject) => {
            // send image ids and property
            axios.post(`${API_URL}/gallary-image/delete-by-ids`, { product_image_ids: productImagIds, property: property })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error deleting model documents:', error);
                    reject(error);
                });
        });
    }

    static async deleteResources(productResourceIds, property = 'downloads'){
        return new Promise((resolve, reject) => {
            // send image ids and property
            axios.post(`${API_URL}/gallary-image/delete-by-ids`, { design_resource_document_ids: productResourceIds, property: property })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error deleting model documents:', error);
                    reject(error);
                });
        });
    }

    static async deleteProductDownload(design_resource_document_id){
        return new Promise((resolve, reject) => {
            // send image ids and property
            axios.post(`${API_URL}/delete-download`, { design_resource_document_id: design_resource_document_id })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error deleting model documents:', error);
                    reject(error);
                });
        });
    }

    static async deleteCertificates(files, property = 'images', productId){
        return new Promise((resolve, reject) => {
            // send image ids and property
            axios.post(`${API_URL}/gallary-image/delete-by-ids`, { certificates: files, property: property, product_id: productId})
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error deleting model documents:', error);
                    reject(error);
                });
        });
    }

    static updateProductDocumentFormat(file) {
        return new Promise((resolve, reject) => {
            axios.post(`${API_URL}/update-product-document-format`, {
                design_resource_document_id: file.design_resource_document_id,
                format: file.format,
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error updating product document format:', error);
                    reject(error);
                });
        });
    }
}

export default ProductService; 