// src/components/MainLayout.jsx
import React from 'react';
import { Layout, Menu } from 'antd';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { UserOutlined, FileTextOutlined } from '@ant-design/icons';
import ClientsPage from '../pages/ClientsPage';
import ProposalsPage from '../pages/ProposalsPage';

const { Header, Content, Sider } = Layout;

export default function MainLayout() {
  const location = useLocation();
  // determina la sezione attiva basandosi sulla prima parte del path
  const selectedKey = location.pathname === '/' 
    ? '/' 
    : `/${location.pathname.split('/')[1]}`;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div className="logo" style={{ height: 32, margin: 16, background: 'rgba(255,255,255,0.3)' }} />
        <Menu theme="dark" mode="inline" selectedKeys={[selectedKey]}>
          <Menu.Item key="/" icon={<UserOutlined />}>
            <Link to="/">Clienti</Link>
          </Menu.Item>
          <Menu.Item key="/proposals" icon={<FileTextOutlined />}>
            <Link to="/proposals">Contratti</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: 0, textAlign: 'center' }}>
          <h2 style={{ margin: 0 }}>Dashboard Gestione</h2>
        </Header>
        <Content style={{ margin: '24px 16px 0' }}>
          <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            <Routes>
              <Route path="/" element={<ClientsPage />} />
              <Route path="/proposals" element={<ProposalsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
