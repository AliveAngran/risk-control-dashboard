'use client';

import React, { useState, useEffect } from 'react';
import { Card, Table, Typography, Space, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

interface OrderBookItem {
  price: string;
  amount: string;
  total: string;
  makerOrders: number;
  takerOrders: number;
  timestamp: number;
}

interface OrderBookProps {
  symbol: string;
  depth?: number;
}

const OrderBook: React.FC<OrderBookProps> = ({ symbol, depth = 20 }) => {
  const [asks, setAsks] = useState<OrderBookItem[]>([]);
  const [bids, setBids] = useState<OrderBookItem[]>([]);

  const columns: ColumnsType<OrderBookItem> = [
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      render: (text: string, record: OrderBookItem, index: number) => (
        <span style={{ 
          color: index < depth ? '#ff4d4f' : '#52c41a',
          fontWeight: record.makerOrders > 0 ? 'bold' : 'normal',
        }}>
          {text}
        </span>
      ),
    },
    {
      title: '数量',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
    },
    {
      title: '累计',
      dataIndex: 'total',
      key: 'total',
      width: 120,
    },
    {
      title: '订单分布',
      key: 'orders',
      width: 200,
      render: (_, record) => (
        <Space>
          {record.makerOrders > 0 && (
            <Tag color="blue">Maker: {record.makerOrders}</Tag>
          )}
          {record.takerOrders > 0 && (
            <Tag color="orange">Taker: {record.takerOrders}</Tag>
          )}
        </Space>
      ),
    },
  ];

  // 模拟数据更新
  useEffect(() => {
    let isMounted = true;

    const generateOrderBook = () => {
      if (!isMounted) return;

      const basePrice = 42000;
      const timestamp = Date.now();

      const mockAsks: OrderBookItem[] = Array.from({ length: depth }, (_, i) => ({
        price: (basePrice + (i + 1) * 10).toFixed(2),
        amount: (Math.random() * 2).toFixed(4),
        total: ((Math.random() * 2) * (i + 1)).toFixed(4),
        makerOrders: Math.random() > 0.7 ? Math.floor(Math.random() * 5) : 0,
        takerOrders: Math.random() > 0.7 ? Math.floor(Math.random() * 5) : 0,
        timestamp,
      }));

      const mockBids: OrderBookItem[] = Array.from({ length: depth }, (_, i) => ({
        price: (basePrice - (i + 1) * 10).toFixed(2),
        amount: (Math.random() * 2).toFixed(4),
        total: ((Math.random() * 2) * (i + 1)).toFixed(4),
        makerOrders: Math.random() > 0.7 ? Math.floor(Math.random() * 5) : 0,
        takerOrders: Math.random() > 0.7 ? Math.floor(Math.random() * 5) : 0,
        timestamp,
      }));

      if (isMounted) {
        setAsks(mockAsks);
        setBids(mockBids);
      }
    };

    generateOrderBook();
    const timer = setInterval(generateOrderBook, 3000);

    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, [depth]);

  return (
    <Card>
      <Title level={5}>{symbol} 订单薄</Title>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Table
          columns={columns}
          dataSource={asks}
          pagination={false}
          size="small"
          bordered
          rowKey={(record) => `${record.price}-${record.timestamp}`}
          title={() => (
            <div style={{ color: '#ff4d4f', fontWeight: 'bold' }}>卖盘</div>
          )}
        />
        <Table
          columns={columns}
          dataSource={bids}
          pagination={false}
          size="small"
          bordered
          rowKey={(record) => `${record.price}-${record.timestamp}`}
          title={() => (
            <div style={{ color: '#52c41a', fontWeight: 'bold' }}>买盘</div>
          )}
        />
      </Space>
    </Card>
  );
};

export default OrderBook; 