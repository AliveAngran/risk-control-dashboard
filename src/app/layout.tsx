'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { Layout as AntLayout, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import StyledComponentsRegistry from './AntdRegistry';
import SideMenu from '@/components/SideMenu';
import HeaderContent from '@/components/HeaderContent';

const { Header, Sider, Content } = AntLayout;
const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body className={inter.className}>
        <StyledComponentsRegistry>
          <ConfigProvider locale={zhCN}>
            <AntLayout style={{ minHeight: '100vh' }}>
              <Header style={{ padding: 0, background: '#fff' }}>
                <HeaderContent />
              </Header>
              <AntLayout>
                <Sider width={200} style={{ background: '#fff' }}>
                  <SideMenu />
                </Sider>
                <AntLayout style={{ padding: '24px' }}>
                  <Content
                    style={{
                      background: '#fff',
                      padding: 24,
                      margin: 0,
                      minHeight: 280,
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