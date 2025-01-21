'use client';

import React, { useState } from 'react';
import { Card, Table, Tabs, Typography, Space, Tag, Button, Form, Input, InputNumber, Select, Alert } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

interface AlertConfig {
  id: string;
  pair: string;
  pnlLimit: number;
  noticeType: string;
  status: string;
}

interface AlertHistory {
  id: string;
  pair: string;
  type: string;
  message: string;
  time: number;
  status: string;
}

const AlertPage = () => {
  const [activeTab, setActiveTab] = useState('config');
  const [form] = Form.useForm();

  // 告警配置表格列
  const configColumns: ColumnsType<AlertConfig> = [
    {
      title: '交易对',
      dataIndex: 'pair',
      key: 'pair',
      width: 120,
    },
    {
      title: '盈亏限制(USDT)',
      dataIndex: 'pnlLimit',
      key: 'pnlLimit',
      width: 150,
    },
    {
      title: '通知方式',
      dataIndex: 'noticeType',
      key: 'noticeType',
      width: 120,
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: () => (
        <Space>
          <Button icon={<EditOutlined />} size="small">编辑</Button>
          <Button icon={<DeleteOutlined />} size="small" danger>删除</Button>
        </Space>
      ),
    },
  ];

  // 告警历史表格列
  const historyColumns: ColumnsType<AlertHistory> = [
    {
      title: '交易对',
      dataIndex: 'pair',
      key: 'pair',
      width: 120,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (text: string) => (
        <Tag color={text === 'warning' ? 'gold' : 'red'}>
          {text === 'warning' ? '警告' : '严重'}
        </Tag>
      ),
    },
    {
      title: '告警信息',
      dataIndex: 'message',
      key: 'message',
      width: 300,
    },
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
      width: 180,
      render: (time: number) => new Date(time).toLocaleString(),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'handled' ? 'green' : 'gold'}>
          {status === 'handled' ? '已处理' : '未处理'}
        </Tag>
      ),
    },
  ];

  // 模拟数据
  const mockConfigData: AlertConfig[] = [
    {
      id: '1',
      pair: 'BTC/USDT',
      pnlLimit: 1000,
      noticeType: 'Lark',
      status: 'active',
    },
    {
      id: '2',
      pair: 'ETH/USDT',
      pnlLimit: 500,
      noticeType: 'Lark',
      status: 'inactive',
    },
  ];

  const mockHistoryData: AlertHistory[] = [
    {
      id: '1',
      pair: 'BTC/USDT',
      type: 'warning',
      message: '盈亏超过1000 USDT！当前盈亏：-1234.56 USDT',
      time: Date.now(),
      status: 'unhandled',
    },
    {
      id: '2',
      pair: 'ETH/USDT',
      type: 'critical',
      message: '盈亏超过2000 USDT！当前盈亏：-2345.67 USDT',
      time: Date.now() - 3600000,
      status: 'handled',
    },
  ];

  const tabItems = [
    {
      key: 'config',
      label: '告警配置',
      children: (
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Alert
            message="提示"
            description="当币对盈亏超过设定阈值时，系统将通过配置的通知方式发送告警信息。"
            type="info"
            showIcon
          />
          <Card>
            <Form
              form={form}
              layout="inline"
              style={{ marginBottom: 16 }}
            >
              <Form.Item
                name="pair"
                label="交易对"
                rules={[{ required: true }]}
              >
                <Select style={{ width: 120 }}>
                  <Option value="BTC/USDT">BTC/USDT</Option>
                  <Option value="ETH/USDT">ETH/USDT</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="pnlLimit"
                label="盈亏限制"
                rules={[{ required: true }]}
              >
                <InputNumber
                  style={{ width: 150 }}
                  min={0}
                  step={100}
                  addonAfter="USDT"
                />
              </Form.Item>
              <Form.Item
                name="noticeType"
                label="通知方式"
                rules={[{ required: true }]}
              >
                <Select style={{ width: 120 }}>
                  <Option value="Lark">Lark</Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Button type="primary" icon={<PlusOutlined />}>
                  添加配置
                </Button>
              </Form.Item>
            </Form>
            <Table
              columns={configColumns}
              dataSource={mockConfigData}
              pagination={false}
              bordered
              size="middle"
              rowKey="id"
            />
          </Card>
        </Space>
      ),
    },
    {
      key: 'history',
      label: '告警历史',
      children: (
        <Table
          columns={historyColumns}
          dataSource={mockHistoryData}
          pagination={{
            total: 100,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
          bordered
          size="middle"
          rowKey="id"
        />
      ),
    },
  ];

  return (
    <Card>
      <Title level={4}>告警管理</Title>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        type="card"
      />
    </Card>
  );
};

export default AlertPage; 