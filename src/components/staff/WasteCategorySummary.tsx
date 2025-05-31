import React from "react";
import { FaRecycle, FaFlask, FaTrash, FaShieldAlt, FaLeaf, FaSyringe } from "react-icons/fa";

const WasteCategorySummary: React.FC = () => {
  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-green-700">
        Learn Hospital Waste Categories
      </h1>

      <p className="text-gray-700 text-center mb-10">
        Proper segregation of hospital waste is crucial for infection control and safe disposal.
        Below are the main waste categories and how to identify them:
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Biodegradable Waste */}
        <div className="border-l-4 border-green-500 p-4 bg-green-50 rounded-lg shadow">
          <div className="flex items-center mb-2 text-green-700">
            <FaLeaf className="mr-2" />
            <h2 className="text-xl font-semibold">♻ Biodegradable Waste (🟢 Green Bin)</h2>
          </div>
          <ul className="list-disc ml-6 text-sm text-gray-800">
            <li>Leftover food from patient meals or canteen</li>
            <li>Fruit and vegetable peels</li>
            <li>Non-infected cotton swabs or mop heads</li>
            <li>Paper towels and tissues not soaked in blood</li>
            <li>Flowers and plant waste from hospital premises</li>
          </ul>
        </div>

        {/* Non-Biodegradable Waste */}
        <div className="border-l-4 border-blue-500 p-4 bg-blue-50 rounded-lg shadow">
          <div className="flex items-center mb-2 text-blue-700">
            <FaRecycle className="mr-2" />
            <h2 className="text-xl font-semibold">🧴 Non-Biodegradable Waste (🔵 Blue Bin)</h2>
          </div>
          <ul className="list-disc ml-6 text-sm text-gray-800">
            <li>Plastic bottles and IV packaging (unused)</li>
            <li>Broken glass containers (non-contaminated)</li>
            <li>Empty saline bottles or tubes</li>
            <li>Cardboard, clean plastic wrappers</li>
          </ul>
        </div>

        {/* Hazardous Biomedical Waste */}
        <div className="border-l-4 border-yellow-500 p-4 bg-yellow-50 rounded-lg shadow">
          <div className="flex items-center mb-2 text-yellow-700">
            <FaFlask className="mr-2" />
            <h2 className="text-xl font-semibold">
              ☣ Hazardous Biomedical Waste (🟡 Yellow / 🔴 Red Bin for Sharps)
            </h2>
          </div>
          <ul className="list-disc ml-6 text-sm text-gray-800">
            <li>Used needles, syringes, and scalpels</li>
            <li>Gauze, cotton, or gloves soaked in blood</li>
            <li>Contaminated IV tubes and catheters</li>
            <li>Expired medicines or cytotoxic drugs</li>
            <li>Pathology or lab waste with human samples</li>
          </ul>
        </div>

        {/* General Waste */}
        <div className="border-l-4 border-gray-500 p-4 bg-gray-100 rounded-lg shadow">
          <div className="flex items-center mb-2 text-gray-700">
            <FaTrash className="mr-2" />
            <h2 className="text-xl font-semibold">🗑 General Waste (⚪ Black / White Bin)</h2>
          </div>
          <ul className="list-disc ml-6 text-sm text-gray-800">
            <li>Office papers, files, stationery</li>
            <li>Clean packaging, empty boxes</li>
            <li>Old uniforms (not soiled)</li>
            <li>Broken chairs or non-medical furniture</li>
          </ul>
        </div>
      </div>

      {/* Safety Guidelines */}
      <div className="mt-10 p-5 bg-red-50 border-l-4 border-red-400 rounded-lg shadow">
        <div className="flex items-center mb-2 text-red-700">
          <FaShieldAlt className="mr-2" />
          <h2 className="text-lg font-bold">⚠ Important Safety Guidelines</h2>
        </div>
        <ul className="list-disc ml-6 text-sm text-gray-800">
          <li>Always wear gloves and a mask when handling medical waste.</li>
          <li>Do not mix hazardous and general waste in the same bin.</li>
          <li>Report full bins, spills, or damaged containers immediately.</li>
          <li>Use color-coded bins as per hospital protocol.</li>
        </ul>
      </div>
    </div>
  );
};

export default WasteCategorySummary;
