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
  Row,
  Select
} from 'antd';
import { EditOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { useForm } from 'antd/lib/form/Form';
import { useMutation, useQuery } from 'react-query';
import { getListUsers, updateUser } from '@api/users';
import { IListUsers } from '../../@types/users';
import moment from 'moment';
import Modal from '@components/customAntd/Modal';
import { sortByDate } from '@utils/common';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Users = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [list, setList] = useState<IListUsers[]>([]);
  const [form] = useForm();
  const [formSearch] = useForm();
  const [titleModal, setTitleModal] = useState<string>('');

  const navigate = useNavigate();

  const { data, refetch, isLoading } = useQuery<IListUsers[]>(
    'listUsers',
    getListUsers
  );

  useEffect(() => {
    formSearch.resetFields();
    if (data) {
      setList(data);
    } else {
      setList([]);
    }
  }, [data]);

  const { mutate: mutateUpdateUser, isLoading: isLoadingUpdateUser } =
    useMutation('updateUser', updateUser, {
      onSuccess: async () => {
        setIsModalOpen(false);
        await message.success('Thành công');
        await refetch();
        form.resetFields();
      }
    });

  const showModal = (record: IListUsers) => {
    form.setFieldValue('id', record.id);
    form.setFieldValue('active', record.active);
    setTitleModal(record.name || record.email);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = (data: IListUsers) => {
    mutateUpdateUser(data);
  };

  const onChangeSearch = (value: {
    name: string;
    status: string;
    email: string;
  }) => {
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
      if (
        item.name &&
        item.name.toLowerCase().includes(value.name.toLowerCase())
      ) {
        return item;
      }
    });
    const filterEmail = filterName?.filter((item) => {
      if (!value.email || value.email === '') {
        return item;
      }
      if (item.email.toLowerCase().includes(value.email.toLowerCase())) {
        return item;
      }
    });
    setList(filterEmail || []);
  };

  const columns = [
    {
      dataIndex: 'name',
      key: 'name',
      title: 'Tên'
    },
    {
      dataIndex: 'email',
      key: 'email',
      title: 'Email'
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
      render: (_text: string, record: IListUsers) => (
        <Space>
          <Button
            size="small"
            type="primary"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
          />
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              navigate(`/account?type=user&id=${record.id}`);
            }}
          />
        </Space>
      )
    }
  ];

  return (
    <Space direction="vertical" size="large">
      <Card bordered={false}>
        <Row justify="space-between" gutter={[16, 16]}>
          <Title level={3}>Quản lý người dùng</Title>
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
                  placeholder="Tên người dùng"
                  allowClear
                  prefix={<SearchOutlined />}
                />
              </Form.Item>
              <Form.Item name="email">
                <Input
                  placeholder="Email"
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
          loading={isLoading}
          size="small"
          rowKey="id"
          dataSource={list.sort((a, b) =>
            sortByDate(b.created_at, a.created_at)
          )}
          columns={columns}
          scroll={{ x: 'auto' }}
          pagination={{
            position: ['bottomRight'],
            total: list?.length,
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
          <Form.Item>
            <Button
              block
              type="primary"
              htmlType="submit"
              loading={isLoadingUpdateUser}
            >
              Lưu lại
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
};

export default Users;
