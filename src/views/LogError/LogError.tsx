import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row, Select, Space, Typography } from 'antd';
import { useQuery } from 'react-query';
import moment from 'moment';
import { RangeValue } from 'rc-picker/lib/interface';
import LogErrorTable from '@components/LogError/LogErrorTable';
import RangePicker from '@components/customAntd/RangePicker';
import { getLog } from '@api/log-error';
import { identity, pickBy } from 'lodash';

const method = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'Query'];

function LogError() {
  const [dates, setDates] = useState<RangeValue<moment.Moment>>([
    moment().subtract(6, 'days'),
    moment()
  ]);
  const [query, setQuery] = useState<any>();

  const { data } = useQuery(['getErrorLog', query], () => getLog(query), {
    enabled: query ? true : false
  });

  const onFinish = (values: any) => {
    const cleanQuery = pickBy(values, identity);
    if (cleanQuery.time) {
      cleanQuery.from = moment(cleanQuery.time[0]).unix();
      cleanQuery.to = moment(cleanQuery.time[1]).unix();
    }
    delete cleanQuery.time;
    cleanQuery.page = 1;
    setQuery({ ...query, page: cleanQuery.page, method: cleanQuery.method });
  };

  useEffect(() => {
    const from = Number(dates && dates[0]?.startOf('days').unix());
    const to = Number(dates && dates[1]?.endOf('days').unix());
    setQuery({ ...query, from, to, limit: 10 });
  }, [dates]);

  return (
    <Space direction="vertical" size="large">
      <Typography.Title level={3}>Log Hệ Thống</Typography.Title>
      <Card bordered={false}>
        <Form layout="vertical" onFinish={onFinish}>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={8} md={8} lg={10}>
              <RangePicker dates={dates} onChange={setDates} />
            </Col>
            <Col xs={24} sm={8} md={8} lg={10}>
              <Form.Item name="method">
                <Select placeholder="Phương thức" allowClear>
                  {method.map((item: string) => (
                    <Select.Option value={item} key={item}>
                      {item}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={6} md={6} lg={4}>
              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Tìm kiếm
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
      <LogErrorTable data={data} query={query} setQuery={setQuery} />
    </Space>
  );
}

export default LogError;
