import React, { useEffect, useState } from 'react';
import {
  Table,
  Space,
  Form,
  Typography,
  Card,
  Input,
  Row,
  Button,
  Modal,
  Statistic
} from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useMutation, useQuery } from 'react-query';
import {
  getListBalancePartner,
  getBalancePartnerDetail
} from '@api/balance-transaction';
import { IListBalancePartner } from '../../@types/balance-transaction';
import {
  EyeOutlined,
  SearchOutlined,
  FileExcelOutlined
} from '@ant-design/icons';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const { Title } = Typography;

const BalancePartner = () => {
  const [list, setList] = useState<IListBalancePartner[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [titleModal, setTitleModal] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formSearch] = useForm();

  const { data, isLoading } = useQuery<IListBalancePartner[]>(
    'listBalancePartner',
    getListBalancePartner
  );

  useEffect(() => {
    formSearch.resetFields();
    if (data) {
      setList(data);
    } else {
      setList([]);
    }
  }, [data]);

  const { mutate, isLoading: isLoadingDetailBalance } = useMutation(
    'getBalancePartnerDetail',
    getBalancePartnerDetail,
    {
      onSuccess: async (balance: number) => {
        setBalance(balance);
      }
    }
  );

  const onChangeSearch = (value: { name: string }) => {
    const filterName = data?.filter((item) => {
      if (!value.name || value.name === '') {
        return item;
      }
      if (
        item.partner_name &&
        item.partner_name.toLowerCase().includes(value.name.toLowerCase())
      ) {
        return item;
      }
    });
    setList(filterName || []);
  };

  const onExport = () => {
    if (list.length === 0) {
      return;
    }
    const dataExportExcel = list.map((item) => {
      return {
        'Tên đối tác': item.partner_name,
        'Mã đối tác': item.partner_custom_name,
        'Số dư': item.balance
      };
    });
    const fileName = `Số dư đối tác`;
    const fileType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const ws = XLSX.utils.json_to_sheet(dataExportExcel);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const dataEx = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(dataEx, fileName + fileExtension);
  };

  const onDetail = (record: IListBalancePartner) => {
    mutate(record.partner_id);
    setTitleModal(record.partner_name);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setBalance(0);
    setIsModalOpen(false);
  };

  const columns = [
    {
      dataIndex: 'partner_name',
      key: 'partner_name',
      title: 'Tên đối tác'
    },
    {
      dataIndex: 'partner_custom_name',
      key: 'partner_custom_name',
      title: 'Mã đối tác'
    },
    {
      title: 'Số dư',
      dataIndex: 'balance',
      key: 'balance',
      render: (balance: number) => balance && balance.toLocaleString('en-US')
    },
    {
      title: 'Action',
      key: 'action',
      render: (_text: string, record: IListBalancePartner) => (
        <Button
          size="small"
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => onDetail(record)}
        />
      )
    }
  ];

  return (
    <Space direction="vertical" size="large">
      <Card bordered={false}>
        <Row justify="space-between" gutter={[16, 16]}>
          <Title level={3}>Số dư đối tác</Title>
          <Button
            type="primary"
            onClick={onExport}
            icon={<FileExcelOutlined />}
          >
            Xuất báo cáo
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
            <Form.Item name="name">
              <Input
                prefix={<SearchOutlined />}
                placeholder="Tên đối tác"
                allowClear
              />
            </Form.Item>
          </Form>
          <Table
            loading={isLoading}
            size="small"
            rowKey="partner_id"
            dataSource={list}
            columns={columns}
            scroll={{ x: 'auto' }}
            pagination={false}
          />
        </Space>
      </Card>
      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        title={titleModal}
        footer={null}
      >
        <Statistic
          title="Số dư (VNĐ)"
          value={balance}
          loading={isLoadingDetailBalance}
        />
      </Modal>
    </Space>
  );
};

export default BalancePartner;
