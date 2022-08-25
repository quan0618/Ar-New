/* eslint-disable react/prop-types */
import React from "react";
import { Route, Redirect, useLocation } from 'react-router-dom'
// 使用props 接收值
export default function AuthRoute(props) {
    const location = useLocation();
    const Com = props.component;
    return (
        <Route
            path={props.path}
            render={() => {
                if (location.state === undefined) {
                    return <Redirect to="/" />
                } else {
                    return <Com />
                }
            }}
        >
        </Route>
    )
}