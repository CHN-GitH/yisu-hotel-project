// 价格区间选项类型
export type PriceRangeOption = {
  id: string;
  label: string;
  minPrice: number;
  maxPrice: number;
};

// 星级选项类型
export type StarOption = {
  id: string;
  label: string;
  desc: string;
  value: number;
};

// 筛选结果类型
export type FilterResult = {
  price?: {
    slidedRange?: [number, number] | null;
    selectedOptions?: PriceRangeOption[];
  };
  stars?: StarOption[];
};