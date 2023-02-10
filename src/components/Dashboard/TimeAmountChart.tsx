import React from 'react';
import { Area } from '@ant-design/plots';
import moment from 'moment';

interface IProps {
  data: Array<{
    date_time: number;
    amount: number;
    partner_name: string;
  }>;
}

const TimeAmountChart = ({ data }: IProps) => {
  const config = {
    data: data
      .sort((a, b) => a.date_time - b.date_time)
      .map((item) => ({
        date_time: moment.unix(item.date_time).format('DD/MM/YYYY'),
        amount: item.amount,
        partner_name: item.partner_name
      })),
    seriesField: 'partner_name',
    xField: 'date_time',
    yField: 'amount',
    xAxis: {
      tickCount: 5
    },
    animation: false,
    slider: {
      start: 0.1,
      end: 0.9,
      trendCfg: {
        isArea: true
      }
    },
    meta: {
      amount: {
        alias: 'Số tiền',
        formatter: (amount: number) => {
          return amount && Number(amount).toLocaleString('en-US');
        }
      }
    }
  };

  return <Area {...config} />;
};

export default React.memo(TimeAmountChart);
