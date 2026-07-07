import { IManufacturer } from "@/models/Product";

export const manufacturers: IManufacturer[] = [
  {
    manufacturer_id: 1,
    name: "TechCraft Industries",
    slug: "techcraft-industries",
    image: "techcraft.jpg",
    sort_order: 1
  },
  {
    manufacturer_id: 2,
    name: "Global Innovations Co.",
    slug: "global-innovations",
    image: "global-innovations.jpg",
    sort_order: 2
  },
  {
    manufacturer_id: 3,
    name: "Eastern Manufacturing Ltd.",
    slug: "eastern-manufacturing",
    image: "eastern-mfg.jpg",
    sort_order: 3
  },
  {
    manufacturer_id: 4,
    name: "Nordic Solutions",
    slug: "nordic-solutions",
    image: "nordic-solutions.jpg",
    sort_order: 4
  },
  {
    manufacturer_id: 5,
    name: "Innovative Dynamics",
    slug: "innovative-dynamics",
    image: "innovative-dynamics.jpg",
    sort_order: 5
  }
];

// Helper functions for manufacturer data
export const getManufacturerById = (id: number): IManufacturer | undefined => {
  return manufacturers.find(manufacturer => manufacturer.manufacturer_id === id);
};

export const getManufacturersByName = (name: string): IManufacturer[] => {
  return manufacturers.filter(manufacturer => 
    manufacturer.name.toLowerCase().includes(name.toLowerCase())
  );
};

export const productOptionsColumns = [
  {
    field: 'name',
    header: 'Name',
    type: 'text',
    editable: true,
    width: '100px',
    class: ""
  },
  {
    field: 'type',
    header: 'Type',
    type: 'text',
    editable: true,
    width: '100px',
    class: ""
  },
  {
    field: 'value',
    header: 'Value',
    type: 'text',
    editable: true,
    width: '100px',
    class: ""
  },
  {
    field: 'metadata',
    header: 'Metadata',
    type: 'text',
    editable: true,
    width: '100px',
    class: ""
  },
]

export const productOptions = [
  {
    name: 'Finish Color',
    type: 'text',
    required: true,
    value: 'Value 1',
    textureFile: 'texture.jpg',
    colorHex: '#000000',
    metadata: 'Metadata 1'
  },
  {
    name: 'Edge Color',
    type: 'text',
    required: true,
    value: 'Value 2',
    textureFile: 'texture.jpg',
    colorHex: '#000000',
    metadata: 'Metadata 2'
  },
  {
    name: 'Material Color',
    type: 'text',
    required: true,
    value: 'Value 3',
    textureFile: 'texture.jpg',
    colorHex: '#000000',
    metadata: 'Metadata 3'
  }
];
export const productOptionNames = productOptions.map(option => option.name);
// name
// description
// metadata
// value
// type
export const productAttributeColumns = [
  {
    field: 'name',
    header: 'Name',
    type: 'text',
    editable: true,
    width: '100px',
    class: ""
  },
  {
    field: 'description',
    header: 'Description',
    type: 'text',
    editable: true,
    width: '200px',
    class: "" 
  },
  {
    field: 'metadata',
    header: 'Metadata',
    type: 'text',
    editable: true,
    width: '100px',
    class: ""
  },
  {
    field: 'type',
    header: 'Type',
    type: 'text',
    editable: true,
    width: '100px',
    class: ""
  },
  {
    field: 'value',
    header: 'Value',
    type: 'text',
    editable: true,
    width: '100px',
    class: ""
  }
];

export const productAttributes = [
  {
    name: 'Attribute 1',
    description: 'Description 1',
    metadata: 'Metadata 1',
    type: 'text',
    value: 'Value 1'
  },
  {
    name: 'Attribute 2',
    description: 'Description 2',
    metadata: 'Metadata 2',
    type: 'text',
    value: 'Value 2'
  }
];
// variant
// price
// old_price
// quantity
// stock
// weight
// sku
// barcode

export const productVariantColumns = [
  { field: 'variant', header: 'Variant', type: 'text', editable: true },
  { field: 'variant_price', header: 'Price', type: 'number', editable: true },
  { field: 'product_price', header: 'Old Price', type: 'number', editable: true },
  { field: 'stock', header: 'Stock', type: 'number', editable: true },
  { field: 'weight', header: 'Weight', type: 'number', editable: true, default: 0 },
  { field: 'sku', header: 'SKU', type: 'text', editable: true },
  { field: 'barcode', header: 'Barcode', type: 'text', editable: true }
];
export const productVariantColumns_old = [
  {
    field: 'model',
    header: 'Variant',
    type: 'text',
    editable: true,
    width: '100px',
    class: ""
  },
  {
    field: 'price',
    header: 'Price',
    type: 'text',
    editable: true,
    width: '100px',
    class: ""
  },
  {
    field: 'old_price',
    header: 'Old Price',
    type: 'text',
    editable: true,
    width: '100px',
    class: ""
  },
  {
    field: 'stock_quantity',
    header: 'Quantity',
    type: 'text',
    editable: true,
    width: '100px',
    class: ""
  },
  {
    field: 'track_stock',
    header: 'Stock',
    type: 'text',
    editable: true,
    width: '100px',
    class: ""
  },
  {
    field: 'weight',
    header: 'Weight',
    type: 'text',
    editable: true,
    width: '100px',
    class: ""
  },
  {
    field: 'sku',
    header: 'SKU',
    type: 'text',
    editable: true,
    width: '100px',
    class: ""
  },
  {
    field: 'barcode',
    header: 'Barcode',
    type: 'text',
    editable: true,
    width: '100px',
    class: ""
  }
]

export const productVariants = [
  {
    variant: 'Variant 1',
    price: 100,
    old_price: 100,
    quantity: 100,
    stock: true,
    weight: 100,
    sku: 'SKU 1',
    barcode: 'Barcode 1'
  },
  {
    variant: 'Variant 2',
    price: 100,
    old_price: 100,
    quantity: 100,
    stock: true,
    weight: 100,
    sku: 'SKU 2',
    barcode: 'Barcode 2'
  }
]

