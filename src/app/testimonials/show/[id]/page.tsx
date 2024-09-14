"use client";

import { Show, TextField, NumberField, DateField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography } from "antd";

const { Title } = Typography;

export default function TestimonialShow() {
  const { queryResult } = useShow({});
  const { data, isLoading } = queryResult;

  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>{"Autor"}</Title>
      <TextField value={record?.author} />
      <Title level={5}>{"Conteúdo"}</Title>
      <TextField value={record?.content} />
      <Title level={5}>{"Avaliação"}</Title>
      <NumberField value={record?.rating} />
      <Title level={5}>{"Data de Criação"}</Title>
      <DateField value={record?.createdAt} />
    </Show>
  );
}