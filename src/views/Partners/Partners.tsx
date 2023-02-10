import React, { useEffect, useState } from 'react';
import {
  Tag,
  Table,
  Button,
  Space,
  Form,
  Typography,
  Card,
  Switch,
  Input,
  Select,
  Row,
  InputNumber
} from 'antd';
import { EditOutlined, SearchOutlined } from '@ant-design/icons';
import { useForm } from 'antd/lib/form/Form';
import { useMutation, useQuery } from 'react-query';
import { getListPartners, updatePartner } from '@api/partners';
import { IListPartners } from '../../@types/partners';
import moment from 'moment';
import Modal from '@components/customAntd/Modal';
import { sortByDate } from '@utils/common';

const { Title } = Typography;

const Partners = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [list, setList] = useState<IListPartners[]>([]);
  const [form] = useForm();
  const [formSearch] = useForm();
  const [titleModal, setTitleModal] = useState<string>('');

  const {
    data,
    refetch,
    isLoading: isLoadingPartner
  } = useQuery<IListPartners[]>('listPartners', getListPartners);

  useEffect(() => {
    formSearch.resetFields();
    if (data) {
      setList(data);
    } else {
      setList([]);
    }
  }, [data]);

  const { mutate: mutateUpdatePartner, isLoading: isLoadingUpdate } =
    useMutation('updatePartner', updatePartner, {
      onSuccess: async () => {
        await refetch();
        setIsModalOpen(false);
        form.resetFields();
      }
    });

  const showModal = (record: IListPartners) => {
    setTitleModal(record.name);
    form.setFieldsValue({
      id: record.id,
      active: record.active,
      partner_code: record.partner_code,
      fee_cashout: record.fee_cashout,
      list_ips: record.list_ips || ['']
    });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const onFinish = (data: IListPartners) => {
    mutateUpdatePartner(data);
  };

  const onChangeSearch = (value: { name: string; status: string }) => {
    const filterStatus = data?.filter((item) => {
      if (!value.status || value.status === '') {
        return item;
      }
      if (value.status === 'ACTIVE') {
        return item.active;
      }
      if (value.status === 'INACTIVE') {
        return item.active === false;
      }
    });
    const filterName = filterStatus?.filter((item) => {
      if (!value.name || value.name === '') {
        return item;
      }
      if (item.name.toLowerCase().includes(value.name.toLowerCase())) {
        return item;
      }
    });
    setList(filterName || []);
  };

  const columns = [
    {
      dataIndex: 'name',
      key: 'name',
      title: 'Tên đối tác'
    },
    {
      dataIndex: 'phone_number',
      key: 'phone_number',
      title: 'Số điện thoại'
    },
    {
      dataIndex: 'type',
      key: 'type',
      title: 'Loại tài khoản'
    },
    {
      dataIndex: 'partner_code',
      key: 'partner_code',
      title: 'Mã đối tác'
    },
    {
      dataIndex: 'fee_cashout',
      key: 'fee_cashout',
      title: 'Phí rút tiền',
      render: (fee_cashout: number) =>
        fee_cashout && Number(fee_cashout).toLocaleString('en-AU')
    },
    {
      dataIndex: 'list_ips',
      key: 'list_ips',
      title: 'Danh sách IP',
      render: (list_ips: string[]) =>
        list_ips?.map((item) => (
          <Tag key={item} color="blue">
            {item}
          </Tag>
        ))
    },
    {
      title: 'Active',
      dataIndex: 'active',
      key: 'active',
      render: (text: boolean) => (
        <Tag color={text ? 'green' : 'red'}>{text ? 'ACTIVE' : 'INACTIVE'}</Tag>
      )
    },
    {
      dataIndex: 'created_at',
      key: 'created_at',
      title: 'Ngày đăng ký',
      render: (text: string) => moment(text).format('DD/MM/YYYY HH:mm')
    },
    {
      title: 'Action',
      key: 'action',
      render: (_text: string, record: IListPartners) => (
        <Button
          size="small"
          type="primary"
          icon={<EditOutlined />}
          onClick={() => showModal(record)}
        />
      )
    }
  ];

  return (
    <Space direction="vertical" size="large">
      <Card bordered={false}>
        <Row justify="space-between" gutter={[16, 16]}>
          <Title level={3}>Quản lý đối tác</Title>
          <Form
            layout="inline"
            form={formSearch}
            onValuesChange={(_changeValue, values) => {
              onChangeSearch(values);
            }}
          >
            <Row gutter={[16, 16]}>
              <Form.Item name="status">
                <Select
                  placeholder="Trạng thái"
                  style={{ width: 200 }}
                  allowClear
                >
                  <Select.Option value="">Tất cả</Select.Option>
                  <Select.Option value="ACTIVE">ACTIVE</Select.Option>
                  <Select.Option value="INACTIVE">INACTIVE</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="name">
                <Input
                  placeholder="Tên đối tác"
                  allowClear
                  prefix={<SearchOutlined />}
                />
              </Form.Item>
            </Row>
          </Form>
        </Row>
      </Card>
      <Card bordered={false}>
        <Table
          loading={isLoadingPartner}
          size="small"
          rowKey="id"
          dataSource={list.sort((a, b) =>
            sortByDate(b.created_at, a.created_at)
          )}
          columns={columns}
          scroll={{ x: 'auto' }}
          pagination={{
            position: ['bottomRight'],
            total: data?.length,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} bản ghi`
          }}
        />
      </Card>
      <Modal open={isModalOpen} onCancel={handleCancel} title={titleModal}>
        <Form layout="vertical" onFinish={onFinish} form={form}>
          <Form.Item name="id" className="hidden">
            <Input type="hidden" />
          </Form.Item>
          <Form.Item label="Active" name="active" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item
            label="Mã đối tác"
            name="partner_code"
            required
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập Mã đối tác'
              },
              {
                pattern: /^[a-zA-Z ]+$/,
                message: 'Mã đối tác không được chứa số hoặc ký tự đặc biệt'
              }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Phí rút tiền"
            name="fee_cashout"
            rules={[
              {
                pattern: /^[0-9]+$/,
                message: 'Phí rút tiền phải là số nguyên dương'
              }
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>
          {/* <Form.List
            name="list_ips"
            initialValue={['']}
            rules={[
              {
                validator: async (_, list) => {
                  if (!list || list.length < 1) {
                    return Promise.reject(new Error('Vui lòng nhập IP'));
                  }
                }
              }
            ]}
          >
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Space
                    key={field.key}
                    align="baseline"
                    style={{ width: '100%' }}
                  >
                    <Form.Item
                      {...field}
                      label={index === 0 ? 'List IPs' : ''}
                      name={field.name}
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng nhập IP'
                        },
                        {
                          pattern: /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/,
                          message: 'IP không hợp lệ'
                        }
                      ]}
                    >
                      <Input placeholder="IP" />
                    </Form.Item>
                    {index > 0 && (
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    )}
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    style={{
                      width: '60%'
                    }}
                    icon={<PlusOutlined />}
                  >
                    Thêm IP
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List> */}

          <Form.Item>
            <Button
              block
              type="primary"
              htmlType="submit"
              loading={isLoadingUpdate}
            >
              Lưu lại
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
};

export default Partners;
