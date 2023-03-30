import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import jwt_decode from 'jwt-decode'

function Report({ id, accessToken, setAccessToken, refreshToken }) {

    const [reportTable, setReportTable] = React.useState(null)

    const axiosToBeIntercepted = axios.create();
    axiosToBeIntercepted.interceptors.request.use(async (config) => {
        const decoded = jwt_decode(accessToken);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
            console.log("token expired");
            await axios.get('http://localhost:5010/requestNewAccessToken',
                {
                    headers: {
                        'Authorization': refreshToken
                    }
                });
            setAccessToken(res.headers['authorization']);
        }

        return config;
    }, (err) => {
        return Promise.reject(err);
    });

    useEffect(() => {
        async function fetchReport() {
            const res = await axiosToBeIntercepted.get(
                `http://localhost:5010/report?id=${id}`,
                {
                    headers: {
                        "Authorization": accessToken
                    }
                });
            setReportTable(res.data);
        }
        fetchReport();
    }, [id]);

    return (
        <div>
            Report {id}
            {
                reportTable &&
                reportTable
            }
        </div>
    )
}

export default Report