"use client";

import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useTable,
  getDefaultSortOrder,
} from "@refinedev/antd";
import { BaseRecord, HttpError } from "@refinedev/core";
import { Space, Table } from "antd";

export default function TestimonialList() {
  const { tableProps, sorter } = useTable<BaseRecord, HttpError>({
    syncWithLocation: true,
  });
  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex="id"
          title="ID"
          sorter
          defaultSortOrder={getDefaultSortOrder("id", sorter)}
        />
        <Table.Column
          dataIndex="author"
          title="Autor"
          sorter
          defaultSortOrder={getDefaultSortOrder("author", sorter)}
        />
        <Table.Column dataIndex="content" title="Conteúdo" ellipsis={true} />
        <Table.Column
          dataIndex="rating"
          title="Avaliação"
          sorter
          defaultSortOrder={getDefaultSortOrder("rating", sorter)}
        />
        <Table.Column
          dataIndex="createdAt"
          title="Data de Criação"
          sorter
          defaultSortOrder={getDefaultSortOrder("createdAt", sorter)}
        />
        <Table.Column
          title="Ações"
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
}
