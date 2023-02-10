import React from 'react';
import { DatePicker, Form } from 'antd';
import moment from 'moment';

const { RangePicker } = DatePicker;

interface Props {
  name?: string;
  style?: object;
  label?: string;
  format?: string;
  required?: boolean;
  // eslint-disable-next-line no-unused-vars
  disabledDate?: (current: moment.Moment) => boolean;
}

const Index = ({ name, style, format, disabledDate, required }: Props) => {
  return (
    <Form.Item
      name={name}
      required={required}
      rules={[
        {
          required: required,
          message: 'Vui lòng chọn thời gian'
        }
      ]}
    >
      <RangePicker
        style={style}
        format={format}
        disabledDate={disabledDate}
        ranges={{
          'Hôm nay': [moment(), moment()],
          'Hôm qua': [
            moment().subtract(1, 'days'),
            moment().subtract(1, 'days')
          ],
          'Tuần này': [moment().startOf('week'), moment()],
          'Tuần trước': [
            moment().subtract(1, 'weeks').startOf('week'),
            moment().subtract(1, 'weeks').endOf('week')
          ],
          'Tháng này': [moment().startOf('month'), moment()],
          'Tháng trước': [
            moment().subtract(1, 'months').startOf('month'),
            moment().subtract(1, 'months').endOf('month')
          ]
        }}
      />
    </Form.Item>
  );
};

Index.defaultProps = {
  name: 'time',
  style: { width: '100%' },
  label: 'Khoảng thời gian',
  format: 'DD/MM/YYYY',
  required: false,
  disabledDate: (current: moment.Moment) =>
    current && current > moment().endOf('day')
};

export default Index;
