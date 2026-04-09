import { useState, useRef } from 'react';
import {
  Upload, FileText, CheckCircle2, Clock, XCircle,
  Cloud, MessageSquare, ThumbsUp, ThumbsDown,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';
import type { CompteRendu } from '../types';

const initialReports: CompteRendu[] = [
  { id: '1', projectId: '1', title: 'Compte-rendu #1 – Analyse des besoins',
    submittedAt: '2025-11-15', status: 'valide', fileName: 'CR1_Plateforme_PF.pdf',
    period: 'Octobre – Novembre 2025' },
  { id: '2', projectId: '1', title: 'Compte-rendu #2 – Conception & Modélisation',
    submittedAt: '2025-12-20', status: 'valide', fileName: 'CR2_Plateforme_PF.pdf',
    period: 'Novembre – Décembre 2025' },
  { id: '3', projectId: '1', title: 'Compte-rendu #3 – Développement Sprint 1',
    submittedAt: '2026-02-10', status: 'en_attente', fileName: 'CR3_Plateforme_PF.pdf',
    period: 'Janvier – Février 2026' },
];

const periods = [
  'Octobre – Novembre 2025',
  'Novembre – Décembre 2025',
  'Janvier – Février 2026',
  'Mars – Avril 2026',
];

const statusConfig = {
  valide:     { label: 'Validé',     variant: 'success' as const, icon: CheckCircle2 },
  en_attente: { label: 'En attente', variant: 'warning' as const, icon: Clock },
  rejete:     { label: 'Rejeté',     variant: 'danger'  as const, icon: XCircle },
};

/* ── Tutor validation panel (SCRUM-35/36) ────── */
function TutorPanel({ reports, onValidate, onReject }: {
  reports: CompteRendu[];
  onValidate: (id: string) => void;
  onReject:   (id: string, comment: string) => void;
}) {
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const pending = reports.filter(r => r.status === 'en_attente');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-[var(--text-primary)]">Compte-rendus à valider</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Validez ou rejetez les comptes-rendus soumis par vos étudiants</p>
      </div>

      {/* Pending actions */}
      {pending.length > 0 && (
        <Card accent="teal">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>En attente de validation</CardTitle>
              <Badge variant="warning" dot>{pending.length} en attente</Badge>
            </div>
          </CardHeader>
          <div className="space-y-4">
            {pending.map(report => (
              <div key={report.id}
                className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">{report.title}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5 font-mono">{report.fileName}</p>
                    <p className="text-xs text-[var(--text-muted)]">Soumis le {report.submittedAt} · {report.period}</p>
                  </div>
                  <Badge variant="warning">En attente</Badge>
                </div>

                {rejectingId === report.id ? (
                  <div className="space-y-3">
                    <p className="text-xs font-mono text-red-400">Motif du rejet</p>
                    <textarea rows={3} value={comment} onChange={e => setComment(e.target.value)}
                      placeholder="Expliquez pourquoi ce compte-rendu est insuffisant..."
                      className="w-full rounded-xl px-4 py-3 text-sm border border-[var(--border)] bg-[var(--bg-card)]
                        text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
                        focus:outline-none focus:ring-2 focus:border-red-400/40 focus:ring-red-400/15 resize-none" />
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" size="sm" onClick={() => { setRejectingId(null); setComment(''); }}>
                        Annuler
                      </Button>
                      <Button variant="danger" size="sm"
                        disabled={!comment.trim()}
                        onClick={() => { onReject(report.id, comment); setRejectingId(null); setComment(''); }}>
                        <ThumbsDown className="w-3.5 h-3.5" /> Confirmer le rejet
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="teal" size="sm" onClick={() => onValidate(report.id)}>
                      <ThumbsUp className="w-3.5 h-3.5" /> Valider
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => setRejectingId(report.id)}>
                      <ThumbsDown className="w-3.5 h-3.5" /> Rejeter
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {pending.length === 0 && (
        <Card>
          <p className="text-center text-sm text-[var(--text-muted)] py-4">
            ✓ Aucun compte-rendu en attente de validation.
          </p>
        </Card>
      )}

      {/* All history */}
      <Card>
        <CardHeader><CardTitle>Historique complet</CardTitle></CardHeader>
        <HistoryTable reports={reports} />
      </Card>
    </div>
  );
}

/* ── History table ───────────────────────────── */
function HistoryTable({ reports }: { reports: CompteRendu[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--border)]">
            {['Titre', 'Fichier', 'Soumis le', 'Statut'].map(h => (
              <th key={h} className="text-left py-3 px-2 text-xs font-semibold
                text-[var(--text-muted)] uppercase tracking-wide">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          {reports.map(report => {
            const cfg = statusConfig[report.status];
            const StatusIcon = cfg.icon;
            return (
              <tr key={report.id} className="hover:bg-[var(--bg-elevated)] transition-colors">
                <td className="py-3 px-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
                    <div>
                      <p className="text-[var(--text-primary)] font-medium">{report.title}</p>
                      <p className="text-xs text-[var(--text-muted)]">{report.period}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-2">
                  <span className="font-mono text-xs text-[var(--text-muted)]">{report.fileName}</span>
                </td>
                <td className="py-3 px-2 text-xs text-[var(--text-muted)]">{report.submittedAt}</td>
                <td className="py-3 px-2">
                  <div className="flex items-center gap-1.5">
                    <StatusIcon className={`w-3.5 h-3.5 ${
                      cfg.variant === 'success' ? 'text-green-400'
                      : cfg.variant === 'danger' ? 'text-red-400'
                      : 'text-amber-400'}`} />
                    <Badge variant={cfg.variant}>{cfg.label}</Badge>
                  </div>
                  {(report as any).tutorComment && (
                    <div className="flex items-start gap-1.5 mt-1.5">
                      <MessageSquare className="w-3 h-3 text-red-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-[var(--text-muted)]">{(report as any).tutorComment}</p>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ── Student upload view ─────────────────────── */
function StudentPanel({ reports, onUpload }: {
  reports: CompteRendu[];
  onUpload: (file: File, period: string) => void;
}) {
  const [isDragging, setIsDragging]     = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [uploading, setUploading]       = useState(false);
  const fileInputRef                    = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type === 'application/pdf') setUploadedFile(file);
  };

  const handleSubmit = async () => {
    if (!uploadedFile || !selectedPeriod) return;
    setUploading(true);
    await new Promise(r => setTimeout(r, 1200));
    onUpload(uploadedFile, selectedPeriod);
    setUploadedFile(null); setSelectedPeriod(''); setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const nextPeriod = periods.find(p => !reports.some(r => r.period === p));

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-display font-bold text-2xl text-[var(--text-primary)]">Compte-rendus</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Déposez vos rapports d'avancement périodiques</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center py-4">
          <p className="text-3xl font-display font-bold text-green-400">
            {reports.filter(r => r.status === 'valide').length}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">Validés</p>
        </Card>
        <Card className="text-center py-4">
          <p className="text-3xl font-display font-bold text-amber-400">
            {reports.filter(r => r.status === 'en_attente').length}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">En attente</p>
        </Card>
        <Card className="text-center py-4">
          <p className="text-3xl font-display font-bold text-[var(--text-muted)]">
            {4 - reports.length}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">Restants</p>
        </Card>
      </div>

      {/* Upload */}
      <Card>
        <CardHeader><CardTitle>Déposer un compte-rendu</CardTitle></CardHeader>
        {nextPeriod && (
          <div className="mb-4 p-3 rounded-lg text-sm text-[var(--blue)]"
            style={{ background: 'var(--blue-dim)', border: '1px solid rgba(79,142,247,0.2)' }}>
            📅 Prochaine période attendue : <strong>{nextPeriod}</strong>
          </div>
        )}
        <div className="mb-4">
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Période</label>
          <select value={selectedPeriod} onChange={e => setSelectedPeriod(e.target.value)}
            className="w-full rounded-xl px-4 py-2.5 text-sm border border-[var(--border)]
              bg-[var(--bg-card)] text-[var(--text-primary)]
              focus:outline-none focus:ring-2 focus:border-[rgba(232,168,58,0.4)] focus:ring-[rgba(232,168,58,0.15)]">
            <option value="">Sélectionnez une période...</option>
            {periods
              .filter(p => !reports.some(r => r.period === p && r.status === 'valide'))
              .map(p => <option key={p} value={p} style={{background:'var(--bg-base)'}}>{p}</option>)}
          </select>
        </div>
        <div
          onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200 ${
            isDragging ? 'border-[var(--gold)] bg-[var(--gold-dim)]'
            : uploadedFile ? 'border-green-500/50 bg-[rgba(34,197,94,0.05)]'
            : 'border-[var(--border)] hover:border-[var(--border-light)] hover:bg-[var(--bg-elevated)]'}`}>
          <input ref={fileInputRef} type="file" accept=".pdf"
            onChange={e => { const f = e.target.files?.[0]; if (f) setUploadedFile(f); }}
            className="hidden" />
          {uploadedFile ? (
            <div className="space-y-2">
              <CheckCircle2 className="w-8 h-8 text-green-400 mx-auto" />
              <p className="text-sm font-medium text-green-400">{uploadedFile.name}</p>
              <p className="text-xs text-[var(--text-muted)]">{(uploadedFile.size/1024).toFixed(1)} KB</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Cloud className="w-8 h-8 text-[var(--text-muted)] mx-auto" />
              <p className="text-sm text-[var(--text-secondary)]">Glissez votre fichier PDF ici</p>
              <p className="text-xs text-[var(--text-muted)]">ou cliquez pour parcourir</p>
              <p className="text-xs text-[var(--border-light)] font-mono">Format : PDF · Max : 10 MB</p>
            </div>
          )}
        </div>
        <div className="flex justify-end mt-4 gap-3">
          {uploadedFile && (
            <Button variant="ghost" size="sm"
              onClick={() => { setUploadedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}>
              Retirer
            </Button>
          )}
          <Button variant="gold" onClick={handleSubmit}
            disabled={!uploadedFile || !selectedPeriod} loading={uploading}>
            <Upload className="w-4 h-4" /> Soumettre
          </Button>
        </div>
      </Card>

      <Card>
        <CardHeader><CardTitle>Historique des soumissions</CardTitle></CardHeader>
        <HistoryTable reports={reports} />
      </Card>
    </div>
  );
}

/* ── Main ────────────────────────────────────── */
export function CompteRendus() {
  const user = useAuthStore(s => s.user);
  const role = user?.role ?? 'etudiant';

  const [reports, setReports] = useState<CompteRendu[]>(initialReports);

  const handleUpload = (file: File, period: string) => {
    const n = reports.length + 1;
    setReports(prev => [...prev, {
      id: crypto.randomUUID(), projectId: '1',
      title: `Compte-rendu #${n} – ${period}`,
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'en_attente', fileName: file.name, period,
    }]);
  };

  const handleValidate = (id: string) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'valide' } : r));
  };

  const handleReject = (id: string, comment: string) => {
    setReports(prev => prev.map(r =>
      r.id === id ? { ...r, status: 'rejete', ...(comment ? { tutorComment: comment } as any : {}) } : r
    ));
  };

  if (role === 'tuteur' || role === 'coordinateur') {
    return (
      <div className="max-w-4xl">
        <TutorPanel reports={reports} onValidate={handleValidate} onReject={handleReject} />
      </div>
    );
  }

  return <StudentPanel reports={reports} onUpload={handleUpload} />;
}
