import React from 'react'
import Report from './Report'

import {
    Routes,
    Route,
    Link
  } from "react-router-dom";

function Dashboard() {
    return (
        <div>
            <ul>
                <li><Link to="/report/1">Report 1 - Unique API users over a period of time</Link></li>
                <li><Link to="/report/2">Report 2 - Top API users over period of time</Link></li>
                <li><Link to="/report/3">Report 3 - Top users for each Endpoint</Link></li>
            </ul>
        </div>
    )
}

export default Dashboard