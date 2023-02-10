/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { ReactNode, useEffect } from 'react';
import { ConfigProvider, Layout, message } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import { useNavigate } from 'react-router-dom';
import Cookie from 'universal-cookie';
import Footer from './Footer';
import Header from './Header';
import SideBar from './SideBar';
import { useQuery } from 'react-query';
import { IInfoUser } from '../../../@types/account';
import { getInfoUser } from '@api/account';

interface IProps {
  children: ReactNode;
}

const PrivateLayout = ({ children }: IProps) => {
  const navigate = useNavigate();
  const cookie = new Cookie();

  const { isSuccess } = useQuery<IInfoUser>('getInfoUser', getInfoUser, {
    onSuccess: (data) => {
      localStorage.setItem('is_owner', JSON.stringify(data.is_owner));
      localStorage.setItem('permissions', JSON.stringify(data.permissions));
    },
    enabled: cookie.get('tokenKYCAdmin') && true,
    onError: () => {
      cookie.remove('tokenKYCAdmin');
      message.loading('', 0);
    },
    staleTime: Infinity
  });

  // useEffect(() => {
  //   if (!cookie.get('tokenKYCAdmin')) {
  //     navigate('/signin');
  //   }
  // }, [navigate]);

  return (
    <>
      {isSuccess && (
        <ConfigProvider>
          <Layout>
            <SideBar />
            <Layout>
              <Header />
              <Content>
                <div style={{ padding: 24, minHeight: '81vh', paddingTop: 48 }}>
                  {children}
                </div>
              </Content>
              <Footer />
            </Layout>
          </Layout>
        </ConfigProvider>
      )}
    </>
  );
};

export default PrivateLayout;
