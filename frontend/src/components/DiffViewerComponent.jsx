export default function DiffViewerComponent({ oldCode, newCode, filename }) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
      <div className="bg-gray-900 px-6 py-4 border-b border-gray-700">
        <h3 className="text-white font-mono text-sm">{filename}</h3>
      </div>

      <div className="grid grid-cols-2 divide-x divide-gray-700">
        <div className="p-4">
          <p className="text-gray-500 text-xs font-semibold mb-3">ORIGINAL</p>
          <pre className="text-gray-300 text-xs font-mono overflow-x-auto max-h-96 bg-gray-900 p-3 rounded">
            {oldCode}
          </pre>
        </div>

        <div className="p-4">
          <p className="text-gray-500 text-xs font-semibold mb-3">REFACTORED</p>
          <pre className="text-green-300 text-xs font-mono overflow-x-auto max-h-96 bg-gray-900 p-3 rounded">
            {newCode}
          </pre>
        </div>
      </div>
    </div>
  )
}
