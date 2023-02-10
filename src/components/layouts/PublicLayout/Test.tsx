import {
  Button,
  DatePicker,
  Form,
  List,
  message,
  Row,
  Space,
  Typography
} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import axios from 'axios';
import React from 'react';
import dayjs from 'dayjs';
import moment from 'moment';
import ReactJson from 'react-json-view';
import Tooltip from 'antd/es/tooltip';
import { InfoCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function Test() {
  const [form] = Form.useForm();
  const [listShifts, setListShifts] = React.useState<any>([]);
  const [listDate, setListDate] = React.useState<any>([]);
  const [listResultCheckin, setListResultCheckin] = React.useState<any>([]);
  const [dateCheckinWithOutShift, setDateCheckinWithOutShift] =
    React.useState<any>();
  const [resultCheckinWithOutShift, setResultCheckinWithOutShift] =
    React.useState<any>();

  const getListShifts = async (values: any) => {
    setListShifts([]);
    setListDate([]);
    setListResultCheckin([]);
    const { header } = values;
    const date = dayjs().format('YYYYMMDD');
    const result = await axios({
      url: `http://localhost:8998/v2/mobile/user-workspaces/daily-work-statistics?date=${date}&key=shifts`,
      headers: {
        ...JSON.parse(header)
      },
      method: 'GET'
    });
    setListShifts(result.data.data);
  };

  const onCheckin = async (index: number) => {
    const { date, dateAndTime } = listDate[index];
    const shift = listShifts[index];
    const checkin_time = dayjs(dateAndTime).valueOf();
    if (!dateAndTime) {
      message.error('Chưa chọn ngày');
      return;
    }
    let result: any;
    try {
      const response = await axios({
        url: 'http://localhost:8998/v2/mobile/user-workspaces/checkin',
        headers: {
          ...JSON.parse(form.getFieldValue('header'))
        },
        method: 'POST',
        data: {
          date: date
            ? Number(moment(date).format('YYYYMMDD'))
            : Number(moment(dateAndTime).format('YYYYMMDD')),
          shift_id: shift.metadata.shift_id,
          shift_group_id: shift.metadata.shift_group_id,
          checkin_time
        }
      });
      result = response.data;
    } catch (error: any) {
      result = error.response;
    }
    const newListResultCheckin = [...listResultCheckin];
    newListResultCheckin[index] = result.data;
    setListResultCheckin(newListResultCheckin);
  };

  const onCheckinAll = async () => {
    const newListResultCheckin = [...listResultCheckin];
    for (let i = 0; i < listDate.length; i++) {
      if (listDate[i]) {
        const { date, dateAndTime } = listDate[i];
        const shift = listShifts[i];
        const checkin_time = dayjs(dateAndTime).valueOf();
        let result: any;
        try {
          const res = await axios({
            url: 'http://localhost:8998/v2/mobile/user-workspaces/checkin',
            headers: {
              ...JSON.parse(form.getFieldValue('header'))
            },
            method: 'POST',
            data: {
              date: date
                ? Number(moment(date).format('YYYYMMDD'))
                : Number(moment(dateAndTime).format('YYYYMMDD')),
              shift_id: shift.metadata.shift_id,
              shift_group_id: shift.metadata.shift_group_id,
              checkin_time
            }
          });
          result = res.data;
        } catch (error: any) {
          result = error.response;
        }
        newListResultCheckin[i] = result.data;
      }
    }
    setListResultCheckin(newListResultCheckin);
  };

  const convertTime = (time: string) => {
    if (time.length === 4) {
      return time.slice(0, 2) + ':' + time.slice(2, 4);
    }
    if (time.length === 3) {
      return '0' + time.slice(0, 1) + ':' + time.slice(1, 3);
    }
    if (time.length === 2) {
      return '00:' + time;
    }
    if (time.length === 1) {
      return '00:0' + time;
    }
    return time;
  };

  const onCheckinWithOutShift = async () => {
    const date = dateCheckinWithOutShift;
    const checkin_time = dayjs(date).valueOf();
    if (!date) {
      message.error('Chưa chọn ngày');
      return;
    }
    let result: any;
    try {
      const response = await axios({
        url: 'http://localhost:8998/v2/mobile/user-workspaces/checkin',
        headers: {
          ...JSON.parse(form.getFieldValue('header'))
        },
        method: 'POST',
        data: {
          date: Number(moment(date).format('YYYYMMDD')),
          checkin_time
        }
      });
      result = response.data;
    } catch (error: any) {
      result = error.response;
    }
    setResultCheckinWithOutShift(result.data);
  };

  const renderTooltip = (shift_hours: any) => {
    return (
      <List
        style={{ width: '450px' }}
        itemLayout="horizontal"
        dataSource={shift_hours}
        renderItem={(item: any) => (
          <List.Item>
            <List.Item.Meta
              title={
                convertTime(item.from_time.toString()) +
                ' - ' +
                convertTime(item.to_time.toString())
              }
              description={
                <Space direction="vertical">
                  <Space>
                    <>Chấp nhận chấm công muộn</>
                    <>{item.allow_checkin_late_minutes} phút</>
                  </Space>
                  <Space>
                    <>Chấp nhận chấm công sớm</>
                    <>{item.allow_checkin_early_time} phút</>
                  </Space>
                  <Space>
                    <>Không tính công sau</>
                    <>{item.not_checkin_after_minutes} phút</>
                  </Space>
                  <Space>
                    <>Chấp nhận checkout sớm</>
                    <>{item.allow_checkout_early_minutes} phút</>
                  </Space>
                  <Space>
                    <>Không tính công nếu checkout trước</>
                    <>{item.not_checkout_before_minutes} phút</>
                  </Space>
                  <Space>
                    <>Chấp nhận checkout muộn</>
                    <>{item.allow_checkout_late_time} phút</>
                  </Space>
                </Space>
              }
            />
          </List.Item>
        )}
      />
    );
  };

  return (
    <>
      <Row justify="center">
        <Form
          form={form}
          onFinish={getListShifts}
          style={{ width: '1000px' }}
          layout="vertical"
        >
          <Form.Item name="header" label="Header">
            <TextArea showCount />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Lấy danh sách ca
            </Button>
          </Form.Item>
        </Form>
      </Row>
      <Row justify="center">
        <Space direction="vertical">
          <List
            itemLayout="horizontal"
            dataSource={listShifts}
            style={{ width: '1000px' }}
            renderItem={(item: any, index: number) => (
              <>
                <List.Item style={{ width: '100%' }}>
                  <List.Item.Meta
                    title={<Title level={4}>{item?.title}</Title>}
                    description={
                      <Space>
                        {item?.description}
                        <Tooltip
                          color={'white'}
                          placement="bottom"
                          title={renderTooltip(item?.metadata?.shift_hours)}
                        >
                          <InfoCircleOutlined />
                        </Tooltip>
                      </Space>
                    }
                  />
                  <Space>
                    <DatePicker
                      format="YYYY-MM-DD HH:mm:ss"
                      showTime={{
                        defaultValue: dayjs('00:00:00', 'HH:mm:ss') as any
                      }}
                      onChange={(date, dateString) => {
                        const newListDate = [...listDate];
                        const object = newListDate[index] || {};
                        object.dateAndTime = dateString;
                        newListDate[index] = object;
                        setListDate(newListDate);
                      }}
                    />
                    <DatePicker
                      format="YYYY-MM-DD"
                      placeholder="Ngày của ca"
                      onChange={(date, dateString) => {
                        const newListDate = [...listDate];
                        const object = newListDate[index] || {};
                        object.date = dateString;
                        newListDate[index] = object;
                        setListDate(newListDate);
                      }}
                    />
                    <Button type="primary" onClick={() => onCheckin(index)}>
                      Checkin
                    </Button>
                  </Space>
                </List.Item>
                <pre>
                  <ReactJson
                    style={{ overflow: 'auto' }}
                    displayObjectSize={false}
                    name={false}
                    displayDataTypes={false}
                    src={listResultCheckin[index]}
                  />
                </pre>
              </>
            )}
          />
          <Button type="primary" onClick={onCheckinAll}>
            Checkin All
          </Button>
          <Title level={3}>Checkin Không yêu cầu ca</Title>
          <DatePicker
            format="YYYY-MM-DD HH:mm:ss"
            showTime={{
              defaultValue: dayjs('00:00:00', 'HH:mm:ss') as any
            }}
            onChange={(date, dateString) => {
              setDateCheckinWithOutShift(dateString);
            }}
          />
          <Button type="primary" onClick={onCheckinWithOutShift}>
            Checkin Không yêu cầu ca
          </Button>
          <pre>
            <ReactJson
              style={{ overflow: 'auto' }}
              displayObjectSize={false}
              name={false}
              displayDataTypes={false}
              src={resultCheckinWithOutShift}
            />
          </pre>
        </Space>
      </Row>
    </>
  );
}
