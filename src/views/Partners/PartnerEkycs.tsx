import React, { useEffect, useState } from 'react';
import {
  Table,
  Space,
  Typography,
  Card,
  Button,
  Form,
  Input,
  Select,
  InputNumber
} from 'antd';
import { useMutation, useQuery } from 'react-query';
import {
  addToPartner,
  allPartnerEkycs,
  getListEkycs,
  removeFromPartner,
  updatePartnerEkyc
} from '@api/ekycs';
import {
  IAddEkycToPartner,
  IListEkycs,
  IListPartnerEkycs
} from '../../@types/ekycs';
import { sortByDate } from '@utils/common';
import { ApiOutlined } from '@ant-design/icons';
import Modal from '@components/customAntd/Modal';
import { useForm } from 'antd/lib/form/Form';

const { Title } = Typography;

const PartnerEkycs = () => {
  const [list, setList] = useState<IListPartnerEkycs[]>([]);
  const [isModalOpenAddEkyc, setIsModalOpenAddEkyc] = useState(false);
  const [formAddEkyc] = useForm();
  const [titleModal, setTitleModal] = useState<string>('');
  const [selectedEkyc, setSelectedEkyc] = useState<string>('');
  const [isUpdatePartnerEkyc, setIsUpdatePartnerEkyc] = useState('');

  const { data: listEkycs } = useQuery<IListEkycs[]>('listEkycs', getListEkycs);

  const { data, refetch, isLoading } = useQuery<IListPartnerEkycs[]>(
    'allPartnerEkycs',
    allPartnerEkycs
  );

  const { mutate: mutateAddEkycToPartner, isLoading: isLoadingAddPartner } =
    useMutation('addToPartner', addToPartner, {
      onSuccess: async () => {
        handleCancelAddEkyc();
        refetch();
      }
    });

  const { mutate: mutateUpdatePartnerEkyc, isLoading: isLoadingUpdate } =
    useMutation('updatePartnerEkyc', updatePartnerEkyc, {
      onSuccess: async () => {
        handleCancelAddEkyc();
        refetch();
      }
    });

  const {
    mutate: mutateRemoveEkycFromPartner,
    isLoading: isLoadingRemoveEkyc
  } = useMutation('removeFromPartner', removeFromPartner, {
    onSuccess: async () => {
      handleCancelAddEkyc();
      refetch();
    }
  });

  useEffect(() => {
    if (data) {
      const mapData = data.map((item) => {
        const ekycData = {} as any;
        item.ekycs.forEach((ekyc: { ekyc_id: string; price: number }) => {
          ekycData[ekyc.ekyc_id] = ekyc.price;
        });
        return {
          ...item,
          ...ekycData
        };
      });
      setList(mapData);
    } else {
      setList([]);
    }
  }, [data]);

  const showModalAddEkyc = (record: IListPartnerEkycs) => {
    formAddEkyc.setFieldValue('partner_id', record.id);
    setIsModalOpenAddEkyc(true);
    setTitleModal(record.name);
  };

  const columns = [
    {
      dataIndex: 'name',
      key: 'name',
      title: 'Tên'
    },
    ...(listEkycs
      ? listEkycs.map((item) => ({
          dataIndex: item.id,
          key: item.id,
          title: item.name,
          width: 150,
          render: (price: number) => {
            return typeof price === 'number'
              ? price.toLocaleString('en-US')
              : '_';
          }
        }))
      : []),
    {
      title: 'Action',
      key: 'action',
      render: (_text: string, record: IListPartnerEkycs) => (
        <Button
          size="small"
          type="primary"
          icon={<ApiOutlined />}
          onClick={() => showModalAddEkyc(record)}
        />
      )
    }
  ];

  const handleCancelAddEkyc = () => {
    formAddEkyc.resetFields();
    setIsModalOpenAddEkyc(false);
    setIsUpdatePartnerEkyc('');
    setSelectedEkyc('');
  };

  const onFinishAddEkyc = (data: IAddEkycToPartner) => {
    mutateAddEkycToPartner(data);
  };

  const onChangeSelectedEkyc = (value: string) => {
    const partner_id = formAddEkyc.getFieldValue('partner_id');
    const partnerEkyc = data?.find((item) => item.id === partner_id);
    const ekyc = partnerEkyc?.ekycs.find((item) => item.ekyc_id === value);
    if (ekyc) {
      formAddEkyc.setFieldsValue({
        price: ekyc.price
      });
      setIsUpdatePartnerEkyc(ekyc.id);
    } else {
      formAddEkyc.setFieldsValue({
        price: null
      });
      setIsUpdatePartnerEkyc('');
    }
    setSelectedEkyc(value);
  };

  const onRemoveEkycFromPartner = () => {
    const id = isUpdatePartnerEkyc;
    mutateRemoveEkycFromPartner({ id });
  };

  const onUpdatePartnerEkyc = () => {
    formAddEkyc.validateFields().then((values) => {
      const { price } = values;
      const id = isUpdatePartnerEkyc;
      mutateUpdatePartnerEkyc({ id, price });
    });
  };

  return (
    <Space direction="vertical" size="large">
      <Title level={3}>Danh sách sản phẩm của đối tác</Title>
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
      <Modal
        title={`Gán Ekyc cho partner ${titleModal}`}
        open={isModalOpenAddEkyc}
        onCancel={handleCancelAddEkyc}
      >
        <Form layout="vertical" onFinish={onFinishAddEkyc} form={formAddEkyc}>
          <Form.Item name="partner_id" className="hidden">
            <Input type="hidden" />
          </Form.Item>
          <Form.Item
            name="ekyc_id"
            label="Ekyc"
            required
            rules={[
              {
                required: true,
                message: 'Vui lòng chọn Ekyc'
              }
            ]}
          >
            {listEkycs && (
              <Select onChange={onChangeSelectedEkyc}>
                {listEkycs.map((ekyc) => (
                  <Select.Option key={ekyc.id} value={ekyc.id}>
                    {ekyc.name}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          {selectedEkyc && (
            <Form.Item
              name="price"
              label="Giá tiền"
              required
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập giá tiền'
                },
                {
                  pattern: /^[0-9]*$/,
                  message: 'Vui lòng nhập số nguyên dương'
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
          )}
          {isUpdatePartnerEkyc ? (
            <Form.Item>
              <Button
                block
                type="primary"
                onClick={onUpdatePartnerEkyc}
                loading={isLoadingUpdate}
              >
                Cập nhật
              </Button>
              <Button
                block
                danger
                style={{ top: 10 }}
                onClick={onRemoveEkycFromPartner}
                loading={isLoadingRemoveEkyc}
              >
                Xóa
              </Button>
            </Form.Item>
          ) : (
            <Form.Item>
              <Button
                block
                type="primary"
                htmlType="submit"
                loading={isLoadingAddPartner}
              >
                Lưu lại
              </Button>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </Space>
  );
};

export default PartnerEkycs;
