'use client';

import React, { useState, useEffect } from 'react';
import { Card, Table, Tabs, Typography, Space, Button, DatePicker, Statistic, Row, Col, Alert, Empty, Spin, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Area } from '@ant-design/charts';
import { ArrowUpOutlined, ArrowDownOutlined, DownloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

interface DailyReportData {
  uid: string;
  assets: string;
  makerBalance: string;
  makerChange: string;
  makerNetIn: string;
  takerBalance: string;
  takerChange: string;
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

const ReportPage = () => {
  const [activeTab, setActiveTab] = useState('daily');
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dailyData, setDailyData] = useState<DailyReportData[]>([]);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs());
  const [selectedUids, setSelectedUids] = useState<string[]>(['ALL']);

  // 模拟UID列表
  const uidOptions = [
    { label: '全部账户', value: 'ALL' },
    { label: 'UID: 123456', value: '123456' },
    { label: 'UID: 234567', value: '234567' },
    { label: 'UID: 345678', value: '345678' },
  ];

  // 日报表格列配置
  const dailyColumns: ColumnsType<DailyReportData> = [
    {
      title: 'UID',
      dataIndex: 'uid',
      key: 'uid',
      fixed: 'left',
      width: 100,
    },
    {
      title: '币种资产 / Assets',
      dataIndex: 'assets',
      key: 'assets',
      fixed: 'left',
      width: 120,
    },
    {
      title: 'Maker',
      children: [
        {
          title: '余额 / Balance',
          dataIndex: 'makerBalance',
          key: 'makerBalance',
          width: 150,
        },
        {
          title: '变化 / Change',
          dataIndex: 'makerChange',
          key: 'makerChange',
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
          title: '净流入 / Net In TRF',
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
          title: '余额 / Balance',
          dataIndex: 'takerBalance',
          key: 'takerBalance',
          width: 150,
        },
        {
          title: '变化 / Change',
          dataIndex: 'takerChange',
          key: 'takerChange',
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
          title: '净流入 / Net In TRF',
          dataIndex: 'takerNetIn',
          key: 'takerNetIn',
          width: 150,
        },
      ],
    },
    {
      title: '差值 / Diff',
      dataIndex: 'diff',
      key: 'diff',
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
      title: '价格 / Price',
      dataIndex: 'price',
      key: 'price',
      width: 150,
    },
    {
      title: '盈亏 / U-PnL',
      dataIndex: 'pnl',
      key: 'pnl',
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
  ];

  // 模拟数据
  const mockDailyData: DailyReportData[] = [
    {
      uid: '123456',
      assets: 'BTC',
      makerBalance: '1.2345',
      makerChange: '-0.0123',
      makerNetIn: '0.5000',
      takerBalance: '1.3456',
      takerChange: '+0.0234',
      takerNetIn: '0.6000',
      diff: '-0.0889',
      price: '42000.00',
      pnl: '-3733.80',
    },
    {
      uid: '123456',
      assets: 'ETH',
      makerBalance: '10.2345',
      makerChange: '+0.1234',
      makerNetIn: '5.0000',
      takerBalance: '11.3456',
      takerChange: '-0.2345',
      takerNetIn: '6.0000',
      diff: '-0.8889',
      price: '2500.00',
      pnl: '-2222.25',
    },
    {
      uid: '234567',
      assets: 'BTC',
      makerBalance: '2.3456',
      makerChange: '+0.0234',
      makerNetIn: '0.7000',
      takerBalance: '2.4567',
      takerChange: '-0.0345',
      takerNetIn: '0.8000',
      diff: '-0.0999',
      price: '42000.00',
      pnl: '-4195.80',
    },
    {
      uid: '234567',
      assets: 'ETH',
      makerBalance: '20.3456',
      makerChange: '-0.2345',
      makerNetIn: '7.0000',
      takerBalance: '21.4567',
      takerChange: '+0.3456',
      takerNetIn: '8.0000',
      diff: '-0.9999',
      price: '2500.00',
      pnl: '-2497.75',
    },
  ];

  // 模拟数据更新
  useEffect(() => {
    let isMounted = true;

    const generateData = () => {
      if (!isMounted) return;
      
      setLoading(true);
      
      // 生成图表数据，使用固定的时间点
      const mockChartData = Array.from({ length: 24 }, (_, i) => {
        const hour = i.toString().padStart(2, '0');
        return {
          time: `${hour}:00`,
          value: Math.random() * 2000 - 1000,
          type: 'PnL',
        };
      });

      // 使用选择的日期生成数据
      const mockData = mockDailyData.map(item => ({
        ...item,
        time: selectedDate.valueOf(),
      }));

      setChartData(mockChartData);
      setDailyData(mockData);
      
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
  }, [selectedDate]);

  // 处理日期选择
  const handleDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  // 处理UID选择
  const handleUidChange = (values: string[]) => {
    setSelectedUids(values.length === 0 ? ['ALL'] : values);
  };

  // 过滤数据
  const getFilteredData = () => {
    if (selectedUids.includes('ALL')) {
      return dailyData;
    }
    return dailyData.filter(item => selectedUids.includes(item.uid));
  };

  // 计算汇总数据
  const calculateSummary = (data: DailyReportData[]) => {
    const totalPnl = data.reduce((sum, item) => sum + parseFloat(item.pnl), 0);
    return totalPnl.toFixed(2);
  };

  const config = {
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

  const tabItems = [
    {
      key: 'daily',
      label: '日报',
      children: (
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Space>
            <DatePicker 
              value={selectedDate}
              onChange={handleDateChange}
              allowClear={false}
            />
            <Select
              mode="multiple"
              value={selectedUids}
              onChange={handleUidChange}
              options={uidOptions}
              style={{ width: 300 }}
              placeholder="选择UID"
              maxTagCount={3}
            />
            <Button icon={<DownloadOutlined />}>导出报表</Button>
          </Space>
          <Row gutter={16}>
            <Col span={8}>
              <Card>
                <Statistic
                  title="所选账户总盈亏"
                  value={calculateSummary(getFilteredData())}
                  precision={2}
                  valueStyle={{ color: parseFloat(calculateSummary(getFilteredData())) >= 0 ? '#52c41a' : '#ff4d4f' }}
                  prefix={parseFloat(calculateSummary(getFilteredData())) >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                  suffix="USDT"
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title="所选Maker账户变化"
                  value={-1.23}
                  precision={2}
                  valueStyle={{ color: '#ff4d4f' }}
                  prefix={<ArrowDownOutlined />}
                  suffix="%"
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title="所选Taker账户变化"
                  value={2.34}
                  precision={2}
                  valueStyle={{ color: '#52c41a' }}
                  prefix={<ArrowUpOutlined />}
                  suffix="%"
                />
              </Card>
            </Col>
          </Row>
          <Spin spinning={loading}>
            {getFilteredData().length > 0 ? (
              <Table
                columns={dailyColumns}
                dataSource={getFilteredData()}
                scroll={{ x: 1500 }}
                pagination={false}
                bordered
                size="middle"
                rowKey={(record) => `${record.uid}-${record.assets}`}
                summary={() => (
                  <Table.Summary fixed>
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0}>总计</Table.Summary.Cell>
                      <Table.Summary.Cell index={1}>-</Table.Summary.Cell>
                      <Table.Summary.Cell index={2}>-</Table.Summary.Cell>
                      <Table.Summary.Cell index={3}>-</Table.Summary.Cell>
                      <Table.Summary.Cell index={4}>-</Table.Summary.Cell>
                      <Table.Summary.Cell index={5}>-</Table.Summary.Cell>
                      <Table.Summary.Cell index={6}>-</Table.Summary.Cell>
                      <Table.Summary.Cell index={7}>-</Table.Summary.Cell>
                      <Table.Summary.Cell index={8}>-</Table.Summary.Cell>
                      <Table.Summary.Cell index={9}>-</Table.Summary.Cell>
                      <Table.Summary.Cell index={10}>
                        <Text type="danger">{calculateSummary(getFilteredData())}</Text>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </Table.Summary>
                )}
              />
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="暂无日报数据"
              />
            )}
          </Spin>
        </Space>
      ),
    },
    {
      key: 'realtime',
      label: '实时监控',
      children: (
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Alert
            message="盈亏预警"
            description="BTC/USDT 盈亏超过1000 USDT！"
            type="warning"
            showIcon
            closable
          />
          <Card>
            <Title level={4} style={{ color: '#fff' }}>盈亏趋势</Title>
            <Area {...config} height={300} />
          </Card>
          <Spin spinning={loading}>
            {dailyData.length > 0 ? (
              <Table
                columns={dailyColumns.filter(col => col.title !== 'Change')}
                dataSource={dailyData.filter(item => item.assets !== 'Daily Summary')}
                scroll={{ x: 1500 }}
                pagination={{
                  total: 100,
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total) => `共 ${total} 条记录`,
                }}
                bordered
                size="middle"
                rowKey="assets"
              />
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="暂无监控数据"
              />
            )}
          </Spin>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <Title level={4}>报表管理</Title>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        type="card"
      />
    </Card>
  );
};

export default ReportPage; 