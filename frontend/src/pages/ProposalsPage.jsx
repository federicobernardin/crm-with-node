// src/pages/ProposalsPage.jsx
import { useState } from 'react';
import { Row, Col, Button, Drawer } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProposalsList from '../components/ProposalsList';
import ProposalForm from '../components/ProposalForm';

export default function ProposalsPage() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingProposal, setEditingProposal] = useState(null);
  const [refreshToggle, setRefreshToggle] = useState(false);

  const openDrawer = (proposal = null) => {
    setEditingProposal(proposal);
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setEditingProposal(null);
    setDrawerVisible(false);
  };

  const handleSaved = () => {
    closeDrawer();
    setRefreshToggle(!refreshToggle);
  };

  return (
    <>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col><h1>Gestione Contratti</h1></Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openDrawer()}
          >
            Nuovo Contratto
          </Button>
        </Col>
      </Row>

      <ProposalsList
        key={refreshToggle}
        onEdit={openDrawer}
      />

      <Drawer
        title={editingProposal ? 'Modifica Contratto' : 'Nuovo Contratto'}
        width={720}
        onClose={closeDrawer}
        open={drawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <ProposalForm
          editing={editingProposal}
          onSaved={handleSaved}
          onCancel={closeDrawer}
        />
      </Drawer>
    </>
  );
}
