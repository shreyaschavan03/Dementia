import React from "react";
import "./ReportPage.css";

export default function ReportPage() {
  // Example dummy data
  const reports = [
    { id: 1, name: "User 1", score: 5, photo: "photo1.jpg" },
    { id: 2, name: "User 2", score: 7, photo: "photo2.jpg" },
  ];

  return (
    <div className="report-container">
      <h2>Game & Camera Reports</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Score</th>
            <th>Photo</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => (
            <tr key={r.id}>
              <td>{r.name}</td>
              <td>{r.score}</td>
              <td>
                <img
                  src={`/uploads/images/${r.photo}`}
                  alt={r.name}
                  width="80"
                  height="80"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
