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
  message,
  Row
} from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useForm } from 'antd/lib/form/Form';
import { useMutation, useQuery } from 'react-query';
import {
  getListProviders,
  updateProvider,
  createProvider
} from '@api/providers';
import { IListProviders } from '../../@types/providers';
import moment from 'moment';
import Modal from '@components/customAntd/Modal';
import { sortByDate } from '@utils/common';

const { Title } = Typography;

const Providers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = useForm();
  const [list, setList] = useState<IListProviders[]>([]);
  const [titleModal, setTitleModal] = useState<string>('');

  const { data, refetch, isLoading } = useQuery<IListProviders[]>(
    'listProviders',
    getListProviders
  );

  useEffect(() => {
    form.resetFields();
    if (data) {
      setList(data);
    } else {
      setList([]);
    }
  }, [data]);

  const { mutate: mutateUpdateProvider, isLoading: isLoadingUpdateProvider } =
    useMutation('updateProvider', updateProvider, {
      onSuccess: async () => {
        await refetch();
        await setIsModalOpen(false);
        await message.success('Thành công');
        form.resetFields();
      }
    });

  const { mutate: mutateCreateProvider, isLoading: isLoadingCreateProvider } =
    useMutation('createProvider', createProvider, {
      onSuccess: async () => {
        await refetch();
        await setIsModalOpen(false);
        await message.success('Thành công');
        form.resetFields();
      }
    });

  const onEdit = (record: IListProviders) => {
    form.setFieldsValue({
      id: record.id,
      name: record.name,
      desc: record.desc,
      active: record.active
    });
    setTitleModal(record.name);
    setIsModalOpen(true);
  };

  const onCreate = () => {
    form.resetFields();
    setIsModalOpen(true);
    setTitleModal('');
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = (data: IListProviders) => {
    if (data.id) {
      mutateUpdateProvider(data);
    } else {
      mutateCreateProvider(data);
    }
  };

  const columns = [
    {
      dataIndex: 'name',
      key: 'name',
      title: 'Tên'
    },
    {
      dataIndex: 'desc',
      key: 'desc',
      title: 'Mô tả'
    },
    {
      title: 'Active',
      dataIndex: 'active',
      key: 'active',
      render: (text: boolean) => (
        <Tag color={text ? 'green' : 'red'}>{text ? 'ACTIVE' : 'INACTVE'}</Tag>
      )
    },
    {
      dataIndex: 'created_at',
      key: 'created_at',
      title: 'Ngày tạo',
      render: (text: string) => moment(text).format('DD/MM/YYYY HH:mm')
    },
    {
      title: 'Action',
      key: 'action',
      render: (_text: string, record: IListProviders) => (
        <Space>
          <Button
            size="small"
            type="primary"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          />
        </Space>
      )
    }
  ];

  return (
    <Space direction="vertical" size="large">
      <Card bordered={false}>
        <Row justify="space-between">
          <Title level={3}>Quản lý Providers</Title>
          <Button type="primary" onClick={onCreate}>
            Tạo mới
          </Button>
        </Row>
      </Card>
      <Card bordered={false}>
        <Table
          loading={isLoading}
          size="small"
          rowKey="id"
          dataSource={list.sort((a, b) =>
            sortByDate(b.created_at, a.created_at)
          )}
          columns={columns}
          scroll={{ x: 'auto' }}
        />
      </Card>
      <Modal open={isModalOpen} onCancel={handleCancel} title={titleModal}>
        <Form layout="vertical" onFinish={onFinish} form={form}>
          <Form.Item name="id" className="hidden">
            <Input type="hidden" />
          </Form.Item>
          {form.getFieldValue('id') && (
            <Form.Item label="Active" name="active" valuePropName="checked">
              <Switch />
            </Form.Item>
          )}
          <Form.Item
            label="Tên"
            name="name"
            required
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập tên'
              }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Mô tả" name="desc">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button
              block
              type="primary"
              htmlType="submit"
              loading={isLoadingCreateProvider || isLoadingUpdateProvider}
            >
              Lưu lại
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
};

export default Providers;
