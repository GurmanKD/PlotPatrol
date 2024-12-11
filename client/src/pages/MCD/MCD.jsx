import "./Dashboard.css"; // Import the styles as a separate CSS file

const MCD = () => {
  return (
    <div className="container">
      <div className="dashboard">
        <div className="box circular-graph">
          <svg>
            <circle cx="60" cy="60" r="50" stroke="#007bff" strokeWidth="10" fill="none" />
            <text x="50%" y="50%" alignmentBaseline="middle" textAnchor="middle" fill="#333" fontSize="18">
              70%
            </text>
          </svg>
          <div className="info">Monitoring Completed: 7/10</div>
        </div>

        <div className="box">
          <p>
            <strong>Date of Next Drone Flight:</strong> 2024-12-15
          </p>
          <p>
            <strong>Number of Buildings Spotted:</strong> 25
          </p>
        </div>
      </div>

      <div className="big-buttons">
        <button>View Reports</button>
        <button>Schedule Survey</button>
      </div>

      <div className="scheduled-reports">
        <h3>Scheduled Reports</h3>
        <table>
          <thead>
            <tr>
              <th>Area Pincode</th>
              <th>Section (ULB Code)</th>
              <th>Date of Drone Swat</th>
              <th>Days Passed</th>
              <th>Flags Collected</th>
              <th>Complaints</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>123456</td>
              <td>ULB-01</td>
              <td>2024-12-10</td>
              <td>1</td>
              <td>5</td>
              <td>2</td>
            </tr>
            <tr>
              <td>654321</td>
              <td>ULB-02</td>
              <td>2024-12-08</td>
              <td>3</td>
              <td>8</td>
              <td>4</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MCD;
