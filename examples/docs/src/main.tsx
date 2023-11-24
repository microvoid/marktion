import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { useDarkMode } from 'usehooks-ts';
import { ConfigProvider, theme as AntdTheme, Row, Col } from 'antd';

import { MarktionEditor } from './editor';

import 'marktion/dist/marktion.css';
import './main.css';
import { Settings } from './settings';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <StyleProvider>
      <App />
    </StyleProvider>
  </React.StrictMode>
);

function App() {
  const { isDarkMode } = useDarkMode();
  const token = AntdTheme.useToken();

  return (
    <div className="marktion" style={{ backgroundColor: token.token.colorBgBase }}>
      <Row justify="center" align="middle" style={{ height: 80 }}>
        <Col sm={20}>
          <Row justify="end">
            <Settings />
          </Row>
        </Col>
      </Row>

      <Row justify="center" style={{ height: 'calc(100vh - 80px)', marginTop: 200 }}>
        <Col xs={22}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <MarktionEditor dark={isDarkMode} />
          </div>
        </Col>
      </Row>
    </div>
  );
}

function StyleProvider({ children }: React.PropsWithChildren) {
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? AntdTheme.darkAlgorithm : AntdTheme.defaultAlgorithm
      }}
    >
      {children}
    </ConfigProvider>
  );
}
