import '@mantine/notifications/styles.css';

import '@mantine/core/styles.css';
import { createRoot } from 'react-dom/client'
import './index.css'
import LoginPage from './pages/common/LoginPage.jsx'
import Error403Page from './pages/common/Error403Page.jsx'
import RegisterPage from './pages/common/RegisterPage.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import DefaultLayout from './layouts/DefaultLayout.jsx'
import AppLayout from './layouts/AppLayout.jsx'
import LandingPage from './pages/common/LandingPage.jsx'
import LandingPageLayout from './layouts/LandingPageLayout.jsx'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications';
import ManageSunCode from './pages/admin/ManageSunCode.jsx'
import DashboardPage from './pages/admin/DashboardPage.jsx'
import ManageUsersPage from './pages/admin/ManageUsersPage.jsx'
import ManageMatchesPage from './pages/admin/ManageMatchesPage.jsx'
import '@mantine/dates/styles.css';
import MatchDetailPage from './pages/admin/MatchDetailPage.jsx';
import UserProfilePage from './pages/user/UserProfilePage.jsx';

createRoot(document.getElementById('root')).render(
  <MantineProvider>
    <Notifications />
    <BrowserRouter>
      <Routes>
        <Route path="/auth/*" element={<DefaultLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
        <Route path="/admin/*" element={<AppLayout configRoles={["Admin"]} />}>
          <Route index element={
            <DashboardPage />
          } />
          <Route path="users" element={<ManageUsersPage />} />
          <Route path="matches" element={<ManageMatchesPage />} />
          <Route path="matches/:matchId" element={<MatchDetailPage />} />
          <Route path="suncodes" element={<ManageSunCode />} />
        </Route>

        <Route path="/user/*" element={<AppLayout configRoles={["Mentee", "Mentor"]} />}>
          <Route path="profile" element={<UserProfilePage />} />
        </Route>

        <Route path="/" element={<LandingPageLayout />}>
          <Route index element={<LandingPage />} />
        </Route>

        {/* 404, errors */}
        <Route path="*" element={<div>404 Not Found</div>} />
        <Route path="/403" element={<Error403Page />} />
      </Routes>
    </BrowserRouter >
  </MantineProvider>
)
