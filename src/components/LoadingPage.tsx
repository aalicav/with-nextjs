"use client"
import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const LoadingPage: React.FC = () => {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />;

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column',
      backgroundColor: '#f0f2f5'
    }}>
      <Spin indicator={antIcon} size="large" />
      <p style={{ marginTop: '20px', fontSize: '18px' }}>Carregando...</p>
    </div>
  );
};

export default LoadingPage;