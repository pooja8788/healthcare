import { AlertTriangle, Biohazard, Leaf, PackageSearch, Trash2 } from 'lucide-react';

const Lessons = () => {
  return (
    <div className="space-y-6 text-gray-800">
      <h2 className="text-2xl font-bold">Learn Hospital Waste Categories</h2>
      <p className="text-md">
        Proper segregation of hospital waste is crucial for infection control and safe disposal. Below are the main waste categories and how to identify them:
      </p>

      <div className="space-y-4">
        {/* ♻ Biodegradable Waste */}
        <div>
          <h3 className="text-xl font-semibold flex items-center gap-2 text-green-600">
            <Leaf className="w-5 h-5" /> Biodegradable Waste
          </h3>
          <p className="font-medium text-green-700">🟢 Bin Color: Green</p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Leftover food from patient meals or canteen</li>
            <li>Fruit and vegetable peels</li>
            <li>Non-infected cotton swabs or mop heads</li>
            <li>Paper towels and tissues not soaked in blood</li>
            <li>Flowers and plant waste from hospital premises</li>
          </ul>
        </div>

        {/* 🧴 Non-Biodegradable Waste */}
        <div>
          <h3 className="text-xl font-semibold flex items-center gap-2 text-blue-600">
            <PackageSearch className="w-5 h-5" /> Non-Biodegradable Waste
          </h3>
          <p className="font-medium text-blue-700">🔵 Bin Color: Blue</p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Plastic bottles and IV packaging (unused)</li>
            <li>Broken glass containers (non-contaminated)</li>
            <li>Empty saline bottles or tubes</li>
            <li>Cardboard, clean plastic wrappers</li>
          </ul>
        </div>

        {/* ☣ Hazardous Biomedical Waste */}
        <div>
          <h3 className="text-xl font-semibold flex items-center gap-2 text-yellow-700">
            <Biohazard className="w-5 h-5" /> Hazardous Biomedical Waste
          </h3>
          <p className="font-medium text-yellow-600">🟡 Bin Color: Yellow</p>
          <p className="font-medium text-red-600">🔴 Sharp Waste: Red Bin</p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Used needles, syringes, and scalpels</li>
            <li>Gauze, cotton, or gloves soaked in blood</li>
            <li>Contaminated IV tubes and catheters</li>
            <li>Expired medicines or cytotoxic drugs</li>
            <li>Pathology or lab waste with human samples</li>
          </ul>
        </div>

        {/* 🗑 General Waste */}
        <div>
          <h3 className="text-xl font-semibold flex items-center gap-2 text-gray-700">
            <Trash2 className="w-5 h-5" /> General Waste
          </h3>
          <p className="font-medium text-gray-600">⚪ Bin Color: Black / White</p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Office papers, files, stationery</li>
            <li>Clean packaging, empty boxes</li>
            <li>Old uniforms (not soiled)</li>
            <li>Broken chairs or non-medical furniture</li>
          </ul>
        </div>

        {/* ⚠ Safety Guidelines */}
        <div>
          <h3 className="text-xl font-semibold flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" /> Important Safety Guidelines
          </h3>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Always wear gloves and a mask when handling medical waste.</li>
            <li>Do not mix hazardous and general waste in the same bin.</li>
            <li>Report full bins, spills, or damaged containers immediately.</li>
            <li>Use color-coded bins as per hospital protocol.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Lessons;