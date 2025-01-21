'use client';

import React, { useState } from 'react';
import { Card, Row, Col, Form, Select, DatePicker, Button, Table } from 'antd';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

// 模拟数据
const accountColumns = [
  { title: '币种', dataIndex: 'asset', key: 'asset' },
  { title: 'Maker余额', dataIndex: 'makerBalance', key: 'makerBalance' },
  { title: 'Maker变化', dataIndex: 'makerChange', key: 'makerChange' },
  { title: 'Maker净流入', dataIndex: 'makerNetIn', key: 'makerNetIn' },
  { title: 'Taker余额', dataIndex: 'takerBalance', key: 'takerBalance' },
  { title: 'Taker变化', dataIndex: 'takerChange', key: 'takerChange' },
  { title: 'Taker净流入', dataIndex: 'takerNetIn', key: 'takerNetIn' },
  { title: '差值', dataIndex: 'difference', key: 'difference' },
];

const mockAccountData = [
  {
    key: '1',
    asset: 'BTC',
    makerBalance: '12.3456',
    makerChange: '+0.1234',
    makerNetIn: '+0.5678',
    takerBalance: '11.2345',
    takerChange: '-0.1234',
    takerNetIn: '-0.5678',
    difference: '0.0000',
  },
  {
    key: '2',
    asset: 'ETH',
    makerBalance: '45.6789',
    makerChange: '-1.2345',
    makerNetIn: '-2.3456',
    takerBalance: '44.5678',
    takerChange: '+1.2345',
    takerNetIn: '+2.3456',
    difference: '0.0000',
  },
];

export default function ReportAnalysis() {
  const [pnlChartOption] = useState({
    title: {
      text: '分币对盈亏分析',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      data: ['Maker', 'Taker', '净盈亏'],
    },
    xAxis: {
      type: 'category',
      data: ['BTC/USDT', 'ETH/USDT', 'DOT/USDT', 'LINK/USDT'],
    },
    yAxis: {
      type: 'value',
      name: '盈亏(USDT)',
    },
    series: [
      {
        name: 'Maker',
        type: 'bar',
        stack: 'total',
        data: [320, 302, 301, 334],
      },
      {
        name: 'Taker',
        type: 'bar',
        stack: 'total',
        data: [-120, -132, -101, -134],
      },
      {
        name: '净盈亏',
        type: 'line',
        data: [200, 170, 200, 200],
      },
    ],
  });

  const [netValueChartOption] = useState({
    title: {
      text: '账户组净值走势',
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['Maker净值', 'Taker净值'],
    },
    xAxis: {
      type: 'time',
      boundaryGap: false,
    },
    yAxis: [
      {
        type: 'value',
        name: 'Maker净值',
        position: 'left',
      },
      {
        type: 'value',
        name: 'Taker净值',
        position: 'right',
      },
    ],
    series: [
      {
        name: 'Maker净值',
        type: 'line',
        yAxisIndex: 0,
        data: Array.from({ length: 7 }, (_, i) => ({
          value: [dayjs().subtract(i, 'day').valueOf(), Math.random() * 50000 + 500000],
        })).reverse(),
      },
      {
        name: 'Taker净值',
        type: 'line',
        yAxisIndex: 1,
        data: Array.from({ length: 7 }, (_, i) => ({
          value: [dayjs().subtract(i, 'day').valueOf(), Math.random() * 40000 + 400000],
        })).reverse(),
      },
    ],
  });

  return (
    <div>
      <Card>
        <Form layout="inline">
          <Form.Item label="报表类型">
            <Select
              defaultValue="daily"
              style={{ width: 120 }}
              options={[
                { value: 'daily', label: '日报' },
                { value: 'realtime', label: '实时' },
              ]}
            />
          </Form.Item>
          <Form.Item label="币对">
            <Select
              mode="multiple"
              style={{ width: 200 }}
              placeholder="请选择币对"
              options={[
                { value: 'BTC/USDT', label: 'BTC/USDT' },
                { value: 'ETH/USDT', label: 'ETH/USDT' },
              ]}
            />
          </Form.Item>
          <Form.Item label="账户组">
            <Select
              defaultValue="all"
              style={{ width: 120 }}
              options={[
                { value: 'all', label: '全部' },
                { value: 'maker', label: 'Maker' },
                { value: 'taker', label: 'Taker' },
              ]}
            />
          </Form.Item>
          <Form.Item label="时间范围">
            <RangePicker showTime />
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
        <Table columns={accountColumns} dataSource={mockAccountData} />
      </Card>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card>
            <ReactECharts option={pnlChartOption} style={{ height: '400px' }} />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <ReactECharts option={netValueChartOption} style={{ height: '400px' }} />
          </Card>
        </Col>
      </Row>
    </div>
  );
} 