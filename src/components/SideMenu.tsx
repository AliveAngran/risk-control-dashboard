'use client';

import React from 'react';
import { Menu } from 'antd';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  DashboardOutlined,
  UserOutlined,
  BarChartOutlined,
  AlertOutlined,
} from '@ant-design/icons';

const menuItems = [
  {
    key: '/dashboard',
    icon: <DashboardOutlined />,
    label: <Link href="/dashboard">实时监控大盘</Link>,
  },
  {
    key: '/account',
    icon: <UserOutlined />,
    label: <Link href="/account">账户管理</Link>,
  },
  {
    key: '/report',
    icon: <BarChartOutlined />,
    label: <Link href="/report">报表分析</Link>,
  },
  {
    key: '/alert',
    icon: <AlertOutlined />,
    label: <Link href="/alert">告警配置</Link>,
  },
];

export default function SideMenu() {
  const pathname = usePathname();

  return (
    <Menu
      mode="inline"
      selectedKeys={[pathname]}
      style={{ height: '100%', borderRight: 0 }}
      items={menuItems}
    />
  );
} 