import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import 'react-toastify/dist/ReactToastify.css';
import App from "./App";

ReactDOM.createRoot(document.querySelector("#root")!).render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
)
;