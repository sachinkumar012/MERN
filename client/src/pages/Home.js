import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function Home() {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <Card sx={{ maxWidth: 500, width: '100%', boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h3" align="center" gutterBottom fontWeight={700}>
                        Welcome to MERN Projects
                    </Typography>
                    <Typography variant="h6" align="center" color="text.secondary">
                        Build, manage, and grow your affiliate business with ease.
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}

export default Home;