'use client';

import React, { useState } from 'react';
import { Card, Row, Col, Form, Select, DatePicker, Button, Table } from 'antd';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

// 模拟数据
const balanceColumns = [
  { title: 'UID', dataIndex: 'uid', key: 'uid' },
  { title: '币种', dataIndex: 'asset', key: 'asset' },
  { title: '可用余额', dataIndex: 'free', key: 'free' },
  { title: '冻结余额', dataIndex: 'locked', key: 'locked' },
  { title: '总资产(USDT)', dataIndex: 'total', key: 'total' },
  { title: '24H变化', dataIndex: 'change', key: 'change' },
  {
    title: '操作',
    key: 'action',
    render: () => <Button type="link">详情</Button>,
  },
];

const mockBalanceData = [
  {
    key: '1',
    uid: '123456',
    asset: 'BTC',
    free: '12.3456',
    locked: '0.0000',
    total: '556,789.12',
    change: '+1.2%',
  },
  {
    key: '2',
    uid: '123456',
    asset: 'ETH',
    free: '45.6789',
    locked: '1.2345',
    total: '123,456.78',
    change: '-0.5%',
  },
];

export default function AccountManagement() {
  const [balanceChartOption] = useState({
    title: {
      text: '余额变化趋势',
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['BTC', 'ETH', 'USDT'],
    },
    xAxis: {
      type: 'time',
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
      name: '余额(USDT)',
    },
    series: [
      {
        name: 'BTC',
        type: 'line',
        data: Array.from({ length: 7 }, (_, i) => ({
          value: [dayjs().subtract(i, 'day').valueOf(), Math.random() * 10000 + 50000],
        })).reverse(),
      },
      {
        name: 'ETH',
        type: 'line',
        data: Array.from({ length: 7 }, (_, i) => ({
          value: [dayjs().subtract(i, 'day').valueOf(), Math.random() * 5000 + 20000],
        })).reverse(),
      },
      {
        name: 'USDT',
        type: 'line',
        data: Array.from({ length: 7 }, (_, i) => ({
          value: [dayjs().subtract(i, 'day').valueOf(), Math.random() * 20000 + 100000],
        })).reverse(),
      },
    ],
  });

  const [transferChartOption] = useState({
    title: {
      text: '出入金分析',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      data: ['转入', '转出'],
    },
    xAxis: {
      type: 'category',
      data: Array.from({ length: 7 }, (_, i) =>
        dayjs().subtract(i, 'day').format('MM-DD'),
      ).reverse(),
    },
    yAxis: {
      type: 'value',
      name: '金额(USDT)',
    },
    series: [
      {
        name: '转入',
        type: 'bar',
        stack: 'total',
        data: Array.from({ length: 7 }, () => Math.random() * 10000 + 5000),
      },
      {
        name: '转出',
        type: 'bar',
        stack: 'total',
        data: Array.from({ length: 7 }, () => -(Math.random() * 8000 + 4000)),
      },
    ],
  });

  return (
    <div>
      <Card>
        <Form layout="inline">
          <Form.Item label="账户组">
            <Select
              defaultValue="maker"
              style={{ width: 120 }}
              options={[
                { value: 'maker', label: 'Maker' },
                { value: 'taker', label: 'Taker' },
              ]}
            />
          </Form.Item>
          <Form.Item label="UID">
            <Select
              mode="multiple"
              style={{ width: 200 }}
              placeholder="请选择UID"
              options={[
                { value: '123456', label: '123456' },
                { value: '123457', label: '123457' },
              ]}
            />
          </Form.Item>
          <Form.Item label="币种">
            <Select
              mode="multiple"
              style={{ width: 200 }}
              placeholder="请选择币种"
              options={[
                { value: 'BTC', label: 'BTC' },
                { value: 'ETH', label: 'ETH' },
                { value: 'USDT', label: 'USDT' },
              ]}
            />
          </Form.Item>
          <Form.Item label="时间">
            <RangePicker />
          </Form.Item>
          <Form.Item>
            <Button type="primary">查询</Button>
          </Form.Item>
          <Form.Item>
            <Button>导出</Button>
          </Form.Item>
        </Form>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <Table columns={balanceColumns} dataSource={mockBalanceData} />
      </Card>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card>
            <ReactECharts option={balanceChartOption} style={{ height: '400px' }} />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <ReactECharts option={transferChartOption} style={{ height: '400px' }} />
          </Card>
        </Col>
      </Row>
    </div>
  );
} 