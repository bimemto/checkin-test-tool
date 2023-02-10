import React from 'react';
import { Card, Table, Tag, Typography } from 'antd';
import moment from 'moment';
import ReactJson from 'react-json-view';
import { IRecordLog, IResLog, ISearchLogError } from '../../@types/log-error';
import { useThemeSwitcher } from 'react-css-theme-switcher';

type IProps = {
  data: IResLog;
  query: ISearchLogError;
  // eslint-disable-next-line no-unused-vars
  setQuery: (query: ISearchLogError) => void;
};

const statusText: any = {
  GET: 'blue',
  POST: 'green',
  PUT: 'orange',
  PATCH: 'orange',
  DELETE: 'red',
  Query: 'cyan'
};

function LogErrorTable({ data, query, setQuery }: IProps) {
  const { currentTheme } = useThemeSwitcher();
  const columns = [
    {
      title: 'Phương thức',
      dataIndex: 'method',
      key: 'method',
      render: (text: string) => <Tag color={statusText[text]}>{text}</Tag>
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: string) =>
        moment(createdAt).format('DD/MM/YYYY HH:mm:ss')
    },
    {
      title: 'URL',
      dataIndex: 'endpoint',
      key: 'endpoint',
      render: (text: string, record: IRecordLog) => text || record.url
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message'
    }
  ];

  return (
    <Card bordered={false}>
      <Table
        rowKey="_id"
        size="small"
        columns={columns}
        dataSource={data?.rows}
        loading={!data}
        scroll={{ x: 'auto' }}
        pagination={{
          current: query?.page,
          pageSize: query?.limit || 10,
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
        expandable={{
          expandedRowRender: (record: IRecordLog) => {
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
                <Typography.Paragraph>
                  <Typography.Text type="secondary">Stack</Typography.Text>
                  <pre>{record?.stack}</pre>
                </Typography.Paragraph>
              </>
            );
          }
        }}
      />
    </Card>
  );
}

export default LogErrorTable;
