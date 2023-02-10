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
  message,
  Row
} from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useForm } from 'antd/lib/form/Form';
import { useMutation, useQuery } from 'react-query';
import { getListEkycs, updateEkyc, createEkyc, getListApis } from '@api/ekycs';
import { IListEkycs } from '../../@types/ekycs';
import moment from 'moment';
import Modal from '@components/customAntd/Modal';
import { IListProviders } from '../../@types/providers';
import { getListProviders } from '@api/providers';
import { sortByDate } from '@utils/common';
import { pickBy } from 'lodash';

const { Title } = Typography;

const Ekycs = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = useForm();
  const [list, setList] = useState<IListEkycs[]>([]);
  const [titleModal, setTitleModal] = useState<string>('');

  const { data, refetch, isLoading } = useQuery<IListEkycs[]>(
    'listEkycs',
    getListEkycs
  );

  useEffect(() => {
    form.resetFields();
    if (data) {
      setList(data);
    } else {
      setList([]);
    }
  }, [data]);

  const { data: listProviders } = useQuery<IListProviders[]>(
    'listProviders',
    getListProviders
  );

  const { data: listApis } = useQuery<{ key: string; viName: string }[]>(
    'listApis',
    getListApis
  );

  const { mutate: mutateUpdateEkyc, isLoading: isLoadingUpdateKYC } =
    useMutation('updateEkyc', updateEkyc, {
      onSuccess: async () => {
        await refetch();
        await setIsModalOpen(false);
        await message.success('Thành công');
        form.resetFields();
      }
    });

  const { mutate: mutateCreateEkyc, isLoading: isLoaingCreateKYC } =
    useMutation('createEkyc', createEkyc, {
      onSuccess: async () => {
        await refetch();
        await setIsModalOpen(false);
        await message.success('Thành công');
        form.resetFields();
      }
    });

  const onEdit = (record: IListEkycs) => {
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

  const onFinish = (data: any) => {
    if (data.id) {
      mutateUpdateEkyc(
        pickBy(
          data,
          (item) => item !== '' && item !== null && item !== undefined
        ) as IListEkycs
      );
    } else {
      const name = listApis?.find((item) => item.key === data.api)?.viName;
      mutateCreateEkyc({ ...data, name });
    }
  };

  const columns = [
    {
      dataIndex: 'name',
      key: 'name',
      title: 'Tên sản phẩm'
    },
    {
      dataIndex: 'desc',
      key: 'desc',
      title: 'Mô tả'
    },
    {
      dataIndex: 'api',
      key: 'api',
      title: 'API'
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
      render: (_text: string, record: IListEkycs) => (
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
          <Title level={3}>Quản lý sản phẩm</Title>
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
          <Form.Item name="name" className="hidden">
            <Input type="hidden" />
          </Form.Item>
          {form.getFieldValue('id') && (
            <Form.Item label="Active" name="active" valuePropName="checked">
              <Switch />
            </Form.Item>
          )}
          {!form.getFieldValue('id') && (
            <>
              <Form.Item
                label="Tên"
                name="api"
                required
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng chọn api'
                  }
                ]}
              >
                {listApis && (
                  <Select>
                    {listApis.map((item) => (
                      <Select.Option key={item.key} value={item.key}>
                        {item.viName}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="API" name="api">
                <Input readOnly disabled />
              </Form.Item>
              <Form.Item
                label="Provider"
                name="provider_id"
                required
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng chọn provider'
                  }
                ]}
              >
                {listProviders && (
                  <Select>
                    {listProviders.map((item) => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </>
          )}
          <Form.Item label="Mô tả" name="desc">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button
              block
              type="primary"
              htmlType="submit"
              loading={isLoaingCreateKYC || isLoadingUpdateKYC}
            >
              Lưu lại
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
};

export default Ekycs;
