import React from 'react';
import { Layout, Avatar, Menu, Space, Dropdown, Modal, Affix, Row } from 'antd';
import {
  SettingOutlined,
  LogoutOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useThemeSwitcher } from 'react-css-theme-switcher';
import { useLocalStorage } from '@hooks/useLocalStorage';
import { useQuery, useMutation } from 'react-query';
import { IInfoUser } from '../../../@types/account';
import { getInfoUser } from '@api/account';
import { adminSignOut } from '@api/auth';
import Cookie from 'universal-cookie';

const { Header } = Layout;

const HeaderAdmin = () => {
  const { switcher, themes } = useThemeSwitcher();
  const cookie = new Cookie();
  const navigate = useNavigate();
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const { mutate } = useMutation('lougout', adminSignOut, {
    onSuccess: async () => {
      await cookie.remove('tokenKYCAdmin');
      localStorage.removeItem('is_owner');
      localStorage.removeItem('permissions');
      navigate('/signin');
    }
  });

  const { data: infoUser } = useQuery<IInfoUser>('getInfoUser', getInfoUser);

  const onLogoutAccount = () => {
    Modal.confirm({
      onOk: () => mutate(),
      okText: 'Đồng ý',
      okType: 'danger',
      title: 'Đăng xuất khỏi phiên làm việc',
      content: 'Bạn muốn đăng xuất khỏi phiên làm việc hiện tại?',
      centered: true
    });
  };

  const menu = (
    <Menu>
      <Menu.Item>
        <Link to="/profile">
          <SettingOutlined /> Cá nhân
        </Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item onClick={onLogoutAccount}>
        <LogoutOutlined /> Đăng xuất
      </Menu.Item>
    </Menu>
  );

  const onChange = () => {
    setTheme(theme === 'light' ? themes.dark : themes.light);
    switcher({ theme: theme === 'light' ? themes.dark : themes.light });
  };

  return (
    <Affix offsetTop={0}>
      <Header className="header-component">
        <Row justify="end">
          <Space size="large" align="center">
            <Dropdown overlay={menu} trigger={['click']}>
              <Space>
                <Avatar
                  style={{ backgroundColor: '#87d068' }}
                  icon={<UserOutlined />}
                />
                {infoUser?.name}
              </Space>
            </Dropdown>
            <Avatar onClick={onChange} src={`../image/${theme}.png`} />
          </Space>
        </Row>
      </Header>
    </Affix>
  );
};

export default HeaderAdmin;
