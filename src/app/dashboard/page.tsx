'use client';

import React, { useState, useEffect } from 'react';
import { Card, Table, Row, Col, Typography, Badge, Space, Select, Statistic, Empty, Spin } from 'antd';
import { Area, Pie } from '@ant-design/charts';
import type { ColumnsType } from 'antd/es/table';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import OrderBook from '@/components/OrderBook';
import FeeCalculator from '@/components/FeeCalculator';

const { Title } = Typography;
const { Option } = Select;

interface ChartEvent {
  data: {
    data: AssetDistribution;
  };
}

interface PlotInstance {
  on: (eventName: string, callback: (e: ChartEvent) => void) => void;
}

interface PnLData {
  assets: string;
  makerBalance: string;
  makerNetIn: string;
  takerBalance: string;
  takerNetIn: string;
  diff: string;
  price: string;
  pnl: string;
}

interface ChartData {
  time: string;
  value: number;
  type: string;
}

interface AssetDistribution {
  type: string;
  value: number;
}

const DashboardPage = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('BTC/USDT');
  const [pnlData, setPnlData] = useState<PnLData[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [assetDistribution, setAssetDistribution] = useState<AssetDistribution[]>([]);

  // 表格列配置
  const columns: ColumnsType<PnLData> = [
    {
      title: '币种资产',
      dataIndex: 'assets',
      key: 'assets',
      fixed: 'left',
      width: 100,
    },
    {
      title: 'Maker',
      children: [
        {
          title: '余额',
          dataIndex: 'makerBalance',
          key: 'makerBalance',
          width: 150,
        },
        {
          title: '净流入',
          dataIndex: 'makerNetIn',
          key: 'makerNetIn',
          width: 150,
        },
      ],
    },
    {
      title: 'Taker',
      children: [
        {
          title: '余额',
          dataIndex: 'takerBalance',
          key: 'takerBalance',
          width: 150,
        },
        {
          title: '净流入',
          dataIndex: 'takerNetIn',
          key: 'takerNetIn',
          width: 150,
        },
      ],
    },
    {
      title: '差值',
      dataIndex: 'diff',
      key: 'diff',
      width: 150,
      render: (text: string) => {
        const value = parseFloat(text);
        return (
          <span style={{ color: value >= 0 ? '#52c41a' : '#ff4d4f' }}>
            {text}
          </span>
        );
      },
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      width: 150,
    },
    {
      title: '盈亏',
      dataIndex: 'pnl',
      key: 'pnl',
      width: 150,
      render: (text: string) => {
        const value = parseFloat(text);
        return (
          <span style={{ color: value >= 0 ? '#52c41a' : '#ff4d4f' }}>
            {text}
          </span>
        );
      },
    },
  ];

  // 模拟数据更新
  useEffect(() => {
    const generateData = () => {
      setLoading(true);
      
      // 模拟PnL数据
      const mockData = [
        {
          assets: 'BTC',
          makerBalance: '1.2345',
          makerNetIn: '0.5000',
          takerBalance: '1.3456',
          takerNetIn: '0.6000',
          diff: '-0.0889',
          price: '42000.00',
          pnl: '-3733.80',
        },
        {
          assets: 'ETH',
          makerBalance: '10.2345',
          makerNetIn: '5.0000',
          takerBalance: '11.3456',
          takerNetIn: '6.0000',
          diff: '-0.8889',
          price: '2500.00',
          pnl: '-2222.25',
        },
      ];

      // 模拟图表数据
      const mockChartData = Array.from({ length: 24 }, (_, i) => ({
        time: `${i}:00`,
        value: Math.random() * 2000 - 1000,
        type: 'PnL',
      }));

      // 模拟资产分布数据
      const mockAssetDistribution = [
        { type: 'BTC', value: 45 },
        { type: 'ETH', value: 25 },
        { type: 'USDT', value: 20 },
        { type: 'Others', value: 10 },
      ];

      setPnlData(mockData);
      setChartData(mockChartData);
      setAssetDistribution(mockAssetDistribution);
      setLoading(false);
    };

    generateData();
    const timer = setInterval(generateData, 3000);

    return () => clearInterval(timer);
  }, []);

  const areaConfig = {
    data: chartData,
    xField: 'time',
    yField: 'value',
    seriesField: 'type',
    smooth: true,
    autoFit: true,
    color: '#1890ff',
    xAxis: {
      label: {
        style: {
          fill: '#ffffff',
        },
      },
      line: {
        style: {
          stroke: '#303030',
        },
      },
      grid: {
        line: {
          style: {
            stroke: '#303030',
          },
        },
      },
    },
    yAxis: {
      label: {
        style: {
          fill: '#ffffff',
        },
      },
      grid: {
        line: {
          style: {
            stroke: '#303030',
          },
        },
      },
    },
    legend: {
      itemName: {
        style: {
          fill: '#ffffff',
        },
      },
    },
    tooltip: {
      domStyles: {
        'g2-tooltip': {
          backgroundColor: 'rgba(0,0,0,0.8)',
          color: '#ffffff',
          boxShadow: '0px 2px 8px rgba(0,0,0,0.15)',
        },
      },
    },
    slider: {
      handlerStyle: {
        fill: '#ffffff',
        stroke: '#1890ff',
      },
      backgroundStyle: {
        fill: '#262626',
      },
      foregroundStyle: {
        fill: '#1890ff',
        fillOpacity: 0.2,
      },
      textStyle: {
        fill: '#ffffff',
      },
    },
  };

  const pieConfig = {
    data: assetDistribution,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
      style: {
        fill: '#ffffff',
        fontSize: 14,
      },
    },
    legend: {
      itemName: {
        style: {
          fill: '#ffffff',
          fontSize: 14,
        },
      },
    },
    tooltip: {
      domStyles: {
        'g2-tooltip': {
          backgroundColor: 'rgba(0,0,0,0.8)',
          color: '#ffffff',
          boxShadow: '0px 2px 8px rgba(0,0,0,0.15)',
        },
      },
    },
    statistic: {
      title: {
        style: {
          color: '#ffffff',
        },
      },
      content: {
        style: {
          color: '#ffffff',
        },
      },
    },
    interactions: [
      {
        type: 'element-active',
      },
      {
        type: 'pie-statistic-active',
      }
    ],
    state: {
      active: {
        style: {
          lineWidth: 0,
          fillOpacity: 0.9,
        },
      },
    },
    onReady: (plot: unknown) => {
      if (plot && typeof plot === 'object' && 'on' in plot) {
        (plot as PlotInstance).on('element:click', (e: ChartEvent) => {
          const { data } = e.data;
          if (data.type === 'BTC') {
            setSelectedSymbol('BTC/USDT');
          } else if (data.type === 'ETH') {
            setSelectedSymbol('ETH/USDT');
          }
        });
      }
    },
  };

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总资产 (USDT)"
              value={158934.56}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
              suffix="USDT"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="24h成交量"
              value={256.78}
              precision={2}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ArrowDownOutlined />}
              suffix="BTC"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="活跃订单数"
              value={42}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="24h盈亏"
              value={-5956.05}
              precision={2}
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<ArrowDownOutlined />}
              suffix="USDT"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={16}>
          <Card>
            <Space style={{ marginBottom: 16 }}>
              <span style={{ color: '#fff' }}>选择交易对：</span>
              <Select 
                value={selectedSymbol}
                onChange={setSelectedSymbol}
                style={{ width: 120 }}
              >
                <Option value="BTC/USDT">BTC/USDT</Option>
                <Option value="ETH/USDT">ETH/USDT</Option>
              </Select>
            </Space>
            <Title level={4} style={{ color: '#fff' }}>盈亏趋势</Title>
            <Area {...areaConfig} height={300} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Title level={4} style={{ color: '#fff' }}>资产分布</Title>
            <Pie {...pieConfig} height={300} style={{ color: '#fff' }}/>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <Title level={4}>
              实时监控
              <Badge 
                count="实时" 
                style={{ 
                  backgroundColor: '#52c41a',
                  marginLeft: 8,
                }} 
              />
            </Title>
            <Spin spinning={loading}>
              {pnlData.length > 0 ? (
                <Table 
                  columns={columns} 
                  dataSource={pnlData}
                  scroll={{ x: 1500 }}
                  pagination={false}
                  bordered
                  size="middle"
                  rowKey="assets"
                />
              ) : (
                <Empty 
                  image={Empty.PRESENTED_IMAGE_SIMPLE} 
                  description="暂无数据"
                />
              )}
            </Spin>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <OrderBook symbol={selectedSymbol} depth={10} />
        </Col>
        <Col span={12}>
          <FeeCalculator symbol={selectedSymbol} />
        </Col>
      </Row>
    </Space>
  );
};

export default DashboardPage; 