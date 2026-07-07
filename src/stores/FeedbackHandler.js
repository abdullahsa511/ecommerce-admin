import { unset } from "lodash";
export default class FeedbackHandler {
  constructor() {
    this.loading = {};
    this.success = {};
    this.errors = {};
    this.status = {};
    this.message = {};
    this.successTime = 2000;
  }
  hasErrors() {
    return Object.keys(this.errors).length;
  }
  renderErrors(type, entity, field) {
    let errors = this.errors[type];
    if (entity) {
      errors = this.errors[type][entity];
    }
    if (field) {
      errors = this.errors[type][entity][field];
    }

    if(errors?.response?.data?.errors
      && errors?.response?.data?.errors?.length > 0
    ){
      errors = errors.response.data.errors;
    }else if(errors?.response?.data?.message){
      errors = errors.response.data.message;
    } else if(errors?.response?.data){
      errors = errors.response.data;
    }else if(errors?.response?.message){
      errors = errors.response.message;
    } else if(errors?.message){
      errors = errors.message;
    } else if(errors?.data?.errors){
      errors = errors.data.errors;
    } else if(errors?.data?.message){
      errors = errors.data.message;
    }
    let list = document.createElement('ul');
    list.classList.add('list-disc', 'list-inside', 'text-red-500');
    if (Array.isArray(errors)) {
      for (let error of errors) {
        let item = document.createElement('li');
        item.textContent = error.join('\n');
        list.appendChild(item);
      }
    } else if (typeof errors === 'object') {
      for (let error in errors) {
        let item = document.createElement('li');
        item.textContent = errors[error].join('\n');
        list.appendChild(item);
      }
    } else{
      let item = document.createElement('li');
      let message = errors;
      // Check if message is an HTML string
      if (/<[a-z][\s\S]*>/i.test(message)) {
        message = "";
        const parser = new DOMParser();
        const doc = parser.parseFromString(errors, 'text/html');
  
        // Find all <strong> tags
        const strongTags = doc.querySelectorAll('strong');
  
        // Loop through and find the one with "Message:"
        strongTags.forEach((strong, index) => {
          if (strong.textContent === 'Message:') {
            // Get the text after this strong tag until the next <br>
            let nextNode = strong.nextSibling;
            while (nextNode && nextNode.nodeName !== 'BR') {
              if (nextNode.nodeType === Node.TEXT_NODE) {
                message += nextNode.textContent.trim();
              }
              nextNode = nextNode.nextSibling;
            }
          }
        });
      }
     
      item.textContent = message;
      list.appendChild(item);
    }
    return list.outerHTML;
  }
  startLoading(type, entity, field) {
    if (entity) {
      this.loading[type] = this.loading[type] || {};
      if (field) {
        this.loading[type][entity] = this.loading[type][entity] || {};
        this.loading[type][entity][field] = true;
      } else {
        this.loading[type][entity] = true;
      }
    } else {
      this.loading[type] = true;
    }
  }
  finishLoading(type, entity, field) {
    if (entity) {
      if (field) {
        unset(this.loading[type][entity], field);
      } else {
        unset(this.loading[type], entity);
      }
    } else {
      unset(this.loading, type);
    }
  }
  showSuccess(type, entity, field, successTime = 0) {
    if (entity) {
      this.success[type] = this.success[type] || {};
      if (field) {
        this.success[type][entity] = this.success[type][entity] || {};
        this.success[type][entity][field] = true;
      } else {
        this.success[type][entity] = true;
      }
    } else {
      this.success[type] = true;
    }
    setTimeout(() => {
      this.removeSuccess(type, entity, field);
    }, successTime??this.successTime);
  }
  removeSuccess(type, entity, field) {
    if (entity) {
      if (field) {
        unset(this.success[type][entity], field);
      } else {
        unset(this.success[type], entity);
      }
    } else {
      unset(this.success, type);
    }
  }
  setMessage(message, type, entity, field) {
    if (entity) {
      this.message[type] = this.message[type] || {};
      if (field) {
        this.message[type][entity] = this.message[type][entity] || {};
        this.message[type][entity][field] = message;
      } else {
        this.message[type][entity] = message;
      }
    } else {
      this.message[type] = message;
    }
    setTimeout(() => {
      this.removeSuccess(type, entity, field);
    }, this.messageTime);
  }
  removeMessage(type, entity, field) {
    if (entity) {
      if (field) {
        unset(this.message[type][entity], field);
      } else {
        unset(this.message[type], entity);
      }
    } else {
      unset(this.message, type);
    }
  }
  setStatus(value, type, entity, field) {
    if (entity) {
      this.status[type] = this.status[type] || {};
      if (field) {
        this.status[type][entity] = this.status[type][entity] || {};
        this.status[type][entity][field] = value;
      } else {
        this.status[type][entity] = value;
      }
    } else {
      this.status[type] = value;
    }
  }
  setError(error, type, entity, field) {
    if (entity) {
      this.errors[type] = this.errors[type] || {};
      if (field) {
        this.errors[type][entity] = this.errors[type][entity] || {};
        this.errors[type][entity][field] = error;
      } else {
        this.errors[type][entity] = error;
      }
    } else {
      this.errors[type] = error;
    }
  }
  setErrorProps(error, type, entity) {
    if (typeof error === 'string') return;
    let obj = this.errors;
    if (type) {
      this.errors[type] = this.errors[type] || {};
      obj = this.errors[type];
      if (entity) {
        this.errors[type][entity] = this.errors[type][entity] || {};
        obj = this.errors[type][entity];
      }
    }
    for (let field in error) {
      obj[field] = error[field].join('\n');
    }
  }
  clearError(type, entity, field) {
    if (entity) {
      if (field) {
        unset(this.errors[type]?.[entity], field);
      } else {
        unset(this.errors[type], entity);
      }
    } else {
      unset(this.errors, type);
    }
  }
  clearFeedback(type, entity, field) {
    if (type) {
      if (entity) {
        if (field) {
          unset(this.errors[type]?.[entity], field);
          unset(this.loading[type]?.[entity], field);
          unset(this.success[type]?.[entity], field);
          unset(this.status[type]?.[entity], field);
          unset(this.message[type]?.[entity], field);
        } else {
          unset(this.errors[type], entity);
          unset(this.loading[type], entity);
          unset(this.success[type], entity);
          unset(this.status[type], entity);
          unset(this.message[type], entity);
        }
      } else {
        unset(this.errors, type);
        unset(this.loading, type);
        unset(this.success, type);
        unset(this.status, type);
        unset(this.message, type);
      }
    } else {
      this.errors = {};
      this.loading = {};
      this.success = {};
      this.status = {};
      this.message = {};
    }
  }
}
