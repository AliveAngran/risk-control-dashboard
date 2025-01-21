'use client';

import React, { useState } from 'react';
import { Card, Row, Col, Table, Button, Tag, Statistic } from 'antd';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';

// 模拟数据
const ruleColumns = [
  { title: '币对', dataIndex: 'pair', key: 'pair' },
  { title: '阈值(USDT)', dataIndex: 'threshold', key: 'threshold' },
  { title: '监控周期', dataIndex: 'interval', key: 'interval' },
  { title: '通知方式', dataIndex: 'notifyType', key: 'notifyType' },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => (
      <Tag color={status === '启用' ? 'green' : 'red'}>{status}</Tag>
    ),
  },
  { title: '最近告警', dataIndex: 'lastAlert', key: 'lastAlert' },
  {
    title: '操作',
    key: 'action',
    render: () => (
      <>
        <Button type="link">编辑</Button>
        <Button type="link" danger>
          删除
        </Button>
      </>
    ),
  },
];

const mockRuleData = [
  {
    key: '1',
    pair: 'BTC/USDT',
    threshold: '1000',
    interval: '3s',
    notifyType: 'Lark',
    status: '启用',
    lastAlert: '15:28:30',
  },
  {
    key: '2',
    pair: 'ETH/USDT',
    threshold: '500',
    interval: '3s',
    notifyType: 'Lark',
    status: '启用',
    lastAlert: '15:25:45',
  },
];

const historyColumns = [
  { title: '时间', dataIndex: 'time', key: 'time' },
  { title: '币对', dataIndex: 'pair', key: 'pair' },
  { title: '触发值', dataIndex: 'triggerValue', key: 'triggerValue' },
  { title: '阈值', dataIndex: 'threshold', key: 'threshold' },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => (
      <Tag color={status === '已处理' ? 'green' : status === '处理中' ? 'orange' : 'red'}>
        {status}
      </Tag>
    ),
  },
  { title: '处理人', dataIndex: 'handler', key: 'handler' },
  { title: '处理时间', dataIndex: 'handleTime', key: 'handleTime' },
  { title: '备注', dataIndex: 'remark', key: 'remark' },
];

const mockHistoryData = [
  {
    key: '1',
    time: '15:28:30',
    pair: 'BTC/USDT',
    triggerValue: '1234.56',
    threshold: '1000',
    status: '已处理',
    handler: '张三',
    handleTime: '15:29:00',
    remark: '风险解除',
  },
  {
    key: '2',
    time: '15:25:45',
    pair: 'ETH/USDT',
    triggerValue: '678.90',
    threshold: '500',
    status: '处理中',
    handler: '李四',
    handleTime: '-',
    remark: '处理中',
  },
];

export default function AlertConfig() {
  const [distributionChartOption] = useState({
    title: {
      text: '告警统计分析',
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
        name: '告警分布',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 80, name: 'BTC/USDT' },
          { value: 45, name: 'ETH/USDT' },
          { value: 25, name: 'DOT/USDT' },
          { value: 6, name: 'Others' },
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
  });

  const [trendChartOption] = useState({
    title: {
      text: '告警触发趋势',
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'time',
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
      name: '告警次数',
    },
    series: [
      {
        name: '告警次数',
        type: 'line',
        data: Array.from({ length: 24 }, (_, i) => ({
          value: [dayjs().subtract(i, 'hour').valueOf(), Math.floor(Math.random() * 10)],
        })).reverse(),
        areaStyle: {},
      },
    ],
  });

  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic title="今日告警总数" value={156} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="待处理告警" value={23} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="已处理告警" value={133} />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: 16 }}>
        <div style={{ marginBottom: 16, textAlign: 'right' }}>
          <Button type="primary">新增规则</Button>
        </div>
        <Table columns={ruleColumns} dataSource={mockRuleData} />
      </Card>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card>
            <ReactECharts option={distributionChartOption} style={{ height: '400px' }} />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <ReactECharts option={trendChartOption} style={{ height: '400px' }} />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: 16 }} title="告警历史记录">
        <Table columns={historyColumns} dataSource={mockHistoryData} />
      </Card>
    </div>
  );
} 