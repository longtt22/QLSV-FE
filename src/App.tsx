import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Dashboard from './Dashboard';
import SignIn from './modules/login/pages/SignIn';
import NotFoundPage from './components/pages/NotFoundPage';
import AboutPage from './components/pages/AboutPage';
import MainGrid from './components/MainGrid';
import Student from './modules/student/pages/Student';
import {ToastContainer} from 'react-toastify';
import {StyledEngineProvider} from "@mui/material/styles";
import LoadingIndicator from './components/LoadingIndicator';
import {Provider} from 'react-redux';
import {store} from './redux/store';
import PrivateRoute from "./router/PrivateRoute";
import Profile from "./modules/profile/pages/Profile";
import TypeApplication from "./modules/application-type/pages/ApplicationType";
import Employee from "./modules/employee/pages/Employee";
import Application from "./modules/application/pages/Application";
import {ADMIN, STAFF, STUDENT} from "./commons/constants";

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <StyledEngineProvider injectFirst>
                <Router>
                    <Routes>
                        <Route path="/" element={<Dashboard/>}>
                            <Route index element={<AboutPage/>}/>

                            <Route element={<PrivateRoute allowedRoles={[ADMIN]}/>}>
                                <Route path="statistics" element={<MainGrid/>}/>
                            </Route>

                            <Route element={<PrivateRoute allowedRoles={[STAFF, ADMIN]}/>}>
                                <Route path="student" element={<Student/>}/>
                                <Route path="employee" element={<Employee/>}/>
                                <Route path="application-type" element={<TypeApplication/>}/>
                            </Route>

                            <Route element={<PrivateRoute allowedRoles={[STUDENT, STAFF, ADMIN]}/>}>
                                <Route path="profile" element={<Profile/>}/>
                                <Route path="prescription" element={<Application/>}/>
                            </Route>
                        </Route>
                        <Route path="login" element={<SignIn/>}/>
                        <Route path="*" element={<NotFoundPage/>}/>
                    </Routes>
                </Router>
                <ToastContainer/>
                <LoadingIndicator/>
            </StyledEngineProvider>
        </Provider>
    );
};

export default App;
