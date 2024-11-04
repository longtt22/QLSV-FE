import {DataGrid, GridColDef, GridRenderCellParams} from "@mui/x-data-grid";
import * as React from "react";
import {useEffect} from "react";
import Box from "@mui/material/Box";
import {getAllStudent} from "../service";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {StudentType} from "../type";
import IconButton from "@mui/material/IconButton";


export default function Student() {
    const [rows, setRows] = React.useState<StudentType[]>([]);
    const getAllData = async () => {
        try {
            const [
                columns
            ] = await Promise.all([
                getAllStudent(),
            ]);
            setRows(columns || []);
            console.log("Student Data", columns);
        } catch (error) {
            console.log("error", error);
        }
    };

    useEffect(() => {
        getAllData().then(r => console.log("error get data table student", r));
    }, [columns]);

    return (
        <Box sx={{width: '100%', maxWidth: {sm: '100%', md: '1700px'}}}>

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