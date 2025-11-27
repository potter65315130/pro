import { Container, Typography, Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import JobCard from './JobCard';

const jobs = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=400&q=80',
        category: 'บริการลูกค้า',
        title: 'พนักงานต้อนรับ',
        company: 'The Coffee Club',
        location: 'สยามพารากอน, กรุงเทพฯ',
        positions: '3 อัตรา',
        salary: '60 บาท/ชม.',
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&w=400&q=80',
        category: 'การขาย',
        title: 'พนักงานขายหน้าร้าน',
        company: 'Uniqlo',
        location: 'เซ็นทรัลเวิลด์, กรุงเทพฯ',
        positions: '5 อัตรา',
        salary: '70 บาท/ชม.',
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=400&q=80',
        category: 'ไอที',
        title: 'ผู้ช่วยดูแลระบบ',
        company: 'Tech Solutions',
        location: 'อโศก, กรุงเทพฯ',
        positions: '1 อัตรา',
        salary: '100 บาท/ชม.',
    },
    {
        id: 4,
        image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=400&q=80',
        category: 'การตลาด',
        title: 'ผู้ช่วยการตลาด',
        company: 'Creative Agency',
        location: 'ทองหล่อ, กรุงเทพฯ',
        positions: '2 อัตรา',
        salary: '80 บาท/ชม.',
    },
];

const JobListings = () => {
    return (
        <Box sx={{ py: 6, backgroundColor: 'background.default' }}>
            <Container maxWidth="lg">
                <Typography variant="h2" sx={{ mb: 4, color: 'primary.main', fontWeight: 700 }}>
                    งานพาร์ทไทม์ทั้งหมด
                </Typography>

                <Grid container spacing={3}>
                    {jobs.map((job) => (
                        <Grid key={job.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                            <JobCard {...job} />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default JobListings;
