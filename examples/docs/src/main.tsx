import debounce from 'lodash/debounce';
import ReactDOM from 'react-dom/client';
import React, { useEffect, useMemo, useState } from 'react';
import { useDarkMode } from 'usehooks-ts';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { ConfigProvider, theme as AntdTheme, Row, Col, Tooltip, Button } from 'antd';

import { Settings } from './settings';
import { MarktionEditor } from './editor';
import { Articles } from './article-list';
import { MainContextProvider, useMainContextSelector } from './hooks';

import 'marktion/dist/style.css';
import './main.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <StyleProvider>
      <MainContextProvider>
        <App />
      </MainContextProvider>
    </StyleProvider>
  </React.StrictMode>
);

function App() {
  const { isDarkMode } = useDarkMode();
  const token = AntdTheme.useToken();
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const articles = useMainContextSelector(ctx => ctx.articles);
  const refreshArticles = useMainContextSelector(ctx => ctx.refreshArticles);
  const debouceRefreshArticles = useMemo(() => debounce(refreshArticles, 2000), []);

  useEffect(() => {
    setTimeout(() => {
      setTooltipOpen(true);
    }, 2000);
  }, []);

  return (
    <div className="marktion" style={{ backgroundColor: token.token.colorBgBase }}>
      <Row justify="center" align="middle" style={{ height: 80 }}>
        <Col md={20} xs={22}>
          <Row justify="space-between">
            <Tooltip open={tooltipOpen} title="Star on Github" placement="right" color="purple">
              <Button
                type="default"
                href="https://github.com/microvoid/marktion"
                target="_blank"
                icon={<GitHubLogoIcon />}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              ></Button>
            </Tooltip>

            <Settings />
          </Row>
        </Col>
      </Row>

      <Row justify="center" style={{ minHeight: 'calc(100vh - 80px)', marginTop: 100 }}>
        <Col xs={22}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <MarktionEditor
              dark={isDarkMode}
              onSave={article => {
                if (!articles.find(item => item.id === article.id)) {
                  refreshArticles();
                } else {
                  debouceRefreshArticles();
                }
              }}
            />
            <div style={{ marginTop: 20 }}>
              <Articles />
            </div>
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
