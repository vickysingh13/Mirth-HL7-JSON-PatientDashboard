export default function FHIRViewer({ fhirData, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-2/3 shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-blue-600">
          FHIR Patient Resource
        </h2>

        <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
{JSON.stringify(fhirData, null, 2)}
        </pre>

        <button
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
