import React from 'react';
import { Card, Tabs } from 'antd';
import AccountInfo from '@components/Profile/AccountInfo';

const { TabPane } = Tabs;

const Profile = () => {
  return (
    <Card bordered={false}>
      <Tabs defaultActiveKey="info">
        <TabPane tab="Cá nhân" key="info">
          <AccountInfo />
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default Profile;
