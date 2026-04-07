import { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, Clock, XCircle, Cloud } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import type { CompteRendu } from '../types';

const mockReports: CompteRendu[] = [
  {
    id: '1',
    projectId: '1',
    title: 'Compte-rendu #1 – Analyse des besoins',
    submittedAt: '2025-11-15',
    status: 'valide',
    fileName: 'CR1_Plateforme_PF.pdf',
    period: 'Octobre – Novembre 2025',
  },
  {
    id: '2',
    projectId: '1',
    title: 'Compte-rendu #2 – Conception & Modélisation',
    submittedAt: '2025-12-20',
    status: 'valide',
    fileName: 'CR2_Plateforme_PF.pdf',
    period: 'Novembre – Décembre 2025',
  },
  {
    id: '3',
    projectId: '1',
    title: 'Compte-rendu #3 – Développement Sprint 1',
    submittedAt: '2026-02-10',
    status: 'en_attente',
    fileName: 'CR3_Plateforme_PF.pdf',
    period: 'Janvier – Février 2026',
  },
];

const statusConfig = {
  valide: { label: 'Validé', variant: 'success' as const, icon: CheckCircle2 },
  en_attente: { label: 'En attente', variant: 'warning' as const, icon: Clock },
  rejete: { label: 'Rejeté', variant: 'danger' as const, icon: XCircle },
};

const periods = [
  'Octobre – Novembre 2025',
  'Novembre – Décembre 2025',
  'Janvier – Février 2026',
  'Mars – Avril 2026',
];

export function CompteRendus() {
  const [reports, setReports] = useState<CompteRendu[]>(mockReports);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file);
  };

  const handleUpload = async () => {
    if (!uploadedFile || !selectedPeriod) return;
    setUploading(true);
    await new Promise((r) => setTimeout(r, 1200));
    const crNumber = reports.length + 1;
    const newReport: CompteRendu = {
      id: crypto.randomUUID(),
      projectId: '1',
      title: `Compte-rendu #${crNumber} – ${selectedPeriod}`,
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'en_attente',
      fileName: uploadedFile.name,
      period: selectedPeriod,
    };
    setReports((prev) => [...prev, newReport]);
    setUploadedFile(null);
    setSelectedPeriod('');
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const nextPeriod = periods.find(
    (p) => !reports.some((r) => r.period === p)
  );

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-display font-bold text-2xl text-slate-100">Compte-rendus</h1>
        <p className="text-sm text-slate-400 mt-1">Déposez vos rapports d'avancement périodiques</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center py-4">
          <p className="text-3xl font-display font-bold text-green-400">{reports.filter((r) => r.status === 'valide').length}</p>
          <p className="text-xs text-slate-500 mt-1">Validés</p>
        </Card>
        <Card className="text-center py-4">
          <p className="text-3xl font-display font-bold text-amber-400">{reports.filter((r) => r.status === 'en_attente').length}</p>
          <p className="text-xs text-slate-500 mt-1">En attente</p>
        </Card>
        <Card className="text-center py-4">
          <p className="text-3xl font-display font-bold text-slate-400">{4 - reports.length}</p>
          <p className="text-xs text-slate-500 mt-1">Restants</p>
        </Card>
      </div>

      {/* Upload area */}
      <Card>
        <CardHeader>
          <CardTitle>Déposer un compte-rendu</CardTitle>
        </CardHeader>

        {nextPeriod && (
          <div className="mb-4 p-3 rounded-lg bg-blue-600/10 border border-blue-600/20 text-sm text-blue-400">
            📅 Prochaine période attendue : <strong>{nextPeriod}</strong>
          </div>
        )}

        {/* Period selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Période</label>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700/80 rounded-lg px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors"
          >
            <option value="">Sélectionnez une période...</option>
            {periods
              .filter((p) => !reports.some((r) => r.period === p && r.status === 'valide'))
              .map((p) => (
                <option key={p} value={p} className="bg-slate-900">{p}</option>
              ))}
          </select>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-blue-500 bg-blue-600/10'
              : uploadedFile
              ? 'border-green-500/50 bg-green-500/5'
              : 'border-slate-600/60 hover:border-slate-500/80 hover:bg-slate-800/40'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          {uploadedFile ? (
            <div className="space-y-2">
              <CheckCircle2 className="w-8 h-8 text-green-400 mx-auto" />
              <p className="text-sm font-medium text-green-400">{uploadedFile.name}</p>
              <p className="text-xs text-slate-500">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Cloud className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-sm text-slate-300">Glissez votre fichier PDF ici</p>
              <p className="text-xs text-slate-500">ou cliquez pour parcourir</p>
              <p className="text-xs text-slate-600 font-mono">Format : PDF · Taille max : 10 MB</p>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-4 gap-3">
          {uploadedFile && (
            <Button variant="ghost" size="sm" onClick={() => { setUploadedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}>
              Retirer le fichier
            </Button>
          )}
          <Button
            onClick={handleUpload}
            disabled={!uploadedFile || !selectedPeriod}
            loading={uploading}
          >
            <Upload className="w-4 h-4" />
            Soumettre le compte-rendu
          </Button>
        </div>
      </Card>

      {/* Reports table */}
      <Card>
        <CardHeader><CardTitle>Historique des soumissions</CardTitle></CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left py-3 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">Titre</th>
                <th className="text-left py-3 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">Fichier</th>
                <th className="text-left py-3 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">Soumis le</th>
                <th className="text-left py-3 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {reports.map((report) => {
                const cfg = statusConfig[report.status];
                const StatusIcon = cfg.icon;
                return (
                  <tr key={report.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <div>
                          <p className="text-slate-200 font-medium">{report.title}</p>
                          <p className="text-xs text-slate-500">{report.period}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span className="font-mono text-xs text-slate-400">{report.fileName}</span>
                    </td>
                    <td className="py-3 px-2 text-slate-400 text-xs">{report.submittedAt}</td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1.5">
                        <StatusIcon className={`w-3.5 h-3.5 ${cfg.variant === 'success' ? 'text-green-400' : cfg.variant === 'danger' ? 'text-red-400' : 'text-amber-400'}`} />
                        <Badge variant={cfg.variant}>{cfg.label}</Badge>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
