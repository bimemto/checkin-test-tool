import React from 'react';
import { Column } from '@ant-design/plots';

interface IProps {
  data: Array<{
    api: string;
    count: number;
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

const APIRequestChart = ({ data, apis, partners }: IProps) => {
  const config = {
    data: data.map((item) => {
      const apiInfo = apis?.find((api) => api.key === item.api);
      const partnerInfo = partners?.find(
        (partner) => partner.id === item.partner_id
      );
      return {
        api: apiInfo?.viName,
        count: item.count,
        partner: partnerInfo?.name
      };
    }),
    isStack: true,
    seriesField: 'partner',
    xField: 'api',
    yField: 'count',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6
      }
    },
    xAxis: {
      label: {
        autoHide: true,
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
      count: {
        alias: 'Số lượng yêu cầu'
      }
    }
  };
  return <Column {...(config as any)} />;
};

export default React.memo(APIRequestChart);
