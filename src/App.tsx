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

const App: React.FC = () => {
    return (
        <div>
            <StyledEngineProvider injectFirst>
                <ToastContainer/>
                <Router>
                    <Routes>
                        <Route path="/" element={<Dashboard/>}>
                            <Route index element={<MainGrid/>}/>
                            <Route path="about" element={<AboutPage/>}/>
                            <Route path="student" element={<Student/>}/>
                        </Route>
                        <Route path="login" element={<SignIn/>}/>
                        <Route path="*" element={<NotFoundPage/>}/>
                    </Routes>
                </Router>
            </StyledEngineProvider>
        </div>
    );
};

export default App;
