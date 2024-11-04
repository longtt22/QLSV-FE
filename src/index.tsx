import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import {StyledEngineProvider} from '@mui/material/styles';
import Dashboard from './Dashboard';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import SignIn from "./components/login/SignIn";
import NotFoundPage from "./components/pages/NotFoundPage";
import AboutPage from "./components/pages/AboutPage";
import MainGrid from "./components/MainGrid";
import Student from "./modules/student/pages/Student";

ReactDOM.createRoot(document.querySelector("#root")!).render(
    <React.StrictMode>
        <StyledEngineProvider injectFirst>
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
    </React.StrictMode>
)
;