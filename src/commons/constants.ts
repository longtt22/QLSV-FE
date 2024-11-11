export const ACCESS_TOKEN_KEY = `admin:access_token`;
export const REFRESH_ACCESS_TOKEN_KEY = `admin:refresh_token`;
export const USERNAME = 'username';

export const TOKEN_DATA = 'tokenData';

export const RegValidPass = '(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[~@#$!%^*?&()])[A-Za-z\\d@$!%*?&]';
// eslint-disable-next-line no-useless-escape
export const RegValidStringEnglish = /^[~`!@#$%^&*()_+=[\]\{}|;':",.\/<>?a-zA-Z0-9-]+$/;
export const RegOnlyAlphabetAndNumber = /^[a-zA-Z0-9]+$/;
// eslint-disable-next-line no-useless-escape
export const RegNoSpecial = /^[^*|\":<>[\]{}`\\()';@&$#,+=]+$/;
export const RegPositiveInteger = new RegExp('^[1-9]\\d*$');
export const XLSM_FILE_TYPE = 'application/vnd.ms-excel.sheet.macroEnabled.12';
export const XLSX_FILE_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
export const XLS_FILE_TYPE = 'application/vnd.ms-excel';

export const ListFileExcel = [XLSX_FILE_TYPE, XLS_FILE_TYPE, XLSM_FILE_TYPE];

export const formatDate = 'DD/MM/YYYY';
export const formatDateAnt = 'YYYY-MM-DD';
export const formatDateTime = 'DD/MM/YYYY HH:mm:ss';
export const formatDateTimeHHmm = 'DD/MM/YYYY HH:mm';
export const formatTimeHHmm = 'HH:mm';
export const formatLocalDateTime = 'YYYY-MM-DDTHH:mm:ss[Z]';

export const maximumFileSize = 5242880;

