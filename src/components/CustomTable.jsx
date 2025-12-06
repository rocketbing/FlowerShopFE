import React from "react";
import { Table } from "antd";

export default function CustomTable({ columns, data, paginationTotal, pageChange, currentPage, pageSize }) {
  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey={(record) => record?.id || record?.key || record?.name}
      pagination={{
        total: paginationTotal,
        pageSize: pageSize,
        current: currentPage,
        onChange: pageChange,
        onShowSizeChange: pageChange,
        showSizeChanger: false,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
      }}
    />
  );
}