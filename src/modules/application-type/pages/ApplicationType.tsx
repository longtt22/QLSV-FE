import {DataGrid, GridCloseIcon, GridColDef, GridRenderCellParams} from "@mui/x-data-grid";
import * as React from "react";
import {ChangeEvent, useEffect, useState} from "react";
import Box from "@mui/material/Box";
import {createType, deleteType, findByTypeId, getAllType} from "../service";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {ApplicationType} from "../type";
import {toast} from "react-toastify";
import IconButton from "@mui/material/IconButton";
import {Modal} from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

const initialType: ApplicationType = {
    id: null,
    name: '',
    description: '',
    createdAt: null,
    createdBy: null,
    updatedAt: null,
    updatedBy: null,
};

export default function TypeApplication() {
    const [rows, setRows] = React.useState<ApplicationType[]>([]);
    const [open, setOpen] = React.useState(false);
    const [applicationType, setApplicationType] = useState(initialType);
    const [errors, setErrors] = useState<{
        name: boolean,
        description: boolean,
    }>({
        name: false,
        description: false
    });

    const handleOpen = () => {
        setOpen(true);
        setApplicationType(initialType)
    }

    const handleClose = () => setOpen(false);

    const getAllData = async () => {
        try {
            const [
                rows
            ] = await Promise.all([
                getAllType(),
            ]);
            setRows(rows || []);
            console.log("Application type Data", rows);
        } catch (error) {
            console.log("error", error);
        }
    };

    useEffect(() => {
        getAllData().then(r => console.log(r));
    }, []);


    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setApplicationType((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUpdate = async (ID: number) => {
        setOpen(true);
        const data = await findByTypeId(ID);
        setApplicationType(data);
    };

    const handleDelete = async (ID: number) => {
        await deleteType(ID);
        await getAllData();
        toast.success("Delete application type successfully!");
    };

    const handleSubmit = async () => {
        console.log(applicationType);

        const isNameValid = null != applicationType.name && !!applicationType.name.trim();
        const isDescriptionValid = null != applicationType.description && !!applicationType.description.trim();

        if (!isNameValid || !isDescriptionValid) {
            setErrors({
                name: !isNameValid,
                description: !isDescriptionValid
            });

            return; // Dừng lại nếu có lỗi
        }
        try {
            await createType(applicationType);
            toast.success("Save application type successfully!");
            await getAllData();
            handleClose();
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            toast.error("Save application type Error: " + errorMessage);
        }
    };

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
            headerAlign: 'center',
            align: 'center',
            flex: 0.5,
            minWidth: 50
        },
        {
            field: 'name',
            headerName: 'Name',
            headerAlign: 'center',
            align: 'center',
            flex: 0.5,
            minWidth: 100,
        },
        {
            field: 'description',
            headerName: 'Description',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            minWidth: 100,
        },
        {
            field: 'createdAt',
            headerName: 'Created At',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            minWidth: 80,
        },
        {
            field: 'createdBy',
            headerName: 'Created By',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            minWidth: 80,
        },
        {
            field: 'updatedAt',
            headerName: 'Updated At',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            minWidth: 80,
        },
        {
            field: 'updatedBy',
            headerName: 'Updated By',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            minWidth: 80,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            headerAlign: 'center',
            align: 'center',
            sortable: false,
            editable: false,

            renderCell: (params: GridRenderCellParams) => (
                <>
                    <IconButton
                        size={"small"}
                        color="primary"
                        onClick={() => handleUpdate(params.row.id)}
                    >
                        <EditIcon/>
                    </IconButton>
                    <IconButton
                        size={"small"}
                        color="error"
                        onClick={() => handleDelete(params.row.id)}
                    >
                        <DeleteIcon/>
                    </IconButton>
                </>
            ),
        },
    ];

    return (
        <Box sx={{width: '100%', maxWidth: {sm: '100%', md: '1700px'}}}>
            <Button onClick={handleOpen} sx={{mb: 2}}>Create application type</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Box
                    sx={{
                        width: 800,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                        outline: 'none',
                        position: 'relative',
                    }}
                >
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            color: 'grey.500',
                        }}
                    >
                        <GridCloseIcon/>
                    </IconButton>

                    <Typography id="application-type-form-title" variant="h6" component="h2" gutterBottom>
                        {applicationType.id ? 'Update application type' : 'Create application type'}
                    </Typography>

                    <TextField
                        label="name"
                        name="name"
                        fullWidth
                        margin="normal"
                        value={applicationType.name}
                        error={errors.name}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Description"
                        name="description"
                        fullWidth
                        margin="normal"
                        value={applicationType.description}
                        error={errors.description}
                        onChange={handleChange}
                    />
                    <Button variant="contained" color="primary" fullWidth sx={{mt: 2}} onClick={handleSubmit}>
                        Submit
                    </Button>
                </Box>
            </Modal>
            <DataGrid
                autoHeight
                rows={rows}
                columns={columns}
                getRowClassName={(params) =>
                    params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                }
                initialState={{
                    pagination: {paginationModel: {pageSize: 20}},
                }}
                pageSizeOptions={[10, 20, 50]}
                disableColumnResize
                density="compact"
                slotProps={{
                    filterPanel: {
                        filterFormProps: {
                            logicOperatorInputProps: {
                                variant: 'outlined',
                                size: 'small',
                            },
                            columnInputProps: {
                                variant: 'outlined',
                                size: 'small',
                                sx: {mt: 'auto'},
                            },
                            operatorInputProps: {
                                variant: 'outlined',
                                size: 'small',
                                sx: {mt: 'auto'},
                            },
                            valueInputProps: {
                                InputComponentProps: {
                                    variant: 'outlined',
                                    size: 'small',
                                },
                            },
                        },
                    },
                }}
            />
        </Box>
    );
}
