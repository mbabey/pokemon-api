import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import jwt_decode from 'jwt-decode'
import './styles/report-styles.css'

function Report({ id, accessToken, setAccessToken, refreshToken, POKEDEX_AUTH_SERVER_URL }) {

    const [reportTable, setReportTable] = useState({});

    const axiosToBeIntercepted = axios.create();
    axiosToBeIntercepted.interceptors.request.use(async (config) => {
        const decoded = jwt_decode(accessToken);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
            console.log("token expired");
            try {
                const res = await axios.post(`${POKEDEX_AUTH_SERVER_URL}/requestNewAccessToken`, {},
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
                    `${POKEDEX_AUTH_SERVER_URL}/report?id=${id}`,
                    {
                        headers: {
                            "authorization": accessToken
                        }
                    });
                setReportTable({ ...reportTable, ...res.data });
            } catch (err) {
                console.log(err.message);
            }
        }
        fetchReport();
    }, [id]);

    return (
        <div className='report-container'>
            {
                (reportTable?.report_num === "1") &&
                (
                    <div className={`report report-${reportTable.report_num}`}>
                        <h4>Report {reportTable.report_num} - {reportTable.report_name}</h4>
                        <table>
                            <thead>
                                <tr><th>User ID</th><th>Username</th><th>Email</th></tr>
                            </thead>
                            <tbody>
                                {reportTable.statistics.map(stat => <tr key={stat._id.user_id}><td>{stat._id.user_id}</td><td>{stat._id.username}</td><td>{stat._id.email}</td></tr>)}
                            </tbody>
                        </table>
                    </div>
                )
            }{
                (reportTable?.report_num === "2") &&
                (
                    <div className={`report report-${reportTable.report_num}`}>
                        <h4>Report {reportTable.report_num} - {reportTable.report_name}</h4>
                        <table>
                            <thead>
                                <tr><th>User ID</th><th>Username</th><th>Email</th><th>Accesses</th></tr>
                            </thead>
                            <tbody>
                                {reportTable.statistics.map(stat => <tr key={stat._id.user_id}><td>{stat._id.user_id}</td><td>{stat._id.username}</td><td>{stat._id.email}</td><td>{stat.count}</td></tr>)}
                            </tbody>
                        </table>
                    </div>
                )
            }{
                (reportTable?.report_num === "3") &&
                (
                    <div className={`report report-${reportTable.report_num}`}>
                        <h4>Report {reportTable.report_num} - {reportTable.report_name}</h4>
                        <table>
                            <thead>
                                <tr><th>Route</th><th>User ID</th><th>Username</th><th>Email</th><th>Accesses</th></tr>
                            </thead>
                            <tbody>
                                {reportTable.statistics.map(stat => {
                                    let count = 0;
                                    return <>
                                        <tr key={stat._id.endpoint + " " + ++count}>
                                            <td rowSpan={stat.topUsers.length}>{stat._id.endpoint}</td>
                                            <td>{stat.topUsers[0].user_id}</td>
                                            <td>{stat.topUsers[0].username}</td>
                                            <td>{stat.topUsers[0].email}</td>
                                            <td>{stat.topUsers[0].count}</td>
                                        </tr>
                                        {stat.topUsers.slice(1).map(user => {
                                            return <tr key={stat._id.endpoint + " " + ++count}><td>{user.user_id}</td><td>{user.username}</td><td>{user.email}</td><td>{user.count}</td></tr>
                                        })}
                                    </>
                                }
                                )}
                            </tbody>
                        </table>
                    </div>
                )
            }{
                (reportTable?.report_num === "4") &&
                (
                    <div className={`report report-${reportTable.report_num}`}>
                        <h4>Report {reportTable.report_num} - {reportTable.report_name}</h4>
                        <table>
                            <thead>
                                <tr><th>Endpoint</th><th>Error</th><th>Accesses</th></tr>
                            </thead>
                            <tbody>
                                {reportTable.statistics.map(stat => <tr key={stat._id.endpoint}><td>{stat._id.endpoint}</td><td>{stat._id.status_code}</td><td>{stat.count}</td></tr>)}
                            </tbody>
                        </table>
                    </div>
                )
            }{
                (reportTable?.report_num === "5") &&
                (
                    <div className={`report report-${reportTable.report_num}`}>
                        <h4>Report {reportTable.report_num} - {reportTable.report_name}</h4>
                        <table>
                            <thead>
                                <tr><th>Endpoint</th><th>Error</th><th>Accesses</th></tr>
                            </thead>
                            <tbody>
                                {reportTable.statistics.map(stat => {
                                    let count = 0;
                                    return <tr key={stat._id.endpoint + " " + ++count}><td>{stat._id.endpoint}</td><td>{stat._id.status_code}</td><td>{stat.count}</td></tr>
                                }
                                )}
                            </tbody>
                        </table>
                    </div>
                )
            }


        </div>
    )
}

export default Report