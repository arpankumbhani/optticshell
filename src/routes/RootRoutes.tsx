import { BrowserRouter, Routes, Route, } from "react-router-dom";
import Dashboard from "../pages/Dashboard/Dashboard";
import SignInPage from "../pages/AuthPages/SignInPage";
import PrivateRoutes from "./PrivateRoutes";
import AdminLayout from "../layout/AdminLayout";
import Opticorders from "../pages/Opticorders/Opticorders";
import Umiyaplast from "../pages/Umiyaplast/Umiyaplast";
import ViewOpticorders from "../components/Opticorders/ViewOpticorders";
import EditOpticorders from "../components/Opticorders/EditOpticorders";
import DeletedOrders from "../pages/DeletedOrders/DeletedOrders";
import ViewOpticOrders from "../pages/ViewOpticorders/ViewOpticOrders";
import CreateOpticorder from "../components/Opticorders/CreateOpticorder";
import DeletedRequestUser from "../pages/DeletedRequestUser/DeletedRequestUser";
import ModelDetails from "../components/ModelDetails/ModelDetails";

export default function RootRoutes() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/signin" element={<SignInPage />} />
                <Route element={<PrivateRoutes />}>
                    <Route element={<AdminLayout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="/create-opticorders" element={<CreateOpticorder />} />
                        <Route path="/opticorders" element={<Opticorders />} />
                        <Route path="view-opticorders/:id" element={<ViewOpticorders />} />
                        <Route path="view-opticorders" element={<ViewOpticOrders />} />
                        <Route path="edit-opticorders/:id" element={<EditOpticorders />} />
                        <Route path="model-details/:id" element={<ModelDetails />} />
                        <Route path="/deleted-order" element={<DeletedOrders />} />
                        <Route path="/deleted-request-user" element={<DeletedRequestUser />} />


                        <Route path="/umiyaplast" element={<Umiyaplast />} />

                        <Route path="/" element={<Dashboard />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
