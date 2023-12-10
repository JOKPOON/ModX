export interface singleProductItems {
  id: number;
  stock: number | undefined;
  price: number | undefined;
  picture?: string[];
  title: string;
  sold: number;
  discount?: number;
  rating?: number;
  desc?: string;
  options?: {
    option_1?: {
      [option: string]: {
        option_2?: {
          [option: string]: {
            stock: number;
            price: number;
          };
        };
        stock: number;
        price: number;
      };
    };
    option_name?: {
      [option: string]: string;
    };
  };
  review?: {
    name: string;
    comment: string;
    created_at?: string;
    rating?: number;
  }[];
}

export interface reviewItems {
  id: number;
  item_id: number;
  title: string;
  total: number;
  picture?: string;
  product_id: number;
  quantity?: number;
  rating: number | null;
  comment?: string;
  is_reviewed?: boolean;
  options: {
    [option: string]: string;
  };
}

export interface ordersItems {
  id: number;
  quantity: number;
  total: number;
  updated_at: string;
  status: string;
  is_reviewed: boolean;
}

export interface userDetails {
  username: string;
  email: string;
}

export interface shippingDetails {
  name?: string;
  tel?: string;
  addr?: string;
  province?: string;
  district?: string;
  sub_dist?: string;
  zip?: string;
}

export interface productItems {
  id: number;
  picture?: string;
  title: string;
  sold: number;
  price: number;
  discount?: number;
}

export interface wishlistItems {
  id: number;
  product_id?: number;
  product_image?: string;
  product_title: string;
  price: number;
}

export interface orderProducts {
  product_id: number;
  quantity: number;
  options?: {
    option_1?: string;
    option_2?: string;
  };
}

export interface cartItems {
  id: number;
  product_id: number;
  product_image?: string;
  product_title: string;
  price: number;
  discount?: number;
  options?: {
    option_1?: string;
    option_2?: string;
  };
  quantity: number;
}
