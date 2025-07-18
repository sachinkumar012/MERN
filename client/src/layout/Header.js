import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import AdbIcon from '@mui/icons-material/Adb';

function Header() {
    return (
        <AppBar position="static" color="primary" elevation={2}>
            <Toolbar>
                <AdbIcon sx={{ mr: 1 }} />
                <Typography
                    variant="h6"
                    component={RouterLink}
                    to="/"
                    sx={{
                        flexGrow: 1,
                        textDecoration: 'none',
                        color: 'inherit',
                        fontWeight: 700,
                        letterSpacing: 1,
                    }}
                >
                    Affiliate++
                </Typography>
                <Box>
                    <Button color="inherit" component={RouterLink} to="/">Home</Button>
                    <Button color="inherit" component={RouterLink} to="/login">Login</Button>
                    <Button color="inherit" component={RouterLink} to="/register">Register</Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
