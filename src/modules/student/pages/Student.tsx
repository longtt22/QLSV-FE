import {DataGrid, GridCloseIcon, GridColDef, GridRenderCellParams} from "@mui/x-data-grid";
import * as React from "react";
import {ChangeEvent, useEffect, useState} from "react";
import Box from "@mui/material/Box";
import {createStudent, getAllStudent} from "../service";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {StudentType} from "../type";
import {toast} from "react-toastify";
import IconButton from "@mui/material/IconButton";
import {Modal} from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

const initialStudent = {
    id: null,
    fullName: '',
    code: '',
    email: '',
    phoneNumber: '',
    address: '',
};

export default function Student() {
    const [rows, setRows] = React.useState<StudentType[]>([]);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [student, setStudent] = useState(initialStudent);
    const [errors, setErrors] = useState<{
        fullName: boolean,
        code: boolean,
        email: boolean;
        phoneNumber: boolean,
        address: boolean,
    }>({
        fullName: false,
        code: false,
        email: false,
        phoneNumber: false,
        address: false,
    });
    const getAllData = async () => {
        try {
            const [
                rows
            ] = await Promise.all([
                getAllStudent(),
            ]);
            setRows(rows || []);
            console.log("Student Data", rows);
        } catch (error) {
            console.log("error", error);
        }
    };

    useEffect(() => {
        getAllData();
    }, []);


    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setStudent((prevStudent) => ({
            ...prevStudent,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        console.log(student);

        const isFullNameValid = !!student.fullName.trim();
        const isCodeValid = !!student.code.trim();
        const isEmailValid = !!student.email.trim();
        const isPhoneNumberValid = !!student.phoneNumber.trim();
        const isAddressValid = !!student.address.trim();

        if (
            !isEmailValid ||
            !isPhoneNumberValid ||
            !isFullNameValid ||
            !isCodeValid ||
            !isAddressValid
        ) {
            setErrors({
                fullName: !isFullNameValid,
                code: !isCodeValid,
                email: !isEmailValid,
                phoneNumber: !isPhoneNumberValid,
                address: !isAddressValid,
            });

            return; // Dừng lại nếu có lỗi
        }
        try {
            await createStudent(student);
            toast.success("Create Student successfully!");
            await getAllData();
            handleClose();
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            toast.error("Create Student Error: " + errorMessage);
        }
    };

    return (
        <Box sx={{width: '100%', maxWidth: {sm: '100%', md: '1700px'}}}>
            <Button onClick={handleOpen} sx={{mb: 2}}>Create Student</Button>
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

                    <Typography id="student-form-title" variant="h6" component="h2" gutterBottom>
                        {student.id ? 'Update student' : 'Create student'}
                    </Typography>

                    <TextField
                        label="fullName"
                        name="fullName"
                        fullWidth
                        margin="normal"
                        value={student.fullName}
                        error={errors.fullName}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Student code"
                        name="code"
                        fullWidth
                        margin="normal"
                        value={student.code}
                        error={errors.code}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        fullWidth
                        margin="normal"
                        value={student.email}
                        error={errors.email}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Phone number"
                        name="phoneNumber"
                        fullWidth
                        margin="normal"
                        value={student.phoneNumber}
                        error={errors.phoneNumber}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Address"
                        name="address"
                        fullWidth
                        margin="normal"
                        value={student.address}
                        error={errors.address}
                        onChange={handleChange}
                    />

                    <Button variant="contained" color="primary" fullWidth sx={{mt: 2}} onClick={handleSubmit}>
                        Submit
                    </Button>
                </Box>
            </Modal>
            <DataGrid
                autoHeight
                checkboxSelection
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
        field: 'fullName',
        headerName: 'Full Name',
        headerAlign: 'center',
        align: 'center',
        flex: 0.5,
        minWidth: 100,
    },
    {
        field: 'code',
        headerName: 'Code',
        headerAlign: 'center',
        align: 'center',
        flex: 1,
        minWidth: 80,
    },
    {
        field: 'email',
        headerName: 'Email',
        headerAlign: 'center',
        align: 'center',
        flex: 1,
        minWidth: 80,
    },
    {
        field: 'phoneNumber',
        headerName: 'Phone Number',
        headerAlign: 'center',
        align: 'center',
        flex: 1,
        minWidth: 80,
    },
    {
        field: 'address',
        headerName: 'Address',
        headerAlign: 'center',
        align: 'center',
        flex: 1,
        minWidth: 80,
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
                    onClick={() => console.log(params.row.id)}
                >
                    <EditIcon/>
                </IconButton>
                <IconButton
                    size={"small"}
                    color="error"
                    onClick={() => console.log(params.row.id)}
                >
                    <DeleteIcon/>
                </IconButton>
            </>
        ),
    },
];