import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Space,
  Form,
  Typography,
  Card,
  Input,
  Select,
  Row,
  Col,
  Tag
} from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useForm } from 'antd/lib/form/Form';
import { useMutation, useQuery } from 'react-query';
import {
  exportExcelTransactions,
  getListTransactions
} from '@api/transactions';
import {
  IListTransactions,
  ISearchTransactions
} from '../../@types/transactions';
import moment from 'moment';
import { pickBy } from 'lodash';
import { getListApis } from '@api/ekycs';
import RangePickerFormItem from '@components/customAntd/RangePickerFormItem';
import { getListPartners } from '@api/partners';
import { IListPartners } from '../../@types/partners';
import ModalInfo from '@components/Transaction/ModalInfo';
import { renderStatusTag } from '@utils/common';
import { AxiosResponse } from 'axios';
import { FileExcelOutlined, SearchOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Transactions = () => {
  const [formSearch] = useForm();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<ISearchTransactions>({
    page: 1,
    limit: 10
  });
  const [detailTrans, setDetailTrans] = useState<any>();

  const { data: listApis } = useQuery<{ key: string; viName: string }[]>(
    'listApis',
    getListApis
  );

  useEffect(() => {
    refetch();
  }, [query]);

  const { data: listPartners, isLoading: isLoadingPartner } = useQuery<
    IListPartners[]
  >('listPartners', getListPartners);

  const { data, refetch, isLoading } = useQuery<{
    count: number;
    rows: IListTransactions[];
  }>(['listTransactions', query], getListTransactions);

  const { mutate, isLoading: isLoadingExport } = useMutation(
    exportExcelTransactions,
    {
      onSuccess: (response: AxiosResponse) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Danh_sach_giao_dich.xlsx');
        document.body.appendChild(link);
        link.click();
      }
    }
  );

  const onSearch = (data: any) => {
    const updatedQuery = {
      from: data.time && data.time[0] && data.time[0]?.startOf('days').unix(),
      to: data.time && data.time[1] && data.time[1]?.endOf('days').unix(),
      status: data.status,
      api: data.api,
      partner_id: data.partner_id,
      trans_id: data.trans_id,
      call_api: data.call_api
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
      dataIndex: 'partner',
      key: 'partner',
      title: 'Tên đối tác',
      render: (partner: { name: string }) => <span>{partner?.name}</span>
    },
    {
      dataIndex: 'trans_id',
      key: 'trans_id',
      title: 'Mã giao dịch',
      render: (text: string) => <Text copyable>{text}</Text>
    },
    {
      dataIndex: 'api',
      key: 'api',
      title: 'Tên sản phẩm',
      render: (api: string) => {
        const apiInfo = listApis?.find((item) => item.key === api);
        return <>{apiInfo?.viName}</>;
      }
    },
    {
      dataIndex: 'price',
      key: 'price',
      title: 'Giá tiền',
      render: (price: number) => price && Number(price).toLocaleString('en-AU')
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
      title: '',
      key: 'action',
      render: (record: any) => (
        <Button
          size="small"
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => {
            setIsOpen(true);
            setDetailTrans(record);
          }}
        ></Button>
      )
    }
  ];

  return (
    <Space direction="vertical" size="large">
      <Title level={3}>Danh sách giao dịch</Title>
      <Card bordered={false}>
        <Form layout="vertical" form={formSearch} onFinish={onSearch}>
          <Row gutter={24}>
            <Col xs={24} sm={8}>
              <Form.Item name="trans_id">
                <Input allowClear placeholder="Mã giao dịch" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
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
            <Col xs={24} sm={8}>
              <Form.Item name="api">
                <Select allowClear placeholder="Tên sản phẩm">
                  {listApis?.map((api) => (
                    <Select.Option key={api.key} value={api.key}>
                      {api.viName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="status">
                <Select allowClear placeholder="Trạng thái giao dịch">
                  <Select.Option value="SUCCESS">SUCCESS</Select.Option>
                  <Select.Option value="PENDING">PENDING</Select.Option>
                  <Select.Option value="FAILED">FAILED</Select.Option>
                  <Select.Option value="PROCESSING">PROCESSING</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="call_api">
                <Select allowClear placeholder="Call Api">
                  <Select.Option value={true}>TRUE</Select.Option>
                  <Select.Option value={false}>FALSE</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
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

                <Button type="dashed" onClick={() => formSearch.resetFields()}>
                  Xóa bộ lọc
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
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
      {detailTrans && (
        <ModalInfo
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          detailTrans={detailTrans}
        />
      )}
    </Space>
  );
};

export default Transactions;
