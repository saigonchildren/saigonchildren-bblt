"use client"

import { useEffect, useState } from "react"
import { TextInput, PasswordInput, Button, Paper, Title, Container, Stack, Text } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { FaLock, FaMailBulk, FaUser } from "react-icons/fa"
import { useAuthStore } from "../../store/auth.store"
import { getUserProfile } from "../../services/auth.service"
import { useNavigate } from "react-router-dom"


export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const login = useAuthStore((state) => state.login)
    const setUser = useAuthStore((state) => state.setUser)
    const user = useAuthStore((state) => state.user)
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated()) {
            notifications.show({
                title: "Already Logged In",
                message: `Welcome back ${user.email}`,
                color: "green",
            })
            if (user.role === "Admin") {
                navigate("/admin");
            } else {
                navigate("/user/profile");
            }
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!email || !password) {
            notifications.show({
                title: "Login Error",
                message: "Please enter both email and password",
                color: "red",
            })
            return
        } setLoading(true)
        const { user } = await login(email, password);

        if (!user) {
            notifications.show({
                title: "Login Error",
                message: "Incorrect email or password",
                color: "red",
            })
            setLoading(false)
            return
        } else {
            notifications.show({
                title: "Login Successful",
                message: `Welcome ${user.email}`,
                color: "green",
            })
            if (user.role === "Admin") {
                navigate("/admin");
            }
            else {
                navigate("/user/profile");
            }
        }
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                // background: "linear-gradient(135deg, #rgb(234, 223, 102),rgb(72, 124, 228) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "1rem",
            }}
        >
            <Container size={640}>
                <Paper shadow="md" p={30} radius="md" withBorder>                    <Title order={2} ta="center" mb="md" c="dark">
                    Login
                </Title>
                    <Text c="dimmed" size="sm" ta="center" mb={30}>
                        Enter your login information
                    </Text>

                    <form onSubmit={handleSubmit}>
                        <Stack gap="md">
                            <TextInput
                                label="Email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.currentTarget.value)}
                                leftSection={<FaUser size={16} />}
                                required
                                size="md"
                            />                            <PasswordInput
                                label="Password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.currentTarget.value)}
                                leftSection={<FaLock size={16} />}
                                required
                                size="md"
                            />                            <Button type="submit" fullWidth size="md" loading={loading} mt="md">
                                {loading ? "Logging in..." : "Login"}
                            </Button>
                        </Stack>
                    </form>                    <Text c="dimmed" size="sm" ta="center" mt={30}>
                        Don't have an account?{" "}
                        <Text component="a" href="/auth/register" c="blue" style={{ cursor: "pointer" }}>
                            Register now
                        </Text>
                    </Text>
                </Paper>
            </Container>
        </div>
    )
}
