import React from 'react';
import { Space, Table, Tooltip } from 'antd';
import { useQuery } from 'react-query';
import { useLocation } from 'react-router-dom';
import { adminSession, userSession } from '@api/log-account';
import { UAParser } from 'ua-parser-js';
import moment from 'moment';
import { sortByDate } from '@utils/common';
import { ISessionUser } from '../../@types/account';

function HistoryLog() {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const id = queryParams.get('id') as string;
  const type = queryParams.get('type') as string;

  const { data: sessionUser, isLoading } = useQuery<ISessionUser[]>(
    ['getUserSession', id],
    () => (type === 'user' ? userSession(id) : adminSession(id))
  );
  const parser = new UAParser();

  const columns = [
    {
      title: 'IP',
      dataIndex: 'ip',
      key: 'ip'
    },
    {
      title: 'Location',
      dataIndex: 'city',
      key: 'city',
      render: (city: string, record: ISessionUser) => (
        <Space>
          {city} - {record.region} - {record.country}
        </Space>
      )
    },
    {
      title: 'Device',
      dataIndex: 'agent',
      key: 'agent',
      render: (agent: string) => (
        <Space>
          {parser.setUA(agent).getResult().browser.name} -
          {parser.setUA(agent).getResult().os.name}
        </Space>
      )
    },
    {
      title: 'Thời điểm đăng nhập',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (updated_at: string) => (
        <Tooltip title={moment(updated_at).format('DD/MM/YYYY HH:mm')}>
          <a>{moment(updated_at).fromNow()}</a>
        </Tooltip>
      )
    }
  ];

  return (
    <div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={sessionUser?.sort((a: ISessionUser, b: ISessionUser) =>
          sortByDate(b.updated_at, a.updated_at)
        )}
        size="small"
        loading={isLoading}
        scroll={{ x: 'auto' }}
      />
    </div>
  );
}

export default HistoryLog;
