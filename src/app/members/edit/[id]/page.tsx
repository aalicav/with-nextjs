"use client";

import { Edit, useForm, useFileUploadState } from "@refinedev/antd";
import {
  Form,
  Input,
  DatePicker,
  Switch,
  Select,
  Upload,
  InputNumber,
} from "antd";
import { useApiUrl } from "@refinedev/core";
import moment from "moment";
import Avatar from "antd/lib/avatar";

export default function MemberEdit() {
  const { formProps, saveButtonProps, queryResult } = useForm();
  const apiUrl = useApiUrl();
  const { onChange: onChangeHandler } = useFileUploadState();

  const member = queryResult?.data?.data;

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form
        {...formProps}
        layout="vertical"
        initialValues={{
          ...formProps.initialValues,
          birthDate: moment(formProps.initialValues?.["birthDate"]),
          brasaoReceivedDate: formProps.initialValues?.["brasaoReceivedDate"]
            ? moment(formProps.initialValues?.["brasaoReceivedDate"])
            : undefined,
        }}
      >
        <Form.Item label="Nome" name={["name"]} rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name={["email"]}
          rules={[{ required: true, type: "email" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Nova Senha" name={["password"]}>
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Data de Nascimento"
          name={["birthDate"]}
          rules={[{ required: true }]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          label="WhatsApp"
          name={["whatsapp"]}
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Perfil TikTok"
          name={["tiktokProfile"]}
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Uso do TikTok"
          name={["tiktokUsage"]}
          rules={[{ required: true }]}
        >
          <Select>
            <Select.Option value="Profissional">Profissional</Select.Option>
            <Select.Option value="Entrertenimento">
              Entrertenimento
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Pertenceu a outra família"
          name={["belongedToOtherFamily"]}
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Form.Item
          label="Transmitido e Agendado"
          name={["isStreamedAndAgened"]}
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Form.Item
          label="Data de Recebimento do Brasão"
          name={["brasaoReceivedDate"]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          label="Moedas"
          name={["coins"]}
          rules={[{ required: true, type: "number", min: 0 }]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item label="Preso" name={["isJailed"]} valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item label="Foto de Perfil">
          <Upload
            name="image"
            listType="picture-card"
            showUploadList={false}
            action={`${apiUrl}/members/image`}
            onChange={onChangeHandler}
            data={{
              memberId: member?._id,
            }}
          >
            {member?.profileImageId ? (
              <Avatar
                size="large"
                src={`${apiUrl}/members/image/${member.profileImageId}`}
              />
            ) : (
              "Upload"
            )}
          </Upload>
        </Form.Item>
      </Form>
    </Edit>
  );
}
