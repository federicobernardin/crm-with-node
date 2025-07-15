import React, { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, Space, Upload, message } from 'antd';
import {
  DownloadOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  FileWordOutlined
} from '@ant-design/icons';
import { getProposals, deleteProposal } from '../api/proposals';

export default function ProposalsList({ onEdit }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProposals = async () => {
    setLoading(true);
    try {
      const list = await getProposals();
      setData(list || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deleteProposal(id);
      fetchProposals();
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = (id) => ({
    name: 'file',
    action: `/api/proposals/${id}/upload`,
    accept: '.docx',
    showUploadList: false,
    onChange(info) {
      if (info.file.status === 'done') {
        const returned = info.file.response; // { success: true, path: 'uploads/…' }
        message.success(`File caricato per proposta ${id}`);
        // aggiorno localmente lo stato per questo record
        setData(curr =>
          curr.map(r =>
            r.id === id ? { ...r, document_path: returned.path } : r
          )
        );
      } else if (info.file.status === 'error') {
        message.error(`Errore caricamento file per proposta ${id}`);
      }
    }
  });

  const columns = [
    { title: 'Codice', dataIndex: 'code', key: 'code' },
    { title: 'Titolo', dataIndex: 'title', key: 'title' },
    {
      title: 'Azioni',
      key: 'actions',
      render: (_, record) => {
        const hasFile = !!record.document_path;
        return (
          <Space>
            <Button
              type="link"
              icon={<DownloadOutlined />}
              href={`/api/proposals/${record.id}/download?force=true`}
              target="_blank"
            >
              Gen
            </Button>
            <Upload {...uploadProps(record.id)}>
              <Button type="link" icon={<UploadOutlined />}>Carica</Button>
            </Upload>
            <Button
              type="link"
              icon={<FileWordOutlined />}
              href={`/api/proposals/${record.id}/file`}
              target="_blank"
              disabled={!hasFile}
            >
              File
            </Button>
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            >
              Mod
            </Button>
            <Popconfirm
              title="Confermi eliminazione?"
              onConfirm={() => handleDelete(record.id)}
            >
              <Button type="link" icon={<DeleteOutlined />} danger>
                Del
              </Button>
            </Popconfirm>
          </Space>
        );
      }
    }
  ];

  return (
    <Table
      rowKey="id"
      loading={loading}
      dataSource={data}
      columns={columns}
      pagination={{ pageSize: 10 }}
    />
  );
}
