'use client';

import React, { useState } from 'react';
import { Card, Table, Tabs, Typography, Space, Tag, Button, DatePicker } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { RangePicker } = DatePicker;

interface BalanceData {
  uid: string;
  asset: string;
  free: string;
  locked: string;
  total: string;
  totalInBtc: string;
  updateTime: number;
}

interface TransferData {
  uid: string;
  exchange: string;
  asset: string;
  amount: string;
  price: string;
  usdtValue: string;
  time: number;
}

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState('balance');

  // 余额表格列配置
  const balanceColumns: ColumnsType<BalanceData> = [
    {
      title: 'UID',
      dataIndex: 'uid',
      key: 'uid',
      width: 120,
    },
    {
      title: '币种',
      dataIndex: 'asset',
      key: 'asset',
      width: 100,
    },
    {
      title: '可用余额',
      dataIndex: 'free',
      key: 'free',
      width: 150,
    },
    {
      title: '冻结余额',
      dataIndex: 'locked',
      key: 'locked',
      width: 150,
    },
    {
      title: '总余额',
      dataIndex: 'total',
      key: 'total',
      width: 150,
    },
    {
      title: 'BTC估值',
      dataIndex: 'totalInBtc',
      key: 'totalInBtc',
      width: 150,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 180,
      render: (time: number) => new Date(time).toLocaleString(),
    },
  ];

  // 划转记录表格列配置
  const transferColumns: ColumnsType<TransferData> = [
    {
      title: 'UID',
      dataIndex: 'uid',
      key: 'uid',
      width: 120,
    },
    {
      title: '交易所',
      dataIndex: 'exchange',
      key: 'exchange',
      width: 100,
    },
    {
      title: '币种',
      dataIndex: 'asset',
      key: 'asset',
      width: 100,
    },
    {
      title: '数量',
      dataIndex: 'amount',
      key: 'amount',
      width: 150,
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
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      width: 150,
    },
    {
      title: 'USDT价值',
      dataIndex: 'usdtValue',
      key: 'usdtValue',
      width: 150,
    },
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
      width: 180,
      render: (time: number) => new Date(time).toLocaleString(),
    },
  ];

  // 模拟数据
  const mockBalanceData: BalanceData[] = [
    {
      uid: '12345678',
      asset: 'BTC',
      free: '0.09905021',
      locked: '0.00000000',
      total: '0.09905021',
      totalInBtc: '0.09905021',
      updateTime: Date.now(),
    },
    {
      uid: '12345678',
      asset: 'USDT',
      free: '1.89109409',
      locked: '0.00000000',
      total: '1.89109409',
      totalInBtc: '0.00004500',
      updateTime: Date.now(),
    },
  ];

  const mockTransferData: TransferData[] = [
    {
      uid: '121313',
      exchange: 'BN',
      asset: 'BTC',
      amount: '-0.100000',
      price: '100000.00',
      usdtValue: '10000.000000',
      time: Date.now(),
    },
  ];

  const tabItems = [
    {
      key: 'balance',
      label: '账户余额',
      children: (
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Space>
            <Button icon={<SearchOutlined />}>搜索账户</Button>
            <Button icon={<DownloadOutlined />}>导出</Button>
          </Space>
          <Table
            columns={balanceColumns}
            dataSource={mockBalanceData}
            scroll={{ x: 1200 }}
            pagination={false}
            bordered
            size="middle"
            rowKey={(record) => `${record.uid}-${record.asset}`}
          />
        </Space>
      ),
    },
    {
      key: 'transfer',
      label: '划转记录',
      children: (
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Space>
            <RangePicker showTime />
            <Button icon={<SearchOutlined />}>查询</Button>
            <Button icon={<DownloadOutlined />}>导出</Button>
          </Space>
          <Table
            columns={transferColumns}
            dataSource={mockTransferData}
            scroll={{ x: 1200 }}
            pagination={{
              total: 100,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
            }}
            bordered
            size="middle"
            rowKey={(record) => `${record.uid}-${record.time}`}
          />
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <Title level={4}>账户管理</Title>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        type="card"
      />
    </Card>
  );
};

export default AccountPage; 