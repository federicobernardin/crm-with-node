// src/components/ClientForm.jsx
import { useEffect } from 'react';
import { Form, Input, Button, Card, Row, Col } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { createClient, updateClient } from '../api/clients';

export default function ClientForm({ editing, onSaved, onCancel }) {
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      ...editing,
      contacts: editing?.contacts || []
    });
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
          company: '',
          address: '',
          city: '',
          state: '',
          zip: '',
          vat: '',
          sdi: '',
          pec: '',
          email: '',
          payment_term: '',
          contacts: []
        }}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="company"
              label="Azienda"
              rules={[{ required: true, message: 'Inserisci la ragione sociale' }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="address" label="Indirizzo">
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="city" label="Città">
              <Input />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="state" label="Provincia">
              <Input />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="zip" label="CAP">
              <Input />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name="vat"
              label="Partita IVA"
              rules={[{ required: true, message: 'Inserisci la Partita IVA' }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="sdi" label="Codice SDI">
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="pec"
              label="PEC"
              rules={[{ type: 'email', message: 'Inserisci un indirizzo PEC valido' }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ type: 'email', message: 'Inserisci un indirizzo email valido' }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="payment_term" label="Termini di Pagamento">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Card type="inner" title="Contatti" style={{ marginTop: 16 }}>
          <Form.List name="contacts">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <Card
                    key={key}
                    size="small"
                    style={{ marginBottom: 12, position: 'relative' }}
                  >
                    <Button
                      type="text"
                      icon={<MinusCircleOutlined />}
                      onClick={() => remove(name)}
                      style={{ position: 'absolute', top: 8, right: 8 }}
                    />
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          {...restField}
                          name={[name, 'first_name']}
                          fieldKey={[fieldKey, 'first_name']}
                          label="Nome"
                          rules={[{ required: true, message: 'Nome obbligatorio' }]}
                        >
                          <Input placeholder="Nome" />
                        </Form.Item>
                      </Col>

                      <Col span={12}>
                        <Form.Item
                          {...restField}
                          name={[name, 'last_name']}
                          fieldKey={[fieldKey, 'last_name']}
                          label="Cognome"
                          rules={[{ required: true, message: 'Cognome obbligatorio' }]}
                        >
                          <Input placeholder="Cognome" />
                        </Form.Item>
                      </Col>

                      <Col span={12}>
                        <Form.Item
                          {...restField}
                          name={[name, 'email']}
                          fieldKey={[fieldKey, 'email']}
                          label="Email"
                          rules={[{ type: 'email', message: 'Email non valida' }]}
                        >
                          <Input placeholder="Email (opzionale)" />
                        </Form.Item>
                      </Col>

                      <Col span={12}>
                        <Form.Item
                          {...restField}
                          name={[name, 'phone']}
                          fieldKey={[fieldKey, 'phone']}
                          label="Telefono"
                        >
                          <Input placeholder="Telefono (opzionale)" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Aggiungi Contatto
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Card>

        <Form.Item style={{ marginTop: 24 }}>
          <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
            Salva
          </Button>
          {editing && <Button onClick={onCancel}>Annulla</Button>}
        </Form.Item>
      </Form>
    </Card>
  );
}
