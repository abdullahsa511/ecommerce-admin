import axios from 'axios';
import Item from '../models/Item';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/items';
const MEDIA_API_URL = import.meta.env.VITE_API_BASE_URL + '/media';
const ITEM_IMPORT_URL = import.meta.env.VITE_API_BASE_URL + '/items-import';
const DIMENSION_IMPORT_URL = import.meta.env.VITE_API_BASE_URL + '/dimensions-import';

const API_URL_VARIANT = import.meta.env.VITE_API_BASE_URL + '/item-variants';
const API_URL_ITEM_OPTION_GROUPS = import.meta.env.VITE_API_BASE_URL + '/item-option-groups';
const API_URL_ITEMS_SEARCH = import.meta.env.VITE_API_BASE_URL + '/items-list-search';

class ItemService {
    // Get all products
    static getItems(query) {
        return new Promise((resolve, reject) => {
            axios.get(API_URL + '?' + query)
                .then(response => {
                    // console.log('Response data items:', response.data);
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching products:', error);
                    reject(error);
                });
        });
    }

    // Get a single item by ID
    static getItemById(itemId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${itemId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching item by id:', error);
                    reject(error);
                });
        });
    }

    // start variant 
    static createItemVariant(data) {
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

    static getItemVariantByItemId(itemId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL_VARIANT}/${itemId}`)
                .then(response => {
                    // console.log('getVariantsByProductId svc response', response.data);
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching item variants:', error);
                    reject(error);
                });
        });
    }

    // end variant  


    // Create a new item
    static createItem(newItem) {
        return new Promise((resolve, reject) => {

            axios.post(API_URL, newItem, {
                headers: { 'Content-Type': 'application/json' }
            })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating item:', error);
                    reject(error);
                });
        });
    }

    // Update an existing item
    static updateItem(updatedItem) {
        // alert('updateItem');
        console.log('updatedItem', updatedItem);
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${updatedItem.item_id}`, updatedItem, {
                headers: { 'Content-Type': 'application/json' }
            }).then(response => {
                resolve(response.data);
            }).catch(error => {
                console.error('Error updating item:', error);
                reject(error);
            });
        });
    }

    // Delete a product
    static deleteItem(itemId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${itemId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error deleting item:', error);
                    reject(error);
                });
        });
    }

    static getItemList() {
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

    static uploadItemImages(files, property, itemId) {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            for (const file of files) {
                formData.append(file.index.toString(), file.file);
            }
            if (property) {
                formData.append('property', property);
            }

            axios.post(`${API_URL}/${itemId}/upload`, formData, {
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
    static deleteItemImage(imageId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/delete-image/${imageId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error deleting item image:', error);
                    reject(error);
                });
        });
    }

    static deleteImageByFilePath(filepath, property, itemId) {
        return new Promise((resolve, reject) => {

            axios.post(`${API_URL}/delete-by-path/${itemId}`, { path: filepath, property: property })
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

    static importItems(newImport) {
        return new Promise((resolve, reject) => {
            axios.post(ITEM_IMPORT_URL, newImport)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating Item Import:', error);
                    reject(error);
                });
        });
    }
    static importDimensions(newImport) {
        return new Promise((resolve, reject) => {
            axios.post(DIMENSION_IMPORT_URL, newImport)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating Dimension Import:', error);
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

    static getItemVariantOptionByItemId(itemId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL_VARIANT}/${itemId}`)
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
          axios.put(`${API_URL_VARIANT}/${variant.variant_item_id}`, variant, {
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
            axios.post(API_URL_VARIANT, data)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating item variant:', error);
                    reject(error);
                });
        });
    }

    static deleteItemVariant(productVariantId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL_VARIANT}/${productVariantId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error deleting item variant:', error);
                    reject(error);
                });
        });
    }

    static listItemVariants(query, productId) {
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

    static listItemOptionGroups(query, productId) {
        // console.log("this is seach variant groups", query, variantId);
        return new Promise((resolve, reject) => {
            axios.get(API_URL_ITEM_OPTION_GROUPS + '/search?option_group_name=' + query + '&product_id=' + productId)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching product option groups:', error);
                    reject(error);
                });
        });
    }

    static listItems(query, productId) {
        console.log("this is seach items", query, productId);
        return new Promise((resolve, reject) => {
            axios.get(API_URL_ITEMS_SEARCH + '?item_code=' + query + '&product_id=' + productId)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching items:', error);
                    reject(error);
                });
        });
    }
}

export default ItemService; 