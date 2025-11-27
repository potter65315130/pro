import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Box,
    Chip,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

interface JobCardProps {
    image: string;
    category: string;
    title: string;
    company: string;
    location: string;
    positions: string;
    salary: string;
}

const JobCard = ({
    image,
    category,
    title,
    company,
    location,
    positions,
    salary,
}: JobCardProps) => {
    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(91, 127, 255, 0.15)',
                },
            }}
        >
            <CardMedia
                component="img"
                height="180"
                image={image}
                alt={title}
                sx={{
                    objectFit: 'cover',
                }}
            />
            <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                <Chip
                    label={category}
                    size="small"
                    sx={{
                        mb: 1.5,
                        backgroundColor: '#EBF4FF',
                        color: 'primary.main',
                        fontWeight: 500,
                        fontSize: '0.75rem',
                    }}
                />

                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 600,
                        mb: 1,
                        fontSize: '1.1rem',
                        lineHeight: 1.4,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    }}
                >
                    {title}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, fontWeight: 500 }}
                >
                    {company}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOnIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                            {location}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PeopleIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                            {positions}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AttachMoneyIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                        <Typography
                            variant="body2"
                            sx={{ color: 'primary.main', fontWeight: 600 }}
                        >
                            {salary}
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default JobCard;