import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import jwt_decode from 'jwt-decode'

function Report({ id, accessToken, setAccessToken, refreshToken, SERVER_ADDRESS }) {

    const [reportTable, setReportTable] = React.useState(null)

    const axiosToBeIntercepted = axios.create();
    axiosToBeIntercepted.interceptors.request.use(async (config) => {
        const decoded = jwt_decode(accessToken);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
            console.log("token expired");
            try {
                const res = await axios.post(`${SERVER_ADDRESS}/requestNewAccessToken`, {},
                    {
                        headers: {
                            'Authorization': refreshToken
                        }
                    });
                setAccessToken(res.headers['authorization']);
                config.headers['Authorization'] = res.headers['Authorization'];
            } catch (err) {
                console.log(err.message);
            }
        }

        return config;
    }, (err) => {
        return Promise.reject(err);
    });

    useEffect(() => {
        async function fetchReport() {
            try {
                const res = await axiosToBeIntercepted.get(
                    `${SERVER_ADDRESS}/report?id=${id}`,
                    {
                        headers: {
                            "Authorization": accessToken
                        }
                    });
                setReportTable(res.data);
            } catch (err) {
                console.log(err.message);
            }
        }
        fetchReport();
    }, [id]);

    return (
        <div>
            {
                reportTable &&
                reportTable
            }
        </div>
    )
}

export default Report