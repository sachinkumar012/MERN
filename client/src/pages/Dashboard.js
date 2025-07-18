import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import LinksDashboard from './links/LinksDashboard';

function Dashboard() {
    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box>
                <LinksDashboard />
            </Box>
        </Container>
    );
}

export default Dashboard;