// src/components/ClientForm.jsx
import { useEffect } from 'react';
import { Form, Input, Button, Card } from 'antd';
import { createClient, updateClient } from '../api/clients';

export default function ClientForm({ editing, onSaved, onCancel }) {
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
    if (editing) form.setFieldsValue(editing);
  }, [editing, form]);

  const onFinish = async (values) => {
    if (editing) {
      await updateClient(editing.id, values);
    } else {
      await createClient(values);
    }
    onSaved();
  };

  return (
    <Card size="small" title={editing ? 'Modifica Cliente' : 'Nuovo Cliente'} style={{ marginBottom: 24 }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          company: '', contact: '', address: '', city: '', state: '',
          zip: '', vat: '', sdi: '', pec: '', email: '', payment_term: ''
        }}
      >
        <Form.Item name="company" label="Azienda" rules={[{ required: true, message: 'Inserisci la ragione sociale' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="contact" label="Referente">
          <Input />
        </Form.Item>
        <Form.Item name="address" label="Indirizzo">
          <Input />
        </Form.Item>
        <Form.Item name="city" label="Città">
          <Input />
        </Form.Item>
        <Form.Item name="state" label="Provincia">
          <Input />
        </Form.Item>
        <Form.Item name="zip" label="CAP">
          <Input />
        </Form.Item>
        <Form.Item name="vat" label="Partita IVA" rules={[{ required: true, message: 'Inserisci la Partita IVA' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="sdi" label="Codice SDI">
          <Input />
        </Form.Item>
        <Form.Item name="pec" label="PEC" rules={[{ type: 'email', message: 'Inserisci un indirizzo PEC valido' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ type: 'email', message: 'Inserisci un indirizzo email valido' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="payment_term" label="Termini di Pagamento">
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>Salva</Button>
          {editing && <Button onClick={onCancel}>Annulla</Button>}
        </Form.Item>
      </Form>
    </Card>
  );
}
