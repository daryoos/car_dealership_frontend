import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import { Navigate } from "react-router-dom";

const AdminLayout = () => {
    const basicUserInfo = useAppSelector((state) => state.auth.basicUserInfo);

    if (!basicUserInfo?.isAdmin) {
        return <Navigate replace to={"/"} />;
    }

    return (
        <>
            <Outlet />
        </>
    );
};

export default AdminLayout;