import React from 'react';
import { adminSignIn } from '@api/auth';
import OTP from '@views/OTP/OTP';
import { Button, Form, Input } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useState } from 'react';
import Cookie from 'universal-cookie';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { IUserLogin } from '../../@types/auth';
import moment from 'moment';

const Login = () => {
  const navigate = useNavigate();
  const cookie = new Cookie();
  const [form] = useForm();
  const [isRequireOTP, setIsRequireOTP] = useState(false);
  const [userLogin, setUserLogin] = useState({ email: '', password: '' });
  const { mutate, isLoading } = useMutation(adminSignIn, {
    onSuccess: (response) => {
      if (response.require_otp) {
        setIsRequireOTP(true);
      } else {
        cookie.set('tokenKYCAdmin', response.token, {
          expires: moment().add(14, 'day').toDate()
        });
        navigate('/');
      }
    }
  });

  const onFinish = (values: IUserLogin) => {
    setUserLogin({ email: values.email, password: values.password });
    mutate(values);
  };

  return (
    <>
      {!isRequireOTP ? (
        <Form
          form={form}
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              {
                type: 'email',
                message: 'Vui lòng nhập email'
              },
              {
                required: true,
                message: 'Vui lòng nhập email'
              }
            ]}
            label="Email"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập mật khẩu'
              },
              {
                min: 6,
                message: 'Mật khẩu từ 6 đến 30 ký tự'
              },
              {
                max: 30,
                message: 'Mật khẩu từ 6 đến 30 ký tự'
              }
            ]}
            label="Mật khẩu"
          >
            <Input.Password placeholder="Mật khẩu từ 6 đến 30 ký tự" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" block htmlType="submit" loading={isLoading}>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <OTP userLogin={userLogin} />
      )}
    </>
  );
};

export default Login;
