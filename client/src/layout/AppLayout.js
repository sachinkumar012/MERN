import App from "../App";
import Footer from "./Footer";
import Header from "./Header";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

function AppLayout({ children }) {
    return (
        <>
            <Header />
            <Container maxWidth="lg" sx={{ minHeight: '70vh', py: 4 }}>
                <Box>
                    {children}
                </Box>
            </Container>
            <Footer />
        </>
    );
}

export default AppLayout;