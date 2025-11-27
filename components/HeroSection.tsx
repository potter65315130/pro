import { Box, Container, Typography } from '@mui/material';

const HeroSection = () => {
    return (
        <Box
            sx={{
                background: 'linear-gradient(135deg,#5D87FF 100%)',
                py: { xs: 6, md: 10 },
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
                },
            }}
        >
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ textAlign: 'center', color: 'white' }}>
                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: { xs: '2rem', md: '3rem' },
                            fontWeight: 700,
                            mb: 2,
                            textShadow: '0 2px 10px rgba(0,0,0,0.1)',
                        }}
                    >
                        ค้นหางาน สมัครงาน ทั้งหมด
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            fontSize: { xs: '1rem', md: '1.125rem' },
                            maxWidth: 600,
                            mx: 'auto',
                            opacity: 0.95,
                            lineHeight: 1.8,
                        }}
                    >
                        ค้นหางานพาร์ทไทม์ที่ดีที่สุดและเหมาะกับตัวคุณ ง่ายกว่าที่เคย!!!
                        <br />
                        เลือกงานที่ใช่แบบเอื้อมถึง แค่คลิกเดียวได้เลย
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default HeroSection;