'use client';

import React, { useState, useEffect } from 'react';
import { Card, Table, Tabs, Typography, Space, Button, Select, Empty, Spin, Tag, InputNumber, Form, Row, Col } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SendOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;

interface OrderData {
  id: number;
  symbol: string;
  exchange: 'Binance' | 'Other';
  side: 'BUY' | 'SELL';
  positionSide: 'LONG' | 'SHORT';
  type: string;
  price: string;
  origQty: string;
  executedQty: string;
  status: string;
  time: number;
  reduceOnly: boolean;
  workingType: string;
  priceProtect: boolean;
}

interface OrderFormValues {
  symbol: string;
  type: string;
  side: 'BUY' | 'SELL';
  positionSide: 'LONG' | 'SHORT';
  price: number;
  quantity: number;
}

const TradePage = () => {
  const [activeTab, setActiveTab] = useState('current');
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState<OrderData[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('BTCUSDT');
  const [form] = Form.useForm();

  // 交易对选项
  const symbolOptions = [
    { label: 'BTC/USDT', value: 'BTCUSDT' },
    { label: 'ETH/USDT', value: 'ETHUSDT' },
  ];

  // 订单类型选项
  const orderTypes = [
    { label: '限价单', value: 'LIMIT' },
    { label: '市价单', value: 'MARKET' },
    { label: '止损限价单', value: 'STOP' },
    { label: '止损市价单', value: 'STOP_MARKET' },
    { label: '止盈限价单', value: 'TAKE_PROFIT' },
    { label: '止盈市价单', value: 'TAKE_PROFIT_MARKET' },
    { label: '跟踪止损单', value: 'TRAILING_STOP_MARKET' },
  ];

  // 当前订单列配置
  const orderColumns: ColumnsType<OrderData> = [
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
      width: 150,
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      width: 120,
    },
    {
      title: '数量',
      children: [
        {
          title: '原始',
          dataIndex: 'origQty',
          key: 'origQty',
          width: 120,
        },
        {
          title: '已成交',
          dataIndex: 'executedQty',
          key: 'executedQty',
          width: 120,
        },
      ],
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (text: string) => {
        const color = {
          'NEW': 'blue',
          'PARTIALLY_FILLED': 'gold',
          'FILLED': 'green',
          'CANCELED': 'red',
          'EXPIRED': 'gray',
        }[text] || 'default';
        return <Tag color={color}>{text}</Tag>;
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
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Button 
          type="text" 
          danger 
          icon={<DeleteOutlined />}
          disabled={record.status === 'FILLED' || record.status === 'CANCELED'}
        >
          撤单
        </Button>
      ),
    },
  ];

  // 模拟订单数据
  const mockOrderData: OrderData[] = [
    {
      id: 123456,
      symbol: 'BTCUSDT',
      exchange: 'Binance',
      side: 'BUY',
      positionSide: 'LONG',
      type: 'LIMIT',
      price: '7825.35',
      origQty: '0.005',
      executedQty: '0.000',
      status: 'NEW',
      time: dayjs().subtract(5, 'minute').valueOf(),
      reduceOnly: false,
      workingType: 'CONTRACT_PRICE',
      priceProtect: false,
    },
    {
      id: 123457,
      symbol: 'ETHUSDT',
      exchange: 'Binance',
      side: 'SELL',
      positionSide: 'SHORT',
      type: 'STOP_MARKET',
      price: '2345.67',
      origQty: '0.15',
      executedQty: '0.05',
      status: 'PARTIALLY_FILLED',
      time: dayjs().subtract(3, 'minute').valueOf(),
      reduceOnly: true,
      workingType: 'CONTRACT_PRICE',
      priceProtect: true,
    },
    {
      id: 123458,
      symbol: 'BTCUSDT',
      exchange: 'Other',
      side: 'SELL',
      positionSide: 'SHORT',
      type: 'TAKE_PROFIT_MARKET',
      price: '7845.23',
      origQty: '0.003',
      executedQty: '0.003',
      status: 'FILLED',
      time: dayjs().subtract(1, 'minute').valueOf(),
      reduceOnly: false,
      workingType: 'CONTRACT_PRICE',
      priceProtect: false,
    },
    {
      id: 123459,
      symbol: 'ETHUSDT',
      exchange: 'Other',
      side: 'BUY',
      positionSide: 'LONG',
      type: 'TRAILING_STOP_MARKET',
      price: '2352.18',
      origQty: '0.12',
      executedQty: '0.00',
      status: 'CANCELED',
      time: dayjs().valueOf(),
      reduceOnly: false,
      workingType: 'CONTRACT_PRICE',
      priceProtect: true,
    },
  ];

  // 模拟数据更新
  useEffect(() => {
    let isMounted = true;

    const generateData = () => {
      if (!isMounted) return;
      
      setLoading(true);
      
      // 使用选择的交易对过滤数据
      const filteredData = mockOrderData.filter(item => 
        selectedSymbol === 'ALL' || item.symbol === selectedSymbol
      );

      setOrderData(filteredData);
      
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
  }, [selectedSymbol]);

  // 处理交易对选择
  const handleSymbolChange = (value: string) => {
    setSelectedSymbol(value);
    form.setFieldsValue({ symbol: value });
  };

  // 处理下单
  const handlePlaceOrder = (values: OrderFormValues) => {
    console.log('下单参数:', values);
    // 这里添加下单逻辑
  };

  const tabItems = [
    {
      key: 'current',
      label: '当前订单',
      children: (
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Space>
            <Select
              value={selectedSymbol}
              onChange={handleSymbolChange}
              options={symbolOptions}
              style={{ width: 150 }}
            />
          </Space>
          <Spin spinning={loading}>
            {orderData.length > 0 ? (
              <Table
                columns={orderColumns}
                dataSource={orderData}
                scroll={{ x: 1500 }}
                pagination={false}
                bordered
                size="middle"
                rowKey="id"
              />
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="暂无订单"
              />
            )}
          </Spin>
        </Space>
      ),
    },
    {
      key: 'place',
      label: '下单',
      children: (
        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={handlePlaceOrder}
            initialValues={{
              symbol: selectedSymbol,
              type: 'LIMIT',
              side: 'BUY',
              positionSide: 'LONG',
            }}
          >
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="symbol"
                  label="交易对"
                  rules={[{ required: true }]}
                >
                  <Select options={symbolOptions} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="type"
                  label="订单类型"
                  rules={[{ required: true }]}
                >
                  <Select options={orderTypes} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="side"
                  label="交易方向"
                  rules={[{ required: true }]}
                >
                  <Select>
                    <Option value="BUY">买入</Option>
                    <Option value="SELL">卖出</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="positionSide"
                  label="持仓方向"
                  rules={[{ required: true }]}
                >
                  <Select>
                    <Option value="LONG">做多</Option>
                    <Option value="SHORT">做空</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="price"
                  label="价格"
                  rules={[{ required: true }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    precision={2}
                    min={0}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="quantity"
                  label="数量"
                  rules={[{ required: true }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    precision={4}
                    min={0}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item>
                  <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
                    下单
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      ),
    },
  ];

  return (
    <Card>
      <Title level={4}>交易管理</Title>
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