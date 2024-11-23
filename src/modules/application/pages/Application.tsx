import {DataGrid, GridCloseIcon, GridColDef, GridRenderCellParams} from "@mui/x-data-grid";
import * as React from "react";
import {ChangeEvent, useEffect, useState} from "react";
import Box from "@mui/material/Box";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {RequestType} from "../type";
import {toast} from "react-toastify";
import IconButton from "@mui/material/IconButton";
import {InputLabel, Modal, Tabs} from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import {createApplication, deleteApplication, findAllByStatus, findById} from "../service";
import Grid from '@mui/material/Grid';
import {getAllType} from "../../application-type/service";
import {ApplicationType} from "../../application-type/type";
import FormControl from "@mui/material/FormControl";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import MenuItem from '@mui/material/MenuItem';
import {useDropzone} from "react-dropzone";
import Tab from '@mui/material/Tab';
import {format, parse} from 'date-fns';
import {ALL, APPROVED, IN_PROGRESS, PENDING_APPROVAL, REJECT, STUDENT} from "../../../commons/constants";
import VisibilityIcon from '@mui/icons-material/Visibility';
import storage from "../../../commons/storage";

const initialData: RequestType = {
    id: null,
    requestType: null,
    description: null,
    fileName: null,
    filePath: null,
    fromDate: null,
    toDate: null,
    reason: null,
    status: null,
    handlerUser: null,
    createdAt: null,
    createdBy: null,
    updatedAt: null,
    updatedBy: null,
};

export default function Application() {
    const [requestTypes, setRequestTypes] = useState<ApplicationType[]>([]);
    const [rows, setRows] = React.useState<RequestType[]>([]);
    const [open, setOpen] = React.useState(false);
    const [application, setApplication] = useState(initialData);
    const [tabs, setTabs] = React.useState(ALL);
    const [files, setFiles] = useState<File[]>([]);
    const [errors, setErrors] = useState<{
        requestType: boolean,
        description: boolean,
        fromDate: boolean,
        toDate: boolean,
        reason: boolean,
    }>({
        requestType: false,
        description: false,
        fromDate: false,
        toDate: false,
        reason: false,
    });
    const user = storage.getTokenData();
    const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
        setTabs(newValue);
    };
    // React Dropzone logic
    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        maxFiles: 1,
        onDrop: (acceptedFiles) => {
            setFiles(acceptedFiles.slice(0, 1));
        }
    });

    const handleOpen = () => {
        setOpen(true);
        setApplication(initialData)
    }

    const handleClose = () => setOpen(false);

    const fetchData = async () => {
        try {
            const [fetchedRows, fetchedRequestTypes] = await Promise.all([
                findAllByStatus(tabs),
                getAllType(),
            ]);
            setRows(fetchedRows || []);
            setRequestTypes(fetchedRequestTypes || []);
            console.log("Application Data", fetchedRows);
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [tabs]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setApplication((data) => ({
            ...data,
            [name]: value,
        }));
    };

    const handleChangeSelectBox = (event: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>) => {
        const {name, value} = event.target;
        setApplication((prev) => ({...prev, [name]: value}));
    };


    const handleUpdateApplication = async (ID: number) => {
        setOpen(true);
        const data = await findById(ID);
        setApplication(data);
    };

    const handleDeleteApplication = async (ID: number) => {
        try {
            await deleteApplication(ID);
            await fetchData();
            toast.success("Delete Application successfully!");
        } catch (error) {
            console.log("error", error);
        }
    };

    const handleSubmit = async () => {
        console.log(application);

        const isRequestTypeValid = null != application.requestType && !!application.requestType.trim();
        const isDescriptionValid = null != application.description && !!application.description.trim();
        const isFromDateValid = null != application.fromDate && !!application.fromDate.trim();
        const isToDateValid = null != application.toDate && !!application.toDate.trim();


        if (
            !isRequestTypeValid ||
            !isDescriptionValid ||
            !isFromDateValid ||
            !isToDateValid
        ) {
            setErrors({
                requestType: !isRequestTypeValid,
                description: !isDescriptionValid,
                fromDate: !isFromDateValid,
                toDate: !isToDateValid,
                reason: false,
            });

            return; // Dừng lại nếu có lỗi
        }
        try {
            await createApplication(application, files)
                .then(() => {
                    toast.success("Save Application successfully!");
                    handleClose();
                })
                .catch((error: any) => {
                    const errorMessage = error.response?.data?.message || "An unknown error occurred";
                    toast.error("Save Application Error: " + errorMessage);
                });
            await fetchData();
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            toast.error("Save Application Error: " + errorMessage);
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
            field: 'requestType',
            headerName: 'Request type',
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
            minWidth: 80,
        },
        {
            field: 'fileName',
            headerName: 'File name',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            minWidth: 80,
        },
        {
            field: 'fromDate',
            headerName: 'From date',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            minWidth: 80,
        },
        {
            field: 'toDate',
            headerName: 'To date',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            minWidth: 80,
        },
        {
            field: 'reason',
            headerName: 'Reason',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            minWidth: 80,
        },
        {
            field: 'status',
            headerName: 'Status',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            minWidth: 80,
        },
        {
            field: 'handlerUser',
            headerName: 'Handler user',
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
            width: 150,
            headerAlign: 'center',
            align: 'center',
            sortable: false,
            editable: false,

            renderCell: (params: GridRenderCellParams) => (
                <>
                    {/* Nút chỉnh sửa (chỉ hiển thị cho sinh viên nếu trạng thái không phải "Đang xử lý") */}
                    {user?.authorities.includes(STUDENT) && params.row.status !== IN_PROGRESS && (
                        <IconButton
                            size={"small"}
                            color="primary"
                            onClick={() => handleUpdateApplication(params.row.id)}
                        >
                            <EditIcon/>
                        </IconButton>
                    )}

                    {/* Nút xem (hiển thị cho tất cả các vai trò) */}
                    <IconButton
                        size={"small"}
                        color="primary"
                        onClick={() => handleUpdateApplication(params.row.id)}
                    >
                        <VisibilityIcon/>
                    </IconButton>

                    {/* Nút xóa (chỉ hiển thị cho sinh viên nếu trạng thái không phải "Đang xử lý") */}
                    {user?.authorities.includes(STUDENT) && params.row.status !== IN_PROGRESS && (
                        <IconButton
                            size={"small"}
                            color="error"
                            onClick={() => handleDeleteApplication(params.row.id)}
                        >
                            <DeleteIcon/>
                        </IconButton>
                    )}
                </>
            ),
        },
    ];

    // @ts-ignore
    return (
        <Box sx={{width: '100%', maxWidth: {sm: '100%', md: '1700px'}}}>
            <Button onClick={handleOpen} sx={{mb: 1}}>Create Application</Button>
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

                    <Typography id="application-form-title" variant="h6" component="h2" gutterBottom>
                        {application.id ? 'Update application' : 'Create application'}
                    </Typography>
                    {/* Selectbox for Request Type */}
                    <FormControl fullWidth margin="normal" error={errors.requestType}>
                        <InputLabel id="request-type-label">Request type</InputLabel>
                        <Select
                            labelId="request-type-label"
                            name="requestType"
                            value={(application.requestType || '') as string}
                            onChange={handleChangeSelectBox}
                        >
                            {requestTypes.map((type) => (
                                <MenuItem key={type.id} value={type.name?.toString() || ''}>
                                    {type.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="Description"
                        name="description"
                        fullWidth
                        margin="normal"
                        value={application.description}
                        error={errors.description}
                        onChange={handleChange}
                    />
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                label="From date"
                                type="datetime-local"
                                name="fromDate"
                                fullWidth
                                margin="normal"
                                value={application.fromDate
                                    ? format(
                                        parse(application.fromDate as string, 'dd-MM-yyyy HH:mm:ss', new Date()),
                                        "yyyy-MM-dd'T'HH:mm"
                                    )
                                    : ''}
                                error={errors.fromDate}
                                onChange={handleChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="To date"
                                type="datetime-local"
                                name="toDate"
                                fullWidth
                                margin="normal"
                                value={application.toDate
                                    ? format(
                                        parse(application.toDate as string, 'dd-MM-yyyy HH:mm:ss', new Date()),
                                        "yyyy-MM-dd'T'HH:mm"
                                    )
                                    : ''}
                                error={errors.toDate}
                                onChange={handleChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                    </Grid>

                    <Box
                        {...getRootProps()}
                        sx={{
                            mt: 2,
                            p: 2,
                            border: '2px dashed grey',
                            borderRadius: 1,
                            textAlign: 'center',
                            bgcolor: isDragActive ? 'grey.100' : 'background.paper',
                            cursor: 'pointer',
                        }}
                    >
                        <input {...getInputProps()} />
                        <Typography variant="body2" color="textSecondary">
                            {isDragActive ? 'Drop your file here...' : 'Drag and drop a file here, or click to select one'}
                        </Typography>
                    </Box>

                    {/* Display the selected file */}
                    {(files.length > 0 && application.id === null) && (
                        <Box sx={{mt: 2, textAlign: 'center'}}>
                            <Typography variant="body2" color="textSecondary">
                                Selected file: <strong>{files[0].name}</strong>
                            </Typography>
                        </Box>
                    )}

                    {application.id && (
                        <Box sx={{mt: 2, textAlign: 'center'}}>
                            <Typography variant="body2" color="textSecondary">
                                Selected file: <strong>{application.fileName}</strong>
                            </Typography>
                        </Box>
                    )}

                    <Button variant="contained" color="primary" fullWidth sx={{mt: 2}} onClick={handleSubmit}>
                        Submit
                    </Button>
                </Box>
            </Modal>
            <Tabs
                value={tabs}
                sx={{mb: 1}}
                onChange={handleChangeTab}
                textColor="secondary"
                indicatorColor="secondary"
                aria-label="secondary tabs example"
            >
                <Tab value={ALL} label={ALL}/>
                <Tab value={PENDING_APPROVAL} label={PENDING_APPROVAL}/>
                <Tab value={IN_PROGRESS} label={IN_PROGRESS}/>
                <Tab value={APPROVED} label={APPROVED}/>
                <Tab value={REJECT} label={REJECT}/>
            </Tabs>
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
