import React from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import { RangeValue } from 'rc-picker/lib/interface';

const { RangePicker } = DatePicker;

interface Props {
  dates: RangeValue<moment.Moment>;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: RangeValue<moment.Moment>) => void;
}

const Index = ({ dates, onChange }: Props) => {
  return (
    <RangePicker
      format="DD/MM/YYYY"
      value={dates}
      allowClear={false}
      onChange={(datesPicker) => {
        onChange(datesPicker);
      }}
      disabledDate={(current) => current && current > moment().endOf('day')}
      ranges={{
        'Hôm nay': [moment(), moment()],
        'Hôm qua': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
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
  );
};

export default Index;
