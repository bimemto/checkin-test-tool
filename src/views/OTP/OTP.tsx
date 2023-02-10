import React from 'react';
import { Button, Form, Input } from 'antd';
import Cookie from 'universal-cookie';
import { useMutation } from 'react-query';
import { adminSignIn } from '@api/auth';
import { useForm } from 'antd/lib/form/Form';
import { useNavigate } from 'react-router-dom';
import { IUserLogin } from '../../@types/auth';

type IProps = {
  userLogin: {
    email: string;
    password: string;
    captchaCode?: string;
  };
};

const OTP = ({ userLogin }: IProps) => {
  const navigate = useNavigate();
  const [form] = useForm();
  const cookie = new Cookie();

  const { mutate, isLoading } = useMutation(adminSignIn, {
    onSuccess: (data) => {
      cookie.set('tokenKYCAdmin', data.token);
      localStorage.removeItem('is_owner');
      localStorage.removeItem('permissions');
      navigate('/');
    }
  });

  const onFinish = (values: IUserLogin) => {
    delete userLogin.captchaCode;
    mutate({ ...userLogin, ...values });
  };

  return (
    <Form
      autoComplete="off"
      layout="vertical"
      size="large"
      form={form}
      onFinish={onFinish}
    >
      <Form.Item
        label="OTP"
        name="otp"
        rules={[
          {
            required: true,
            message: 'Vui lòng nhập OTP'
          },
          {
            len: 6,
            message: 'Vui lòng nhập OTP'
          }
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" block htmlType="submit" loading={isLoading}>
          Đăng nhập
        </Button>
      </Form.Item>
    </Form>
  );
};

export default OTP;
