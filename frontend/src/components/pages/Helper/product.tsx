interface Item {
  stock: number | undefined;
  price: number | undefined;
  picture?: string[];
  name: string;
  sold: number;
  discount?: number;
  rating?: number;
  description?: string;
  options?: {
    [option: string]: {
      [subOption: string]: {
        price: number;
        stock: number;
      };
    };
  };
  option_name?: {
    [key: string]: string;
  };
}

export const Product: Item = {
  picture: [
    "https://image.makewebeasy.net/makeweb/m_1920x0/o3WoPJcHm/content/%E0%B9%80%E0%B8%97%E0%B8%84%E0%B8%99%E0%B8%B4%E0%B8%84%E0%B8%A7%E0%B8%B4%E0%B8%98%E0%B8%B5%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%A5%E0%B8%B7%E0%B8%AD%E0%B8%81%E0%B8%8B%E0%B8%B7%E0%B9%89%E0%B8%AD%E0%B9%80%E0%B8%82%E0%B9%87%E0%B8%A1%E0%B8%82%E0%B8%B1%E0%B8%94%E0%B8%9C%E0%B8%B9%E0%B9%89%E0%B8%8A%E0%B8%B2%E0%B8%A2.jpg",
    "https://shopee.co.th/blog/wp-content/uploads/2019/10/FACTFULNESS-%E0%B8%88%E0%B8%A3%E0%B8%B4%E0%B8%87-%E0%B9%86-%E0%B9%81%E0%B8%A5%E0%B9%89%E0%B8%A7%E0%B9%82%E0%B8%A5%E0%B8%81%E0%B8%94%E0%B8%B5%E0%B8%82%E0%B8%B6%E0%B9%89%E0%B8%99%E0%B8%97%E0%B8%B8%E0%B8%81%E0%B8%A7%E0%B8%B1%E0%B8%99.png",
    "https://shoppo-file.sgp1.cdn.digitaloceanspaces.com/natpopshop/product-images/310960155_477469997675145_5855571439791689059_n.jpeg",
    "https://www.kmutt.ac.th/wp-content/uploads/2020/08/HDR_0001-5-HDR-scaled.jpg",
    "https://steco.kmutt.ac.th/wp-content/uploads/2019/12/KMUTT-Landscape.jpg",
    "https://www.kmutt.ac.th/wp-content/uploads/2020/09/MG_0703-scaled.jpg",
    "https://www.kmutt.ac.th/wp-content/uploads/2020/08/%E0%B8%9A%E0%B8%B2%E0%B8%87%E0%B8%A1%E0%B8%94_%E0%B9%91%E0%B9%98%E0%B9%91%E0%B9%92%E0%B9%92%E0%B9%97_0091.jpg",
  ],
  name: "Female Uniform From KMUTT Fear of Natacha 2nd hand",
  sold: 4500,
  discount: 10,
  rating: 4.5,
  description:
    "Female Uniform From KMUTT Fear of Natacha 2nd hand Female Uniform From KMUTT Fear of Natacha 2nd hand Female Uniform From KMUTT Fear of Natacha 2nd hand Female Uniform From KMUTT Fear of Natacha 2nd hand",
  options: {
    option_1: {
      S: {
        price: 1502,
        stock: 5,
      },
      M: {
        price: 1815,
        stock: 7,
      },
      L: {
        price: 2021,
        stock: 10,
      },
    },
    option_2: {
      Black: {
        price: 1215,
        stock: 5,
      },
      White: {
        price: 1725,
        stock: 10,
      },
      Red: {
        price: 1329,
        stock: 8,
      },
      Blue: {
        price: 23321,
        stock: 15,
      },
      Green: {
        price: 2233,
        stock: 20,
      },
    },
  },
  option_name: {
    option_1: "size",
    option_2: "color",
  },
  price: undefined,
  stock: undefined,
};
