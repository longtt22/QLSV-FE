// import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import includes from 'lodash.includes';
// import paths from './pathRoutes'; // Đường dẫn các route
//
// export interface RouterConfig {
//     path: string;
//     page: React.ElementType;
// }
//
// const AppRoute: React.FC<RouterConfig> = ({ page: Component, path }) => {
//     const navigate = useNavigate();
//
//     // Kiểm tra isAuthenticated dựa trên token trong localStorage
//     const isAuthenticated = Boolean(localStorage.getItem('accessToken')); // Hoặc `sessionStorage`
//
//     useEffect(() => {
//         if (!isAuthenticated) {
//             navigate(paths.login); // Nếu chưa đăng nhập, điều hướng đến trang login
//         }
//     }, [isAuthenticated, navigate]);
//
//     // Kiểm tra quyền truy cập (ví dụ bằng cách lấy danh sách từ localStorage)
//     const listUrlActive = JSON.parse(localStorage.getItem('listUrlActive') || '[]');
//     if (!isAuthenticated || !includes(listUrlActive, path)) {
//         return null;
//     }
//
//     return <Component />;
// };
//
// export default AppRoute;
