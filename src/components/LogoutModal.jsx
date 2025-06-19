import { Modal, Button, Group, Text } from '@mantine/core';
import { logout } from '../services/auth.service.js';
import { useAuthStore } from '../store/auth.store.js';
import { useNavigate } from 'react-router-dom';

export default function LogoutModal({ opened, onClose }) {
    const { clearUser } = useAuthStore(state => state);
    const navigate = useNavigate();

    const handleLogout = async () => {
        const success = await logout();
        if (success) {
            clearUser();
            navigate('/auth/login');
        }
        onClose();
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Confirm Logout"
            centered
        >
            <Text mb="lg">
                Are you sure you want to logout?
            </Text>
            <Group justify="flex-end">
                <Button variant="default" onClick={onClose}>
                    Cancel
                </Button>
                <Button color="red" onClick={handleLogout}>
                    Logout
                </Button>
            </Group>
        </Modal>
    );
}
