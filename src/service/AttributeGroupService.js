import AttributeGroup from '@/models/AttributeGroup';
import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_BASE_URL || '') + '/attribute-groups';
const API_URL_IMPORT = (import.meta.env.VITE_API_BASE_URL || '') + '/attribute-groups/import-attribute-groups';

export default class AttributeGroupService {

  static async fetchAttributeGroups() {
    try {
      const response = await axios.get(API_URL);
      console.log('attribute service data:', response.data);

      // Map API data to ProductAttribute instances
      return response.data;
    } catch (error) {
      console.error('Error fetching product attributes:', error);
      throw error;
    }
  }

  static createAttributeGroup(newAttribute) {
      return new Promise((resolve, reject) => {
          axios.post(API_URL, newAttribute, {
              headers: {'Content-Type': 'application/json'}
          })
          .then(response => {
              console.log('rqs ', response);
              resolve(response.data);
          })
          .catch(error => {
              console.error('Error creating showroom:', error);
              reject(error);
          });
      });
  }

  static updateAttributeGroup(updataAttributeGroup) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${updataAttributeGroup.attribute_group_id}`, updataAttributeGroup, {
              headers: {'Content-Type': 'application/json'}
          })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error fetching attribute group:', error);
                reject(error);
            });
        });
    }

  static getAttributeGroupById(id) {
    return new Promise((resolve, reject) => {
      axios.get(`${API_URL}/${id}`)
          .then(response => {
              resolve(response.data);
          })
      .catch(error => {
          console.error('Error fetching attribute group:', error);
          reject(error);
      });
  });
  }

  static deleteAttributeGroup(id) {
    return new Promise((resolve, reject) => {
        axios.delete(`${API_URL}/${id}`)
        .then(response => {
            resolve(response.data);
        })
        .catch(error => {
            console.error('Error deleting showroom:', error);
            reject(error);
        });
    });
  }

  // import attributes from CSV
  static async attributeGroupsImport(fromData) {
    try {
      const response = await axios.post(`${API_URL_IMPORT}`, fromData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error importing product attributes:', error);
      throw error;
    }
  }
}
