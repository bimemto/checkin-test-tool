/* eslint-disable no-unused-vars */
import React from 'react';
import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';

type IProps = {
  dataSource: any;
  columns: ColumnsType<any>;
  query: any;
  setQuery: (query: any) => void;
  totalPage?: number;
};

const TableTransaction = ({
  dataSource,
  columns,
  query,
  setQuery,
  totalPage
}: IProps) => {
  return (
    <Table
      size="small"
      rowKey="id"
      columns={columns}
      loading={!dataSource}
      dataSource={dataSource}
      pagination={{
        showSizeChanger: false,
        current: query?.page,
        total: totalPage,
        onChange: (page) => {
          setQuery({ ...query, page });
        }
      }}
      scroll={{ x: 'auto' }}
    />
  );
};

export default TableTransaction;
