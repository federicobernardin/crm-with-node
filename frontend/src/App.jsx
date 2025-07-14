// src/App.jsx
import { useState } from 'react';
import { Row, Col, Button, Drawer } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ClientsList from './components/ClientsList';
import ClientForm from './components/ClientForm';

export default function App() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [refreshToggle, setRefreshToggle] = useState(false);

  const openDrawer = (client = null) => {
    setEditingClient(client);
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setEditingClient(null);
  };

  const handleSaved = () => {
    setDrawerVisible(false);
    setEditingClient(null);
    setRefreshToggle(!refreshToggle);
  };

  return (
    <div style={{ padding: 24 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col><h1>Gestione Clienti</h1></Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openDrawer()}>
            Aggiungi Cliente
          </Button>
        </Col>
      </Row>

      <ClientsList key={refreshToggle} onEdit={openDrawer} />

      <Drawer
        title={editingClient ? 'Modifica Cliente' : 'Nuovo Cliente'}
        width={720}
        onClose={closeDrawer}
        open={drawerVisible}
        style={{ body: {paddingBottom: 80 }}}
      >
        <ClientForm editing={editingClient} onSaved={handleSaved} onCancel={closeDrawer} />
      </Drawer>
    </div>
  );
}
