"use client"

export default function ProjectDetail({ project, diffs, onBack }) {
  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="px-4 py-2 bg-card border border-border rounded text-foreground hover:bg-muted transition-colors"
      >
        ← Back to Projects
      </button>

      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-2xl font-bold text-foreground">{project.name}</h2>
        <p className="text-muted-foreground mt-2">{project.description}</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Refactoring History</h3>
        {diffs && diffs.length > 0 ? (
          <div className="grid gap-4">
            {diffs.map((diff) => (
              <div
                key={diff.id}
                className="bg-card border border-border rounded-lg p-4 hover:border-primary transition-colors"
              >
                <p className="text-sm text-muted-foreground">{new Date(diff.createdAt).toLocaleString()}</p>
                <p className="text-foreground mt-2">{diff.summary}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No refactoring history yet</p>
        )}
      </div>
    </div>
  )
}
