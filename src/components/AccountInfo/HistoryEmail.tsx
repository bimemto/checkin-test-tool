import React, { useState } from 'react';
import {
  Button,
  Col,
  Form,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography
} from 'antd';
import moment from 'moment';
import { identity, pickBy } from 'lodash';
import { useQuery } from 'react-query';
import { userMail } from '@api/log-account';
import { useLocation } from 'react-router-dom';
import { renderStatusTag } from '@utils/common';
import RangePickerFormItem from '@components/customAntd/RangePickerFormItem';
import { IEmailUser, IEmailUserRes } from '../../@types/account';

function HistoryEmail() {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const id = queryParams.get('id') as string;
  const [query, setQuery] = useState<any>({
    page: 1,
    limit: 10,
    user_id: id,
    from: moment().subtract(6, 'days').startOf('days').unix(),
    to: moment().endOf('days').unix()
  });

  const { data: mailUser, isLoading } = useQuery<IEmailUserRes>(
    ['getUserMail', query],
    () => userMail(query),
    {
      enabled: query ? true : false
    }
  );

  const onFinish = (values: any) => {
    const cleanQuery = pickBy(values, identity);
    if (cleanQuery.time) {
      cleanQuery.from = moment(cleanQuery.time[0]).startOf('days').unix();
      cleanQuery.to = moment(cleanQuery.time[1]).endOf('days').unix();
    }
    delete cleanQuery.time;
    cleanQuery.page = 1;
    setQuery({
      ...cleanQuery,
      limit: query.limit,
      page: query.page,
      user_id: id
    });
  };

  const columns = [
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: IEmailUser) => (
        <Space>
          <Tag color={renderStatusTag(status)}>{status}</Tag>
          {record.email}
        </Space>
      )
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (title: string, record: IEmailUser) => (
        <Space>
          {title}
          <Tag>{record.template}</Tag>
        </Space>
      )
    },
    {
      title: 'CreatedAt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: string) =>
        moment(createdAt).format('DD/MM/YYYY HH:mm')
    }
  ];
  return (
    <div>
      <Form
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          time: [moment().subtract(6, 'days'), moment()]
        }}
      >
        <Row gutter={[24, 24]}>
          <Col xs={24} md={9}>
            <RangePickerFormItem required />
          </Col>
          <Col xs={24} md={9}>
            <Form.Item name="status">
              <Select placeholder="Trạng thái" allowClear>
                <Select.Option value="SUCCESS">SUCCESS</Select.Option>
                <Select.Option value="FAILED">FAILED</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Tìm kiếm
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Table
        showHeader={false}
        rowKey="_id"
        columns={columns}
        dataSource={mailUser?.rows}
        size="small"
        loading={isLoading}
        pagination={{
          current: query?.page,
          pageSize: query?.limit || 10,
          total: mailUser?.count,
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
        scroll={{ x: 'auto' }}
        expandable={{
          expandedRowRender: (record: any) => {
            return (
              <>
                {record?.message_error && (
                  <Typography.Paragraph>
                    <Typography.Text type="secondary">
                      Message error
                    </Typography.Text>
                    <pre>{record?.message_error}</pre>
                  </Typography.Paragraph>
                )}
                {record?.stack_error && (
                  <Typography.Paragraph>
                    <Typography.Text type="secondary">
                      Stack error
                    </Typography.Text>
                    <pre>{record?.stack_error}</pre>
                  </Typography.Paragraph>
                )}
              </>
            );
          }
        }}
      />
    </div>
  );
}

export default HistoryEmail;
