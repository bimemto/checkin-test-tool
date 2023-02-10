import React, { useState } from 'react';
import {
  Button,
  Descriptions,
  Form,
  Input,
  message,
  Space,
  Switch,
  Typography
} from 'antd';
import { useQuery, useMutation } from 'react-query';
import { getInfoUser } from '@api/account';
import { IInfoUser } from './../../@types/account';
import ModalCustom from '@components/customAntd/Modal';
import { changePassword, updateAdmin } from '@api/admin';
import { useForm } from 'antd/lib/form/Form';
import QRCode from 'qrcode.react';
import { pick } from 'lodash';

const { Text, Paragraph } = Typography;

const AccountInfo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalChangePasswordOpen, setIsModalChangePasswordOpen] =
    useState(false);
  const [qrcode, setQrcode] = useState<boolean>(false);

  const [form] = useForm();
  const [formChangePassword] = useForm();
  const { data: infoUser, refetch } = useQuery<IInfoUser>(
    'getInfoUser',
    getInfoUser
  );

  const { mutate, isLoading } = useMutation('updateUser', updateAdmin, {
    onSuccess: async () => {
      await setIsModalOpen(false);
      await refetch();
      message.success('Thành công');
    }
  });

  const { mutate: mutateChangePass, isLoading: isLoadingChangePass } =
    useMutation('changePassword', changePassword, {
      onSuccess: async () => {
        await setIsModalChangePasswordOpen(false);
        await refetch();
        message.success('Thành công');
      }
    });

  const onFinish = (values: any) => {
    mutate(values);
  };

  const onFinishChangePassword = (values: {
    old_password: string;
    new_password: string;
  }) => {
    mutateChangePass(pick(values, ['old_password', 'new_password']));
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsModalChangePasswordOpen(false);
  };

  const showModalEdit = () => {
    setIsModalOpen(true);
    form.setFieldsValue({
      name: infoUser?.name,
      active_otp: infoUser?.active_otp
    });
  };

  const showModalChangePassword = () => {
    setIsModalChangePasswordOpen(true);
  };

  return (
    <>
      <Descriptions
        bordered
        extra={
          <Space>
            <Button type="primary" onClick={showModalEdit}>
              Chỉnh sửa
            </Button>
            <Button type="primary" onClick={showModalChangePassword}>
              Đổi mật khẩu
            </Button>
          </Space>
        }
      >
        <Descriptions.Item label="Tên" span={3}>
          {infoUser?.name}
        </Descriptions.Item>
        <Descriptions.Item label="Email" span={3}>
          {infoUser?.email}
        </Descriptions.Item>
      </Descriptions>
      <ModalCustom open={isModalOpen} onCancel={handleCancel}>
        <Form layout="vertical" onFinish={onFinish} form={form}>
          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập tên'
              }
            ]}
            label="Tên"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Xác thực 2 lớp"
            name="active_otp"
            valuePropName="checked"
          >
            <Switch
              onChange={() => setQrcode(form.getFieldValue('active_otp'))}
            />
          </Form.Item>
          {qrcode && infoUser?.otpauth_url_otp && (
            <div style={{ marginBottom: 24 }}>
              <Paragraph>
                <Text type="secondary">
                  Quét mã QR bằng ứng dụng Authenticator trên điện thoại
                </Text>
              </Paragraph>
              <QRCode
                includeMargin
                size={200}
                value={infoUser.otpauth_url_otp}
              />
            </div>
          )}
          <Form.Item>
            <Button block type="primary" htmlType="submit" loading={isLoading}>
              Lưu lại
            </Button>
          </Form.Item>
        </Form>
      </ModalCustom>
      <ModalCustom open={isModalChangePasswordOpen} onCancel={handleCancel}>
        <Form
          layout="vertical"
          onFinish={onFinishChangePassword}
          form={formChangePassword}
        >
          <Form.Item
            name="old_password"
            label="Mật khẩu cũ"
            required
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập mật khẩu cũ'
              },
              {
                pattern: /^[\S*]{6,30}$/,
                message: 'Mật khẩu phải từ 6 đến 30 ký tự'
              }
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="new_password"
            label="Mật khẩu mới"
            required
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập mật khẩu mới'
              },
              {
                pattern: /^[\S*]{6,30}$/,
                message: 'Mật khẩu phải từ 6 đến 30 ký tự'
              }
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirm_password"
            label="Xác nhận mật khẩu mới"
            required
            dependencies={['new_password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập mật khẩu mới'
              },
              {
                pattern: /^[\S*]{6,30}$/,
                message: 'Mật khẩu phải từ 6 đến 30 ký tự'
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('new_password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu không khớp!'));
                }
              })
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button
              block
              type="primary"
              htmlType="submit"
              loading={isLoadingChangePass}
            >
              Lưu lại
            </Button>
          </Form.Item>
        </Form>
      </ModalCustom>
    </>
  );
};
export default AccountInfo;
