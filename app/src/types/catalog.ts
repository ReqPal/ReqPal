import { Database } from "@/types/supabase.ts";

export type ProductDetail = {
    product_name: string,
    qualification: number;
    comment: string;
}

export type Product = {
    product_id: string;
    product_name: string;
    product_url: string;
}

export type Requirement = {
    requirement_id: string;
    label: string;
    title: string;
    description: string | null;
    products: {
        [product_id: string]: ProductDetail;
    };
}

export type Catalog = {
    catalog_id: string;
    catalog_name: string;
    products: Product[];
    requirements: Requirement[];
    user_id: string;
}

export type CatalogDTO = Database["public"]["Tables"]["catalogs"]["Row"];
export type ProductDTO = Database["public"]["Tables"]["products"]["Row"];
export type RequirementDTO = Database["public"]["Tables"]["requirements"]["Row"];
export type ProductRequirementDTO = Database["public"]["Tables"]["product_requirements"]["Row"];