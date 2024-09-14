"use client";

import { BooleanField, DateField, Show, TextField } from "@refinedev/antd";
import { Typography } from "antd";
import { useApiUrl, useShow } from "@refinedev/core";
import { Avatar } from "@chakra-ui/react";

const { Title } = Typography;

export default function MemberShow() {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;
  const apiUrl = useApiUrl();

  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>{"Email"}</Title>
      <TextField value={record?.email} />
      <Title level={5}>{"Data de Nascimento"}</Title>
      <DateField value={record?.birthDate} />
      <Title level={5}>{"WhatsApp"}</Title>
      <TextField value={record?.whatsapp} />
      <Title level={5}>{"Perfil TikTok"}</Title>
      <TextField value={record?.tiktokProfile} />
      <Title level={5}>{"Uso do TikTok"}</Title>
      <TextField value={record?.tiktokUsage} />
      <Title level={5}>{"Pertenceu a outra família"}</Title>
      <BooleanField value={record?.belongedToOtherFamily} />
      <Title level={5}>{"Transmitido e Agendado"}</Title>
      <BooleanField value={record?.isStreamedAndAgened} />
      <Title level={5}>Foto de Perfil</Title>
      <Avatar
        src={record?.profileImageId ? `${apiUrl}/members/image/${record.profileImageId}` : undefined}
        name={record?.personalName}
        size="xl"
      />
    </Show>
  );
}