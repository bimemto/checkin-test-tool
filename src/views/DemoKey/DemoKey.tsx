import React from 'react';
import { Button, Card, Space, Typography } from 'antd';
import { createDemoKey } from '@api/demo-key';
import { useMutation } from 'react-query';

const { Text } = Typography;

const DemoKey = () => {
  const [key, setKey] = React.useState<string>('');
  const { mutate, isLoading } = useMutation('createDemoKey', createDemoKey, {
    onSuccess: async (data) => {
      setKey(data);
    }
  });
  return (
    <Space direction="vertical" size="large">
      <Card bordered={false}>
        <Space direction="vertical">
          <Button type="primary" onClick={() => mutate()} loading={isLoading}>
            Tạo demo key
          </Button>
          {key && <Text copyable>{key}</Text>}
        </Space>
      </Card>
    </Space>
  );
};

export default DemoKey;
