import React from 'react';
import {
  Menu,
  Typography,
  Row,
  Col,
  Divider,
  Table,
  Avatar,
  Space,
  Tag,
  Tooltip,
  Button
} from 'antd';

import {
  DeleteOutlined,
  SendOutlined,
  MailOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  CheckOutlined,
  PlusOutlined
} from '@ant-design/icons';

const { Title } = Typography;

export const Mail = () => {
  const dataSource = [
    {
      id: '1',
      email: 'mike@gmail.com',
      title: 'Lorem ipsum, dolor sit amet consectetur',
      created_at: 'Dec 03',
      template: 'magenta'
    },
    {
      id: '2',
      email: 'john@gmail.com',
      title: 'Ullam suscipit at ad! Non incidunt sapiente porro ipsum?',
      created_at: 'Nov 29',
      template: 'cyan'
    },
    {
      id: '1',
      email: 'mike@gmail.com',
      title: 'Lorem ipsum, dolor sit amet consectetur',
      created_at: 'Dec 03',
      template: 'magenta'
    },
    {
      id: '2',
      email: 'john@gmail.com',
      title: 'Ullam suscipit at ad! Non incidunt sapiente porro ipsum?',
      created_at: 'Nov 29',
      template: 'cyan'
    },
    {
      id: '1',
      email: 'mike@gmail.com',
      title: 'Lorem ipsum, dolor sit amet consectetur',
      created_at: 'Dec 03',
      template: 'magenta'
    },
    {
      id: '2',
      email: 'john@gmail.com',
      title: 'Ullam suscipit at ad! Non incidunt sapiente porro ipsum?',
      created_at: 'Nov 29',
      template: 'cyan'
    },
    {
      id: '1',
      email: 'mike@gmail.com',
      title: 'Lorem ipsum, dolor sit amet consectetur',
      created_at: 'Dec 03',
      template: 'magenta'
    },
    {
      id: '2',
      email: 'john@gmail.com',
      title: 'Ullam suscipit at ad! Non incidunt sapiente porro ipsum?',
      created_at: 'Nov 29',
      template: 'cyan'
    },
    {
      id: '1',
      email: 'mike@gmail.com',
      title: 'Lorem ipsum, dolor sit amet consectetur',
      created_at: 'Dec 03',
      template: 'magenta'
    },
    {
      id: '2',
      email: 'john@gmail.com',
      title: 'Ullam suscipit at ad! Non incidunt sapiente porro ipsum?',
      created_at: 'Nov 29',
      template: 'cyan'
    },
    {
      id: '1',
      email: 'mike@gmail.com',
      title: 'Lorem ipsum, dolor sit amet consectetur',
      created_at: 'Dec 03',
      template: 'magenta'
    },
    {
      id: '2',
      email: 'john@gmail.com',
      title: 'Ullam suscipit at ad! Non incidunt sapiente porro ipsum?',
      created_at: 'Nov 29',
      template: 'cyan'
    },
    {
      id: '1',
      email: 'mike@gmail.com',
      title: 'Lorem ipsum, dolor sit amet consectetur',
      created_at: 'Dec 03',
      template: 'magenta'
    },
    {
      id: '2',
      email: 'john@gmail.com',
      title: 'Ullam suscipit at ad! Non incidunt sapiente porro ipsum?',
      created_at: 'Nov 29',
      template: 'cyan'
    },
    {
      id: '1',
      email: 'mike@gmail.com',
      title: 'Lorem ipsum, dolor sit amet consectetur',
      created_at: 'Dec 03',
      template: 'magenta'
    },
    {
      id: '2',
      email: 'john@gmail.com',
      title: 'Ullam suscipit at ad! Non incidunt sapiente porro ipsum?',
      created_at: 'Nov 29',
      template: 'cyan'
    }
  ];

  const columns = [
    {
      dataIndex: 'email',
      key: 'email',
      render: (text: string) => (
        <Space>
          <Avatar style={{ backgroundColor: '#87d068' }}>KTV</Avatar>
          {text}
        </Space>
      )
    },
    {
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: any) => (
        <Space>
          {text}
          <Tag color={record.template}>{record.template}</Tag>
        </Space>
      )
    },
    {
      dataIndex: 'created_at',
      key: 'created_at'
    },
    {
      dataIndex: 'action',
      key: 'action',
      render: () => (
        <Space>
          <Tooltip title="Gửi lại">
            <Button
              size="small"
              type="text"
              shape="circle"
              icon={<SendOutlined />}
            />
          </Tooltip>
          <Tooltip title="Cho vào thùng rác">
            <Button
              size="small"
              danger
              type="text"
              shape="circle"
              icon={<DeleteOutlined />}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <div>
      <Title level={3}>Mail</Title>
      <Row wrap={false} gutter={24}>
        <Col flex="none">
          <Menu
            mode="inline"
            inlineCollapsed={false}
            defaultSelectedKeys={['mail']}
            style={{ width: 250 }}
          >
            <div style={{ textAlign: 'center', padding: 24 }}>
              <Button shape="round" icon={<PlusOutlined />} size="large">
                Tạo thư mới
              </Button>
            </div>
            <Menu.Item key="mail" icon={<MailOutlined />}>
              Tất cả thư
            </Menu.Item>
            <Menu.Item key="send" icon={<SendOutlined />}>
              Đã gửi
            </Menu.Item>
            <Menu.Item danger key="profile" icon={<DeleteOutlined />}>
              Thùng rác
            </Menu.Item>
            <Divider />
            <Menu.Item key="success" icon={<CheckOutlined />}>
              Thành công
            </Menu.Item>
            <Menu.Item key="pending" icon={<ClockCircleOutlined />}>
              Đang gửi
            </Menu.Item>
            <Menu.Item key="failed" icon={<WarningOutlined />}>
              Thất bại
            </Menu.Item>
          </Menu>
        </Col>
        <Col flex="auto">
          <Table
            rowKey="id"
            size="small"
            showHeader={false}
            dataSource={dataSource}
            columns={columns}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Mail;
