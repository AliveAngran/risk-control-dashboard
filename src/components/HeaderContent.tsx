'use client';

import React, { useState, useEffect } from 'react';
import { Space } from 'antd';

const HeaderContent = () => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    // 初始化时间
    setCurrentTime(new Date().toLocaleString());
    
    // 每秒更新时间
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Space>
      <span style={{ color: '#fff' }}>
        {currentTime}
      </span>
    </Space>
  );
};

export default HeaderContent; 