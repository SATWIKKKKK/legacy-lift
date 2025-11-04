

import { useNavigate } from "react-router-dom"

export default function ProjectCard({ project }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/project/${project._id}`)}
      className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-purple-600 hover:shadow-lg hover:shadow-purple-600/20 transition cursor-pointer"
    >
      <h3 className="text-white font-bold text-lg mb-2">{project.name}</h3>
      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          <p>{project.uploadedFiles?.length || 0} files</p>
          <p>{project.versions?.length || 0} versions</p>
        </div>

        <div
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            project.status === "completed"
              ? "bg-green-900 text-green-200"
              : project.status === "processing"
                ? "bg-yellow-900 text-yellow-200"
                : "bg-gray-700 text-gray-300"
          }`}
        >
          {project.status}
        </div>
      </div>
    </div>
  )
}
