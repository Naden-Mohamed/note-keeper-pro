import { GlobalStyles as MuiGlobalStyles } from '@mui/material';

const GlobalStyles = () => (
    <MuiGlobalStyles
        styles={{
            '*': {
                margin: 0,
                padding: 0,
                boxSizing: 'border-box',
            },
            html: {
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                height: '100%',
                width: '100%',
            },
            body: {
                height: '100%',
                width: '100%',
            },
            '#root': {
                height: '100%',
                width: '100%',
            },
            a: {
                textDecoration: 'none',
            },
        }}
    />
);

export default GlobalStyles;