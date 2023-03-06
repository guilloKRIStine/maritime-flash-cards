import styled from '@material-ui/core/styles/styled';
import IconButton from '@material-ui/core/IconButton';
import DeleteForever from '@material-ui/icons/DeleteForever';
import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';

export const DeleteButton = styled(
    ({ onClick, refComponentForDelete, warningMessage, ...other }) => {
        const [open, setOpen] = useState(false);

        function handleDelete() {
            setOpen(false);
            if (refComponentForDelete.current) {
                const component = refComponentForDelete.current;
                component.style.transition = 'opacity 500ms';
                component.style.opacity = '0';
            }
            if (onClick) {
                setTimeout(() => onClick(), 500);
            }
        }

        return (
            <div>
                <IconButton onClick={() => setOpen(true)} {...other}>
                    <DeleteForever />
                </IconButton>
                <Dialog open={open} onClose={() => setOpen(false)}>
                    <DialogTitle>{'Предупреждение'}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {warningMessage}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button color='primary' onClick={handleDelete}>
                            Да
                        </Button>
                        <Button color='primary' onClick={() => setOpen(false)} autoFocus>
                            Нет
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
)({
    position: 'absolute',
    right: '5px',
    top: '5px',
    color: 'red',
});