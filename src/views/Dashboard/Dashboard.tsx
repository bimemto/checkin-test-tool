import React, { useEffect, useState } from 'react';
import RangePicker from '@components/customAntd/RangePicker';
import StatisticCard from '@components/Dashboard/StatisticCard';
import moment from 'moment';
import { RangeValue } from 'rc-picker/lib/interface';
import { useQuery } from 'react-query';
import {
  getAllTrafficNumber,
  getAmount,
  getDataChart,
  getDataTimeChart,
  getTrafficNumber
} from '@api/transactions';
import { Card, Space } from 'antd';
import { getListApis } from '@api/ekycs';
import { getListPartners } from '@api/partners';
import APIAmountChart from '@components/Dashboard/APIAmountChart';
import APIRequestChart from '@components/Dashboard/APIRequestChart';
import TimeAmountChart from '@components/Dashboard/TimeAmountChart';

const Dashboard = () => {
  const [dates, setDates] = useState<RangeValue<moment.Moment>>([
    moment().subtract(6, 'days'),
    moment()
  ]);
  const [query, setQuery] = useState<any>();

  const { data: dataAllTrafficNumber, isLoading } = useQuery(
    ['getAllTrafficNumber', query],
    () => getAllTrafficNumber(query),
    {
      enabled: query ? true : false
    }
  );

  const { data: dataTrafficNumber } = useQuery(
    ['getTrafficNumber', query],
    () => getTrafficNumber(query),
    {
      enabled: query ? true : false
    }
  );

  const { data: dataChart } = useQuery(
    ['getDataChart', query],
    () => getDataChart(query),
    {
      enabled: query ? true : false
    }
  );

  const { data: dataTimeChart } = useQuery(
    ['getDataTimeChart', query],
    () => getDataTimeChart(query),
    {
      enabled: query ? true : false
    }
  );

  const { data: dataListPartner } = useQuery(['getListPartner'], () =>
    getListPartners()
  );

  const { data: dataListApi } = useQuery(['getListApi'], () => getListApis());

  const { data: amount } = useQuery(['getAmount', query], () =>
    getAmount(query)
  );

  useEffect(() => {
    const from = Number(dates && dates[0]?.startOf('days').unix());
    const to = Number(dates && dates[1]?.endOf('days').unix());
    setQuery({ ...query, from, to });
  }, [dates]);

  return (
    <Space direction="vertical" size="large">
      <RangePicker dates={dates} onChange={setDates} />
      <StatisticCard
        loading={isLoading}
        all={dataAllTrafficNumber && dataAllTrafficNumber.count}
        traffic_number={dataTrafficNumber && dataTrafficNumber.count}
        amount={amount && amount.amount}
      />
      <Card bordered={false} title="Thống kê số lượng yêu cầu theo API">
        <APIRequestChart
          data={dataChart || []}
          apis={dataListApi as { key: string; viName: string; name: string }[]}
          partners={dataListPartner as { id: string; name: string }[]}
        />
      </Card>
      <Card bordered={false} title="Thống kê số tiền theo API">
        <APIAmountChart
          data={dataChart || []}
          apis={dataListApi as { key: string; viName: string; name: string }[]}
          partners={dataListPartner as { id: string; name: string }[]}
        />
      </Card>
      <Card bordered={false} title="Thống kê số tiền theo ngày">
        <TimeAmountChart data={dataTimeChart || []} />
      </Card>
    </Space>
  );
};

export default Dashboard;
