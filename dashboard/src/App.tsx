import { createGlobalStyle } from "antd-style";
import { ConfigProvider, theme as antdTheme } from "antd";
import zhCN from "antd/locale/zh_CN";
import enUS from "antd/locale/en_US";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import { useEffect } from "react";
import DesktopWindowControls from "./components/DesktopWindowControls";
import {
  DesktopChromeProvider,
  useDesktopChrome,
} from "./hooks/useDesktopChrome";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MainLayout from "./layouts/MainLayout";
import LoginPage from "./pages/Login";
import OidcComplete from "./pages/Login/OidcComplete";
import SetupPage from "./pages/Setup";
import InvitePage from "./pages/Invite";
import AuthGuard from "./components/AuthGuard";
import OctopSpinner from "./components/OctopSpinner";
import { AntdAppProvider } from "./components/AntdAppProvider";
import GlobalErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { AgentProvider } from "./context/AgentContext";
import { LayoutModeProvider } from "./context/LayoutModeContext";
import { VoiceOutputProvider } from "./context/VoiceOutputContext";
import { useIsMobile } from "./hooks/useIsMobile";
import { useUnauthorizedRedirect } from "./hooks/useUnauthorizedRedirect";
import { installDesktopExternalLinks } from "./utils/desktopExternalLinks";
import { brandTokensFor } from "./styles/themePalettes";
import "./styles/theme-vars.css";
import "./styles/yuntai.css";
import "./styles/layout.css";
import "./styles/form-override.css";
import "./styles/spin-override.css";

const GlobalStyle = createGlobalStyle`
* {
  margin: 0;
  box-sizing: border-box;
}
`;

function ThemedApp() {
  const { isDark, palette, customColor } = useTheme();
  const { t, i18n } = useTranslation();
  const isMobile = useIsMobile();
  const desktopChrome = useDesktopChrome();
  const brandTokens = brandTokensFor(palette, isDark, customColor);
  // Make antd built-ins (Popconfirm OK/Cancel, Modal default footer, Empty,
  // Pagination, DatePicker, Table… ) follow the current UI language.
  // DatePicker month/weekday labels come from dayjs — keep it in sync too.
  const isZh = i18n.language?.toLowerCase().startsWith("zh") ?? false;
  const antdLocale = isZh ? zhCN : enUS;
  dayjs.locale(isZh ? "zh-cn" : "en");

  useUnauthorizedRedirect();

  useEffect(() => installDesktopExternalLinks(), []);

  // Set document title based on current language
  useEffect(() => {
    document.title = t("app.pageTitle");
  }, [t]);

  const themeConfig = {
    algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
      borderRadius: 10,
      ...(isMobile
        ? {
            fontSize: 15,
            fontSizeSM: 13,
            fontSizeLG: 17,
            fontSizeXL: 22,
            controlHeight: 36,
          }
        : {}),
      ...(isDark
        ? {
            // 芸台暮云：紫相深空中性面
            colorBgBase: "#191927",
            colorTextBase: "#ecebfa",
            colorBgContainer: "#191927",
            colorBgElevated: "#212130",
            colorBgLayout: "#131320",
            colorBgSpotlight: "rgba(0, 0, 0, 0.85)",
            colorBgMask: "rgba(8, 6, 16, 0.80)",
            colorBorder: "rgba(190, 170, 255, 0.10)",
            colorBorderSecondary: "rgba(190, 170, 255, 0.06)",
            colorText: "rgba(255, 255, 255, 0.92)",
            colorTextSecondary: "rgba(255, 255, 255, 0.64)",
            colorTextTertiary: "rgba(255, 255, 255, 0.38)",
            colorTextQuaternary: "rgba(255, 255, 255, 0.22)",
            colorFill: "rgba(190, 170, 255, 0.06)",
            colorFillSecondary: "rgba(190, 170, 255, 0.04)",
            colorFillTertiary: "rgba(190, 170, 255, 0.03)",
            colorFillQuaternary: "rgba(190, 170, 255, 0.02)",
            colorBgTextHover: "rgba(190, 170, 255, 0.07)",
            ...brandTokens,
            boxShadow: "0px 4px 6px 0px rgba(10, 6, 24, 0.3)",
            boxShadowSecondary:
              "0px 12px 24px -16px rgba(10, 6, 24, 0.2), 0px 8px 40px 0px rgba(10, 6, 24, 0.3)",
          }
        : {
            // 芸台晨露：豆青纸微紫白
            colorBgLayout: "#F7F6FC",
            ...brandTokens,
          }),
    },
    components: isDark
      ? {
          Modal: { headerBg: "#212130", contentBg: "#212130" },
          Input: { colorBgBase: "#191927" },
          InputNumber: { colorBgBase: "#191927" },
          Select: { colorBgBase: "#191927", selectorBg: "#191927" },
          DatePicker: { colorBgBase: "#191927" },
          Segmented: { itemSelectedBg: "#212130" },
          Card: { colorBgContainer: "#1F1F30" },
          Tooltip: { colorBgSpotlight: "#33324E" },
        }
      : {},
  };

  return (
    <ConfigProvider
      theme={themeConfig}
      prefixCls="octop"
      locale={antdLocale}
      spin={{ indicator: <OctopSpinner /> }}
    >
      <AntdAppProvider>
        <DesktopChromeProvider value={desktopChrome}>
          {desktopChrome ? (
            <DesktopWindowControls chrome={desktopChrome} />
          ) : null}
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/login/oidc/complete" element={<OidcComplete />} />
            <Route path="/setup" element={<SetupPage />} />
            <Route path="/invite" element={<InvitePage />} />
            <Route
              path="/*"
              element={
                <AuthGuard>
                  <AgentProvider>
                    <LayoutModeProvider>
                      <VoiceOutputProvider>
                        <MainLayout />
                      </VoiceOutputProvider>
                    </LayoutModeProvider>
                  </AgentProvider>
                </AuthGuard>
              }
            />
          </Routes>
        </DesktopChromeProvider>
      </AntdAppProvider>
    </ConfigProvider>
  );
}

function App() {
  return (
    // `useTransitions` off: with router transitions on, React keeps the old
    // page mounted while a lazy route chunk downloads and never renders the
    // Suspense fallback, so a nav click looks like it did nothing.
    <BrowserRouter useTransitions={false}>
      <GlobalErrorBoundary>
        <GlobalStyle />
        <ThemeProvider>
          <ThemedApp />
        </ThemeProvider>
      </GlobalErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
