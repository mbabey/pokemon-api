import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import jwt_decode from 'jwt-decode'

function Report({ id, accessToken, setAccessToken, refreshToken, SERVER_ADDRESS }) {

    const [reportTable, setReportTable] = useState({});

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
                            'authorization': refreshToken
                        }
                    });
                setAccessToken(res.headers['authorization']);
                config.headers['authorization'] = res.headers['authorization'];
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
                            "authorization": accessToken
                        }
                    });
                console.log(reportTable)
                setReportTable({ ...reportTable, ...res.data });
            } catch (err) {
                console.log(err.message);
            }
        }
        fetchReport();
    }, [id]);

    return (
        <div>
            {
                (reportTable?.report_num === "1") &&
                (
                    <div>
                        <div>Report {reportTable.report_num} - {reportTable.report_name}</div>
                        <table>
                            <tr><th></th></tr>
                        </table>
                    </div>
                )
            }{
                (reportTable?.report_num === "2") &&
                (
                    <div>
                        <div>Report {reportTable.report_num} - {reportTable.report_name}</div>
                        <table>
                            <tr><th></th></tr>
                        </table>
                    </div>
                )
            }{
                (reportTable?.report_num === "3") &&
                (
                    <div>
                        <div>Report {reportTable.report_num} - {reportTable.report_name}</div>
                        <table>
                            <tr><th></th></tr>
                        </table>
                    </div>
                )
            }{
                (reportTable?.report_num === "4") &&
                (
                    <div>
                        <div>Report {reportTable.report_num} - {reportTable.report_name}</div>
                        <table>
                            <tr><th></th></tr>
                        </table>
                    </div>
                )
            }{
                (reportTable?.report_num === "5") &&
                (
                    <div>
                        <div>Report {reportTable.report_num} - {reportTable.report_name}</div>
                        <table>
                            <tr><th></th></tr>
                        </table>
                    </div>
                )
            }


        </div>
    )
}

export default Report