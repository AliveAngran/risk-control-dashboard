'use client';

import React, { useState, useEffect } from 'react';
import { Card, Table, Tabs, Typography, Space, Button, DatePicker, Select, Empty, Tag, Row, Col, Statistic } from 'antd';
import { Area, Pie, Column } from '@ant-design/charts';
import type { ColumnsType } from 'antd/es/table';
import { DownloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title } = Typography;
const { RangePicker } = DatePicker;

// 交易记录数据结构
interface TradeRecord {
  id: string;
  uid: string;
  symbol: string;
  exchange: string;
  orderId: string;
  side: 'BUY' | 'SELL';
  positionSide: 'LONG' | 'SHORT' | 'BOTH';
  type: 'MARKET' | 'LIMIT' | 'STOP' | 'TAKE_PROFIT' | 'TRAILING_STOP_MARKET';
  status: 'FILLED' | 'PARTIALLY_FILLED' | 'CANCELED' | 'REJECTED' | 'NEW' | 'EXPIRED';
  price: number;
  qty: number;
  quoteQty: number;
  commission: number;
  commissionAsset: string;
  commissionUsdtPrice: number;
  commissionUsdtAmount: number;
  realizedPnl: number;
  time: number;
  maker: boolean;
  buyer: boolean;
}

interface PnlRecord {
  symbol: string;
  pnl: number;
  uid: string;
}

const TradePage = () => {
  const [activeTab, setActiveTab] = useState('trades');
  const [tradeData, setTradeData] = useState<TradeRecord[]>([]);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([dayjs().subtract(7, 'day'), dayjs()]);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('ALL');
  const [selectedUid, setSelectedUid] = useState<string>('ALL');
  const [statistics, setStatistics] = useState({
    totalTrades: 0,
    totalVolume: 0,
    totalCommission: 0,
    totalPnl: 0,
    makerRatio: 0,
    winRate: 0,
  });
  const [chartData, setChartData] = useState<{
    pnlTrend: { time: string; value: number; uid: string }[];
    volumeTrend: { time: string; value: number; uid: string }[];
    symbolDistribution: { symbol: string; value: number; uid: string }[];
    pnlDistribution: { range: string; count: number; uid: string }[];
    hourlyDistribution: { hour: string; count: number; uid: string }[];
    sideDistribution: { side: string; count: number; uid: string }[];
    exchangeDistribution: { exchange: string; count: number; uid: string }[];
    makerTakerDistribution: { type: string; count: number; uid: string }[];
    pnlBySymbol: { symbol: string; pnl: number; uid: string }[];
    volumeBySymbol: { symbol: string; volume: number; uid: string }[];
    pnlByExchange: { exchange: string; pnl: number; uid: string }[];
    volumeByExchange: { exchange: string; volume: number; uid: string }[];
  }>({
    pnlTrend: [],
    volumeTrend: [],
    symbolDistribution: [],
    pnlDistribution: [],
    hourlyDistribution: [],
    sideDistribution: [],
    exchangeDistribution: [],
    makerTakerDistribution: [],
    pnlBySymbol: [],
    volumeBySymbol: [],
    pnlByExchange: [],
    volumeByExchange: [],
  });

  // 交易对选项
  const symbolOptions = [
    { label: '全部交易对', value: 'ALL' },
    { label: 'BTC/USDT', value: 'BTCUSDT' },
    { label: 'ETH/USDT', value: 'ETHUSDT' },
  ];

  // UID选项
  const uidOptions = [
    { label: '全部账户', value: 'ALL' },
    { label: 'UID: 123456', value: '123456' },
    { label: 'UID: 234567', value: '234567' },
    { label: 'UID: 345678', value: '345678' },
  ];

  // 成交表列配置
  const tradeColumns: ColumnsType<TradeRecord> = [
    {
      title: 'UID',
      dataIndex: 'uid',
      key: 'uid',
      width: 100,
    },
    {
      title: '交易所',
      dataIndex: 'exchange',
      key: 'exchange',
      width: 100,
    },
    {
      title: '交易对',
      dataIndex: 'symbol',
      key: 'symbol',
      width: 120,
    },
    {
      title: '方向',
      dataIndex: 'side',
      key: 'side',
      width: 100,
      render: (side: string) => (
        <Tag color={side === 'BUY' ? 'green' : 'red'}>
          {side === 'BUY' ? '买入' : '卖出'}
        </Tag>
      ),
    },
    {
      title: '持仓方向',
      dataIndex: 'positionSide',
      key: 'positionSide',
      width: 100,
      render: (positionSide: string) => {
        const colorMap = {
          LONG: 'green',
          SHORT: 'red',
          BOTH: 'blue',
        };
        const textMap = {
          LONG: '多仓',
          SHORT: '空仓',
          BOTH: '双向',
        };
        return (
          <Tag color={colorMap[positionSide as keyof typeof colorMap]}>
            {textMap[positionSide as keyof typeof textMap]}
          </Tag>
        );
      },
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 150,
      render: (type: string) => {
        const typeMap = {
          MARKET: '市价',
          LIMIT: '限价',
          STOP: '止损',
          TAKE_PROFIT: '止盈',
          TRAILING_STOP_MARKET: '追踪止损',
        };
        return typeMap[type as keyof typeof typeMap];
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => {
        const colorMap = {
          FILLED: 'green',
          PARTIALLY_FILLED: 'processing',
          CANCELED: 'default',
          REJECTED: 'error',
          NEW: 'warning',
          EXPIRED: 'default',
        };
        const textMap = {
          FILLED: '已成交',
          PARTIALLY_FILLED: '部分成交',
          CANCELED: '已取消',
          REJECTED: '已拒绝',
          NEW: '新建',
          EXPIRED: '已过期',
        };
        return (
          <Tag color={colorMap[status as keyof typeof colorMap]}>
            {textMap[status as keyof typeof textMap]}
          </Tag>
        );
      },
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      align: 'right',
      render: (price: number) => price.toFixed(2),
    },
    {
      title: '数量',
      dataIndex: 'qty',
      key: 'qty',
      width: 120,
      align: 'right',
      render: (qty: number) => qty.toFixed(4),
    },
    {
      title: '成交金额',
      dataIndex: 'quoteQty',
      key: 'quoteQty',
      width: 120,
      align: 'right',
      render: (quoteQty: number) => quoteQty.toFixed(2),
    },
    {
      title: '手续费',
      dataIndex: 'commission',
      key: 'commission',
      width: 120,
      align: 'right',
      render: (commission: number, record: TradeRecord) => `${commission.toFixed(4)} ${record.commissionAsset}`,
    },
    {
      title: '手续费(USDT)',
      dataIndex: 'commissionUsdtAmount',
      key: 'commissionUsdtAmount',
      width: 120,
      align: 'right',
      render: (amount: number) => amount.toFixed(2),
    },
    {
      title: '已实现盈亏',
      dataIndex: 'realizedPnl',
      key: 'realizedPnl',
      width: 120,
      align: 'right',
      render: (pnl: number) => (
        <span style={{ color: pnl > 0 ? '#52c41a' : pnl < 0 ? '#f5222d' : 'inherit' }}>
          {pnl.toFixed(2)}
        </span>
      ),
    },
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
      width: 180,
      render: (time: number) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: 'Maker',
      dataIndex: 'maker',
      key: 'maker',
      width: 80,
      render: (maker: boolean) => (
        <Tag color={maker ? 'blue' : 'default'}>
          {maker ? 'Maker' : 'Taker'}
        </Tag>
      ),
    },
  ];

  // 模拟交易记录数据
  const mockTradeData: TradeRecord[] = [
    {
      id: '1',
      uid: '123456',
      symbol: 'BTCUSDT',
      exchange: 'Binance',
      orderId: 'ORDER123',
      side: 'BUY',
      positionSide: 'LONG',
      type: 'MARKET',
      status: 'FILLED',
      price: 45000.00,
      qty: 0.5000,
      quoteQty: 22500.00,
      commission: 0.0005,
      commissionAsset: 'BTC',
      commissionUsdtPrice: 45000.00,
      commissionUsdtAmount: 22.50,
      realizedPnl: 100.00,
      time: dayjs().subtract(1, 'hour').valueOf(),
      maker: true,
      buyer: true,
    },
    {
      id: '2',
      uid: '234567',
      symbol: 'ETHUSDT',
      exchange: 'Binance',
      orderId: 'ORDER456',
      side: 'SELL',
      positionSide: 'SHORT',
      type: 'LIMIT',
      status: 'FILLED',
      price: 2500.00,
      qty: 2.0000,
      quoteQty: 5000.00,
      commission: 0.002,
      commissionAsset: 'ETH',
      commissionUsdtPrice: 2500.00,
      commissionUsdtAmount: 5.00,
      realizedPnl: -50.00,
      time: dayjs().subtract(2, 'hours').valueOf(),
      maker: false,
      buyer: false,
    },
    {
      id: '3',
      uid: '345678',
      symbol: 'BTCUSDT',
      exchange: 'Binance',
      orderId: 'ORDER789',
      side: 'SELL',
      positionSide: 'BOTH',
      type: 'TRAILING_STOP_MARKET',
      status: 'FILLED',
      price: 44800.00,
      qty: 0.2500,
      quoteQty: 11200.00,
      commission: 0.00025,
      commissionAsset: 'BTC',
      commissionUsdtPrice: 44800.00,
      commissionUsdtAmount: 11.20,
      realizedPnl: 75.00,
      time: dayjs().subtract(3, 'hours').valueOf(),
      maker: true,
      buyer: false,
    },
  ];

  // 计算统计数据
  const calculateStatistics = (data: TradeRecord[]) => {
    const totalTrades = data.length;
    const totalVolume = data.reduce((sum, trade) => sum + trade.quoteQty, 0);
    const totalCommission = data.reduce((sum, trade) => sum + trade.commissionUsdtAmount, 0);
    const totalPnl = data.reduce((sum, trade) => sum + trade.realizedPnl, 0);
    const makerCount = data.filter(trade => trade.maker).length;
    const makerRatio = totalTrades > 0 ? (makerCount / totalTrades) * 100 : 0;
    const profitTrades = data.filter(trade => trade.realizedPnl > 0).length;
    const winRate = totalTrades > 0 ? (profitTrades / totalTrades) * 100 : 0;

    setStatistics({
      totalTrades,
      totalVolume,
      totalCommission,
      totalPnl,
      makerRatio,
      winRate,
    });
  };

  // 计算图表数据
  const calculateChartData = (data: TradeRecord[]) => {
    // 按时间和UID聚合的盈亏趋势
    const pnlByTimeAndUid = new Map<string, Map<string, number>>();
    // 按时间和UID聚合的成交量趋势
    const volumeByTimeAndUid = new Map<string, Map<string, number>>();
    // 按交易对和UID聚合的成交量分布
    const volumeBySymbolAndUid = new Map<string, Map<string, number>>();
    // 盈亏分布
    const pnlRangesByUid = new Map<string, Map<string, number>>();
    // 按小时和UID统计交易分布
    const hourlyStatsByUid = new Map<string, Map<string, number>>();
    // 按方向和UID统计交易分布
    const sideStatsByUid = new Map<string, Map<string, number>>();
    // 按交易所和UID统计分布
    const exchangeStatsByUid = new Map<string, Map<string, number>>();
    // 按Maker/Taker和UID统计分布
    const makerTakerStatsByUid = new Map<string, Map<string, number>>();
    // 按交易对和UID统计盈亏
    const pnlBySymbolAndUid = new Map<string, Map<string, number>>();
    // 按交易对和UID统计成交量
    const volumeBySymbolAndUid2 = new Map<string, Map<string, number>>();
    // 按交易所和UID统计盈亏
    const pnlByExchangeAndUid = new Map<string, Map<string, number>>();
    // 按交易所和UID统计成交量
    const volumeByExchangeAndUid = new Map<string, Map<string, number>>();

    data.forEach(trade => {
      const timeKey = dayjs(trade.time).format('YYYY-MM-DD');
      const { uid } = trade;

      // 初始化各个Map
      if (!pnlByTimeAndUid.has(timeKey)) pnlByTimeAndUid.set(timeKey, new Map());
      if (!volumeByTimeAndUid.has(timeKey)) volumeByTimeAndUid.set(timeKey, new Map());
      if (!volumeBySymbolAndUid.has(trade.symbol)) volumeBySymbolAndUid.set(trade.symbol, new Map());
      if (!pnlRangesByUid.has(uid)) pnlRangesByUid.set(uid, new Map());
      if (!hourlyStatsByUid.has(uid)) hourlyStatsByUid.set(uid, new Map());
      if (!sideStatsByUid.has(uid)) sideStatsByUid.set(uid, new Map());
      if (!exchangeStatsByUid.has(uid)) exchangeStatsByUid.set(uid, new Map());
      if (!makerTakerStatsByUid.has(uid)) makerTakerStatsByUid.set(uid, new Map());
      if (!pnlBySymbolAndUid.has(trade.symbol)) pnlBySymbolAndUid.set(trade.symbol, new Map());
      if (!volumeBySymbolAndUid2.has(trade.symbol)) volumeBySymbolAndUid2.set(trade.symbol, new Map());
      if (!pnlByExchangeAndUid.has(trade.exchange)) pnlByExchangeAndUid.set(trade.exchange, new Map());
      if (!volumeByExchangeAndUid.has(trade.exchange)) volumeByExchangeAndUid.set(trade.exchange, new Map());

      // 更新各个统计数据
      const pnlTimeMap = pnlByTimeAndUid.get(timeKey)!;
      pnlTimeMap.set(uid, (pnlTimeMap.get(uid) || 0) + trade.realizedPnl);

      const volumeTimeMap = volumeByTimeAndUid.get(timeKey)!;
      volumeTimeMap.set(uid, (volumeTimeMap.get(uid) || 0) + trade.quoteQty);

      const volumeSymbolMap = volumeBySymbolAndUid.get(trade.symbol)!;
      volumeSymbolMap.set(uid, (volumeSymbolMap.get(uid) || 0) + trade.quoteQty);

      // 统计盈亏分布
      let pnlRange = '';
      if (trade.realizedPnl <= -1000) pnlRange = '<= -1000';
      else if (trade.realizedPnl <= -500) pnlRange = '-1000 ~ -500';
      else if (trade.realizedPnl <= -100) pnlRange = '-500 ~ -100';
      else if (trade.realizedPnl < 0) pnlRange = '-100 ~ 0';
      else if (trade.realizedPnl === 0) pnlRange = '0';
      else if (trade.realizedPnl <= 100) pnlRange = '0 ~ 100';
      else if (trade.realizedPnl <= 500) pnlRange = '100 ~ 500';
      else if (trade.realizedPnl <= 1000) pnlRange = '500 ~ 1000';
      else pnlRange = '>= 1000';

      const pnlRangeMap = pnlRangesByUid.get(uid)!;
      pnlRangeMap.set(pnlRange, (pnlRangeMap.get(pnlRange) || 0) + 1);

      // 统计小时分布
      const hour = dayjs(trade.time).format('HH:00');
      const hourlyMap = hourlyStatsByUid.get(uid)!;
      hourlyMap.set(hour, (hourlyMap.get(hour) || 0) + 1);

      // 统计方向分布
      const sideKey = `${trade.side}-${trade.positionSide}`;
      const sideMap = sideStatsByUid.get(uid)!;
      sideMap.set(sideKey, (sideMap.get(sideKey) || 0) + 1);

      // 统计交易所分布
      const exchangeMap = exchangeStatsByUid.get(uid)!;
      exchangeMap.set(trade.exchange, (exchangeMap.get(trade.exchange) || 0) + 1);

      // 统计Maker/Taker分布
      const makerTakerKey = trade.maker ? 'Maker' : 'Taker';
      const makerTakerMap = makerTakerStatsByUid.get(uid)!;
      makerTakerMap.set(makerTakerKey, (makerTakerMap.get(makerTakerKey) || 0) + 1);

      // 统计交易对盈亏和成交量
      const pnlSymbolMap = pnlBySymbolAndUid.get(trade.symbol)!;
      pnlSymbolMap.set(uid, (pnlSymbolMap.get(uid) || 0) + trade.realizedPnl);

      const volumeSymbolMap2 = volumeBySymbolAndUid2.get(trade.symbol)!;
      volumeSymbolMap2.set(uid, (volumeSymbolMap2.get(uid) || 0) + trade.quoteQty);

      // 统计交易所盈亏和成交量
      const pnlExchangeMap = pnlByExchangeAndUid.get(trade.exchange)!;
      pnlExchangeMap.set(uid, (pnlExchangeMap.get(uid) || 0) + trade.realizedPnl);

      const volumeExchangeMap = volumeByExchangeAndUid.get(trade.exchange)!;
      volumeExchangeMap.set(uid, (volumeExchangeMap.get(uid) || 0) + trade.quoteQty);
    });

    // 转换数据格式
    const pnlTrendData: { time: string; value: number; uid: string }[] = [];
    pnlByTimeAndUid.forEach((uidMap, time) => {
      uidMap.forEach((value, uid) => {
        pnlTrendData.push({ time, value, uid });
      });
    });

    const volumeTrendData: { time: string; value: number; uid: string }[] = [];
    volumeByTimeAndUid.forEach((uidMap, time) => {
      uidMap.forEach((value, uid) => {
        volumeTrendData.push({ time, value, uid });
      });
    });

    const symbolDistributionData: { symbol: string; value: number; uid: string }[] = [];
    volumeBySymbolAndUid.forEach((uidMap, symbol) => {
      uidMap.forEach((value, uid) => {
        symbolDistributionData.push({ symbol, value, uid });
      });
    });

    const pnlDistributionData: { range: string; count: number; uid: string }[] = [];
    pnlRangesByUid.forEach((rangeMap, uid) => {
      rangeMap.forEach((count, range) => {
        pnlDistributionData.push({ range, count, uid });
      });
    });

    const hourlyDistributionData: { hour: string; count: number; uid: string }[] = [];
    hourlyStatsByUid.forEach((hourMap, uid) => {
      hourMap.forEach((count, hour) => {
        hourlyDistributionData.push({ hour, count, uid });
      });
    });

    const sideDistributionData: { side: string; count: number; uid: string }[] = [];
    sideStatsByUid.forEach((sideMap, uid) => {
      sideMap.forEach((count, side) => {
        sideDistributionData.push({ side, count, uid });
      });
    });

    const exchangeDistributionData: { exchange: string; count: number; uid: string }[] = [];
    exchangeStatsByUid.forEach((exchangeMap, uid) => {
      exchangeMap.forEach((count, exchange) => {
        exchangeDistributionData.push({ exchange, count, uid });
      });
    });

    const makerTakerDistributionData: { type: string; count: number; uid: string }[] = [];
    makerTakerStatsByUid.forEach((typeMap, uid) => {
      typeMap.forEach((count, type) => {
        makerTakerDistributionData.push({ type, count, uid });
      });
    });

    const pnlBySymbolData: { symbol: string; pnl: number; uid: string }[] = [];
    pnlBySymbolAndUid.forEach((uidMap, symbol) => {
      uidMap.forEach((pnl, uid) => {
        pnlBySymbolData.push({ symbol, pnl, uid });
      });
    });

    const volumeBySymbolData: { symbol: string; volume: number; uid: string }[] = [];
    volumeBySymbolAndUid2.forEach((uidMap, symbol) => {
      uidMap.forEach((volume, uid) => {
        volumeBySymbolData.push({ symbol, volume, uid });
      });
    });

    const pnlByExchangeData: { exchange: string; pnl: number; uid: string }[] = [];
    pnlByExchangeAndUid.forEach((uidMap, exchange) => {
      uidMap.forEach((pnl, uid) => {
        pnlByExchangeData.push({ exchange, pnl, uid });
      });
    });

    const volumeByExchangeData: { exchange: string; volume: number; uid: string }[] = [];
    volumeByExchangeAndUid.forEach((uidMap, exchange) => {
      uidMap.forEach((volume, uid) => {
        volumeByExchangeData.push({ exchange, volume, uid });
      });
    });

    setChartData({
      pnlTrend: pnlTrendData.sort((a, b) => a.time.localeCompare(b.time)),
      volumeTrend: volumeTrendData.sort((a, b) => a.time.localeCompare(b.time)),
      symbolDistribution: symbolDistributionData,
      pnlDistribution: pnlDistributionData,
      hourlyDistribution: hourlyDistributionData.sort((a, b) => a.hour.localeCompare(b.hour)),
      sideDistribution: sideDistributionData,
      exchangeDistribution: exchangeDistributionData,
      makerTakerDistribution: makerTakerDistributionData,
      pnlBySymbol: pnlBySymbolData.sort((a, b) => b.pnl - a.pnl),
      volumeBySymbol: volumeBySymbolData.sort((a, b) => b.volume - a.volume),
      pnlByExchange: pnlByExchangeData.sort((a, b) => b.pnl - a.pnl),
      volumeByExchange: volumeByExchangeData.sort((a, b) => b.volume - a.volume),
    });
  };

  // 更新useEffect
  useEffect(() => {
    let isMounted = true;

    const generateData = () => {
      if (!isMounted) return;
      
      // 使用选择的日期范围、交易对和UID过滤数据
      const filteredData = mockTradeData.filter(item => {
        const time = dayjs(item.time);
        const inDateRange = time.isAfter(dateRange[0]) && time.isBefore(dateRange[1]);
        const matchSymbol = selectedSymbol === 'ALL' || item.symbol === selectedSymbol;
        const matchUid = selectedUid === 'ALL' || item.uid === selectedUid;
        return inDateRange && matchSymbol && matchUid;
      });

      setTradeData(filteredData);
      calculateStatistics(filteredData);
      calculateChartData(filteredData);
    };

    generateData();
    const timer = setInterval(generateData, 3000);

    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, [dateRange, selectedSymbol, selectedUid]);

  // 处理日期范围选择
  const handleDateRangeChange = (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
    if (dates && dates[0] && dates[1]) {
      setDateRange([dates[0], dates[1]]);
    }
  };

  // 处理交易对选择
  const handleSymbolChange = (value: string) => {
    setSelectedSymbol(value);
  };

  // 处理UID选择
  const handleUidChange = (value: string) => {
    setSelectedUid(value);
  };

  // 图表配置
  const areaConfig = {
    data: chartData.pnlTrend,
    xField: 'time',
    yField: 'value',
    seriesField: 'uid',
    xAxis: {
      range: [0, 1],
      label: {
        style: {
          fill: '#fff',
        },
      },
    },
    yAxis: {
      label: {
        style: {
          fill: '#fff',
        },
      },
    },
    legend: {
      position: 'top-right',
      itemName: {
        style: {
          fill: '#fff',
        },
      },
    },
    tooltip: {
      domStyles: {
        'g2-tooltip': {
          backgroundColor: 'rgba(0,0,0,0.8)',
          color: '#fff',
        },
      },
    },
    areaStyle: () => {
      return {
        fill: 'l(270) 0:#1890ff 1:rgba(24,144,255,0.1)',
      };
    },
  };

  const volumeConfig = {
    ...areaConfig,
    data: chartData.volumeTrend,
  };

  const pieConfig = {
    data: chartData.symbolDistribution,
    angleField: 'value',
    colorField: 'symbol',
    seriesField: 'uid',
    radius: 0.8,
    label: {
      type: 'outer',
      style: {
        fill: '#fff',
      },
    },
    legend: {
      position: 'right',
      itemName: {
        style: {
          fill: '#fff',
        },
      },
    },
    tooltip: {
      domStyles: {
        'g2-tooltip': {
          backgroundColor: 'rgba(0,0,0,0.8)',
          color: '#fff',
        },
      },
    },
  };

  const columnConfig = {
    data: chartData.pnlDistribution,
    xField: 'range',
    yField: 'count',
    seriesField: 'uid',
    isGroup: true,
    xAxis: {
      label: {
        style: {
          fill: '#fff',
        },
      },
    },
    yAxis: {
      label: {
        style: {
          fill: '#fff',
        },
      },
    },
    legend: {
      position: 'top-right',
      itemName: {
        style: {
          fill: '#fff',
        },
      },
    },
    tooltip: {
      domStyles: {
        'g2-tooltip': {
          backgroundColor: 'rgba(0,0,0,0.8)',
          color: '#fff',
        },
      },
    },
  };

  const hourlyConfig = {
    data: chartData.hourlyDistribution,
    xField: 'hour',
    yField: 'count',
    seriesField: 'uid',
    isGroup: true,
    xAxis: {
      label: {
        style: {
          fill: '#fff',
        },
      },
    },
    yAxis: {
      label: {
        style: {
          fill: '#fff',
        },
      },
    },
    legend: {
      position: 'top-right',
      itemName: {
        style: {
          fill: '#fff',
        },
      },
    },
    tooltip: {
      domStyles: {
        'g2-tooltip': {
          backgroundColor: 'rgba(0,0,0,0.8)',
          color: '#fff',
        },
      },
    },
  };

  const sideConfig = {
    data: chartData.sideDistribution,
    angleField: 'count',
    colorField: 'side',
    seriesField: 'uid',
    radius: 0.8,
    label: {
      type: 'outer',
      style: {
        fill: '#fff',
      },
    },
    legend: {
      position: 'right',
      itemName: {
        style: {
          fill: '#fff',
        },
      },
    },
    tooltip: {
      domStyles: {
        'g2-tooltip': {
          backgroundColor: 'rgba(0,0,0,0.8)',
          color: '#fff',
        },
      },
    },
  };

  const exchangeConfig = {
    ...sideConfig,
    data: chartData.exchangeDistribution,
    colorField: 'exchange',
  };

  const makerTakerConfig = {
    ...sideConfig,
    data: chartData.makerTakerDistribution,
    colorField: 'type',
  };

  const pnlBySymbolConfig = {
    data: chartData.pnlBySymbol,
    xField: 'symbol',
    yField: 'pnl',
    seriesField: 'uid',
    isGroup: true,
    xAxis: {
      label: {
        style: {
          fill: '#fff',
        },
      },
    },
    yAxis: {
      label: {
        style: {
          fill: '#fff',
        },
      },
    },
    legend: {
      position: 'top-right',
      itemName: {
        style: {
          fill: '#fff',
        },
      },
    },
    tooltip: {
      domStyles: {
        'g2-tooltip': {
          backgroundColor: 'rgba(0,0,0,0.8)',
          color: '#fff',
        },
      },
    },
    columnStyle: (record: PnlRecord) => {
      return {
        fill: record.pnl >= 0 ? '#3f8600' : '#cf1322',
      };
    },
  };

  const volumeBySymbolConfig = {
    data: chartData.volumeBySymbol,
    xField: 'symbol',
    yField: 'volume',
    seriesField: 'uid',
    isGroup: true,
    xAxis: {
      label: {
        style: {
          fill: '#fff',
        },
      },
    },
    yAxis: {
      label: {
        style: {
          fill: '#fff',
        },
      },
    },
    legend: {
      position: 'top-right',
      itemName: {
        style: {
          fill: '#fff',
        },
      },
    },
    tooltip: {
      domStyles: {
        'g2-tooltip': {
          backgroundColor: 'rgba(0,0,0,0.8)',
          color: '#fff',
        },
      },
    },
  };

  const pnlByExchangeConfig = {
    ...pnlBySymbolConfig,
    data: chartData.pnlByExchange,
    xField: 'exchange',
    yField: 'pnl',
  };

  const volumeByExchangeConfig = {
    ...volumeBySymbolConfig,
    data: chartData.volumeByExchange,
    xField: 'exchange',
    yField: 'volume',
  };

  const tabItems = [
    {
      key: 'trades',
      label: '成交记录',
      children: (
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Space>
            <RangePicker 
              value={dateRange}
              onChange={handleDateRangeChange}
              allowClear={false}
            />
            <Select
              value={selectedUid}
              onChange={handleUidChange}
              options={uidOptions}
              style={{ width: 150 }}
              placeholder="选择UID"
            />
            <Select
              value={selectedSymbol}
              onChange={handleSymbolChange}
              options={symbolOptions}
              style={{ width: 150 }}
              placeholder="选择交易对"
            />
            <Button icon={<DownloadOutlined />}>导出记录</Button>
          </Space>

          {tradeData.length > 0 ? (
            <Table
              columns={tradeColumns}
              dataSource={tradeData}
              scroll={{ x: 2000 }}
              pagination={{
                total: tradeData.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条记录`,
              }}
              bordered
              size="middle"
              rowKey="id"
            />
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="暂无成交记录"
            />
          )}
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <Title level={4}>成交记录</Title>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        type="card"
      />
    </Card>
  );
};

export default TradePage; 