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
  Checkbox,
  Col,
  Modal as ModalAntd,
  Select
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { useForm } from 'antd/lib/form/Form';
import { useMutation, useQuery } from 'react-query';
import {
  getListAdmins,
  updateAdmin,
  createAdmin,
  getListPermission,
  getAdminInfo,
  deleteAdmin
} from '@api/admin-manage';
import { IListAdmins } from '../../@types/admin-manage';
import moment from 'moment';
import Modal from '@components/customAntd/Modal';
import { makePassword, sortByDate } from '@utils/common';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const AdminManage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = useForm();
  const [formSearch] = useForm();
  const [list, setList] = useState<IListAdmins[]>([]);
  const [titleModal, setTitleModal] = useState<string>('');

  const { data, refetch, isLoading } = useQuery<IListAdmins[]>(
    'listAdmins',
    getListAdmins
  );

  const { data: listPermission } = useQuery<[]>(
    'listPermission',
    getListPermission
  );

  const { mutate: mutateGetAdminInfo } = useMutation(
    'getAdminInfo',
    getAdminInfo,
    {
      onSuccess: async (info: {
        permissions: string;
        id: string;
        active: boolean;
        name: string;
      }) => {
        form.setFieldsValue({
          id: info?.id,
          active: info?.active,
          permissions: info?.permissions
        });
        setTitleModal(info?.name);
        setIsModalOpen(true);
      }
    }
  );

  useEffect(() => {
    form.resetFields();
    if (data) {
      setList(data);
    } else {
      setList([]);
    }
  }, [data]);

  const { mutate: mutateUpdateAdmin, isLoading: isLoadingUpdateAdmin } =
    useMutation('updateAdmin', updateAdmin, {
      onSuccess: async () => {
        await refetch();
        await setIsModalOpen(false);
        await message.success('Thành công');
        form.resetFields();
      }
    });

  const { mutate: mutateCreateAdmin, isLoading: isLoadingCreateAdmin } =
    useMutation('createAdmin', createAdmin, {
      onSuccess: async () => {
        await refetch();
        await setIsModalOpen(false);
        await message.success('Thành công');
        form.resetFields();
      }
    });

  const { mutate: mutateDeleteAdmin } = useMutation(
    'deleteAdmin',
    deleteAdmin,
    {
      onSuccess: async () => {
        await refetch();
        await message.success('Thành công');
      }
    }
  );

  const onEdit = (record: IListAdmins) => {
    mutateGetAdminInfo(record.id);
  };

  const onCreate = () => {
    form.resetFields();
    setIsModalOpen(true);
    setTitleModal('');
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onDelete = (id: string) => {
    ModalAntd.confirm({
      onOk: () => mutateDeleteAdmin(id),
      okText: 'Đồng ý',
      okType: 'danger',
      title: 'Bạn có chắc chắn muốn xóa?',
      content: 'Xóa tài khoản này sẽ không thể khôi phục',
      centered: true
    });
  };

  const onFinish = (data: any) => {
    if (data.id) {
      mutateUpdateAdmin({ ...data, permissions: data.permissions || [] });
    } else {
      mutateCreateAdmin({ ...data, permissions: data.permissions || [] });
    }
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
      dataIndex: 'is_owner',
      key: 'Role',
      title: 'Role',
      render: (is_owner: boolean) => {
        return is_owner ? (
          <Tag color="red">OWNER</Tag>
        ) : (
          <Tag color="blue">ADMIN</Tag>
        );
      }
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
      render: (_text: string, record: IListAdmins) => (
        <Space>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              navigate(`/account?type=admin&id=${record.id}`);
            }}
          />
          {!record?.is_owner && (
            <Button
              size="small"
              type="primary"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            />
          )}
          {!record?.is_owner && (
            <Button
              size="small"
              type="primary"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDelete(record.id)}
            />
          )}
        </Space>
      )
    }
  ];

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

  return (
    <Space direction="vertical" size="large">
      <Card bordered={false}>
        <Row justify="space-between">
          <Title level={3}>Quản lý Admin</Title>
          <Button type="primary" onClick={onCreate}>
            Tạo mới
          </Button>
        </Row>
      </Card>
      <Card bordered={false}>
        <Space direction="vertical" size="large">
          <Form
            layout="inline"
            form={formSearch}
            onValuesChange={(_changeValue, values) => {
              onChangeSearch(values);
            }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={8}>
                <Form.Item name="status">
                  <Select placeholder="Trạng thái" allowClear>
                    <Select.Option value="">Tất cả</Select.Option>
                    <Select.Option value="ACTIVE">ACTIVE</Select.Option>
                    <Select.Option value="INACTIVE">INACTIVE</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item name="name">
                  <Input
                    placeholder="Tên"
                    allowClear
                    prefix={<SearchOutlined />}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item name="email">
                  <Input
                    placeholder="Email"
                    allowClear
                    prefix={<SearchOutlined />}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
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
        </Space>
      </Card>
      <Modal open={isModalOpen} onCancel={handleCancel} title={titleModal}>
        <Form layout="vertical" onFinish={onFinish} form={form}>
          <Form.Item name="id" className="hidden">
            <Input type="hidden" />
          </Form.Item>
          {titleModal && (
            <Form.Item label="Active" name="active" valuePropName="checked">
              <Switch />
            </Form.Item>
          )}
          {!titleModal && (
            <>
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
              <Form.Item
                label="Email"
                name="email"
                required
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập email'
                  },
                  {
                    type: 'email',
                    message: 'Email không đúng định dạng'
                  }
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập mật khẩu'
                  },
                  {
                    min: 6,
                    message: 'Mật khẩu từ 6 đến 30 ký tự'
                  },
                  {
                    max: 30,
                    message: 'Mật khẩu từ 6 đến 30 ký tự'
                  }
                ]}
                label={
                  <Space>
                    <>Mật khẩu</>
                    <Button
                      onClick={() =>
                        form.setFieldsValue({ password: makePassword(8) })
                      }
                    >
                      Tạo ngẫu nhiên
                    </Button>
                  </Space>
                }
              >
                <Input.Password />
              </Form.Item>
            </>
          )}
          <Form.Item label="Quyền" name="permissions">
            <Checkbox.Group style={{ width: '100%' }}>
              <Row gutter={[12, 12]}>
                {listPermission?.map((item: { key: string; name: string }) => {
                  return (
                    <Col span={12} key={item.key}>
                      <Checkbox value={item.key}>{item.name}</Checkbox>
                    </Col>
                  );
                })}
              </Row>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item>
            <Button
              block
              type="primary"
              htmlType="submit"
              loading={isLoadingCreateAdmin || isLoadingUpdateAdmin}
            >
              Lưu lại
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
};

export default AdminManage;
