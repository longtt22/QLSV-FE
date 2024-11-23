import {DataGrid, GridCloseIcon, GridColDef, GridRenderCellParams} from "@mui/x-data-grid";
import * as React from "react";
import {ChangeEvent, useEffect, useState} from "react";
import Box from "@mui/material/Box";
import {createEmployee, deleteEmployee, findByEmployeeId, getAllEmployee} from "../service";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {EmployeeType} from "../type";
import {toast} from "react-toastify";
import IconButton from "@mui/material/IconButton";
import {Modal} from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

const initialEmployee: EmployeeType = {
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

export default function Employee() {
    const [rows, setRows] = React.useState<EmployeeType[]>([]);
    const [open, setOpen] = React.useState(false);
    const [employee, setEmployee] = useState(initialEmployee);
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

    const handleOpen = () => {
        setOpen(true);
        setEmployee(initialEmployee)
    }

    const handleClose = () => setOpen(false);

    const getAllData = async () => {
        try {
            const [
                rows
            ] = await Promise.all([
                getAllEmployee(),
            ]);
            setRows(rows || []);
            console.log("Employee Data", rows);
        } catch (error) {
            console.log("error", error);
        }
    };

    useEffect(() => {
        getAllData();
    }, []);


    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setEmployee((prevEmployee) => ({
            ...prevEmployee,
            [name]: value,
        }));
    };

    const handleUpdateEmployee = async (ID: number) => {
        setOpen(true);
        const data = await findByEmployeeId(ID);
        setEmployee(data);
    };

    const handleDeleteEmployee = async (ID: number) => {
        try {
            await deleteEmployee(ID);
            await getAllData();
            toast.success("Delete Employee successfully!");
        } catch (error) {
            console.log("error", error);
        }
    };

    const handleSubmit = async () => {
        console.log(employee);

        const isFullNameValid = null != employee.fullName && !!employee.fullName.trim();
        const isCodeValid = null != employee.username && !!employee.username.trim();
        const isEmailValid = null != employee.email && !!employee.email.trim();
        const isPhoneNumberValid = null != employee.phoneNumber && !!employee.phoneNumber.trim();
        const isAddressValid = null != employee.address && !!employee.address.trim();

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
            await createEmployee(employee)
                .then(() => {
                    toast.success("Save Employee successfully!");
                    handleClose();
                })
                .catch((error: any) => {
                    const errorMessage = error.response?.data?.message || "An unknown error occurred";
                    toast.error("Save Employee Error: " + errorMessage);
                });
            await getAllData();
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            toast.error("Save Employee Error: " + errorMessage);
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
                        onClick={() => handleUpdateEmployee(params.row.id)}
                    >
                        <EditIcon/>
                    </IconButton>
                    <IconButton
                        size={"small"}
                        color="error"
                        onClick={() => handleDeleteEmployee(params.row.id)}
                    >
                        <DeleteIcon/>
                    </IconButton>
                </>
            ),
        },
    ];

    return (
        <Box sx={{width: '100%', maxWidth: {sm: '100%', md: '1700px'}}}>
            <Button onClick={handleOpen} sx={{mb: 2}}>Create Employee</Button>
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

                    <Typography id="employee-form-title" variant="h6" component="h2" gutterBottom>
                        {employee.id ? 'Update employee' : 'Create employee'}
                    </Typography>

                    <TextField
                        label="fullName"
                        name="fullName"
                        fullWidth
                        margin="normal"
                        value={employee.fullName}
                        error={errors.fullName}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Username"
                        name="username"
                        fullWidth
                        margin="normal"
                        disabled={employee.id != null}
                        value={employee.username}
                        error={errors.code}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Password"
                        name="password"
                        fullWidth
                        margin="normal"
                        value={employee.password}
                        error={errors.code}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        fullWidth
                        margin="normal"
                        value={employee.email}
                        error={errors.email}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Phone number"
                        name="phoneNumber"
                        fullWidth
                        margin="normal"
                        value={employee.phoneNumber}
                        error={errors.phoneNumber}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Address"
                        name="address"
                        fullWidth
                        margin="normal"
                        value={employee.address}
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
