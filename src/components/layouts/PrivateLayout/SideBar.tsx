import React, { useEffect, useState } from 'react';
import { Menu, Layout, Affix } from 'antd';
import {
  // DollarCircleOutlined,
  // AppstoreOutlined,
  // UserOutlined,
  UsergroupAddOutlined
  // ApiOutlined,
  // CodeOutlined,
  // MailOutlined,
  // EditOutlined,
  // TeamOutlined,
  // FileTextOutlined
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import { useLocalStorage } from './../../../hooks/useLocalStorage';
import { useThemeSwitcher } from 'react-css-theme-switcher';
// import { IPermission } from '@utils/common';

const { Sider } = Layout;

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { currentTheme } = useThemeSwitcher();
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const pathName = useLocation().pathname;

  // const isAdmin = JSON.parse(localStorage.getItem('is_owner') || 'false');
  // const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');

  // const checkPermission = (userPermission: string) => {
  //   return (
  //     isAdmin || permissions?.some((item: string) => item === userPermission)
  //   );
  // };

  useEffect(() => {
    setTheme(currentTheme);
  }, [currentTheme, setTheme]);

  return (
    <Affix offsetTop={0}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        theme={theme}
        breakpoint="lg"
        collapsedWidth={0}
        style={{ height: '100vh' }}
      >
        <Menu
          mode="vertical"
          theme={theme}
          selectedKeys={[pathName]}
          defaultOpenKeys={[pathName?.split('/')[1]]}
        >
          <Menu.Item key="/partners" icon={<UsergroupAddOutlined />}>
            <Link to="/partners">Danh sách đối tác</Link>
          </Menu.Item>
          <Menu.Item key="/users" icon={<UsergroupAddOutlined />}>
            <Link to="/users">Danh sách người dùng</Link>
          </Menu.Item>
        </Menu>
      </Sider>
    </Affix>
  );
};

export default SideBar;
