import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Space,
  Form,
  Typography,
  Card,
  Input,
  message,
  Select,
  InputNumber,
  Row,
  Col,
  Tag,
  Statistic
} from 'antd';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useForm } from 'antd/lib/form/Form';
import { useMutation, useQuery } from 'react-query';
import {
  getListBalanceTransaction,
  updateBalanceTransaction,
  getBalanceProvider,
  exportExcelPayment
} from '@api/balance-transaction';
import {
  IListBalanceTransaction,
  ISearchBalanceTransaction
} from '../../@types/balance-transaction';
import moment from 'moment';
import Modal from '@components/customAntd/Modal';
import { pickBy } from 'lodash';
import RangePickerFormItem from '@components/customAntd/RangePickerFormItem';
import { getListPartners } from '@api/partners';
import { IListPartners } from '../../@types/partners';
import { renderStatusTag } from '@utils/common';
import ModalInfo from '@components/Transaction/ModalInfo';
import { AxiosResponse } from 'axios';
import { FileExcelOutlined, SearchOutlined } from '@ant-design/icons';

const { Title } = Typography;

const BalanceTransaction = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = useForm();
  const [formSearch] = useForm();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<ISearchBalanceTransaction>({
    page: 1,
    limit: 10
  });
  const [titleModal, setTitleModal] = useState<string>('');
  const isAdmin = JSON.parse(localStorage.getItem('is_owner') || 'false');
  const [detailTrans, setDetailTrans] = useState<any>();

  const { mutate, isLoading: isLoadingExport } = useMutation(
    exportExcelPayment,
    {
      onSuccess: (response: AxiosResponse) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Danh_sach_nap_rut.xlsx');
        document.body.appendChild(link);
        link.click();
      }
    }
  );

  useEffect(() => {
    refetch();
  }, [query]);

  const { data: listPartners, isLoading: isLoadingPartner } = useQuery<
    IListPartners[]
  >('listPartners', getListPartners);

  const { data, refetch, isLoading } = useQuery<{
    count: number;
    rows: IListBalanceTransaction[];
  }>(['listBalanceTransaction', query], getListBalanceTransaction);

  const { data: dataBalanceProvider, isLoading: isLoadingBalance } = useQuery(
    ['getBalanceProvider'],
    getBalanceProvider
  );

  const {
    mutate: mutateUpdateBalanceTransaction,
    isLoading: isLoadingUpdateBalanceTransaction
  } = useMutation('updateBalanceTransaction', updateBalanceTransaction, {
    onSuccess: async () => {
      await refetch();
      await setIsModalOpen(false);
      await message.success('Thành công');
      form.resetFields();
    }
  });

  const onEdit = (record: IListBalanceTransaction) => {
    form.setFieldsValue({
      id: record.id,
      status: record.status,
      amount: record.amount
    });
    setIsModalOpen(true);
    setTitleModal(record.partner?.name);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = (data: IListBalanceTransaction) => {
    mutateUpdateBalanceTransaction(data);
  };

  const onSearch = (data: any) => {
    const updatedQuery = {
      from: data.time && data.time[0] && data.time[0]?.startOf('days').unix(),
      to: data.time && data.time[1] && data.time[1]?.endOf('days').unix(),
      status: data.status,
      type: data.type,
      partner_id: data.partner_id
    };
    setQuery({
      ...pickBy(
        updatedQuery,
        (value) => value !== undefined && value !== '' && value !== null
      ),
      page: 1,
      limit: 10
    });
  };

  const columns = [
    {
      dataIndex: 'customer_name',
      key: 'customer_name',
      title: 'Mã đối tác'
    },
    {
      dataIndex: 'type',
      key: 'type',
      title: 'Loại giao dịch',
      render: (type: string) => {
        return (
          <Tag color={type === 'CASHIN' ? 'success' : 'error'}>{type}</Tag>
        );
      }
    },
    {
      dataIndex: 'amount',
      key: 'amount',
      title: 'Số tiền',
      render: (amount: number) =>
        amount && Number(amount).toLocaleString('en-AU')
    },
    {
      dataIndex: 'fee',
      key: 'fee',
      title: 'Phí',
      render: (fee: number) => fee && Number(fee).toLocaleString('en-AU')
    },
    {
      dataIndex: 'bank_code',
      key: 'bank_code',
      title: 'Mã ngân hàng'
    },
    {
      dataIndex: 'account_no',
      key: 'account_no',
      title: 'Số tài khoản'
    },
    {
      dataIndex: 'account_name',
      key: 'account_name',
      title: 'Tên tài khoản'
    },
    {
      dataIndex: 'created_at',
      key: 'created_at',
      title: 'Ngày tạo',
      render: (text: string) => moment(text).format('DD/MM/YYYY HH:mm')
    },
    {
      dataIndex: 'status',
      key: 'status',
      title: 'Trạng thái',
      render: (status: string) => {
        return <Tag color={renderStatusTag(status)}>{status}</Tag>;
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (_text: string, record: IListBalanceTransaction) => (
        <Space>
          <Button
            size="small"
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => {
              setIsOpen(true);
              setDetailTrans(record);
            }}
          />
          {isAdmin &&
            record.status === 'PENDING' &&
            record.type === 'CASHIN' && (
              <Button
                size="small"
                type="primary"
                icon={<EditOutlined />}
                onClick={() => onEdit(record)}
              />
            )}
        </Space>
      )
    }
  ];

  return (
    <Space direction="vertical" size="large">
      <Title level={3}>Danh sách giao dịch số dư</Title>
      <Card bordered={false}>
        <Space direction="vertical" size="large">
          <Statistic
            title="Số dư (VNĐ)"
            value={dataBalanceProvider}
            loading={isLoadingBalance}
          />
          <Form layout="vertical" form={formSearch} onFinish={onSearch}>
            <Row gutter={24}>
              <Col xs={24} sm={6}>
                <Form.Item name="status">
                  <Select allowClear placeholder="Trạng thái giao dịch">
                    <Select.Option value="SUCCESS">SUCCESS</Select.Option>
                    <Select.Option value="PENDING">PENDING</Select.Option>
                    <Select.Option value="FAILED">FAILED</Select.Option>
                    <Select.Option value="PROCESSING">PROCESSING</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={6}>
                <Form.Item name="partner_id">
                  <Select
                    placeholder="Đối tác"
                    showSearch
                    allowClear
                    loading={isLoadingPartner}
                    optionFilterProp="children"
                  >
                    {listPartners?.map((partner) => (
                      <Select.Option key={partner.id} value={partner.id}>
                        {partner.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={6}>
                <Form.Item name="type">
                  <Select allowClear placeholder="Loại giao dịch">
                    <Select.Option value="CASHIN">CASHIN</Select.Option>
                    <Select.Option value="CASHOUT">CASHOUT</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={6}>
                <RangePickerFormItem />
              </Col>
              <Col span={24} style={{ textAlign: 'right' }}>
                <Space wrap size="middle">
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SearchOutlined />}
                  >
                    Tìm kiếm
                  </Button>
                  <Button
                    loading={isLoadingExport}
                    onClick={() => {
                      mutate(query);
                    }}
                    icon={<FileExcelOutlined />}
                  >
                    Xuất báo cáo
                  </Button>
                  <Button
                    type="dashed"
                    onClick={() => formSearch.resetFields()}
                  >
                    Xóa bộ lọc
                  </Button>
                </Space>
              </Col>
            </Row>
          </Form>
        </Space>
      </Card>
      <Card bordered={false}>
        <Table
          loading={isLoading}
          size="small"
          dataSource={data?.rows}
          columns={columns}
          scroll={{ x: 'auto' }}
          pagination={{
            position: ['topRight', 'bottomRight'],
            current: query.page,
            pageSize: query.limit,
            total: data?.count,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} bản ghi`,
            onChange: (page, pageSize) => {
              setQuery({
                ...query,
                page,
                limit: pageSize
              });
            }
          }}
        />
      </Card>
      <Modal open={isModalOpen} onCancel={handleCancel} title={titleModal}>
        <Form layout="vertical" onFinish={onFinish} form={form}>
          <Form.Item name="id" className="hidden">
            <Input type="hidden" />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái" style={{ width: '100%' }}>
            <Select allowClear>
              <Select.Option value="SUCCESS">SUCCESS</Select.Option>
              <Select.Option value="PENDING">PENDING</Select.Option>
              <Select.Option value="FAILED">FAILED</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Số tiền"
            name="amount"
            rules={[
              {
                pattern: /^[0-9]+$/,
                message: 'Số tiền phải là số nguyên dương'
              },
              {
                validator: (_, value) => {
                  if (value && value < 50000) {
                    return Promise.reject('Số tiền phải lớn hơn 50.000');
                  }
                  if (value && value > 10000000) {
                    return Promise.reject('Số tiền phải nhỏ hơn 10.000.000');
                  }
                  return Promise.resolve();
                }
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
          <Form.Item>
            <Button
              block
              type="primary"
              htmlType="submit"
              loading={isLoadingUpdateBalanceTransaction}
            >
              Lưu lại
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {detailTrans && (
        <ModalInfo
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          detailTrans={detailTrans}
          onlyRow
        />
      )}
    </Space>
  );
};

export default BalanceTransaction;
