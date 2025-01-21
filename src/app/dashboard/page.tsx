'use client';

import React from 'react';
import { Card, Row, Col, Table, Tabs, Radio, Space } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';

// 模拟数据
const mockData = {
  makerBalance: 123456789.12,
  makerChange: 1.23,
  takerBalance: 987654321.98,
  takerChange: -0.45,
  totalPnL: 123456.78,
  totalPnLChange: 0.78,
};

// 实时成交数据
const tradeColumns = [
  { title: '时间', dataIndex: 'time', key: 'time' },
  { title: 'UID', dataIndex: 'uid', key: 'uid' },
  { title: '币对', dataIndex: 'pair', key: 'pair' },
  { title: '方向', dataIndex: 'direction', key: 'direction' },
  { title: '价格', dataIndex: 'price', key: 'price' },
  { title: '数量', dataIndex: 'amount', key: 'amount' },
  { title: '成交额', dataIndex: 'total', key: 'total' },
];

const mockTradeData = [
  {
    key: '1',
    time: '15:30:42',
    uid: '123456',
    pair: 'BTC/USDT',
    direction: '买入',
    price: '45000',
    amount: '0.1234',
    total: '5550.3',
  },
  {
    key: '2',
    time: '15:30:38',
    uid: '123457',
    pair: 'ETH/USDT',
    direction: '卖出',
    price: '2800',
    amount: '1.5678',
    total: '4389.8',
  },
];

// 告警信息
const mockAlerts = [
  {
    level: '严重',
    pair: 'BTC/USDT',
    time: '15:28:30',
    detail: '盈亏-1500 USDT'
  },
  {
    level: '警告',
    pair: 'ETH/USDT', 
    time: '15:25:45',
    detail: '盈亏-800 USDT'
  }
];

export default function Dashboard() {
  const pnlChartOption = {
    title: {
      text: '币对实时盈亏监控',
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['Maker', 'Taker'],
    },
    xAxis: {
      type: 'time',
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
      name: '盈亏(USDT)',
    },
    series: [
      {
        name: 'Maker',
        type: 'line',
        data: Array.from({ length: 20 }, (_, i) => ({
          value: [
            dayjs().subtract(i * 3, 'second').valueOf(),
            Math.random() * 1000,
          ],
        })).reverse(),
      },
      {
        name: 'Taker',
        type: 'line',
        data: Array.from({ length: 20 }, (_, i) => ({
          value: [
            dayjs().subtract(i * 3, 'second').valueOf(),
            Math.random() * 1000,
          ],
        })).reverse(),
      },
    ],
  };

  const balanceChartOption = {
    title: {
      text: '账户组余额分布',
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: '余额分布',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 735, name: 'BTC' },
          { value: 580, name: 'ETH' },
          { value: 484, name: 'USDT' },
          { value: 300, name: 'Others' },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  return (
    <div className="p-6">
      {/* 页面标题 */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">实时监控大盘</h1>
        <div className="text-gray-500">
          {dayjs().format('YYYY-MM-DD HH:mm:ss')} 刷新间隔: 3s
        </div>
      </div>

      {/* 顶部卡片 */}
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <div>Maker账户组</div>
            <div className="text-2xl font-bold mt-2">
              {mockData.makerBalance.toLocaleString()} USDT
            </div>
            <div className={mockData.makerChange > 0 ? 'text-green-500' : 'text-red-500'}>
              {mockData.makerChange > 0 ? '+' : ''}
              {mockData.makerChange}%
              {mockData.makerChange > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <div>Taker账户组</div>
            <div className="text-2xl font-bold mt-2">
              {mockData.takerBalance.toLocaleString()} USDT
            </div>
            <div className={mockData.takerChange > 0 ? 'text-green-500' : 'text-red-500'}>
              {mockData.takerChange > 0 ? '+' : ''}
              {mockData.takerChange}%
              {mockData.takerChange > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <div>整体盈亏</div>
            <div className="text-2xl font-bold mt-2">
              {mockData.totalPnL > 0 ? '+' : ''}
              {mockData.totalPnL.toLocaleString()} USDT
            </div>
            <div className={mockData.totalPnLChange > 0 ? 'text-green-500' : 'text-red-500'}>
              {mockData.totalPnLChange > 0 ? '+' : ''}
              {mockData.totalPnLChange}%
              {mockData.totalPnLChange > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            </div>
          </Card>
        </Col>
      </Row>

      {/* 币对盈亏监控 */}
      <Card className="mt-6">
        <div className="mb-4">
          <Space size="large">
            <Tabs
              defaultActiveKey="BTC/USDT"
              items={[
                { key: 'BTC/USDT', label: 'BTC/USDT' },
                { key: 'ETH/USDT', label: 'ETH/USDT' },
                { key: 'Others', label: '其他币对...' },
              ]}
            />
            <Radio.Group defaultValue="1H">
              <Radio.Button value="1H">1H</Radio.Button>
              <Radio.Button value="4H">4H</Radio.Button>
              <Radio.Button value="24H">24H</Radio.Button>
            </Radio.Group>
          </Space>
        </div>
        <ReactECharts option={pnlChartOption} style={{ height: '400px' }} />
      </Card>

      {/* 余额分布和告警信息 */}
      <Row gutter={16} className="mt-6">
        <Col span={12}>
          <Card>
            <Tabs
              defaultActiveKey="maker"
              items={[
                { key: 'maker', label: 'Maker' },
                { key: 'taker', label: 'Taker' },
              ]}
            />
            <ReactECharts option={balanceChartOption} style={{ height: '300px' }} />
          </Card>
        </Col>
        <Col span={12}>
          <Card 
            title="实时告警信息" 
            className="h-full"
          >
            {mockAlerts.map((alert, index) => (
              <div 
                key={index}
                className={`mb-4 p-4 rounded ${
                  alert.level === '严重' ? 'bg-red-50' : 'bg-yellow-50'
                }`}
              >
                <div className={alert.level === '严重' ? 'text-red-500' : 'text-yellow-500'}>
                  [{alert.level}] {alert.pair}盈亏超限
                </div>
                <div className="text-gray-500 mt-1">时间: {alert.time}</div>
                <div className="text-gray-500">详情: {alert.detail}</div>
              </div>
            ))}
          </Card>
        </Col>
      </Row>

      {/* 实时成交流水 */}
      <Card title="实时成交流水" className="mt-6">
        <Table 
          columns={tradeColumns} 
          dataSource={mockTradeData} 
          pagination={false}
          className="border rounded"
        />
      </Card>
    </div>
  );
} 