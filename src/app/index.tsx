import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ThemeSwitcherProvider } from 'react-css-theme-switcher';
import '@styles/index.less';
import { PATH } from '@utils/constants/path';
import { useLocalStorage } from '@hooks/useLocalStorage';
import PublicLayout from '@components/layouts/PublicLayout';
import PrivateLayout from '@components/layouts/PrivateLayout';
import Transaction from '@views/Transaction/Transaction';
import Dashboard from '@views/Dashboard/Dashboard';
import { ConfigProvider, message } from 'antd';
import viVN from 'antd/es/locale/vi_VN';
import Profile from '@views/Profile/Profile';
import Login from '@views/Login/Login';
import Partners from '@views/Partners/Partners';
import Users from '@views/Users/Users';
import Providers from '@views/Providers/Providers';
import Ekycs from '@views/Ekycs/Ekycs';
import PartnerEkycs from '@views/Partners/PartnerEkycs';
import Mail from '@views/Mail/Mail';
import BalanceTransaction from '@views/BalanceTransaction/BalanceTransaction';
import DemoKey from '@views/DemoKey/DemoKey';
import AdminManage from '@views/AdminManage/AdminManage';
import Account from '@views/Account/Account';
import moment from 'moment';
import BalancePartner from '@views/BalanceTransaction/BalancePartner';
import LogError from '@views/LogError/LogError';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false
    }
  }
});

function MainApp() {
  moment.updateLocale('vi', {
    relativeTime: {
      future: '%s tới',
      past: '%s trước',
      s: 'vài giây',
      ss: '%d giây',
      m: '1 phút',
      mm: '%d phút',
      h: '1 giờ',
      hh: '%d giờ',
      d: '1 ngày',
      dd: '%d ngày',
      M: '1 tháng',
      MM: '%d tháng',
      y: '1 năm',
      yy: '%d năm'
    }
  });
  message.config({
    duration: 2,
    maxCount: 1
  });
  const [theme] = useLocalStorage('theme', 'light');

  const themes = {
    dark: `${process.env.PUBLIC_URL}/dark-theme.css`,
    light: `${process.env.PUBLIC_URL}/light-theme.css`
  };

  return (
    <ConfigProvider locale={viVN}>
      <ThemeSwitcherProvider themeMap={themes} defaultTheme={theme}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Routes>
              <Route
                path={PATH.SIGNIN}
                element={<PublicLayout children={<Login />} />}
              />
              <Route
                path={PATH.PARTNERS}
                element={<PrivateLayout children={<Partners />} />}
              />
              <Route
                path={PATH.HOME}
                element={<PrivateLayout children={<Dashboard />} />}
              />
              <Route
                path={PATH.TRANSACTION}
                element={<PrivateLayout children={<Transaction />} />}
              />
              <Route
                path={PATH.PROFILE}
                element={<PrivateLayout children={<Profile />} />}
              />
              <Route
                path={PATH.USERS}
                element={<PrivateLayout children={<Users />} />}
              />
              <Route
                path={PATH.PROVIDERS}
                element={<PrivateLayout children={<Providers />} />}
              />
              <Route
                path={PATH.EKYCS}
                element={<PrivateLayout children={<Ekycs />} />}
              />
              <Route
                path={PATH.PARTNER_EKYCS}
                element={<PrivateLayout children={<PartnerEkycs />} />}
              />
              <Route
                path={PATH.MAIL}
                element={<PrivateLayout children={<Mail />} />}
              />
              <Route
                path={PATH.BALANCE_TRANSACTION}
                element={<PrivateLayout children={<BalanceTransaction />} />}
              />
              <Route
                path={PATH.DEMO_KEY}
                element={<PrivateLayout children={<DemoKey />} />}
              />
              <Route
                path={PATH.ADMIN_MANAGE}
                element={<PrivateLayout children={<AdminManage />} />}
              />
              <Route
                path={PATH.ACCOUNT}
                element={<PrivateLayout children={<Account />} />}
              />
              <Route
                path={PATH.BALANCE_PARTNER}
                element={<PrivateLayout children={<BalancePartner />} />}
              />
              <Route
                path={PATH.LOG_ERROR}
                element={<PrivateLayout children={<LogError />} />}
              />
              <Route
                path={PATH.ACCOUNT_INFO}
                element={<PrivateLayout children={<Account />} />}
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </ThemeSwitcherProvider>
    </ConfigProvider>
  );
}

export default MainApp;
