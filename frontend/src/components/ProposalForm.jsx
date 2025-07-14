// frontend/src/components/ProposalForm.jsx
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Form, Input, Button, Card, Select, DatePicker, InputNumber, Checkbox } from 'antd';
import { createProposal, updateProposal } from '../api/proposals';
import { getClients } from '../api/clients';

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
        <Form.Item name="new_customer" valuePropName="checked"><Checkbox>Nuovo Cliente</Checkbox></Form.Item>
        <Form.Item name="payment" label="Payment"><Input /></Form.Item>
        <Form.Item name="start_at" label="Inizio"><DatePicker style={{width:'100%'}} /></Form.Item>
        <Form.Item name="stop_at" label="Fine"><DatePicker style={{width:'100%'}} /></Form.Item>
        <Form.Item name="estimation_end" label="Stima Fine"><DatePicker style={{width:'100%'}} /></Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{marginRight:8}}>Salva</Button>
          <Button onClick={onCancel}>Annulla</Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
