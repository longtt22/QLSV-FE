import {DataGrid, GridCloseIcon, GridColDef, GridRenderCellParams} from "@mui/x-data-grid";
import * as React from "react";
import {ChangeEvent, useEffect, useState} from "react";
import Box from "@mui/material/Box";
import {createStudent, deleteStudent, findByStudentId, getAllStudent} from "../service";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {StudentType} from "../type";
import {toast} from "react-toastify";
import IconButton from "@mui/material/IconButton";
import {Modal} from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

const initialStudent: StudentType = {
    id: null,
    fullName: null,
    username: null,
    password: null,
    email: null,
    phoneNumber: null,
    address: null,
    status: true,
    createdAt: null,
    createdBy: null,
    updatedAt: null,
    updatedBy: null,
};

export default function Student() {
    const [rows, setRows] = React.useState<StudentType[]>([]);
    const [open, setOpen] = React.useState(false);
    const [student, setStudent] = useState(initialStudent);
    const [errors, setErrors] = useState<{
        fullName: boolean,
        username: boolean,
        email: boolean;
        phoneNumber: boolean,
        address: boolean,
    }>({
        fullName: false,
        username: false,
        email: false,
        phoneNumber: false,
        address: false,
    });

    const handleOpen = () => {
        setOpen(true);
        setStudent(initialStudent)
    }

    const handleClose = () => setOpen(false);

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

    const handleUpdateStudent = async (ID: number) => {
        setOpen(true);
        const data = await findByStudentId(ID);
        setStudent(data);
    };

    const handleDeleteStudent = async (ID: number) => {
        try {
            await deleteStudent(ID);
            await getAllData();
            toast.success("Delete Student successfully!");
        } catch (error) {
            console.log("error", error);
        }
    };

    const handleSubmit = async () => {
        console.log(student);

        const isFullNameValid = null != student.fullName && !!student.fullName.trim();
        const isUsernameValid = null != student.username && !!student.username.trim();
        const isEmailValid = null != student.email && !!student.email.trim();
        const isPhoneNumberValid = null != student.phoneNumber && !!student.phoneNumber.trim();
        const isAddressValid = null != student.address && !!student.address.trim();

        if (
            !isEmailValid ||
            !isPhoneNumberValid ||
            !isFullNameValid ||
            !isUsernameValid ||
            !isAddressValid
        ) {
            setErrors({
                fullName: !isFullNameValid,
                username: !isUsernameValid,
                email: !isEmailValid,
                phoneNumber: !isPhoneNumberValid,
                address: !isAddressValid,
            });

            return; // Dừng lại nếu có lỗi
        }
        try {
            await createStudent(student)
                .then(() => {
                    toast.success("Save Student successfully!");
                    handleClose();
                })
                .catch((error: any) => {
                    const errorMessage = error.response?.data?.message || "An unknown error occurred";
                    toast.error("Save Student Error: " + errorMessage);
                });
            await getAllData();
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            toast.error("Save Student Error: " + errorMessage);
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
            field: 'fullName',
            headerName: 'Full Name',
            headerAlign: 'center',
            align: 'center',
            flex: 0.5,
            minWidth: 100,
        },
        {
            field: 'username',
            headerName: 'Username',
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
                        onClick={() => handleUpdateStudent(params.row.id)}
                    >
                        <EditIcon/>
                    </IconButton>
                    <IconButton
                        size={"small"}
                        color="error"
                        onClick={() => handleDeleteStudent(params.row.id)}
                    >
                        <DeleteIcon/>
                    </IconButton>
                </>
            ),
        },
    ];

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
                        name="username"
                        fullWidth
                        margin="normal"
                        value={student.username}
                        error={errors.username}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Password"
                        name="password"
                        fullWidth
                        margin="normal"
                        value={student.password}
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
