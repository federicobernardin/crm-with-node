// frontend/src/components/ProposalForm.jsx
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Form, Input, Button, Card, Select, DatePicker, InputNumber, Checkbox, Upload, message, Space } from 'antd';
import { createProposal, updateProposal } from '../api/proposals';
import { getClients } from '../api/clients';
import { UploadOutlined } from '@ant-design/icons';

export default function ProposalForm({ editing, onSaved, onCancel }) {
  const [form] = Form.useForm();
  const [clients, setClients] = useState([]);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    getClients().then(setClients);
  }, []);

  // quando cliente cambia, aggiorno lista contatti
  const onClientChange = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    setContacts(client?.contacts || []);
    form.setFieldsValue({ contacts: [] });
  };

  useEffect(() => {
    form.resetFields();
    if (editing) {
      form.setFieldsValue({
        language:      editing.language,
        type:          editing.type,
        client_id:     editing.client.id,
        contacts:      editing.contacts.map(c => c.id),
        code:          editing.code,
        date:          editing.date           ? dayjs(editing.date)          : null,
        author:        editing.author,
        title:         editing.title,
        revenue:       editing.revenue,
        version:       editing.version,
        notes:         editing.notes,
        tranche:       editing.tranche,
        billing_tranches: editing.billing_tranches || [],
        new_customer:  editing.new_customer,
        payment:       editing.payment,
        start_at:      editing.start_at      ? dayjs(editing.start_at)      : null,
        stop_at:       editing.stop_at       ? dayjs(editing.stop_at)       : null,
        estimation_end:editing.estimation_end? dayjs(editing.estimation_end): null,
      });
      setContacts(editing.contacts);
    }
  }, [editing, form]);

  const onFinish = async vals => {
    const payload = {
      ...vals,
      date:          vals.date           ? vals.date.format('YYYY-MM-DD')          : null,
      start_at:      vals.start_at       ? vals.start_at.format('YYYY-MM-DD')       : null,
      stop_at:       vals.stop_at        ? vals.stop_at.format('YYYY-MM-DD')        : null,
      estimation_end:vals.estimation_end ? vals.estimation_end.format('YYYY-MM-DD') : null,
    };
    // normalizza billing_tranches (numeri)
    if (Array.isArray(payload.billing_tranches)) {
      payload.billing_tranches = payload.billing_tranches
        .filter(it => it && (it.text || it.value != null))
        .map(it => ({ text: it.text || '', value: it.value != null ? Number(it.value) : null }));
    }
    if (editing) await updateProposal(editing.id, payload);
    else await createProposal(payload);
    onSaved();
  };

  return (
    <Card title={editing ? 'Modifica Offerta' : 'Nuova Offerta'}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="language" label="Lingua" rules={[{required:true}]}>
          <Select options={[{label:'IT',value:'IT'},{label:'EN',value:'EN'}]} />
        </Form.Item>
        <Form.Item name="type" label="Tipo">
           <Select options={[{label:'Task',value:'task'},{label:'DTC',value:'dtc'},{label:'T&M',value:'tem'},{label:'Hosting',value:'hosting'}]} />
        </Form.Item>
        <Form.Item name="client_id" label="Cliente" rules={[{required:true}]}>
          <Select
            options={clients.map(c=>({label:c.company,value:c.id}))}
            onChange={onClientChange}
          />
        </Form.Item>
        <Form.Item name="contacts" label="Contatti">
          <Select
            mode="multiple"
            options={contacts.map(c=>({
              label:`${c.first_name} ${c.last_name}`,
              value:c.id
            }))}
          />
        </Form.Item>
        <Form.Item name="code" label="Codice"><Input /></Form.Item>
        <Form.Item name="date" label="Data"><DatePicker style={{width:'100%'}} /></Form.Item>
        <Form.Item name="author" label="Autore"><Input /></Form.Item>
        <Form.Item name="title" label="Titolo"><Input /></Form.Item>
        <Form.Item name="revenue" label="Revenue"><InputNumber style={{width:'100%'}} /></Form.Item>
        <Form.Item name="version" label="Versione"><Input /></Form.Item>
        <Form.Item name="notes" label="Note"><Input.TextArea rows={3}/></Form.Item>
        <Form.Item name="tranche" label="Tranche"><Input /></Form.Item>

        <Card size="small" style={{ marginBottom: 16 }} title="Tranche di Fatturazione">
          <Form.List name="billing_tranches">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} align="baseline" style={{ display: 'flex', marginBottom: 8 }}>
                    <Form.Item
                      {...restField}
                      name={[name, 'text']}
                      rules={[{ required: true, message: 'Inserisci descrizione' }]}
                    >
                      <Input placeholder="Descrizione tranche" style={{ width: 380 }} />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'value']}
                      rules={[{ required: true, message: 'Inserisci importo' }]}
                    >
                      <InputNumber placeholder="Importo" style={{ width: 160 }} min={0} step={0.01} />
                    </Form.Item>
                    <Button danger onClick={() => remove(name)}>Rimuovi</Button>
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block>
                    Aggiungi tranche
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Card>
        <Form.Item name="new_customer" valuePropName="checked"><Checkbox>Nuovo Cliente</Checkbox></Form.Item>
        <Form.Item name="payment" label="Payment"><Input /></Form.Item>
        <Form.Item name="start_at" label="Inizio"><DatePicker style={{width:'100%'}} /></Form.Item>
        <Form.Item name="stop_at" label="Fine"><DatePicker style={{width:'100%'}} /></Form.Item>
        <Form.Item name="estimation_end" label="Stima Fine"><DatePicker style={{width:'100%'}} /></Form.Item>
        {editing && (
          <Form.Item label="Carica Documento Word">
            <Upload
              name="file"
              accept=".docx"
              action={`/api/proposals/${editing.id}/upload`}
              showUploadList={false}
              onChange={({ file }) => {
                if (file.status === 'done') {
                  message.success('File caricato con successo');
                } else if (file.status === 'error') {
                  message.error('Errore durante il caricamento');
                }
              }}
            >
              <Button icon={<UploadOutlined />}>Carica file</Button>
            </Upload>
          </Form.Item>
        )}
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{marginRight:8}}>Salva</Button>
          <Button onClick={onCancel}>Annulla</Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
