import React from 'react';
import { DollarCircleOutlined, StockOutlined } from '@ant-design/icons';
import { Card, Col, Row, Statistic } from 'antd';

type IProps = {
  all: number;
  traffic_number: number;
  amount: number;
  loading: boolean;
};

const StatisticCard = ({ all, traffic_number, amount, loading }: IProps) => {
  return (
    <Row gutter={[24, 24]}>
      <Col xs={24} sm={24} md={8}>
        <Card bordered={false}>
          <Statistic
            loading={loading}
            title="Tổng số lượng giao dịch"
            value={all}
            prefix={<StockOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={24} md={8}>
        <Card bordered={false}>
          <Statistic
            loading={loading}
            title="Số lượng giao dịch thành công"
            value={traffic_number}
            prefix={<StockOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={24} md={8}>
        <Card bordered={false}>
          <Statistic
            loading={loading}
            title="Số tiền giao dịch"
            value={amount}
            prefix={<DollarCircleOutlined />}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default StatisticCard;
