// src/components/ClientsList.jsx
import { useEffect, useState } from 'react';
import { Table, Button, Popconfirm } from 'antd';
import { getClients, deleteClient } from '../api/clients';

export default function ClientsList({ onEdit }) {
  const [clients, setClients] = useState([]);

  useEffect(() => { load(); }, []);

  async function load() {
    const data = await getClients();
    setClients(data);
  }

  const columns = [
    { title: 'Azienda', dataIndex: 'company', key: 'company' },
    { title: 'Indirizzo', dataIndex: 'address', key: 'address' },
    { title: 'Città', dataIndex: 'city', key: 'city' },
    { title: 'Provincia', dataIndex: 'state', key: 'state' },
    { title: 'CAP', dataIndex: 'zip', key: 'zip' },
    { title: 'Partita IVA', dataIndex: 'vat', key: 'vat' },
    { title: 'SDI', dataIndex: 'sdi', key: 'sdi' },
    { title: 'PEC', dataIndex: 'pec', key: 'pec' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Termini di Pagamento', dataIndex: 'payment_term', key: 'payment_term' },
    {
      title: 'Azioni',
      key: 'actions',
      fixed: 'right',
      width: 140,
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => onEdit(record)}>Modifica</Button>
          <Popconfirm
            title="Sei sicuro di voler cancellare questo cliente?"
            onConfirm={async () => { await deleteClient(record.id); load(); }}
          >
            <Button type="link" danger>Elimina</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <Table
      dataSource={clients.map(c => ({ ...c, key: c.id }))}
      columns={columns}
      pagination={{ pageSize: 10 }}
      scroll={{ x: 1200 }}
    />
  );
}
