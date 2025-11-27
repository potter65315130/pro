import { useState } from 'react';
import {
    Box,
    Container,
    TextField,
    Button,
    InputAdornment,
    Paper,
    ToggleButton,
    ToggleButtonGroup,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchSection = () => {
    const [searchType, setSearchType] = useState('งานทั่วไป');
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchTypeChange = (
        event: React.MouseEvent<HTMLElement>,
        newSearchType: string,
    ) => {
        if (newSearchType !== null) {
            setSearchType(newSearchType);
        }
    };

    return (
        <Box
            sx={{
                py: 4,
                mt: -6,
                position: 'relative',
                zIndex: 2,
            }}
        >
            <Container maxWidth="md">
                <Paper
                    elevation={3}
                    sx={{
                        p: 3,
                        borderRadius: 3,
                        background: 'white',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 2,
                            flexDirection: { xs: 'column', md: 'row' },
                        }}
                    >
                        <TextField
                            fullWidth
                            placeholder="เลือกคำค้นหาของคุณ/ตำแหน่งงานของคุณ"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: 'text.secondary' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: '#F7FAFC',
                                    '&:hover': {
                                        backgroundColor: '#EDF2F7',
                                    },
                                },
                            }}
                        />
                        <Button
                            variant="contained"
                            size="large"
                            sx={{
                                px: 5,
                                minWidth: { xs: '100%', md: 120 },
                                background: 'linear-gradient(135deg, #5D87FF 100%)',
                            }}
                        >
                            ค้นหา
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default SearchSection;