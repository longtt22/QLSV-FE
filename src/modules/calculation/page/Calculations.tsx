import * as React from "react";
import { useEffect } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import {
  CalculationRequest,
  CalculationResult,
  Commune,
  District,
  Province,
  Region,
  VoltageLevel,
} from "../type";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";
import {
  executeCalculationData,
  getCalculationData,
  getCommuneData,
  getCommuneDataByDistrictId,
  getDistrictData,
  getDistrictDataByProvinceId,
  getProvinceData,
  getProvinceDataByRegionId,
  getRegionData,
  getVoltageLevelData,
} from "../service";

function TableToolbar() {
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        textAlign: "left",
      }}
    >
      <Typography
        sx={{ flex: "1 1 100%", textAlign: "left" }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        Lịch sử tính toán
      </Typography>
    </Toolbar>
  );
}

export default function Calculation() {
  // Khoảng cách
  const [distance, setDistance] = React.useState("");
  // Vung Mien
  const [region, setRegion] = React.useState("");
  // Muc Dien ap
  const [voltageLevel, setVoltageLevel] = React.useState("");
  // Tinh
  const [province, setProvince] = React.useState("");
  // Quan, Huyen
  const [district, setDistricts] = React.useState("");
  // Xa
  const [commune, setCommune] = React.useState("");

  const [regionDropdown, setRegionDropdown] = React.useState<Region[]>([]);

  const [provinceDropdown, setProvinceDropdown] = React.useState<Province[]>(
    []
  );

  const [districtDropdown, setDistrictDropdown] = React.useState<District[]>(
    []
  );

  const [communeDropdown, setCommuneDropdown] = React.useState<Commune[]>([]);

  const [voltageLevelDropdown, setVoltageLevelDropdown] = React.useState<
    VoltageLevel[]
  >([]);

  const [calculationData, setCalculationData] =
    React.useState<CalculationResult>();

  const [calculationDataTable, setCalculationDataTable] = React.useState<
    CalculationResult[]
  >([]);

  const getAllDropdown = async () => {
    try {
      const [
        regionData,
        provinceData,
        districtData,
        communeData,
        voltageLevelData,
        calculationDataTable,
      ] = await Promise.all([
        getRegionData(),
        getProvinceData(),
        getDistrictData(),
        getCommuneData(),
        getVoltageLevelData(),
        getCalculationData(),
      ]);

      setRegionDropdown(regionData || []);
      setProvinceDropdown(provinceData || []);
      setDistrictDropdown(districtData || []);
      setCommuneDropdown(communeData || []);
      setVoltageLevelDropdown(voltageLevelData || []);
      setCalculationDataTable(calculationDataTable || []);
      console.log("regionData", regionData);
      console.log("provinceData", provinceData);
      console.log("districtData", districtData);
      console.log("communeData", communeData);
      console.log("voltageLevelData", voltageLevelData);
    } catch (error) {
      console.log("error", error);
    }
  };
  const onSubmit = async () => {
    if (
      !region ||
      !province ||
      !district ||
      !commune ||
      !voltageLevel ||
      !distance
    ) {
      toast.error("One or more fields are empty or invalid.");
      return;
    }
    const calculationRequest: CalculationRequest = {
      region: JSON.parse(region),
      province: JSON.parse(province),
      district: JSON.parse(district),
      commune: JSON.parse(commune),
      voltageLevel: JSON.parse(voltageLevel),
      kilometer: Number(distance),
    };

    try {
      const [data] = await Promise.all([
        executeCalculationData(calculationRequest),
      ]);
      setCalculationData(data);
    } catch (error) {
      console.log("error", error);
    }
  };

  const getDataTable = async () => {
    try {
      const [calculationDataTable] = await Promise.all([getCalculationData()]);
      console.log(calculationDataTable);
      setCalculationDataTable(calculationDataTable || []);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getDataTable();
  }, [calculationData]);

  useEffect(() => {
    getAllDropdown();
  }, []);

  const getProvinceByRegion = async (data: string) => {
    try {
      console.log(data);
      const regionData: Region = JSON.parse(data);
      console.log(regionData);
      const [provinceData] = await Promise.all([
        getProvinceDataByRegionId(regionData.regionId),
      ]);
      setProvinceDropdown(provinceData || []);
    } catch (error) {
      console.log("error", error);
    }
  };

  const getDistrictByProvince = async (data: string) => {
    try {
      console.log(data);
      const provinceData: Province = JSON.parse(data);
      console.log(provinceData);
      const [districtData] = await Promise.all([
        getDistrictDataByProvinceId(provinceData.provinceId),
      ]);
      setDistrictDropdown(districtData || []);
    } catch (error) {
      console.log("error", error);
    }
  };

  const getCommuneByDistrict = async (data: string) => {
    try {
      console.log(data);
      const districtData: District = JSON.parse(data);
      console.log(districtData);
      const [communeData] = await Promise.all([
        getCommuneDataByDistrictId(districtData.districtId),
      ]);
      setCommuneDropdown(communeData || []);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <Container id="calculation" sx={{ py: { xs: 8, sm: 16 } }}>
      <Grid container spacing={2}>
        <Grid xs={4}>
          <FormControl sx={{ m: 1, minWidth: 300 }}>
            <TextField
              id="outlined-basic"
              variant="outlined"
              label="Khoảng cách(Km)"
              size="small"
              value={distance}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setDistance(event.target.value);
              }}
            />
            <FormHelperText>{}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid xs={4}>
          <FormControl sx={{ m: 1, minWidth: 300 }}>
            <InputLabel id="demo-simple-select-helper-label">
              Vùng miền
            </InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={region}
              label="Vùng miền"
              size="small"
              onChange={(event: SelectChangeEvent) => {
                setRegion(event.target.value);
                getProvinceByRegion(event.target.value);
                setDistrictDropdown([]);
                setCommuneDropdown([]);
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {regionDropdown?.map((e) => {
                return (
                  <MenuItem key={e.regionId} value={JSON.stringify(e)}>
                    {e.regionName}
                  </MenuItem>
                );
              })}
            </Select>
            <FormHelperText>{}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid xs={4}>
          <FormControl sx={{ m: 1, minWidth: 300 }}>
            <InputLabel id="demo-simple-select-helper-label">
              Mức điện áp
            </InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={voltageLevel}
              label="Mức điện áp"
              size="small"
              onChange={(event: SelectChangeEvent) => {
                setVoltageLevel(event.target.value);
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {voltageLevelDropdown?.map((e) => {
                return (
                  <MenuItem key={e.id} value={JSON.stringify(e)}>
                    {e.description}
                  </MenuItem>
                );
              })}
            </Select>
            <FormHelperText>{}</FormHelperText>
          </FormControl>
        </Grid>
        <CssBaseline />
        <Grid xs={4}>
          <FormControl sx={{ m: 1, minWidth: 300 }}>
            <InputLabel id="demo-simple-select-helper-label">
              Tỉnh Thành
            </InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={province}
              label="Tỉnh thành"
              size="small"
              onChange={(event: SelectChangeEvent) => {
                setProvince(event.target.value);
                getDistrictByProvince(event.target.value);
                setCommuneDropdown([]);
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {provinceDropdown?.map((e) => {
                return (
                  <MenuItem key={e.provinceId} value={JSON.stringify(e)}>
                    {e.provinceName}
                  </MenuItem>
                );
              })}
            </Select>
            <FormHelperText>{}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid xs={4}>
          <FormControl sx={{ m: 1, minWidth: 300 }}>
            <InputLabel id="demo-simple-select-helper-label">
              Quận Huyện
            </InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={district}
              label="Quận Huyện"
              size="small"
              onChange={(event: SelectChangeEvent) => {
                setDistricts(event.target.value);
                getCommuneByDistrict(event.target.value);
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {districtDropdown?.map((e) => {
                return (
                  <MenuItem key={e.districtId} value={JSON.stringify(e)}>
                    {e.districtName}
                  </MenuItem>
                );
              })}
            </Select>
            <FormHelperText>{}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid xs={4}>
          <FormControl sx={{ m: 1, minWidth: 300 }}>
            <InputLabel id="demo-simple-select-helper-label">Xã</InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={commune}
              label="Xã"
              size="small"
              onChange={(event: SelectChangeEvent) => {
                setCommune(event.target.value);
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {communeDropdown?.map((e) => {
                return (
                  <MenuItem key={e.communeId} value={JSON.stringify(e)}>
                    {e.communeName}
                  </MenuItem>
                );
              })}
            </Select>
            <FormHelperText>{}</FormHelperText>
          </FormControl>
        </Grid>
      </Grid>
      <Box mt={5} mb={2} sx={{ width: "100%" }}>
        <Button
          variant="contained"
          size="small"
          sx={{ width: "250px" }}
          onClick={onSubmit}
        >
          Tính Toán
        </Button>
      </Box>
      <Box mt={1} mb={2} sx={{ width: "100%", textAlign: "left" }}>
        <h3>Tổng so tiền: {calculationData?.total} </h3>
      </Box>
      <Divider />
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <TableToolbar />
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Vùng miền</TableCell>
                  <TableCell align="center">Tỉnh thành</TableCell>
                  <TableCell align="center">Quận, Huyện</TableCell>
                  <TableCell align="center">Xã</TableCell>
                  <TableCell align="center">Khoảng cách(Km)</TableCell>
                  <TableCell align="center">Mức điện áp</TableCell>
                  <TableCell align="center">Hệ số</TableCell>
                  <TableCell align="center">Tổng số tiền</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {calculationDataTable.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="center">
                      {row.region.regionName}
                    </TableCell>
                    <TableCell align="center">
                      {row.province.provinceName}
                    </TableCell>
                    <TableCell align="center">
                      {row.district.districtName}
                    </TableCell>
                    <TableCell align="center">
                      {row.commune.communeName}
                    </TableCell>
                    <TableCell align="center">{row.distance}</TableCell>
                    <TableCell align="center">
                      {row.voltageLevel.description}
                    </TableCell>
                    <TableCell align="center">
                      {row.distanceFactor.factor}
                    </TableCell>
                    <TableCell align="center">{row.total}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Container>
  );
}
