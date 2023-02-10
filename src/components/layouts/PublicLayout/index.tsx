import React, { ReactNode, useEffect } from 'react';
import { Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import Cookie from 'universal-cookie';
import Test from './Test';
interface IProps {
  children: ReactNode;
}

const PublicLayout = ({ children }: IProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const cookie = new Cookie();
    if (cookie.get('tokenKYCAdmin')) {
      navigate('/');
    }
  }, [navigate]);

  const test = true;

  return test ? (
    <Test />
  ) : (
    <Row align="middle" justify="space-around" className="flex-center">
      <Col
        xs={{ span: 0 }}
        sm={{ span: 0 }}
        md={{ span: 0 }}
        lg={12}
        xl={{ span: 12, push: 0 }}
      >
        <div className="login-left-component text-center"></div>
      </Col>
      <Col
        xs={{ span: 24, push: 0 }}
        sm={24}
        md={24}
        lg={{ span: 12, push: 0 }}
        xl={{ span: 12, push: 0 }}
      >
        <Row>
          <Col span={20} offset={2}>
            {children}
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default PublicLayout;
