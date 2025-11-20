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

export default function RootRoutes() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/signin" element={<SignInPage />} />
                <Route element={<PrivateRoutes />}>
                    <Route element={<AdminLayout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="/create-opticorders" element={<Dashboard />} />
                        <Route path="/opticorders" element={<Opticorders />} />
                        <Route path="view-opticorders/:id" element={<ViewOpticorders />} />
                        <Route path="view-opticorders" element={<ViewOpticOrders />} />
                        <Route path="edit-opticorders/:id" element={<EditOpticorders />} />
                        <Route path="/deleted-order" element={<DeletedOrders />} />


                        <Route path="/umiyaplast" element={<Umiyaplast />} />

                        <Route path="/" element={<Dashboard />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
