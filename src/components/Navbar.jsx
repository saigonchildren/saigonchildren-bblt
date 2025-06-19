import SCC_LOGO from '../assets/scc_logo.png';
import {
    FaBook,
    FaChartPie,
    FaChevronDown,
    FaCode,
    FaCoins,
    FaFingerprint,
    FaBell,
} from 'react-icons/fa';
import {
    Anchor,
    Box,
    Burger,
    Button,
    Center,
    Collapse,
    Divider,
    Drawer,
    Group,
    HoverCard,
    Image,
    ScrollArea,
    SimpleGrid,
    Text,
    ThemeIcon,
    UnstyledButton,
    useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
// import { MantineLogo } from '@mantinex/mantine-logo';
import classes from '../styles/Navbar.module.css';
import { useNavigate } from 'react-router-dom';


export default function Navbar() {
    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
    const theme = useMantineTheme();
    const navigate = useNavigate();


    return (
        <Box pb={120}>
            <header className={classes.header}>
                <Group justify="space-between" h="100%">
                    {/* <MantineLogo size={30} /> */}
                    <div>
                        <img src={SCC_LOGO} alt="Logo" className='h-8 w-auto' />
                        {/* <Image src={SCC_LOGO} alt="Logo" width={30} height={30} /> */}
                    </div>

                    <Group h="100%" gap={0} visibleFrom="sm">
                        <a href="#" className={classes.link}>
                            Home
                        </a>
                        <a href="#" className={classes.link}>
                            About us
                        </a>
                    </Group>

                    <Group visibleFrom="sm">
                        <Button variant="default" onClick={() => {
                            navigate('/auth/login');
                        }}>Login</Button>
                        <Button onClick={() => {
                            navigate('/auth/register');
                        }}>Sign up</Button>
                    </Group>

                    <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
                </Group>
            </header>

            <Drawer
                opened={drawerOpened}
                onClose={closeDrawer}
                size="100%"
                padding="md"
                title="Mentor Mentee Matching"
                hiddenFrom="sm"
                zIndex={1000000}
            >
                <ScrollArea h="calc(100vh - 80px" mx="-md">
                    <Divider my="sm" />

                    <a href="#" className={classes.link}>
                        Home
                    </a>
                    <a href="#" className={classes.link}>
                        About us
                    </a>

                    <Divider my="sm" />

                    <Group justify="center" grow pb="xl" px="md">
                        <Button variant="default" onClick={() => {
                            navigate('/auth/login');
                        }}>Login</Button>
                        <Button onClick={() => {
                            navigate('/auth/register');
                        }}>Sign up</Button>
                    </Group>
                </ScrollArea>
            </Drawer>
        </Box>
    );
}