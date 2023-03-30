import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'

function Report(id) {

    const [reportTable, setReportTable] = React.useState(null)

    useEffect(() => {
        async function fetchReport() {
            const res = await axios.get(`http://localhost:5000/report/${id}`);
        }
        fetchReport();
    }, { id });

    return (
        <div>
            Report {id}
            {
                true && <div>
                    reportTable
                </div>
            }
        </div>
    )
}

export default Report