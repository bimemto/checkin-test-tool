import React from 'react';
import {
  Avatar,
  Badge,
  Card,
  Col,
  Descriptions,
  Row,
  Space,
  Tabs,
  Tag,
  Typography
} from 'antd';

import { UserOutlined } from '@ant-design/icons';
import HistoryActive from '@components/AccountInfo/HistoryActive';
import HistoryLog from '@components/AccountInfo/HistoryLog';
import HistoryEmail from '@components/AccountInfo/HistoryEmail';
import { useQuery } from 'react-query';
import { detailAccount } from '@api/log-account';
import { useLocation } from 'react-router-dom';
import moment from 'moment';
import { getAdminInfo } from '@api/admin-manage';

const { Title } = Typography;

const Account = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const id = queryParams.get('id') as string;
  const type = queryParams.get('type') as string;

  const isAdminDetail = type === 'admin';

  const { data: detailAcc, isLoading } = useQuery(['getAccountInfo', id], () =>
    type === 'user' ? detailAccount(id) : getAdminInfo(id)
  );
  const items =
    type === 'user'
      ? [
          {
            label: 'Lịch sử hoạt động',
            key: 'historyActive',
            children: <HistoryActive />
          },
          {
            label: 'Lịch sử đăng nhập',
            key: 'historyLog',
            children: <HistoryLog />
          },
          {
            label: 'Lịch sử gửi Email',
            key: 'historyEmail',
            children: <HistoryEmail />
          }
        ]
      : [
          {
            label: 'Lịch sử hoạt động',
            key: 'historyActive',
            children: <HistoryActive />
          },
          {
            label: 'Lịch sử đăng nhập',
            key: 'historyLog',
            children: <HistoryLog />
          }
        ];

  return (
    <Row gutter={[12, 12]}>
      <Col xs={24} sm={12} md={8}>
        <Card bordered={false} loading={isLoading}>
          <Space direction="vertical" className="text-center">
            <Avatar
              size={64}
              style={{
                backgroundColor: '#87d068'
              }}
              icon={<UserOutlined />}
            />
            <Title level={5}>{detailAcc?.name}</Title>
          </Space>
          <Descriptions bordered>
            <Descriptions.Item label="Email" span={3}>
              {detailAcc?.email}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái" span={3}>
              <Badge status={detailAcc?.active ? 'success' : 'error'} />
              {detailAcc?.active ? 'ACTIVE' : 'INACTIVE'}
            </Descriptions.Item>
            <Descriptions.Item label="Loại tài khoản" span={3}>
              <Tag color="magenta">
                {detailAcc?.is_owner
                  ? isAdminDetail
                    ? 'Owner'
                    : 'Admin'
                  : isAdminDetail
                  ? 'Admin'
                  : 'User'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày khởi tạo" span={3}>
              {moment(detailAcc?.created_at).format('DD/MM/YYYY HH:mm')}
            </Descriptions.Item>
            {!isAdminDetail && (
              <Descriptions.Item label="Kích hoạt tài khoản" span={3}>
                {detailAcc?.account_active
                  ? moment(detailAcc?.time_active).format('DD/MM/YYYY HH:mm')
                  : 'Chưa kích hoạt'}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Đăng nhập gần đây" span={3}>
              {detailAcc?.recent_login &&
                moment(detailAcc?.recent_login).fromNow()}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Col>
      <Col xs={24} sm={12} md={16}>
        <Card bordered={false}>
          <Tabs items={items} />
        </Card>
      </Col>
    </Row>
  );
};

export default Account;
