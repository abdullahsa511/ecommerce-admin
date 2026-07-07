import { IVendor } from "@/models/Product";

export const vendors: IVendor[] = [
  {
    vendor_id: 1,
    admin_id: 1,
    name: "TechCraft Industries",
    slug: "techcraft-industries",
    image: "techcraft.jpg",
    sort_order: 1
  },
  {
    vendor_id: 2,
    admin_id: 2,
    name: "Global Innovations Co.",
    slug: "global-innovations",
    image: "global-innovations.jpg",
    sort_order: 2
  },
  {
    vendor_id: 3,
    admin_id: 3,
    name: "Eastern Manufacturing Ltd.",
    slug: "eastern-manufacturing",
    image: "eastern-mfg.jpg",
    sort_order: 3
  },
  {
    vendor_id: 4,
    admin_id: 4,
    name: "Nordic Solutions",
    slug: "nordic-solutions",
    image: "nordic-solutions.jpg",
    sort_order: 4
  },
  {
    vendor_id: 5,
    admin_id: 5,
    name: "Innovative Dynamics",
    slug: "innovative-dynamics",
    image: "innovative-dynamics.jpg",
    sort_order: 5
  }
];

// Helper functions for manufacturer data
export const getVendorById = (id: number): IVendor | undefined => {
  return vendors.find(vendor => vendor.vendor_id === id);
};

export const getVendorsByName = (name: string): IVendor[] => {
  return vendors.filter(vendor => 
    vendor.name.toLowerCase().includes(name.toLowerCase())
  );
};
