import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'

function Report({ id, accessToken, setAccessToken, refreshToken }) {

    const [reportTable, setReportTable] = React.useState(null)

    useEffect(() => {
        async function fetchReport() {
            const res = await axios.get(
                `http://localhost:5000/report?id=${id}`,
                {
                    headers: {
                        "Authorization": accessToken
                    }
                });
        }
        fetchReport();
    }, { id });

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