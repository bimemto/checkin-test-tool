import React from 'react';
import { Col, Form, Input, Row, Select, DatePicker } from 'antd';
import { useForm } from 'antd/lib/form/Form';

type IProps = {
  onFinishForm: any;
};

const TransactionFilter = ({ onFinishForm }: IProps) => {
  const [form] = useForm();
  return (
    <Form layout="vertical" form={form} onFinish={onFinishForm}>
      <Row gutter={24}>
        <Col xs={24} sm={8} md={8}>
          <Form.Item name="trans_id" label="Trans ID">
            <Input allowClear />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8} md={8}>
          <Form.Item name="user_id" label="User ID">
            <Input allowClear />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8} md={8}>
          <Form.Item name="type" label="Type">
            <Select allowClear>
              <Select.Option key="NID" value="NID">
                NID
              </Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={8} md={8}>
          <Form.Item name="numberType" label="Number of type">
            <Select allowClear>
              <Select.Option key="NID" value="NID">
                NID
              </Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={8} md={8}>
          <Form.Item name="status" label="Status">
            <Select allowClear>
              <Select.Option key="success" value="success">
                Success
              </Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={8} md={8}>
          <Form.Item name="date" label="Date">
            <DatePicker.RangePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default TransactionFilter;
