import { api } from "@/lib/axios";

export type ProductType = "SUBSCRIPTION" | "COMBO" | "MOCK_TEST_SERIES" | "COURSE";
export type StudyPersona = "FULL_TIME_ASPIRANT" | "PART_TIME_ASPIRANT" | "REPEAT_ASPIRANT";


export interface Product {
  id: string;
  name: string;
  description: string;
  type: ProductType;
  price: number;
  discountedPrice: number | null;
  validityDays: number | null;
  isActive: boolean;
  recommendedFor: StudyPersona[];   // personas this product targets
  createdAt: string;
  updatedAt: string;
  items?: ProductItem[];
}

export interface ProductItem {
  id: string;
  productId: string;
  itemType: "MOCK_TEST" | "PRACTICE_SET" | "CHAPTER" | "LESSON";
  itemId: string;
}

export const getProducts = async (): Promise<Product[]> => {
  const { data } = await api.get("/products");
  return data;
};

export const getProductById = async (id: string): Promise<Product> => {
  const { data } = await api.get(`/products/${id}`);
  return data;
};

export const createProduct = async (productData: Partial<Product>): Promise<Product> => {
  const { data } = await api.post("/products", productData);
  return data;
};

export const updateProduct = async (id: string, productData: Partial<Product>): Promise<Product> => {
  const { data } = await api.patch(`/products/${id}`, productData);
  return data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await api.delete(`/products/${id}`);
};

export const addProductItem = async (productId: string, itemData: { itemType: string, itemId: string }): Promise<ProductItem> => {
  const { data } = await api.post(`/products/${productId}/items`, itemData);
  return data;
};

export const removeProductItem = async (productId: string, itemId: string): Promise<void> => {
  await api.delete(`/products/${productId}/items/${itemId}`);
};
