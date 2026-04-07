import { useState, useRef } from 'react';
import { Award, Calendar, Clock, MapPin, Users, Upload, CheckCircle2, Bell, FileCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

const soutenanceInfo = {
  date: '15 Juin 2026',
  time: '10h00',
  room: 'Salle A-12',
  building: 'Bâtiment principal – FST-SBZ',
  duration: '45 minutes',
  jury: ['Dr. Karim Jebali (Président)', 'Prof. Leila Mansouri', 'Dr. Sami Trabelsi (Tuteur)'],
  project: 'Plateforme PF FST-SBZ',
  status: 'planifie' as const,
};

const checklist = [
  { id: 1, label: 'Rapport final soumis', done: false, required: true },
  { id: 2, label: 'Présentation (slides) préparée', done: true, required: true },
  { id: 3, label: 'Démo fonctionnelle prête', done: true, required: false },
  { id: 4, label: 'Compte-rendus validés (min. 3)', done: true, required: true },
  { id: 5, label: 'Tuteur a approuvé la soutenance', done: false, required: true },
];

export function Soutenance() {
  const [reportUploaded, setReportUploaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') setUploadedFile(file);
  };

  const handleUpload = async () => {
    if (!uploadedFile) return;
    setUploading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setReportUploaded(true);
    setUploading(false);
  };

  const daysUntil = Math.ceil(
    (new Date('2026-06-15').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-100">Soutenance</h1>
          <p className="text-sm text-slate-400 mt-1">Informations et préparation de votre soutenance finale</p>
        </div>
        <Badge variant={soutenanceInfo.status === 'planifie' ? 'info' : 'success'} className="text-sm px-3 py-1">
          {soutenanceInfo.status === 'planifie' ? '📅 Planifiée' : '✅ Terminée'}
        </Badge>
      </div>

      {/* Countdown */}
      <Card className="bg-gradient-to-br from-blue-600/10 to-slate-800/60 border-blue-600/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 mb-1 uppercase tracking-wide font-mono">Compte à rebours</p>
            <p className="text-5xl font-display font-bold text-blue-400">{daysUntil}</p>
            <p className="text-slate-400 mt-1">jours avant la soutenance</p>
          </div>
          <Award className="w-16 h-16 text-blue-600/30" />
        </div>
      </Card>

      {/* Soutenance details */}
      <Card>
        <CardHeader>
          <CardTitle>Informations de soutenance</CardTitle>
        </CardHeader>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/40">
              <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
              <div>
                <p className="text-xs text-slate-500">Date</p>
                <p className="text-sm font-medium text-slate-100">{soutenanceInfo.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/40">
              <Clock className="w-4 h-4 text-blue-400 shrink-0" />
              <div>
                <p className="text-xs text-slate-500">Heure · Durée</p>
                <p className="text-sm font-medium text-slate-100">{soutenanceInfo.time} · {soutenanceInfo.duration}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/40">
              <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
              <div>
                <p className="text-xs text-slate-500">Lieu</p>
                <p className="text-sm font-medium text-slate-100">{soutenanceInfo.room}</p>
                <p className="text-xs text-slate-500">{soutenanceInfo.building}</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-slate-900/40">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-blue-400" />
                <p className="text-xs text-slate-500">Composition du Jury</p>
              </div>
              <div className="space-y-2">
                {soutenanceInfo.jury.map((member, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs text-slate-400 shrink-0">
                      {member.charAt(0)}
                    </div>
                    <p className="text-sm text-slate-300">{member}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Notification toggle */}
        <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-300">Rappels par email</span>
          </div>
          <button
            onClick={() => setNotifEnabled(!notifEnabled)}
            className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${notifEnabled ? 'bg-blue-600' : 'bg-slate-700'}`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${notifEnabled ? 'translate-x-5' : 'translate-x-0.5'}`}
            />
          </button>
        </div>
      </Card>

      {/* Final report upload */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Rapport final</CardTitle>
            {reportUploaded && <Badge variant="success"><CheckCircle2 className="w-3 h-3" /> Soumis</Badge>}
          </div>
        </CardHeader>

        {reportUploaded ? (
          <div className="flex items-center gap-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
            <FileCheck className="w-8 h-8 text-green-400" />
            <div>
              <p className="font-medium text-green-400">Rapport final soumis avec succès</p>
              <p className="text-sm text-slate-400 mt-0.5">{uploadedFile?.name} · {uploadedFile ? (uploadedFile.size / 1024).toFixed(1) : '–'} KB</p>
              <p className="text-xs text-slate-500 mt-1">Soumis le {new Date().toLocaleDateString('fr-FR')}</p>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-400 mb-4">
              Soumettez votre rapport final (PDF) avant le <strong className="text-slate-200">1er Juin 2026</strong>.
              Le rapport doit être validé par votre tuteur avant la soutenance.
            </p>

            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 ${
                isDragging
                  ? 'border-blue-500 bg-blue-600/10'
                  : uploadedFile
                  ? 'border-green-500/50 bg-green-500/5'
                  : 'border-slate-600/60 hover:border-slate-500/80 hover:bg-slate-800/30'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) setUploadedFile(f); }}
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
                  <Upload className="w-8 h-8 text-slate-500 mx-auto" />
                  <p className="text-sm text-slate-300">Glissez votre rapport final (PDF)</p>
                  <p className="text-xs text-slate-500">ou cliquez pour sélectionner</p>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-4">
              <Button onClick={handleUpload} disabled={!uploadedFile} loading={uploading}>
                <Upload className="w-4 h-4" />
                Soumettre le rapport final
              </Button>
            </div>
          </>
        )}
      </Card>

      {/* Checklist */}
      <Card>
        <CardHeader><CardTitle>Checklist de préparation</CardTitle></CardHeader>
        <div className="space-y-2">
          {checklist.map((item) => {
            const done = item.id === 1 ? reportUploaded : item.done;
            return (
              <div key={item.id} className={`flex items-center gap-3 p-3 rounded-lg ${done ? 'bg-green-500/5' : 'bg-slate-900/30'}`}>
                <CheckCircle2 className={`w-4 h-4 shrink-0 ${done ? 'text-green-400' : 'text-slate-700'}`} />
                <span className={`text-sm flex-1 ${done ? 'text-slate-300' : 'text-slate-500'}`}>
                  {item.label}
                </span>
                {item.required && !done && (
                  <Badge variant="danger">Requis</Badge>
                )}
                {done && <Badge variant="success">✓</Badge>}
              </div>
            );
          })}
        </div>
        <div className="mt-4 pt-4 border-t border-slate-700/50">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-400">Préparation</span>
            <span className="text-slate-300 font-medium">
              {checklist.filter((i) => (i.id === 1 ? reportUploaded : i.done)).length} / {checklist.length}
            </span>
          </div>
          <div className="h-2 bg-slate-700/80 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-500"
              style={{ width: `${(checklist.filter((i) => (i.id === 1 ? reportUploaded : i.done)).length / checklist.length) * 100}%` }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
