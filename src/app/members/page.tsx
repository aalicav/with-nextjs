"use client";

import {
  List,
  useTable,
  EditButton,
  ShowButton,
  DeleteButton,
  DateField,
  FilterDropdown,
} from "@refinedev/antd";
import {
  Table,
  Space,
  Button,
  Select,
  Upload,
  message,
  Tag,
  Input,
  Form,
  Modal,
  Typography,
  DatePicker,
} from "antd";
import {
  SearchOutlined,
  ExportOutlined,
  UploadOutlined,
  EditOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import {
  useExport,
  useApiUrl,
  useCustomMutation,
  useUpdate,
  BaseKey,
  CrudFilter,
  useList,
} from "@refinedev/core";
import Papa from "papaparse";
import { useState, useEffect } from "react";
import { ColumnType } from "antd/es/table";
import { BaseRecord } from "@refinedev/core";
import { Avatar } from "@chakra-ui/react";

const { Title, Text } = Typography;

export default function MemberList() {
  const apiUrl = useApiUrl();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [form] = Form.useForm();
  const [totalMembers, setTotalMembers] = useState(0);
  const [filteredMembers, setFilteredMembers] = useState(0);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({});

  const {
    tableProps,
    setFilters,
    filters,
    sorter,
    setSorter,
    current,
    setCurrent,
    pageSize,
    setPageSize,
  } = useTable({
    syncWithLocation: true,
    onSearch: (values) => {
      const filters: CrudFilter[] = Object.entries(values ?? {})
        .filter(
          ([_, value]) => value !== undefined && value !== null && value !== ""
        )
        .map(([key, value]) => ({ operator: "eq", field: key, value }));
      setAppliedFilters(
        Object.fromEntries(filters.map((f) => [f.operator, f.value]))
      );
      return filters;
    },
  });

  const { mutate: update } = useUpdate();

  const { triggerExport, isLoading: exportLoading } = useExport({
    mapData: (item) => ({
      id: item._id,
      email: item.email,
      birthDate: item.birthDate,
      whatsapp: item.whatsapp,
      tiktokProfile: item.tiktokProfile,
      tiktokUsage: item.tiktokUsage,
      belongedToOtherFamily: item.belongedToOtherFamily ? "Sim" : "Não",
      isStreamedAndAgened: item.isStreamedAndAgened ? "Sim" : "Não",
      memberClass: item.memberClass,
      liveParticipations: item.liveParticipations.length,
      brasaoReceivedDate: item.brasaoReceivedDate,
      coins: item.coins,
      isJailed: item.isJailed ? "Sim" : "Não",
    }),
  });

  const { mutate: importMembers, isLoading: importLoading } =
    useCustomMutation();

  const { mutate: bulkEdit, isLoading: isBulkEditing } = useCustomMutation();

  useEffect(() => {
    setTotalMembers(
      tableProps.pagination && "total" in tableProps.pagination
        ? tableProps.pagination.total ?? 0
        : 0
    );
    setFilteredMembers(tableProps.dataSource?.length || 0);
  }, [tableProps.pagination, tableProps.dataSource]);

  const exportToExcel = () => {
    triggerExport();
  };

  const handleImport = (info: any) => {
    const { status } = info.file;
    if (status === "done") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csv = e.target?.result;
        Papa.parse(csv as string, {
          complete: (results) => {
            importMembers({
              url: `${apiUrl}/members/import`,
              method: "post",
              values: results,
            });
          },
          header: true,
        });
      };
      reader.readAsText(info.file.originFileObj);
      message.success(`${info.file.name} arquivo importado com sucesso.`);
    } else if (status === "error") {
      message.error(`${info.file.name} falha no upload do arquivo.`);
    }
  };

  const handleBulkEdit = () => {
    setIsModalVisible(true);
  };

  const handleBulkEditSubmit = async (values: any) => {
    try {
      await bulkEdit({
        url: `${apiUrl}/members/bulk-edit`,
        method: "put",
        values: {
          ids: selectedRowKeys,
          data: values,
        },
      });
      setIsModalVisible(false);
      setSelectedRowKeys([]);
      message.success("Membros atualizados com sucesso");
    } catch (error) {
      message.error("Erro ao atualizar membros");
    }
  };

  const clearFilters = () => {
    setFilters([], "replace");
    setSorter([]);
    setCurrent(1);
    setAppliedFilters({});
  };

  const columns: ColumnType<BaseRecord>[] = [
    {
      dataIndex: "_id",
      title: "ID",
      filterDropdown: (props: any) => (
        <FilterDropdown {...props}>
          <Input placeholder="Buscar ID" />
        </FilterDropdown>
      ),
      filterIcon: (
        <SearchOutlined
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      ),
    },
    {
      dataIndex: "email",
      title: "Email",
      filterDropdown: (props: any) => (
        <FilterDropdown {...props}>
          <Input placeholder="Buscar email" />
        </FilterDropdown>
      ),
      filterIcon: (
        <SearchOutlined
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      ),
    },
    {
      dataIndex: "birthDate",
      title: "Data de Nascimento",
      render: (value: string) => (
        <DateField value={value} format="DD/MM/YYYY" />
      ),
      sorter: (a: any, b: any) =>
        new Date(a.birthDate).getTime() - new Date(b.birthDate).getTime(),
      filterDropdown: (props: any) => (
        <FilterDropdown {...props}>
          <Input placeholder="Buscar data" />
        </FilterDropdown>
      ),
      filterIcon: (
        <SearchOutlined
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      ),
    },
    {
      dataIndex: "whatsapp",
      title: "WhatsApp",
      filterDropdown: (props: any) => (
        <FilterDropdown {...props}>
          <Input placeholder="Buscar WhatsApp" />
        </FilterDropdown>
      ),
      filterIcon: (
        <SearchOutlined
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      ),
    },
    {
      dataIndex: "tiktokProfile",
      title: "Perfil TikTok",
      filterDropdown: (props: any) => (
        <FilterDropdown {...props}>
          <Input placeholder="Buscar perfil TikTok" />
        </FilterDropdown>
      ),
      filterIcon: (
        <SearchOutlined
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      ),
    },
    {
      dataIndex: "tiktokUsage",
      title: "Uso do TikTok",
      render: (value: string) => (
        <Select value={value} style={{ width: 120 }}>
          <Select.Option value="Profissional">Profissional</Select.Option>
          <Select.Option value="Entreternimento">Entreternimento</Select.Option>
        </Select>
      ),
      filterDropdown: (props: any) => (
        <FilterDropdown {...props}>
          <Select style={{ width: 200 }}>
            <Select.Option value="Profissional">Profissional</Select.Option>
            <Select.Option value="Entreternimento">Entreternimento</Select.Option>
          </Select>
        </FilterDropdown>
      ),
    },
    {
      dataIndex: "belongedToOtherFamily",
      title: "Pertenceu a outra família",
      render: (value: boolean) => (value ? "Sim" : "Não"),
      filterDropdown: (props: any) => (
        <FilterDropdown {...props}>
          <Select style={{ width: 200 }}>
            <Select.Option value={true}>Sim</Select.Option>
            <Select.Option value={false}>Não</Select.Option>
          </Select>
        </FilterDropdown>
      ),
    },
    {
      dataIndex: "isStreamedAndAgened",
      title: "Transmitido e Agendado",
      render: (value: any) => (value ? "Sim" : "Não"),
      filterDropdown: (props: any) => (
        <FilterDropdown {...props}>
          <Select style={{ width: 200 }}>
            <Select.Option value={true}>Sim</Select.Option>
            <Select.Option value={false}>Não</Select.Option>
          </Select>
        </FilterDropdown>
      ),
    },
    {
      dataIndex: "tiktokUsername",
      title: "Username TikTok",
      filterDropdown: (props: any) => (
        <FilterDropdown {...props}>
          <Input placeholder="Buscar username" />
        </FilterDropdown>
      ),
      filterIcon: (
        <SearchOutlined
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      ),
    },
    {
      dataIndex: "memberClass",
      title: "Classe",
      render: (value: string) => (
        <Tag
          color={
            value === "Beginner"
              ? "green"
              : value === "Intermediário"
              ? "blue"
              : "red"
          }
        >
          {value}
        </Tag>
      ),
      filterDropdown: (props: any) => (
        <FilterDropdown {...props}>
          <Select style={{ width: 200 }}>
            <Select.Option value="Beginner">Beginner</Select.Option>
            <Select.Option value="Intermediário">Intermediário</Select.Option>
            <Select.Option value="Avançado">Avançado</Select.Option>
          </Select>
        </FilterDropdown>
      ),
    },
    {
      dataIndex: "liveParticipations",
      title: "Participações em Lives",
      render: (value: any[]) => value.length,
      sorter: (a: any, b: any) =>
        a.liveParticipations.length - b.liveParticipations.length,
      filterDropdown: (props: any) => (
        <FilterDropdown {...props}>
          <Input placeholder="Buscar número de participações" />
        </FilterDropdown>
      ),
      filterIcon: (
        <SearchOutlined
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      ),
    },
    {
      dataIndex: "brasaoReceivedDate",
      title: "Data de Recebimento do Brasão",
      render: (value: string) => value ? <DateField value={value} format="DD/MM/YYYY" /> : "-",
      sorter: (a: any, b: any) => {
        if (!a.brasaoReceivedDate) return 1;
        if (!b.brasaoReceivedDate) return -1;
        return new Date(a.brasaoReceivedDate).getTime() - new Date(b.brasaoReceivedDate).getTime();
      },
      filterDropdown: (props: any) => (
        <FilterDropdown {...props}>
          <Input placeholder="Buscar data" />
        </FilterDropdown>
      ),
      filterIcon: <SearchOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
    },
    {
      dataIndex: "coins",
      title: "Moedas",
      render: (value: number) => value,
      sorter: (a: any, b: any) => a.coins - b.coins,
      filterDropdown: (props: any) => (
        <FilterDropdown {...props}>
          <Input placeholder="Buscar quantidade de moedas" />
        </FilterDropdown>
      ),
      filterIcon: <SearchOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />,
    },
    {
      dataIndex: "isJailed",
      title: "Preso",
      render: (value: boolean) => (value ? "Sim" : "Não"),
      filters: [
        { text: 'Sim', value: true },
        { text: 'Não', value: false },
      ],
      onFilter: (value: any, record: any) => record.isJailed === value,
    },
    {
      title: "Foto de Perfil",
      dataIndex: "profileImageId",
      render: (profileImageId: string) => (
        <Avatar
          src={profileImageId ? `${apiUrl}/members/image/${profileImageId}` : undefined}
          name="Foto de Perfil"
        />
      ),
    },
    {
      title: "Ações",
      dataIndex: "actions",
      render: (_: any, record: any) => (
        <Space>
          <EditButton hideText size="small" recordItemId={record._id} />
          <DeleteButton hideText size="small" recordItemId={record._id} />
        </Space>
      ),
    },
  ];

  return (
    <List
      title={
        <Space direction="vertical">
          <Title level={4}>
            Membros
            <Text type="secondary" style={{ marginLeft: 8 }}>
              ({filteredMembers} de {totalMembers})
            </Text>
          </Title>
          {Object.keys(appliedFilters).length > 0 && (
            <Text>
              Filtros aplicados:{" "}
              {Object.entries(appliedFilters).map(([key, value]) => (
                <Tag
                  key={key}
                  closable
                  onClose={() => {
                    const newFilters = { ...appliedFilters };
                    delete newFilters[key];
                    const updatedFilters = Object.entries(newFilters).map(
                      ([field, value]) => ({
                        field,
                        operator: "eq" as const,
                        value,
                      })
                    );
                    setFilters(updatedFilters);
                    setAppliedFilters(newFilters);
                  }}
                >
                  {key}: {value}
                </Tag>
              ))}
            </Text>
          )}
        </Space>
      }
    >
      <Table
        {...tableProps}
        rowKey="_id"
        columns={columns}
        rowSelection={{
          type: "checkbox",
          onChange: (selectedRowKeys) => setSelectedRowKeys(selectedRowKeys),
        }}
      />
      <Space style={{ marginTop: 16 }}>
        <Button
          icon={
            <ExportOutlined
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />
          }
          onClick={exportToExcel}
          loading={exportLoading}
        >
          Exportar para Excel
        </Button>
        <Upload
          accept=".csv"
          showUploadList={false}
          customRequest={({ onSuccess }) =>
            onSuccess ? onSuccess("ok") : undefined
          }
          onChange={handleImport}
        >
          <Button
            icon={
              <UploadOutlined
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
            }
            loading={importLoading}
          >
            Importar CSV
          </Button>
        </Upload>
        <Button
          icon={
            <EditOutlined
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />
          }
          onClick={handleBulkEdit}
          disabled={selectedRowKeys.length === 0}
        >
          Editar em Massa
        </Button>
        <Button
          icon={
            <ClearOutlined
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />
          }
          onClick={clearFilters}
        >
          Limpar Filtros
        </Button>
      </Space>
      <Modal
        title="Edição em Massa"
        visible={isModalVisible}
        onOk={form.submit}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={isBulkEditing}
      >
        <Form form={form} onFinish={handleBulkEditSubmit}>
          <Form.Item name="tiktokUsage" label="Uso do TikTok">
            <Select allowClear>
              <Select.Option value="Profissional">Profissional</Select.Option>
              <Select.Option value="Entreternimento">Entreternimento</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="belongedToOtherFamily"
            label="Pertenceu a outra família"
          >
            <Select allowClear>
              <Select.Option value={true}>Sim</Select.Option>
              <Select.Option value={false}>Não</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="isStreamedAndAgened" label="Transmitido e Agendado">
            <Select allowClear>
              <Select.Option value={true}>Sim</Select.Option>
              <Select.Option value={false}>Não</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="brasaoReceivedDate" label="Data de Recebimento do Brasão">
            <DatePicker />
          </Form.Item>
          <Form.Item name="coins" label="Moedas">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="isJailed" label="Preso">
            <Select allowClear>
              <Select.Option value={true}>Sim</Select.Option>
              <Select.Option value={false}>Não</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </List>
  );
}
