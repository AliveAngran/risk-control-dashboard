'use client';

import React from 'react';
import { Typography } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

const { Title } = Typography;

export default function HeaderContent() {
  const [currentTime, setCurrentTime] = useState(dayjs().format('YYYY-MM-DD HH:mm:ss'));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(dayjs().format('YYYY-MM-DD HH:mm:ss'));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 24px' }}>
      <Title level={4} style={{ margin: 0, lineHeight: '64px' }}>
        风险管控系统
      </Title>
      <div style={{ lineHeight: '64px' }}>
        {currentTime}
        <span style={{ marginLeft: 20 }}>刷新间隔: 3s</span>
      </div>
    </div>
  );
} 