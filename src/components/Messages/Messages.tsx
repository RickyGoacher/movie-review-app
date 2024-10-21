import { Alert, AlertColor } from '@mui/material';

interface MessagesInterface {
    Message: string;
    Type: AlertColor;
}

export const Messages = ({Message, Type}:MessagesInterface) => {
    return (
        <>
            <Alert severity={Type} sx={{ padding: '0 6px' }}>{Message}</Alert>
        </>
    )
}