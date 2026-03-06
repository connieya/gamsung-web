import type { ProductSort } from "@/features/product/types";

export interface CategoryItem {
  id: number;
  name: string;
  children: CategoryItem[];
}

export interface CategoryTreeResponse {
  categories: CategoryItem[];
}

export interface CategoryProductsParams {
  categoryId: number;
  page: number;
  size: number;
  productSort: ProductSort;
}
