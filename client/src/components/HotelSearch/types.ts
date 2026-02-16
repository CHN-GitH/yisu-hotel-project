// 价格区间选项类型
export type PriceRangeOption = {
  id: string;
  label: string;
  min: number;
  max: number;
};

// 星级选项类型
export type StarOption = {
  id: string;
  label: string;
  desc: string;
  value: number; // 对应starLevels的数值
};

// 筛选结果类型
export type FilterResult = {
  price?: {
    customRange?: [number, number]; // 自定义价格区间
    selectedOption?: PriceRangeOption; // 选中的价格区间选项
  };
  star?: StarOption; // 选中的星级选项
};