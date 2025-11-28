import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#5B7FFF',
            light: '#8BA3FF',
            dark: '#4A66CC',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#FF6B9D',
            light: '#FF9AB8',
            dark: '#E5568A',
            contrastText: '#FFFFFF',
        },
        background: {
            default: '#F5F7FF', //body color
            paper: '#FFFFFF', //card color
        },
        text: {
            primary: '#2D3748',
            secondary: '#718096',
        },
    },
    typography: {
        fontFamily: 'var(--font-prompt), "Noto Sans Thai", "Roboto", "Arial", sans-serif',//font family
        h1: {
            fontSize: '2.5rem',//font size
            fontWeight: 600,
            color: '#FFFFFF',//text color
        },
        h2: {
            fontSize: '2rem',//font size
            fontWeight: 600,
            color: '#FFFFFF',//text color
        },
        h3: {
            fontSize: '1.5rem',//font size
            fontWeight: 600,
            color: '#FFFFFF',//text color
        },
        body1: {
            fontSize: '1rem',//font size
            lineHeight: 1.6,
        },
        body2: {
            fontSize: '0.875rem',//font size
            lineHeight: 1.5,
        },
    },
    shape: {
        borderRadius: 12,//border radius
    },
    shadows: [
        'none',
        '0px 2px 8px rgba(91, 127, 255, 0.08)',
        '0px 4px 12px rgba(91, 127, 255, 0.12)',
        '0px 6px 16px rgba(91, 127, 255, 0.16)',
        '0px 8px 24px rgba(91, 127, 255, 0.2)',
        ...Array(20).fill('0px 8px 24px rgba(91, 127, 255, 0.2)'),
    ] as any,
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 8,
                    padding: '10px 24px',
                    fontSize: '1rem',
                    fontWeight: 500,
                },
                contained: {
                    boxShadow: '0px 4px 12px rgba(91, 127, 255, 0.3)',
                    '&:hover': {
                        boxShadow: '0px 6px 16px rgba(91, 127, 255, 0.4)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        boxShadow: '0px 6px 20px rgba(91, 127, 255, 0.2)',
                        transform: 'translateY(-4px)',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8,
                        backgroundColor: '#FFFFFF',
                    },
                },
            },
        },
    },
});

export default theme;