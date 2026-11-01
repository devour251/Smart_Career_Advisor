import { useEffect, useState } from 'react';
import { Download, FileText } from 'lucide-react';

interface DocMeta {
  slug: string;
  title: string;
  filename: string;
  category: string;
  exists: boolean;
}

const ARCHITECTURE_DIAGRAMS = [
  { id: 'improved_sankalp_architecture', title: '1. Proposed Improved Sankalp Architecture' },
  { id: 'original_sankalp_architecture', title: '2. Original IEEE Sankalp Architecture (Baseline)' },
  { id: 'application_workflow', title: '3. Complete Guidance Website Workflow' },
  { id: 'recommendation_engine_workflow', title: '4. Multi-Agent Hybrid Scoring Pipeline' },
  { id: 'qlearning_feedback_loop', title: '5. Contextual Sentiment Q-Learning Loop' },
  { id: 'education_to_career_pathway', title: '6. Multi-Stage Education-to-Career Pathway Graph' },
  { id: 'database_er_diagram', title: '7. SQLite & Knowledge Repository ER Diagram' },
];

export function DocsAndArchitectureSection() {
  const [selectedDiagram, setSelectedDiagram] = useState(ARCHITECTURE_DIAGRAMS[0].id);
  const [docs, setDocs] = useState<DocMeta[]>([]);
  const [activeDocSlug, setActiveDocSlug] = useState<string>('laptop-setup-guide');
  const [docContent, setDocContent] = useState<string>('Loading project documentation...');

  useEffect(() => {
    fetch('/api/docs')
      .then((r) => r.json())
      .then((data) => {
        if (data.documents) {
          setDocs(data.documents);
          if (data.documents.length > 0 && !data.documents.some((d: DocMeta) => d.slug === activeDocSlug)) {
            setActiveDocSlug(data.documents[0].slug);
          }
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setDocContent('Loading document...');
    fetch(`/api/docs/${activeDocSlug}`)
      .then((r) => r.json())
      .then((data) => {
        setDocContent(data.content || data.error || 'Document unavailable.');
      })
      .catch(() => {
        setDocContent('Unable to load document content.');
      });
  }, [activeDocSlug]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* Architecture & System Diagrams Gallery */}
      <section className="glass-card rounded-3xl p-6 sm:p-10 space-y-6">
        <div className="flex flex-col justify-between gap-4 border-b border-teal-900/10 pb-5 sm:flex-row sm:items-end">
          <div className="space-y-1.5">
            <p className="text-sm font-bold text-teal-800">
              System Architecture &amp; ER Diagrams
            </p>
            <h2 className="font-['Bricolage_Grotesque'] text-2xl font-extrabold text-slate-950">
              System Architecture, Workflows &amp; Database Schemas
            </h2>
            <p className="text-[15px] text-slate-600">
              Generated in both vector SVG and high-resolution PNG inside <code className="font-mono text-sm">docs/diagrams/</code> and <code className="font-mono text-sm">public/results/</code>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`/results/${selectedDiagram}.png`}
              download={`${selectedDiagram}.png`}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              <Download className="h-4 w-4" />
              <span>Download PNG</span>
            </a>
            <a
              href={`/results/${selectedDiagram}.svg`}
              download={`${selectedDiagram}.svg`}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              <Download className="h-4 w-4" />
              <span>Download SVG</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-4 space-y-2">
            {ARCHITECTURE_DIAGRAMS.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setSelectedDiagram(d.id)}
                className={`w-full rounded-xl border px-4 py-3 text-left text-sm sm:text-[15px] font-medium transition-colors ${
                  selectedDiagram === d.id
                    ? 'border-teal-700 bg-teal-50 text-teal-950 font-bold'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {d.title}
              </button>
            ))}
          </div>

          <div className="tinted-panel lg:col-span-8 rounded-2xl p-5 flex items-center justify-center overflow-x-auto">
            <img
              src={`/results/${selectedDiagram}.svg`}
              alt={selectedDiagram}
              className="max-h-[540px] w-auto rounded-xl bg-white shadow-xs"
            />
          </div>
        </div>
      </section>

      {/* Complete 10-Document Academic, Laptop Setup & Viva Documentation Hub */}
      <section className="glass-card rounded-3xl p-6 sm:p-10 space-y-6">
        <div className="border-b border-teal-900/10 pb-5 space-y-1.5">
          <p className="text-sm font-bold text-teal-800">
            Complete Documentation, Laptop Setup &amp; Viva-Voce Suite
          </p>
          <h2 className="font-['Bricolage_Grotesque'] text-2xl font-extrabold text-slate-950">
            Project Reports, Laptop Setup Guide &amp; Viva Preparation Reader
          </h2>
          <p className="text-[15px] text-slate-600">
            Browse all Markdown project deliverables (including the Laptop &amp; Database Setup Guide and Viva Q&amp;A) directly below.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-4 space-y-2">
            {docs.map((doc) => (
              <button
                key={doc.slug}
                type="button"
                onClick={() => setActiveDocSlug(doc.slug)}
                className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                  activeDocSlug === doc.slug
                    ? 'border-teal-700 bg-teal-50 text-teal-950'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <FileText className="mt-1 h-4 w-4 shrink-0 text-teal-700" />
                <div className="space-y-0.5">
                  <p className="text-sm sm:text-[15px] font-bold">{doc.title}</p>
                  <p className="font-mono text-xs text-slate-500">
                    {doc.filename} · {doc.category}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <div className="tinted-panel lg:col-span-8 rounded-2xl p-6 sm:p-8 max-h-[720px] overflow-y-auto">
            <pre className="whitespace-pre-wrap font-sans text-[15px] leading-relaxed text-slate-800">
              {docContent}
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
}
