'use client';

import React, { useState, useEffect } from 'react';
import { Card, Table, Typography, Space, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

interface FeeData {
  feeAsset: string;
  feeAmount: string;
  feeAssetPrice: string;
  feeUsdtAmount: string;
  time: number;
}

interface FeeCalculatorProps {
  symbol: string;
}

const FeeCalculator: React.FC<FeeCalculatorProps> = ({ symbol }) => {
  const [feeData, setFeeData] = useState<FeeData[]>([]);
  const [totalFee, setTotalFee] = useState('0');

  const columns: ColumnsType<FeeData> = [
    {
      title: '手续费币种',
      dataIndex: 'feeAsset',
      key: 'feeAsset',
      width: 120,
    },
    {
      title: '手续费数量',
      dataIndex: 'feeAmount',
      key: 'feeAmount',
      width: 150,
    },
    {
      title: '币种价格(USDT)',
      dataIndex: 'feeAssetPrice',
      key: 'feeAssetPrice',
      width: 150,
    },
    {
      title: 'USDT价值',
      dataIndex: 'feeUsdtAmount',
      key: 'feeUsdtAmount',
      width: 150,
      render: (text: string) => (
        <Tag color="blue">{text} USDT</Tag>
      ),
    },
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
      width: 180,
      render: (time: number) => {
        const date = new Date(time);
        return date.toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        });
      },
    },
  ];

  // 模拟数据更新
  useEffect(() => {
    let isMounted = true;

    const generateFeeData = () => {
      if (!isMounted) return;

      const assets = ['BNB', 'USDT', 'BTC'];
      const prices = {
        BNB: 300,
        USDT: 1,
        BTC: 42000,
      };

      const mockData: FeeData[] = Array.from({ length: 5 }, () => {
        const asset = assets[Math.floor(Math.random() * assets.length)];
        const amount = (Math.random() * 0.1).toFixed(6);
        const price = prices[asset as keyof typeof prices];
        const usdtAmount = (parseFloat(amount) * price).toFixed(2);

        return {
          feeAsset: asset,
          feeAmount: amount,
          feeAssetPrice: price.toFixed(2),
          feeUsdtAmount: usdtAmount,
          time: Date.now(),
        };
      }).sort((a, b) => b.time - a.time);

      if (isMounted) {
        const total = mockData.reduce(
          (sum, item) => sum + parseFloat(item.feeUsdtAmount),
          0
        ).toFixed(2);

        setFeeData(mockData);
        setTotalFee(total);
      }
    };

    generateFeeData();
    const timer = setInterval(generateFeeData, 3000);

    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, []);

  return (
    <Card>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Title level={5}>
          {symbol} 手续费统计
          <Tag color="blue" style={{ marginLeft: 16 }}>
            总计: {totalFee} USDT
          </Tag>
        </Title>
        <Table
          columns={columns}
          dataSource={feeData}
          pagination={false}
          size="small"
          bordered
          rowKey={(record) => `${record.feeAsset}-${record.time}`}
        />
      </Space>
    </Card>
  );
};

export default FeeCalculator; 