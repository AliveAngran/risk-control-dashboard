'use client';

import React, { useState, useEffect } from 'react';
import { Card, Table, Tabs, Typography, Space, Button, DatePicker, Select, Empty, Spin, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DownloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title } = Typography;
const { RangePicker } = DatePicker;

interface TradeRecord {
  id: number;
  symbol: string;
  exchange: 'Binance' | 'Other';  // 交易所
  orderId: number;
  side: 'BUY' | 'SELL';  // 订单方向
  positionSide: 'LONG' | 'SHORT';  // 持仓方向
  type: string;  // 订单类型
  status: string;  // 订单状态
  price: string;  // 成交价格
  qty: string;  // 成交数量
  quoteQty: string;  // 成交金额
  commission: string;  // 手续费
  commissionAsset: string;  // 手续费资产
  commissionUsdtPrice: string;  // 手续费资产USDT价格
  commissionUsdtAmount: string;  // 手续费USDT金额
  realizedPnl: string;  // 实现盈亏
  time: number;  // 时间戳
  maker: boolean;  // 是否是挂单方
  buyer: boolean;  // 是否是买方
}

const TradePage = () => {
  const [activeTab, setActiveTab] = useState('trades');
  const [loading, setLoading] = useState(true);
  const [tradeData, setTradeData] = useState<TradeRecord[]>([]);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([dayjs().subtract(7, 'day'), dayjs()]);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('ALL');

  // 交易对选项
  const symbolOptions = [
    { label: '全部交易对', value: 'ALL' },
    { label: 'BTC/USDT', value: 'BTCUSDT' },
    { label: 'ETH/USDT', value: 'ETHUSDT' },
  ];

  // 成交表列配置
  const tradeColumns: ColumnsType<TradeRecord> = [
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
      key: 'direction',
      width: 120,
      render: (_, record) => (
        <Space>
          <Tag color={record.side === 'BUY' ? 'green' : 'red'}>
            {record.side}
          </Tag>
          <Tag color={record.positionSide === 'LONG' ? 'blue' : 'orange'}>
            {record.positionSide}
          </Tag>
        </Space>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
    },
    {
      title: '成交价格',
      dataIndex: 'price',
      key: 'price',
      width: 120,
    },
    {
      title: '成交数量',
      dataIndex: 'qty',
      key: 'qty',
      width: 120,
    },
    {
      title: '成交金额',
      dataIndex: 'quoteQty',
      key: 'quoteQty',
      width: 120,
    },
    {
      title: '手续费',
      children: [
        {
          title: '数量',
          dataIndex: 'commission',
          key: 'commission',
          width: 120,
        },
        {
          title: '币种',
          dataIndex: 'commissionAsset',
          key: 'commissionAsset',
          width: 100,
        },
        {
          title: 'USDT价格',
          dataIndex: 'commissionUsdtPrice',
          key: 'commissionUsdtPrice',
          width: 120,
        },
        {
          title: 'USDT金额',
          dataIndex: 'commissionUsdtAmount',
          key: 'commissionUsdtAmount',
          width: 120,
        },
      ],
    },
    {
      title: '实现盈亏',
      dataIndex: 'realizedPnl',
      key: 'realizedPnl',
      width: 120,
      render: (text: string) => {
        const value = parseFloat(text);
        return (
          <span style={{ color: value >= 0 ? '#52c41a' : '#ff4d4f' }}>
            {value >= 0 ? '+' : ''}{text}
          </span>
        );
      },
    },
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
      width: 180,
      render: (time: number) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '角色',
      key: 'role',
      width: 120,
      render: (_, record) => (
        <Tag color={record.maker ? 'blue' : 'purple'}>
          {record.maker ? 'Maker' : 'Taker'}
        </Tag>
      ),
    },
  ];

  // 模拟数据
  const mockTradeData: TradeRecord[] = [
    {
      id: 698759,
      symbol: 'BTCUSDT',
      exchange: 'Binance',
      orderId: 25851813,
      side: 'SELL',
      positionSide: 'SHORT',
      type: 'LIMIT',
      status: 'FILLED',
      price: '7819.01',
      qty: '0.002',
      quoteQty: '15.63802',
      commission: '-0.07819010',
      commissionAsset: 'BNB',
      commissionUsdtPrice: '250.35',
      commissionUsdtAmount: '-19.57',
      realizedPnl: '-0.91539999',
      time: 1569514978020,
      maker: false,
      buyer: false,
    },
    {
      id: 698760,
      symbol: 'BTCUSDT',
      exchange: 'Binance',
      orderId: 25851814,
      side: 'BUY',
      positionSide: 'LONG',
      type: 'MARKET',
      status: 'FILLED',
      price: '7825.35',
      qty: '0.005',
      quoteQty: '39.12675',
      commission: '-0.03912675',
      commissionAsset: 'USDT',
      commissionUsdtPrice: '1',
      commissionUsdtAmount: '-0.03912675',
      realizedPnl: '0.52345',
      time: dayjs().subtract(2, 'hour').valueOf(),
      maker: false,
      buyer: true,
    },
    {
      id: 698761,
      symbol: 'ETHUSDT',
      exchange: 'Binance',
      orderId: 25851815,
      side: 'SELL',
      positionSide: 'SHORT',
      type: 'LIMIT',
      status: 'FILLED',
      price: '2345.67',
      qty: '0.15',
      quoteQty: '351.85050',
      commission: '-0.00135',
      commissionAsset: 'BNB',
      commissionUsdtPrice: '245.78',
      commissionUsdtAmount: '-0.33180',
      realizedPnl: '1.25678',
      time: dayjs().subtract(1, 'hour').valueOf(),
      maker: true,
      buyer: false,
    },
    {
      id: 698762,
      symbol: 'ETHUSDT',
      exchange: 'Other',
      orderId: 25851816,
      side: 'BUY',
      positionSide: 'LONG',
      type: 'MARKET',
      status: 'FILLED',
      price: '2348.92',
      qty: '0.25',
      quoteQty: '587.23000',
      commission: '-0.58723',
      commissionAsset: 'USDT',
      commissionUsdtPrice: '1',
      commissionUsdtAmount: '-0.58723',
      realizedPnl: '-0.75234',
      time: dayjs().subtract(30, 'minute').valueOf(),
      maker: false,
      buyer: true,
    },
    {
      id: 698763,
      symbol: 'BTCUSDT',
      exchange: 'Other',
      orderId: 25851817,
      side: 'BUY',
      positionSide: 'LONG',
      type: 'TRAILING_STOP_MARKET',
      status: 'FILLED',
      price: '7832.45',
      qty: '0.008',
      quoteQty: '62.65960',
      commission: '-0.00024',
      commissionAsset: 'BNB',
      commissionUsdtPrice: '248.92',
      commissionUsdtAmount: '-0.05974',
      realizedPnl: '0.89234',
      time: dayjs().subtract(15, 'minute').valueOf(),
      maker: false,
      buyer: true,
    },
    {
      id: 698764,
      symbol: 'BTCUSDT',
      exchange: 'Binance',
      orderId: 25851818,
      side: 'SELL',
      positionSide: 'SHORT',
      type: 'TAKE_PROFIT_MARKET',
      status: 'FILLED',
      price: '7845.23',
      qty: '0.003',
      quoteQty: '23.53569',
      commission: '-0.02353569',
      commissionAsset: 'USDT',
      commissionUsdtPrice: '1',
      commissionUsdtAmount: '-0.02353569',
      realizedPnl: '1.12453',
      time: dayjs().subtract(5, 'minute').valueOf(),
      maker: false,
      buyer: false,
    },
    {
      id: 698765,
      symbol: 'ETHUSDT',
      exchange: 'Other',
      orderId: 25851819,
      side: 'SELL',
      positionSide: 'SHORT',
      type: 'STOP_MARKET',
      status: 'FILLED',
      price: '2352.18',
      qty: '0.12',
      quoteQty: '282.26160',
      commission: '-0.00108',
      commissionAsset: 'BNB',
      commissionUsdtPrice: '251.45',
      commissionUsdtAmount: '-0.27156',
      realizedPnl: '-0.45678',
      time: dayjs().valueOf(),
      maker: false,
      buyer: false,
    }
  ];

  // 模拟数据更新
  useEffect(() => {
    let isMounted = true;

    const generateData = () => {
      if (!isMounted) return;
      
      setLoading(true);
      
      // 使用选择的日期范围和交易对过滤数据
      const filteredData = mockTradeData.filter(item => {
        const time = dayjs(item.time);
        const inDateRange = time.isAfter(dateRange[0]) && time.isBefore(dateRange[1]);
        const matchSymbol = selectedSymbol === 'ALL' || item.symbol === selectedSymbol;
        return inDateRange && matchSymbol;
      });

      setTradeData(filteredData);
      
      setTimeout(() => {
        if (isMounted) {
          setLoading(false);
        }
      }, 1000);
    };

    generateData();
    const timer = setInterval(generateData, 3000);

    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, [dateRange, selectedSymbol]);

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
              value={selectedSymbol}
              onChange={handleSymbolChange}
              options={symbolOptions}
              style={{ width: 150 }}
            />
            <Button icon={<DownloadOutlined />}>导出记录</Button>
          </Space>
          <Spin spinning={loading}>
            {tradeData.length > 0 ? (
              <Table
                columns={tradeColumns}
                dataSource={tradeData}
                scroll={{ x: 2000 }}
                pagination={{
                  total: 100,
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
          </Spin>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <Title level={4}>交易记录</Title>
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