import React from 'react';

function TestTailwind() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Tailwind CSS Test</h1>
          <p className="text-gray-600 mb-4">If you can see this styled card with:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Gray background</li>
            <li>White card with shadow</li>
            <li>Proper typography</li>
            <li>Rounded corners</li>
          </ul>
          <p className="mt-4 text-green-600 font-semibold">✅ Then Tailwind is working!</p>
        </div>
      </div>
    </div>
  );
}

export default TestTailwind;