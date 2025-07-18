import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';

function Footer() {
    return (
        <Box component="footer" sx={{ bgcolor: 'primary.main', color: 'white', mt: 4, py: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', px: { xs: 2, md: 6 } }}>
                <Box>
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                        Affiliate++
                    </Typography>
                    <Typography variant="body2" sx={{ maxWidth: 360 }}>
                        Affiliate++ is your trusted platform for managing affiliate links, tracking analytics, and maximizing your online revenue. Join us to simplify your affiliate journey!
                    </Typography>
                </Box>
                <Box>
                    <IconButton color="inherit" href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <LinkedInIcon />
                    </IconButton>
                    <IconButton color="inherit" href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                        <InstagramIcon />
                    </IconButton>
                    <IconButton color="inherit" href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                        <TwitterIcon />
                    </IconButton>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', mt: 2, px: { xs: 2, md: 6 } }}>
                <Typography variant="body2">
                    <strong>Address:</strong> Phagwara (Satnampura), Punjab, India - 144402
                </Typography>
                <Typography variant="body2">
                    &copy; {new Date().getFullYear()} All rights reserved.
                </Typography>
            </Box>
        </Box>
    );
}

export default Footer;