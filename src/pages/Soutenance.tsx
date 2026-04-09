import { useState, useRef } from 'react';
import {
  Award, Calendar, Clock, MapPin, Users, Upload,
  CheckCircle2, Bell, FileCheck, Star, Lock,
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';

const soutenanceInfo = {
  date: '15 Juin 2026', time: '10h00', room: 'Salle A-12',
  building: 'Bâtiment principal – FST-SBZ', duration: '45 minutes',
  jury: ['Dr. Karim Jebali (Président)', 'Prof. Leila Mansouri', 'Dr. Sami Trabelsi (Tuteur)'],
  project: 'Plateforme PF FST-SBZ',
};

const checklist = [
  { id: 1, label: 'Rapport final soumis',        required: true,  done: false },
  { id: 2, label: 'Présentation (slides) prête', required: true,  done: true },
  { id: 3, label: 'Démo fonctionnelle prête',    required: false, done: true },
  { id: 4, label: 'Compte-rendus validés (3+)',  required: true,  done: true },
  { id: 5, label: 'Tuteur a approuvé la soutenance', required: true, done: false },
];

/* ── Jury grading form (SCRUM-45 / SCRUM-47) ─── */
function JuryGradingPanel() {
  const [submitted, setSubmitted] = useState(false);
  const [grade, setGrade]         = useState('');
  const [mention, setMention]     = useState('');
  const [comments, setComments]   = useState('');
  const [engagement, setEngagement] = useState('');
  const [loading, setLoading]     = useState(false);

  const soutenances = [
    { id: '1', student: 'Ahmed Ben Salah', project: 'Plateforme PF FST-SBZ',    date: '15 Juin 2026', evaluated: submitted },
    { id: '2', student: 'Fatma Mejri',     project: 'Système de gestion RH',    date: '15 Juin 2026', evaluated: false },
    { id: '3', student: 'Mohamed Khalil',  project: 'App mobile étudiants',     date: '16 Juin 2026', evaluated: true  },
  ];

  const handleSubmit = async () => {
    if (!grade || !mention || !engagement) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setSubmitted(true); setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-display font-bold text-2xl text-[var(--text-primary)]">Évaluation des soutenances</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Saisissez les notes et appréciations pour les projets soutenus</p>
      </div>

      {/* Soutenance list */}
      <Card>
        <CardHeader><CardTitle>Planning des soutenances</CardTitle></CardHeader>
        <div className="space-y-3">
          {soutenances.map(s => (
            <div key={s.id} className="flex items-center justify-between p-3 rounded-xl
              border border-[var(--border)] bg-[var(--bg-elevated)]">
              <div>
                <p className="font-medium text-[var(--text-primary)] text-sm">{s.project}</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{s.student} · {s.date}</p>
              </div>
              <Badge variant={s.evaluated ? 'success' : 'warning'}>
                {s.evaluated ? '✓ Évalué' : 'À évaluer'}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Grading form for first pending soutenance (SCRUM-45/47) */}
      {!submitted ? (
        <Card accent="gold">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Évaluer — Ahmed Ben Salah</CardTitle>
              <Badge variant="gold">En cours</Badge>
            </div>
            <p className="text-sm text-[var(--text-muted)] mt-1">Plateforme PF FST-SBZ · 15 Juin 2026</p>
          </CardHeader>

          <div className="space-y-5">
            {/* Grade */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Note (sur 20)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number" min="0" max="20" step="0.5"
                  value={grade} onChange={e => setGrade(e.target.value)}
                  placeholder="ex : 15.5"
                  className="w-28 rounded-xl px-4 py-2.5 text-sm border border-[var(--border)]
                    bg-[var(--bg-card)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
                    focus:outline-none focus:ring-2 focus:border-[rgba(232,168,58,0.4)] focus:ring-[rgba(232,168,58,0.15)]" />
                {grade && (
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className={`w-4 h-4 ${
                        parseFloat(grade)/4 >= i ? 'text-[var(--gold)] fill-[var(--gold)]' : 'text-[var(--border)]'}`} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Mention */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Mention
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['Passable', 'Assez bien', 'Bien', 'Très bien'].map(m => (
                  <button key={m} type="button"
                    onClick={() => setMention(m)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-medium border transition-all ${
                      mention === m
                        ? 'border-[var(--gold)] bg-[var(--gold-dim)] text-[var(--gold)]'
                        : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-light)]'
                    }`}>
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Engagement (SCRUM-46) */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Implication de l'étudiant durant le suivi
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Insuffisante', 'Satisfaisante', 'Exemplaire'].map(e => (
                  <button key={e} type="button"
                    onClick={() => setEngagement(e)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-medium border transition-all ${
                      engagement === e
                        ? 'border-[var(--teal)] bg-[var(--teal-dim)] text-[var(--teal)]'
                        : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-light)]'
                    }`}>
                    {e}
                  </button>
                ))}
              </div>
            </div>

            {/* Comments */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Appréciations (optionnel)
              </label>
              <textarea rows={4} value={comments} onChange={e => setComments(e.target.value)}
                placeholder="Commentaires sur la qualité du travail, la présentation orale, les points forts/faibles..."
                className="w-full rounded-xl px-4 py-3 text-sm border border-[var(--border)]
                  bg-[var(--bg-card)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
                  focus:outline-none focus:ring-2 focus:border-[rgba(232,168,58,0.4)] focus:ring-[rgba(232,168,58,0.15)] resize-none" />
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => { setGrade(''); setMention(''); setEngagement(''); setComments(''); }}>
                Réinitialiser
              </Button>
              <Button variant="gold" loading={loading}
                disabled={!grade || !mention || !engagement}
                onClick={handleSubmit}>
                <Lock className="w-4 h-4" /> Soumettre l'évaluation finale
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        /* Closed project confirmation (SCRUM-47) */
        <Card accent="teal">
          <div className="flex items-center gap-4 p-2">
            <CheckCircle2 className="w-10 h-10 text-green-400 shrink-0" />
            <div>
              <p className="font-display font-bold text-[var(--text-primary)] text-lg">Évaluation soumise et projet clôturé</p>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                Note : <strong className="text-[var(--gold)]">{grade}/20</strong> ·
                Mention : <strong className="text-[var(--text-secondary)]">{mention}</strong> ·
                Implication : <strong className="text-[var(--teal)]">{engagement}</strong>
              </p>
              {comments && <p className="text-sm text-[var(--text-muted)] mt-1 italic">"{comments}"</p>}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

/* ── Student view ────────────────────────────── */
function StudentPanel() {
  const [reportUploaded, setReportUploaded] = useState(false);
  const [isDragging, setIsDragging]         = useState(false);
  const [uploadedFile, setUploadedFile]     = useState<File | null>(null);
  const [uploading, setUploading]           = useState(false);
  const [notifEnabled, setNotifEnabled]     = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async () => {
    if (!uploadedFile) return;
    setUploading(true);
    await new Promise(r => setTimeout(r, 1400));
    setReportUploaded(true); setUploading(false);
  };

  const daysUntil = Math.ceil(
    (new Date('2026-06-15').getTime() - new Date().getTime()) / (1000*60*60*24)
  );

  const items = checklist.map(i => ({ ...i, done: i.id === 1 ? reportUploaded : i.done }));

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-[var(--text-primary)]">Soutenance</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Informations et préparation de votre soutenance finale</p>
        </div>
        <Badge variant="info" className="text-sm px-3 py-1">📅 Planifiée</Badge>
      </div>

      {/* Countdown */}
      <Card accent="gold">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-1 uppercase tracking-wide font-mono">Compte à rebours</p>
            <p className="text-5xl font-display font-bold text-[var(--gold)]">{daysUntil}</p>
            <p className="text-[var(--text-secondary)] mt-1">jours avant la soutenance</p>
          </div>
          <Award className="w-16 h-16 text-[var(--gold)] opacity-20" />
        </div>
      </Card>

      {/* Info */}
      <Card>
        <CardHeader><CardTitle>Informations de soutenance</CardTitle></CardHeader>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-3">
            {[
              { icon: Calendar, label: 'Date', value: soutenanceInfo.date },
              { icon: Clock,    label: 'Heure · Durée', value: `${soutenanceInfo.time} · ${soutenanceInfo.duration}` },
              { icon: MapPin,   label: 'Lieu', value: soutenanceInfo.room, sub: soutenanceInfo.building },
            ].map(({ icon: Icon, label, value, sub }) => (
              <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-elevated)]">
                <Icon className="w-4 h-4 text-[var(--blue)] shrink-0" />
                <div>
                  <p className="text-xs text-[var(--text-muted)]">{label}</p>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{value}</p>
                  {sub && <p className="text-xs text-[var(--text-muted)]">{sub}</p>}
                </div>
              </div>
            ))}
          </div>
          <div>
            <div className="p-3 rounded-xl bg-[var(--bg-elevated)]">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-[var(--blue)]" />
                <p className="text-xs text-[var(--text-muted)]">Composition du Jury</p>
              </div>
              {soutenanceInfo.jury.map((m, i) => (
                <div key={i} className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-[var(--bg-card)] flex items-center justify-center
                    text-xs text-[var(--text-muted)] shrink-0 border border-[var(--border)]">{m.charAt(0)}</div>
                  <p className="text-sm text-[var(--text-secondary)]">{m}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Notification toggle */}
        <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[var(--text-muted)]" />
            <span className="text-sm text-[var(--text-secondary)]">Rappels par email</span>
          </div>
          <button onClick={() => setNotifEnabled(!notifEnabled)}
            className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
              notifEnabled ? 'bg-[var(--gold)]' : 'bg-[var(--border)]'}`}>
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
              notifEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </div>
      </Card>

      {/* Final report */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Rapport final</CardTitle>
            {reportUploaded && <Badge variant="success"><CheckCircle2 className="w-3 h-3" /> Soumis</Badge>}
          </div>
        </CardHeader>
        {reportUploaded ? (
          <div className="flex items-center gap-4 p-4 rounded-xl bg-[rgba(34,197,94,0.06)] border border-green-500/20">
            <FileCheck className="w-8 h-8 text-green-400" />
            <div>
              <p className="font-medium text-green-400">Rapport final soumis</p>
              <p className="text-sm text-[var(--text-muted)] mt-0.5">{uploadedFile?.name}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Soumis le {new Date().toLocaleDateString('fr-FR')}</p>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              Soumettez votre rapport final (PDF) avant le <strong className="text-[var(--text-primary)]">1er Juin 2026</strong>.
            </p>
            <div
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={e => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) setUploadedFile(f); }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 ${
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
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-8 h-8 text-[var(--text-muted)] mx-auto" />
                  <p className="text-sm text-[var(--text-secondary)]">Glissez votre rapport final (PDF)</p>
                  <p className="text-xs text-[var(--text-muted)]">ou cliquez pour sélectionner</p>
                </div>
              )}
            </div>
            <div className="flex justify-end mt-4">
              <Button variant="gold" onClick={handleUpload} disabled={!uploadedFile} loading={uploading}>
                <Upload className="w-4 h-4" /> Soumettre le rapport final
              </Button>
            </div>
          </>
        )}
      </Card>

      {/* Checklist */}
      <Card>
        <CardHeader><CardTitle>Checklist de préparation</CardTitle></CardHeader>
        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} className={`flex items-center gap-3 p-3 rounded-xl ${
              item.done ? 'bg-[rgba(34,197,94,0.04)]' : 'bg-[var(--bg-elevated)]'}`}>
              <CheckCircle2 className={`w-4 h-4 shrink-0 ${item.done ? 'text-green-400' : 'text-[var(--border)]'}`} />
              <span className={`text-sm flex-1 ${item.done ? 'text-[var(--text-secondary)]' : 'text-[var(--text-muted)]'}`}>
                {item.label}
              </span>
              {item.required && !item.done && <Badge variant="danger">Requis</Badge>}
              {item.done && <Badge variant="success">✓</Badge>}
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-[var(--border)]">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-[var(--text-muted)]">Préparation</span>
            <span className="text-[var(--text-secondary)] font-medium">
              {items.filter(i => i.done).length} / {items.length}
            </span>
          </div>
          <div className="h-2 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(items.filter(i => i.done).length / items.length) * 100}%`,
                background: 'linear-gradient(90deg, var(--gold), var(--gold-light))',
              }} />
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ── Main ────────────────────────────────────── */
export function Soutenance() {
  const user = useAuthStore(s => s.user);
  const role = user?.role ?? 'etudiant';

  if (role === 'jury') return <JuryGradingPanel />;
  return <StudentPanel />;
}
