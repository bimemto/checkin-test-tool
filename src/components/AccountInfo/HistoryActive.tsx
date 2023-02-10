import React, { useState } from 'react';
import { Button, Col, Form, Row, Select, Table, Tag, Typography } from 'antd';
import moment from 'moment';
import { method, statusText } from '@utils/common';
import { identity, pickBy } from 'lodash';
import { useQuery } from 'react-query';
import { adminLog, userLog } from '@api/log-account';
import { useLocation } from 'react-router-dom';
import RangePickerFormItem from '@components/customAntd/RangePickerFormItem';
import { useThemeSwitcher } from 'react-css-theme-switcher';
import ReactJson from 'react-json-view';

function HistoryActive() {
  const { search } = useLocation();
  const { currentTheme } = useThemeSwitcher();
  const queryParams = new URLSearchParams(search);
  const id = queryParams.get('id') as string;
  const type = queryParams.get('type') as string;

  const [query, setQuery] = useState<any>({
    page: 1,
    limit: 10,
    [type === 'user' ? 'user_id' : 'admin_id']: id,
    from: moment().subtract(6, 'days').startOf('days').unix(),
    to: moment().endOf('days').unix()
  });

  const { data: logUser, isLoading } = useQuery(
    ['getUserLog', query],
    () => (type === 'user' ? userLog(query) : adminLog(query)),
    {
      enabled: query ? true : false
    }
  );

  const onFinish = (values: any) => {
    const cleanQuery = pickBy(values, identity);
    if (cleanQuery.time) {
      cleanQuery.from = moment(cleanQuery.time[0]).unix();
      cleanQuery.to = moment(cleanQuery.time[1]).unix();
    }
    delete cleanQuery.time;
    cleanQuery.page = 1;
    setQuery({
      ...cleanQuery,
      limit: query.limit,
      page: query.page,
      [type === 'user' ? 'user_id' : 'admin_id']: id
    });
  };

  const columns = [
    {
      title: 'Method',
      dataIndex: 'method',
      key: 'method',
      render: (text: string) => <Tag color={statusText[text]}>{text}</Tag>
    },
    {
      title: 'Thời gian tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: string) => (
        <span>{moment(createdAt).format('DD/MM/YYYY HH:mm')}</span>
      )
    },
    {
      title: 'Endpoint',
      dataIndex: 'endpoint',
      key: 'endpoint'
    },
    {
      title: 'Referer',
      dataIndex: 'referer',
      key: 'referer'
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
        <Row gutter={24}>
          <Col xs={24} md={9}>
            <RangePickerFormItem required />
          </Col>
          <Col xs={24} md={9}>
            <Form.Item name="method">
              <Select placeholder="Phương thức" allowClear>
                {method.map((item: string) => (
                  <Select.Option value={item} key={item}>
                    {item}
                  </Select.Option>
                ))}
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
        rowKey="_id"
        columns={columns}
        dataSource={logUser?.rows}
        size="small"
        loading={isLoading}
        pagination={{
          current: query?.page,
          pageSize: query?.limit || 10,
          total: logUser?.count,
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
                {record?.request && (
                  <Typography.Paragraph>
                    <Typography.Text type="secondary">Request</Typography.Text>
                    <pre>
                      <ReactJson
                        style={{ overflow: 'auto' }}
                        displayObjectSize={false}
                        name={false}
                        displayDataTypes={false}
                        src={record?.request}
                        theme={currentTheme === 'dark' ? 'pop' : 'rjv-default'}
                      />
                    </pre>
                  </Typography.Paragraph>
                )}
                {record?.response && (
                  <Typography.Paragraph>
                    <Typography.Text type="secondary">Response</Typography.Text>
                    <pre>
                      <ReactJson
                        style={{ overflow: 'auto' }}
                        displayObjectSize={false}
                        name={false}
                        displayDataTypes={false}
                        src={record?.response}
                        theme={currentTheme === 'dark' ? 'pop' : 'rjv-default'}
                      />
                    </pre>
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

export default HistoryActive;
