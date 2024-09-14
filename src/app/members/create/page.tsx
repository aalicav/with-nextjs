"use client";

import { Create, useForm } from "@refinedev/antd";
import { Form, Input, DatePicker, Switch, Select, InputNumber } from "antd";

export default function MemberCreate() {
  const { formProps, saveButtonProps } = useForm();

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Nome"
          name={["name"]}
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name={["email"]}
          rules={[{ required: true, type: "email" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Senha"
          name={["password"]}
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label={"Data de Nascimento"}
          name={["birthDate"]}
          rules={[{ required: true }]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          label={"WhatsApp"}
          name={["whatsapp"]}
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={"Perfil TikTok"}
          name={["tiktokProfile"]}
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={"Uso do TikTok"}
          name={["tiktokUsage"]}
          rules={[{ required: true }]}
        >
          <Select>
            <Select.Option value="Profissional">Profissional</Select.Option>
            <Select.Option value="Trabalho">Trabalho</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label={"Pertenceu a outra família"}
          name={["belongedToOtherFamily"]}
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Form.Item
          label={"Transmitido e Agendado"}
          name={["isStreamedAndAgened"]}
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Form.Item
          label={"Data de Recebimento do Brasão"}
          name={["brasaoReceivedDate"]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          label={"Moedas"}
          name={["coins"]}
          rules={[{ required: true, type: "number", min: 0 }]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          label={"Preso"}
          name={["isJailed"]}
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </Form>
    </Create>
  );
}