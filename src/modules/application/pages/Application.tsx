import {DataGrid, GridColDef, GridRenderCellParams} from "@mui/x-data-grid";
import * as React from "react";
import {ChangeEvent, useEffect, useState} from "react";
import Box from "@mui/material/Box";
import DeleteIcon from '@mui/icons-material/Delete';
import {RequestType} from "../type";
import {toast} from "react-toastify";
import IconButton from "@mui/material/IconButton";
import {InputLabel, Modal, Tabs, Tooltip} from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import {
    approvalRequest,
    createApplication,
    deleteApplication,
    downloadFile,
    findAllByStatus,
    findById,
    reception,
    rejectRequest
} from "../service";
import Grid from '@mui/material/Grid';
import {getAllType} from "../../application-type/service";
import {ApplicationType} from "../../application-type/type";
import FormControl from "@mui/material/FormControl";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import MenuItem from '@mui/material/MenuItem';
import {useDropzone} from "react-dropzone";
import Tab from '@mui/material/Tab';
import {format, isValid, parse} from 'date-fns';
import {ADMIN, ALL, APPROVED, IN_PROGRESS, PENDING, REJECT, STAFF, STUDENT} from "../../../commons/constants";
import storage from "../../../commons/storage";
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import ModeIcon from '@mui/icons-material/Mode';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ClearIcon from '@mui/icons-material/Clear';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';
const initialData: RequestType = {
    id: null,
    requestType: null,
    description: null,
    fileNameRequest: null,
    filePathRequest: null,
    fileNameResponse: null,
    filePathResponse: null,
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
    const [openModal, setOpenModal] = React.useState(false);
    const [application, setApplication] = useState(initialData);
    const [tabs, setTabs] = React.useState(ALL);
    const [files, setFiles] = useState<File[]>([]);
    const [hover, setHover] = React.useState(false);
    const [disable, setDisable] = React.useState(false);
    const [titleModal, setTitleModal] = React.useState('');
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

    const handleClose = () => {
        setOpen(false);
        setDisable(false);
    };

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
        setApplication((data) => {
            if (name === 'fromDate' || name === 'toDate') {
                const parsedDate = parse(value, "yyyy-MM-dd'T'HH:mm", new Date());
                return {
                    ...data,
                    [name]: isValid(parsedDate)
                        ? format(parsedDate, 'dd-MM-yyyy HH:mm:ss')
                        : value,
                };
            }
            return {
                ...data,
                [name]: value,
            };
        });
    };

    const handleChangeSelectBox = (event: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>) => {
        const {name, value} = event.target;
        setApplication((prev) => ({...prev, [name]: value}));
    };


    const handleReception = async (ID: number) => {
        await reception(ID);
        await fetchData();
    };

    const handleRejectAndApproval = async () => {
        const isReasonValid = null != application.reason && !!application.reason.trim();
        if (!isReasonValid) {
            setErrors({
                requestType: false,
                description: false,
                fromDate: false,
                toDate: false,
                reason: !isReasonValid,
            });

            return;
        }
        if (titleModal === APPROVED) {
            await approvalRequest(application, files);
        } else {
            await rejectRequest(application.id as number, application.reason as string);
        }
        await fetchData();
        setOpenModal(false)
        toast.success(`${titleModal} successfully!`);
    };

    const handleDownloadFile = async (id: number) => {
        const data = await findById(id);
        await downloadFile(data.fileNameRequest as string, data.filePathRequest as string);
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
    const STATUS_COLORS: Record<string, string> = {
        [PENDING]: 'orange',
        [IN_PROGRESS]: 'blue',
        [APPROVED]: 'green',
        [REJECT]: 'red',
    };


    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
            headerAlign: 'center',
            align: 'center',
            flex: 0.5,
            minWidth: 30
        },
        {
            field: 'requestType',
            headerName: 'Request type',
            headerAlign: 'center',
            align: 'left',
            flex: 0.5,
            minWidth: 180,
        },
        {
            field: 'description',
            headerName: 'Description',
            headerAlign: 'center',
            align: 'left',
            flex: 1,
            minWidth: 100,
        },
        {
            field: 'fileNameRequest',
            headerName: 'File name',
            headerAlign: 'center',
            align: 'left',
            flex: 1,
            minWidth: 180,
            renderCell: (params) => (

                <span
                    onClick={() => handleDownloadFile(params.row.id)}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                    style={{
                        color: hover ? 'darkblue' : 'blue',
                        textDecoration: hover ? 'underline' : 'none',
                        cursor: 'pointer',
                    }}
                >
            {params.value}
        </span>
            ),
        },
        {
            field: 'fromDate',
            headerName: 'From date',
            headerAlign: 'center',
            align: 'left',
            flex: 1,
            minWidth: 160,
        },
        {
            field: 'toDate',
            headerName: 'To date',
            headerAlign: 'center',
            align: 'left',
            flex: 1,
            minWidth: 160,
        },
        {
            field: 'status',
            headerName: 'Status',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            minWidth: 60,
            renderCell: (params) => {
                const color = STATUS_COLORS[params.value] || 'gray';
                return (
                    <span style={{color, fontWeight: 'bold'}}>
                        {params.value}
                    </span>
                );
            },
        },
        {
            field: 'handlerUser',
            headerName: 'Handler user',
            headerAlign: 'center',
            align: 'left',
            flex: 1,
            minWidth: 120,
        },
        {
            field: 'reason',
            headerName: 'Reason',
            headerAlign: 'center',
            align: 'left',
            flex: 1,
            minWidth: 200,
        },
        {
            field: 'createdAt',
            headerName: 'Created At',
            headerAlign: 'center',
            align: 'left',
            flex: 1,
            minWidth: 160,
        },
        {
            field: 'createdBy',
            headerName: 'Created By',
            headerAlign: 'center',
            align: 'left',
            flex: 1,
            minWidth: 120,
        },
        {
            field: 'updatedAt',
            headerName: 'Updated At',
            headerAlign: 'center',
            align: 'left',
            flex: 1,
            minWidth: 160,
        },
        {
            field: 'updatedBy',
            headerName: 'Updated By',
            headerAlign: 'center',
            align: 'left',
            flex: 1,
            minWidth: 120,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            headerAlign: 'center',
            align: 'center',
            sortable: false,
            editable: false,

            renderCell: (params: GridRenderCellParams) => (
                <>

                    {user?.authorities.some(role => [STAFF, ADMIN].includes(role)) && params.row.status === PENDING && (
                        <Tooltip title="Reception">
                            <IconButton
                                size={"small"}
                                color="primary"
                                onClick={() => handleReception(params.row.id)}
                            >
                                <KeyboardDoubleArrowDownIcon/>
                            </IconButton>
                        </Tooltip>
                    )}
                    {user?.authorities.some(role => [STAFF, ADMIN, STUDENT].includes(role)) && (
                        <Tooltip title="Detail" sx={{ml: 1}}>
                            <IconButton
                                size={"small"}
                                color="primary"
                                onClick={() => {
                                    handleUpdateApplication(params.row.id);
                                    setDisable(true);
                                }}
                            >
                                <VisibilityIcon/>
                            </IconButton>
                        </Tooltip>
                    )}
                    {user?.authorities.some(role => [STAFF, ADMIN].includes(role)) && params.row.status === IN_PROGRESS && (
                        <Tooltip title={APPROVED} sx={{ml: 1}}>
                            <IconButton
                                size={"small"}
                                color="primary"
                                onClick={async () => {
                                    const data = await findById(params.row.id);
                                    setApplication(data);
                                    setFiles([])
                                    setTitleModal(APPROVED);
                                    setOpenModal(true)
                                }}
                            >
                                <DoneOutlineIcon/>
                            </IconButton>
                        </Tooltip>
                    )}
                    {user?.authorities.some(role => [STAFF, ADMIN].includes(role)) && params.row.status === IN_PROGRESS && (
                        <Tooltip title={REJECT} sx={{ml: 1}}>
                            <IconButton
                                size={"small"}
                                color="primary"
                                onClick={async () => {
                                    const data = await findById(params.row.id);
                                    setApplication(data);
                                    setTitleModal(REJECT);
                                    setOpenModal(true)
                                }}
                            >
                                <ClearIcon/>
                            </IconButton>
                        </Tooltip>
                    )}

                    {user?.authorities.includes(STUDENT) && params.row.status === PENDING && (
                        <Tooltip title="Detail" sx={{ml: 1}}>
                            <IconButton
                                size={"small"}
                                color="error"
                                onClick={() => handleUpdateApplication(params.row.id)}
                            >
                                <ModeIcon/>
                            </IconButton>
                        </Tooltip>
                    )}

                    {user?.authorities.includes(STUDENT) && params.row.status === PENDING && (
                        <Tooltip title="Delete" sx={{ml: 1}}>
                            <IconButton
                                size={"small"}
                                color="error"
                                onClick={() => handleDeleteApplication(params.row.id)}
                            >
                                <DeleteIcon/>
                            </IconButton>
                        </Tooltip>
                    )}

                    {user?.authorities.includes(STUDENT) && params.row.status === APPROVED && (
                        <Tooltip title="Download Result" sx={{ml: 1}}>
                            <IconButton
                                size={"small"}
                                color="error"
                                onClick={() => handleDownloadFile(params.row.id)}
                            >
                                <VerticalAlignBottomIcon/>
                            </IconButton>
                        </Tooltip>
                    )}
                </>
            ),
        },
    ];

    // @ts-ignore
    return (

        <Box sx={{width: '100%', maxWidth: {sm: '100%', md: '95%'}}}>
            {user?.authorities.includes(STUDENT) && (
                <Button onClick={handleOpen} sx={{mb: 1}}>Create Application</Button>
            )}
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
                        size={"small"}
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            color: 'grey.500',
                        }}
                    >
                        <ClearIcon/>
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
                            disabled={disable}
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
                        disabled={disable}
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
                                disabled={disable}
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
                                disabled={disable}
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
                                Selected file: <strong>{application.fileNameRequest}</strong>
                            </Typography>
                        </Box>
                    )}

                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth sx={{mt: 2}}
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                </Box>
            </Modal>

            <Modal
                open={openModal}
                onClose={() => setOpenModal(false)}
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
                        size={"small"}
                        aria-label="close"
                        onClick={() => setOpenModal(false)}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            color: 'grey.500',
                        }}
                    >
                        <ClearIcon/>
                    </IconButton>

                    <Typography id="application-form-title" variant="h6" component="h2" gutterBottom>
                        {titleModal}
                    </Typography>

                    <TextField
                        label="Reason"
                        name="reason"
                        fullWidth
                        margin="normal"
                        value={application.reason}
                        error={errors.reason}
                        onChange={handleChange}
                    />
                    {titleModal === APPROVED && (
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
                    )}

                    {(files.length > 0 ) && (
                        <Box sx={{mt: 2, textAlign: 'center'}}>
                            <Typography variant="body2" color="textSecondary">
                                Selected file: <strong>{files[0].name}</strong>
                            </Typography>
                        </Box>
                    )}

                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth sx={{mt: 2}}
                        onClick={handleRejectAndApproval}
                    >
                        {titleModal}
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
                <Tab value={PENDING} label={PENDING}/>
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
