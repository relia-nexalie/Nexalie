'use client';
import { useState } from 'react';

const EMPTY = { categorie: '', contenu: '', mode: 'both', priorite: 5, actif: true };

const inputStyle = {
  width: '100%', padding: '9px 12px', border: '1px solid #E0E0E0', borderRadius: '8px',
  fontSize: '0.85rem', fontFamily: 'inherit', boxSizing: 'border-box',
  outline: 'none', transition: 'border-color 0.2s',
};
const labelStyle = {
  display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#6B7A94',
  marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.05em',
};

export default function KnowledgeManager({ initialItems }) {
  const [items, setItems] = useState(initialItems || []);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const flash = (text) => { setMsg(text); setTimeout(() => setMsg(''), 2500); };

  async function reload() {
    const r = await fetch('/api/knowledge');
    setItems(await r.json());
  }

  async function save() {
    if (!form.categorie.trim() || !form.contenu.trim()) return;
    setSaving(true);
    const method = editing ? 'PUT' : 'POST';
    const body = editing ? { ...form, id: editing } : form;
    const res = await fetch('/api/knowledge', {
      method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    });
    const data = await res.json();
    if (data.success) {
      flash(editing ? '✓ Mis à jour' : '✓ Ajouté');
      setEditing(null);
      setForm(EMPTY);
      await reload();
    } else {
      flash('Erreur : ' + data.error);
    }
    setSaving(false);
  }

  async function toggle(id, actif) {
    await fetch('/api/knowledge', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, actif: !actif }),
    });
    setItems(items.map(i => i.id === id ? { ...i, actif: !actif } : i));
  }

  async function remove(id) {
    if (!confirm('Supprimer définitivement cet élément ?')) return;
    await fetch('/api/knowledge', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setItems(items.filter(i => i.id !== id));
    flash('Supprimé');
  }

  function startEdit(item) {
    setEditing(item.id);
    setForm({ categorie: item.categorie, contenu: item.contenu, mode: item.mode, priorite: item.priorite, actif: item.actif });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const modeLabel = (m) => m === 'both' ? '🌐 Les deux' : m === 'af' ? '🌍 Afrique' : '🇫🇷 France';

  return (
    <div style={{ padding: '32px', maxWidth: '900px' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0A1628', marginBottom: '4px' }}>Mémoire IA</h1>
      <p style={{ color: '#6B7A94', marginBottom: '32px', fontSize: '0.88rem', lineHeight: 1.5 }}>
        Ces éléments sont injectés dans chaque prompt Nexalie OS, filtrés par mode (France/Afrique).
        Priorité 1 = injecté en premier.
      </p>

      {/* Formulaire */}
      <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0A1628', marginBottom: '20px' }}>
          {editing ? '✏️ Modifier l\'élément' : '+ Nouvel élément'}
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '14px' }}>
          <div>
            <label style={labelStyle}>Catégorie</label>
            <input style={inputStyle} value={form.categorie}
              onChange={e => setForm({ ...form, categorie: e.target.value })}
              placeholder="ex: methode, tarifs, contact…" />
          </div>
          <div>
            <label style={labelStyle}>Mode</label>
            <select style={inputStyle} value={form.mode} onChange={e => setForm({ ...form, mode: e.target.value })}>
              <option value="both">🌐 Les deux</option>
              <option value="fr">🇫🇷 France</option>
              <option value="af">🌍 Afrique</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Priorité (1 = haute)</label>
            <input style={inputStyle} type="number" min={1} max={10} value={form.priorite}
              onChange={e => setForm({ ...form, priorite: parseInt(e.target.value) || 5 })} />
          </div>
        </div>

        <div style={{ marginBottom: '18px' }}>
          <label style={labelStyle}>Contenu injecté dans le prompt</label>
          <textarea style={{ ...inputStyle, minHeight: '90px', resize: 'vertical', lineHeight: 1.6 }}
            value={form.contenu}
            onChange={e => setForm({ ...form, contenu: e.target.value })}
            placeholder="Information à mémoriser et injecter dans le contexte IA…" />
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button onClick={save} disabled={saving || !form.categorie.trim() || !form.contenu.trim()}
            style={{
              padding: '10px 24px', background: '#0A1628', color: '#fff', border: 'none',
              borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '0.88rem',
              opacity: saving || !form.categorie.trim() || !form.contenu.trim() ? 0.45 : 1,
              transition: 'opacity 0.2s',
            }}>
            {saving ? 'Sauvegarde…' : editing ? 'Mettre à jour' : 'Ajouter'}
          </button>
          {editing && (
            <button onClick={() => { setEditing(null); setForm(EMPTY); }}
              style={{ padding: '10px 16px', background: 'transparent', border: '1px solid #E0E0E0', borderRadius: '8px', cursor: 'pointer', fontSize: '0.88rem' }}>
              Annuler
            </button>
          )}
          {msg && <span style={{ fontWeight: 700, color: msg.startsWith('Erreur') ? '#E74C3C' : '#27AE60', fontSize: '0.88rem' }}>{msg}</span>}
        </div>
      </div>

      {/* Liste */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {items.length === 0 && (
          <div style={{ textAlign: 'center', padding: '64px', color: '#6B7A94', background: '#fff', borderRadius: '12px' }}>
            Aucun élément. Ajoutez vos premières connaissances ci-dessus.
          </div>
        )}
        {items.map(item => (
          <div key={item.id} style={{
            background: '#fff', borderRadius: '10px', padding: '16px 20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            display: 'flex', alignItems: 'flex-start', gap: '16px',
            opacity: item.actif ? 1 : 0.45,
            borderLeft: `3px solid ${item.actif ? '#2E9B8B' : '#E0E0E0'}`,
            transition: 'opacity 0.2s',
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ background: '#0A162815', color: '#0A1628', padding: '2px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700 }}>
                  {item.categorie}
                </span>
                <span style={{ background: '#C9A84C22', color: '#8B6914', padding: '2px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 600 }}>
                  {modeLabel(item.mode)}
                </span>
                <span style={{ background: '#F0F0F0', color: '#6B7A94', padding: '2px 10px', borderRadius: '20px', fontSize: '0.72rem' }}>
                  priorité {item.priorite}
                </span>
                {!item.actif && <span style={{ background: '#FFE0E0', color: '#C0392B', padding: '2px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 600 }}>Désactivé</span>}
              </div>
              <p style={{ fontSize: '0.85rem', color: '#333', lineHeight: 1.6, margin: 0, wordBreak: 'break-word' }}>
                {item.contenu}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
              <button onClick={() => toggle(item.id, item.actif)}
                style={{ padding: '6px 10px', fontSize: '0.75rem', border: '1px solid #E0E0E0', borderRadius: '6px', cursor: 'pointer', background: 'transparent', color: '#6B7A94' }}>
                {item.actif ? '⏸' : '▶'}
              </button>
              <button onClick={() => startEdit(item)}
                style={{ padding: '6px 10px', fontSize: '0.75rem', border: '1px solid #E0E0E0', borderRadius: '6px', cursor: 'pointer', background: 'transparent' }}>
                ✏️
              </button>
              <button onClick={() => remove(item.id)}
                style={{ padding: '6px 10px', fontSize: '0.75rem', border: '1px solid #FFE0E0', borderRadius: '6px', cursor: 'pointer', background: 'transparent', color: '#E74C3C' }}>
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
