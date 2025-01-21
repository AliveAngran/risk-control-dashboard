'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { Layout as AntLayout, ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import StyledComponentsRegistry from './AntdRegistry';
import SideMenu from '@/components/SideMenu';
import HeaderContent from '@/components/HeaderContent';

const { Header, Sider, Content } = AntLayout;
const inter = Inter({ subsets: ['latin'] });

// 自定义主题配置
const themeConfig = {
  token: {
    colorPrimary: '#1890ff',
    borderRadius: 4,
    colorBgContainer: '#141414',
    colorBgElevated: '#1f1f1f',
    colorText: 'rgba(255, 255, 255, 0.85)',
    colorTextSecondary: 'rgba(255, 255, 255, 0.45)',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body className={inter.className} style={{ background: '#141414' }}>
        <StyledComponentsRegistry>
          <ConfigProvider 
            locale={zhCN}
            theme={{
              ...themeConfig,
              algorithm: theme.darkAlgorithm,
            }}
          >
            <AntLayout style={{ minHeight: '100vh', background: '#141414' }}>
              <Header style={{ 
                padding: '0 24px', 
                background: '#1f1f1f',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                position: 'fixed',
                width: '100%',
                zIndex: 1,
              }}>
                <HeaderContent />
              </Header>
              <AntLayout style={{ marginTop: 64, background: '#141414' }}>
                <Sider 
                  width={200} 
                  style={{ 
                    background: '#1f1f1f',
                    position: 'fixed',
                    height: 'calc(100vh - 64px)',
                    left: 0,
                    top: 64,
                    borderRight: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <SideMenu />
                </Sider>
                <AntLayout style={{ 
                  padding: '24px 24px 24px 224px',
                  background: '#141414',
                }}>
                  <Content
                    style={{
                      background: '#1f1f1f',
                      padding: 24,
                      margin: 0,
                      minHeight: 280,
                      borderRadius: 8,
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                    }}
                  >
                    {children}
                  </Content>
                </AntLayout>
              </AntLayout>
            </AntLayout>
          </ConfigProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
} 