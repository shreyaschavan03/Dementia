import React from 'react';
import { useNavigate } from 'react-router-dom';

const Report = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          ← Back to Home
        </button>
        
        <h1 className="text-4xl font-bold text-purple-300 mb-6">Your Cognitive Health Report</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-purple-800 p-6 rounded-xl">
            <h2 className="text-2xl font-semibold mb-4">Dementia Risk Prediction</h2>
            <div className="text-center">
              <p className="text-5xl font-bold text-green-400 mb-2">25%</p>
              <p className="text-green-300">Low Risk</p>
            </div>
          </div>
          
          <div className="bg-purple-800 p-6 rounded-xl">
            <h2 className="text-2xl font-semibold mb-4">Overall Cognitive Score</h2>
            <div className="text-center">
              <p className="text-5xl font-bold text-blue-400 mb-2">78/100</p>
              <p className="text-blue-300">Good Performance</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-xl mt-8">
          <h2 className="text-2xl font-semibold mb-4">Recommendations</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>Continue regular cognitive exercises</li>
            <li>Maintain healthy lifestyle habits</li>
            <li>Annual cognitive screening recommended</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Report;