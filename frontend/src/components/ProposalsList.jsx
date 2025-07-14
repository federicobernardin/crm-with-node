// frontend/src/components/ProposalsList.jsx
import { useEffect, useState } from 'react';
import { Table, Button, Popconfirm } from 'antd';
import { getProposals, deleteProposal } from '../api/proposals';

export default function ProposalsList({ onEdit }) {
  const [data, setData] = useState([]);
  useEffect(() => { load(); }, []);
  const load = async () => setData(await getProposals());

  const cols = [
    { title: 'Codice', dataIndex: 'code', key: 'code' },
    { title: 'Cliente', dataIndex: ['client','company'], key: 'company' },
    { title: 'Titolo', dataIndex: 'title', key: 'title' },
    { title: 'Data', dataIndex: 'date', key: 'date' },
    { title: 'Versione', dataIndex: 'version', key: 'version' },
    {
      title: 'Azioni', key: 'actions',
      render: (_, r) => (
        <>
          <Button type="link" onClick={() => onEdit(r)}>Modifica</Button>
          <Popconfirm title="Confermi?" onConfirm={async () => { await deleteProposal(r.id); load(); }}>
            <Button type="link" danger>Elimina</Button>
          </Popconfirm>
        </>
      )
    }
  ];

  return (
    <Table
      dataSource={data.map(d => ({ ...d, key: d.id }))}
      columns={cols}
      pagination={{ pageSize: 10 }}
    />
  );
}
