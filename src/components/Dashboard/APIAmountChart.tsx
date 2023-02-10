import React from 'react';
import { Column } from '@ant-design/plots';

interface IProps {
  data: Array<{
    api: string;
    amount: number;
    partner_id: string;
  }>;
  apis: Array<{
    key: string;
    viName: string;
    name: string;
  }>;
  partners: Array<{
    id: string;
    name: string;
  }>;
}

const APIAmountChart = ({ data, apis, partners }: IProps) => {
  const config = {
    data: data.map((item) => {
      const apiInfo = apis?.find((api) => api.key === item.api);
      const partnerInfo = partners?.find(
        (partner) => partner.id === item.partner_id
      );
      return {
        api: apiInfo?.viName,
        amount: item.amount,
        partner: partnerInfo?.name
      };
    }),
    isStack: true,
    seriesField: 'partner',
    xField: 'api',
    yField: 'amount',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6
      },
      formatter: ({ amount }: { amount: string }) => {
        return amount && Number(amount).toLocaleString('en-US');
      }
    },
    xAxis: {
      label: {
        autoHide: false,
        autoRotate: false,
        formatter: (text: string) => {
          return text.length > 20 ? `${text.slice(0, 27)}...` : text;
        }
      }
    },
    meta: {
      api: {
        alias: 'API'
      },
      amount: {
        alias: 'Số tiền',
        formatter: (amount: number) => {
          return amount && Number(amount).toLocaleString('en-US');
        }
      }
    }
  };
  return <Column {...(config as any)} />;
};

export default React.memo(APIAmountChart);
