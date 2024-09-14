"use client";

import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber } from "antd";

export default function TestimonialEdit() {
  const { formProps, saveButtonProps } = useForm();

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Autor"
          name="author"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Conteúdo"
          name="content"
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item
          label="Avaliação"
          name="rating"
          rules={[{ required: true, type: "number", min: 1, max: 5 }]}
        >
          <InputNumber min={1} max={5} />
        </Form.Item>
      </Form>
    </Edit>
  );
}