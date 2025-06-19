import { useAuthStore } from '../store/auth.store.js';
import { useDisclosure, useFavicon } from '@mantine/hooks';
import classes from '../styles/AdminLayout.module.css';
import { HiChartBar, HiLogout, HiUser } from 'react-icons/hi';
import { AppShell, Burger, Button, Group, ScrollArea, Skeleton } from '@mantine/core';
import SCC_LOGO from '../assets/scc_logo.png';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { FaNetworkWired } from 'react-icons/fa';
import LogoutModal from '../components/LogoutModal.jsx';

export default function AppLayout({ configRoles }) {
    const [opened, { toggle }] = useDisclosure();
    const [logoutModalOpened, { open: openLogoutModal, close: closeLogoutModal }] = useDisclosure();

    const adminLinks = [
        {
            label: 'Dashboard',
            link: '/admin',
            icon: HiChartBar
        },
        { label: 'Manage users', link: '/admin/users', icon: HiUser },
        { label: 'Manage matches', link: '/admin/matches', icon: FaNetworkWired }
    ]

    const userLinks = [
        { label: 'Profile', link: '/user/profile', icon: HiUser },
    ]

    const { user } = useAuthStore(state => state)
    const [active, setActive] = useState(null);

    const navigate = useNavigate();
    useEffect(() => {
        // alert(user.role)
        // user?.role not in configRoles, while configRoles is array of roles we want to check if string user?.role is in configRoles
        if (!configRoles.includes(user?.role)) {
            navigate('/403');
            return;
        }
        if (user) {
            // Set the active link based on the current path
            const path = window.location.pathname;
            const link = user.role === "Admin" ? adminLinks.find(link => link.link === path) : userLinks.find(link => link.link === path);
            setActive(link ? link.label : null);
        }

    }, []);

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                    <img src={SCC_LOGO} alt="SCC Logo" className='h-8 w-auto' />
                </Group>
            </AppShell.Header>
            <AppShell.Navbar p="md">
                {/* <AppShell.Section>Navbar header</AppShell.Section> */}
                <AppShell.Section grow my="md" component={ScrollArea}>
                    {
                        configRoles.includes("Admin") ? (
                            adminLinks.map((link) => (
                                <a
                                    className={classes.link}
                                    data-active={link.label === active || undefined}
                                    href={link.link}
                                    key={link.label}
                                    onClick={(event) => {
                                        event.preventDefault();
                                        setActive(link.label);
                                        navigate(link.link);
                                    }}
                                >
                                    <link.icon className={classes.linkIcon} stroke={1.5} />
                                    <span>{link.label}</span>
                                </a>
                            ))
                        ) : (
                            userLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.link}
                                    className={classes.link}
                                    onClick={(event) => {
                                        event.preventDefault();
                                        setActive(link.label);
                                        navigate(link.link);
                                    }}
                                >
                                    {link.label}
                                </a>
                            ))
                        )
                    }
                </AppShell.Section>
                <AppShell.Section>
                    <a href="#" className={classes.link} onClick={(event) => {
                        event.preventDefault();
                        openLogoutModal();
                    }}>
                        <HiLogout className={classes.linkIcon} stroke={1.5} />
                        <span>Logout</span>
                    </a>
                </AppShell.Section>
            </AppShell.Navbar>
            <AppShell.Main>
                <Outlet />
            </AppShell.Main>
            <LogoutModal opened={logoutModalOpened} onClose={closeLogoutModal} />
        </AppShell>
    );
}