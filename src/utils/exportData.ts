interface ExportOptions {
  filename: string;
  sheets: {
    name: string;
    headers: string[];
    data: Record<string, string | number>[];
  }[];
}

// 将数据转换为CSV格式
const convertToCSV = (headers: string[], data: Record<string, string | number>[]): string => {
  const headerRow = headers.join(',');
  const rows = data.map(item => 
    headers.map(header => {
      const value = item[header] || '';
      // 处理包含逗号的值
      return typeof value === 'string' && value.includes(',') 
        ? `"${value}"`
        : value;
    }).join(',')
  );
  return [headerRow, ...rows].join('\n');
};

// 下载CSV文件
const downloadCSV = (csv: string, filename: string) => {
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// 导出单个表格数据
export const exportTableToCSV = (
  headers: string[],
  data: Record<string, string | number>[],
  filename: string
) => {
  const csv = convertToCSV(headers, data);
  downloadCSV(csv, filename);
};

// 导出多个表格数据（ZIP压缩）
export const exportTablesToZip = async (options: ExportOptions) => {
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();

  options.sheets.forEach(sheet => {
    const csv = convertToCSV(sheet.headers, sheet.data);
    zip.file(`${sheet.name}.csv`, '\ufeff' + csv);
  });

  const content = await zip.generateAsync({ type: 'blob' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(content);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${options.filename}.zip`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// 格式化日期
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}_${hours}${minutes}${seconds}`;
};

// 示例：导出日报数据
export const exportDailyReport = (data: Record<string, string | number>[], date: Date) => {
  const headers = [
    'assets',
    'makerBalance',
    'makerChange',
    'makerNetIn',
    'takerBalance',
    'takerChange',
    'takerNetIn',
    'diff',
    'price',
    'pnl',
  ];

  const filename = `daily_report_${formatDate(date)}`;
  exportTableToCSV(headers, data, filename);
};

// 示例：导出成交记录
export const exportTradeHistory = (
  data: Record<string, string | number>[],
  startDate: Date,
  endDate: Date
) => {
  const headers = [
    'symbol',
    'uid',
    'tradeId',
    'orderId',
    'orderSide',
    'orderType',
    'price',
    'quantity',
    'quoteQty',
    'fee',
    'feeCurrency',
    'time',
  ];

  const filename = `trade_history_${formatDate(startDate)}_${formatDate(endDate)}`;
  exportTableToCSV(headers, data, filename);
};

// 示例：导出完整报表（包含多个表格）
export const exportFullReport = async (
  dailyData: Record<string, string | number>[],
  tradeData: Record<string, string | number>[],
  feeData: Record<string, string | number>[],
  date: Date
) => {
  const options: ExportOptions = {
    filename: `full_report_${formatDate(date)}`,
    sheets: [
      {
        name: 'daily_summary',
        headers: [
          'assets',
          'makerBalance',
          'makerChange',
          'makerNetIn',
          'takerBalance',
          'takerChange',
          'takerNetIn',
          'diff',
          'price',
          'pnl',
        ],
        data: dailyData,
      },
      {
        name: 'trade_history',
        headers: [
          'symbol',
          'uid',
          'tradeId',
          'orderId',
          'orderSide',
          'orderType',
          'price',
          'quantity',
          'quoteQty',
          'fee',
          'feeCurrency',
          'time',
        ],
        data: tradeData,
      },
      {
        name: 'fee_summary',
        headers: [
          'feeAsset',
          'feeAmount',
          'feeAssetPrice',
          'feeUsdtAmount',
          'time',
        ],
        data: feeData,
      },
    ],
  };

  await exportTablesToZip(options);
}; 