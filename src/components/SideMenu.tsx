'use client';

import React from 'react';
import { Menu } from 'antd';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  DashboardOutlined,
  AccountBookOutlined,
  LineChartOutlined,
  AlertOutlined,
  SwapOutlined,
  HistoryOutlined,
} from '@ant-design/icons';

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: React.ReactNode;
}

const items: MenuItem[] = [
  {
    key: '/',
    icon: <DashboardOutlined />,
    label: <Link href="/">总览</Link>,
  },
  {
    key: '/account',
    icon: <AccountBookOutlined />,
    label: <Link href="/account">账户管理</Link>,
  },
  {
    key: '/trade',
    icon: <SwapOutlined />,
    label: <Link href="/trade">交易管理</Link>,
  },
  {
    key: '/trades',
    icon: <HistoryOutlined />,
    label: <Link href="/trades">成交记录</Link>,
  },
  {
    key: '/report',
    icon: <LineChartOutlined />,
    label: <Link href="/report">报表管理</Link>,
  },
  {
    key: '/alert',
    icon: <AlertOutlined />,
    label: <Link href="/alert">预警管理</Link>,
  },
];

const SideMenu: React.FC = () => {
  const pathname = usePathname();

  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[pathname]}
      style={{ height: '100%', borderRight: 0 }}
      items={items}
    />
  );
};

export default SideMenu; 