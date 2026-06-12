'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const router = useRouter();
    const [authenticated, setAuthenticated] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [activeTab, setActiveTab] = useState('bands');

    // Data State
    const [bands, setBands] = useState([]);
    const [venues, setVenues] = useState([]);
    const [concerts, setConcerts] = useState([]);
    const [messages, setMessages] = useState([]);
    const [subscribers, setSubscribers] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [notification, setNotification] = useState(null);
    const [pendingDelete, setPendingDelete] = useState(null);

    // Editing State
    const [editingId, setEditingId] = useState({ bands: null, venues: null, concerts: null, reviews: null });

    // Forms State
    const initialBand = { name: '', tributeTo: '', description: '', imageUrl: '', videoUrl: '' };
    const initialVenue = { name: '', location: '', capacity: '', contactEmail: '', imageUrl: '', videoUrl: '', description: '' };
    const initialConcert = { band_id: '', venue_id: '', date: '', ticketUrl: '', videoUrl: '', description: '' };
    const initialReview = { author: '', text: '', concert_label: '', concert_id: '', subscriber_email: '', stars: 5, visible: true };

    const [bandForm, setBandForm] = useState(initialBand);
    const [venueForm, setVenueForm] = useState(initialVenue);
    const [concertForm, setConcertForm] = useState(initialConcert);
    const [reviewForm, setReviewForm] = useState(initialReview);

    const fetchData = async () => {
        const [bands, venues, concerts, messages, newsletter, reviews] = await Promise.allSettled([
            fetch('/api/bands').then(r => r.json()),
            fetch('/api/venues').then(r => r.json()),
            fetch('/api/concerts').then(r => r.json()),
            fetch('/api/contact').then(r => r.json()),
            fetch('/api/newsletter').then(r => r.json()),
            fetch('/api/reviews').then(r => r.json()),
        ]);
        if (bands.status === 'fulfilled') setBands(bands.value);
        if (venues.status === 'fulfilled') setVenues(venues.value);
        if (concerts.status === 'fulfilled') setConcerts(concerts.value);
        if (messages.status === 'fulfilled') setMessages(messages.value);
        if (newsletter.status === 'fulfilled') setSubscribers(Array.isArray(newsletter.value) ? newsletter.value : []);
        if (reviews.status === 'fulfilled') setReviews(Array.isArray(reviews.value) ? reviews.value : []);
    };

    // Auth check on mount
    useEffect(() => {
        fetch('/api/auth/verify')
            .then(res => {
                if (!res.ok) {
                    router.replace('/login');
                } else {
                    setAuthenticated(true);
                    setCheckingAuth(false);
                }
            })
            .catch(() => router.replace('/login'));
    }, [router]);

    // Fetch data once authenticated
    useEffect(() => {
        if (authenticated) fetchData();
    }, [authenticated]);

    // Auto-clear notification after 3 s
    useEffect(() => {
        if (!notification) return;
        const timer = setTimeout(() => setNotification(null), 3000);
        return () => clearTimeout(timer);
    }, [notification]);

    const handleEntitySubmit = async (e, type, endpoint, formData, tabKey) => {
        e.preventDefault();
        const isEditing = editingId[tabKey] !== null;
        const method = isEditing ? 'PUT' : 'POST';
        const payload = isEditing ? { ...formData, id: editingId[tabKey] } : formData;

        const res = await fetch(endpoint, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (res.ok) {
            setNotification({ type: 'success', message: `${type} ${isEditing ? 'actualizado' : 'guardado'} con éxito!` });
        } else {
            setNotification({ type: 'error', message: `Error al ${isEditing ? 'actualizar' : 'guardar'} ${type}.` });
        }
        cancelEdit(tabKey);
        fetchData();
    };

    const handleDelete = (endpoint, id) => {
        setPendingDelete({ endpoint, id });
    };

    const confirmDelete = async () => {
        if (!pendingDelete) return;
        const { endpoint, id } = pendingDelete;
        setPendingDelete(null);
        const res = await fetch(`${endpoint}?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
            setNotification({ type: 'success', message: 'Elemento eliminado.' });
        } else {
            setNotification({ type: 'error', message: 'Error al eliminar el elemento.' });
        }
        fetchData();
    };

    const cancelEdit = (tabKey) => {
        setEditingId({ ...editingId, [tabKey]: null });
        if (tabKey === 'bands') setBandForm(initialBand);
        if (tabKey === 'venues') setVenueForm(initialVenue);
        if (tabKey === 'concerts') setConcertForm(initialConcert);
        if (tabKey === 'reviews') setReviewForm(initialReview);
    };

    const startEdit = (tabKey, item) => {
        setEditingId({ ...editingId, [tabKey]: item.id });
        if (tabKey === 'bands') setBandForm({ name: item.name, tributeTo: item.tributeTo, description: item.description || '', imageUrl: item.imageUrl || '', videoUrl: item.videoUrl || '' });
        if (tabKey === 'venues') setVenueForm({ name: item.name, location: item.location, capacity: item.capacity || '', contactEmail: item.contactEmail || '', imageUrl: item.imageUrl || '', videoUrl: item.videoUrl || '', description: item.description || '' });
        if (tabKey === 'concerts') setConcertForm({ band_id: item.band_id, venue_id: item.venue_id, date: item.date, ticketUrl: item.ticketUrl || '', videoUrl: item.videoUrl || '', description: item.description || '' });
        if (tabKey === 'reviews') setReviewForm({ author: item.author, text: item.text, concert_label: item.concert_label || '', concert_id: item.concert_id || '', subscriber_email: item.subscriber_email || '', stars: item.stars || 5, visible: item.visible !== 0 });
    };

    const inputStyle = { width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '5px', background: 'rgba(0,0,0,0.3)', color: 'white', border: '1px solid var(--glass-border)' };

    const handleLogout = async () => {
        await fetch('/api/auth', { method: 'DELETE' });
        router.replace('/login');
    };

    if (checkingAuth || !authenticated) {
        return (
            <div className="container animate-fade-in" style={{ padding: '80px 20px', textAlign: 'center' }}>
                <p>Verificando acceso...</p>
            </div>
        );
    }

    return (
        <div className="container animate-fade-in" style={{ padding: '160px 20px 40px', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div></div>
                <h1 style={{ textAlign: 'center', color: 'var(--accent)', margin: 0 }}>Panel del Promotor</h1>
                <button onClick={handleLogout} style={{ background: 'transparent', color: '#ff6b6b', border: '1px solid #ff6b6b', padding: '6px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>
                    Cerrar Sesión
                </button>
            </div>
            <p style={{ textAlign: 'center', marginBottom: '40px', color: 'var(--text-secondary)' }}>
                Gestión de bases de datos para bandas, salas y conciertos.
            </p>

            {notification && (
                <div style={{
                    padding: '12px 20px',
                    marginBottom: '20px',
                    borderRadius: '6px',
                    background: notification.type === 'success' ? 'rgba(80,200,120,0.15)' : 'rgba(255,100,100,0.15)',
                    border: `1px solid ${notification.type === 'success' ? '#50c878' : '#ff6b6b'}`,
                    color: notification.type === 'success' ? '#50c878' : '#ff6b6b',
                    textAlign: 'center',
                    fontWeight: 500,
                }}>
                    {notification.message}
                </div>
            )}

            {pendingDelete && (
                <div style={{
                    padding: '12px 20px',
                    marginBottom: '20px',
                    borderRadius: '6px',
                    background: 'rgba(255,165,0,0.1)',
                    border: '1px solid orange',
                    color: 'orange',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '16px',
                }}>
                    <span>¿Eliminar este elemento?</span>
                    <button onClick={confirmDelete} style={{ background: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 14px', cursor: 'pointer', fontWeight: 600 }}>Sí</button>
                    <button onClick={() => setPendingDelete(null)} style={{ background: 'transparent', color: 'orange', border: '1px solid orange', borderRadius: '4px', padding: '4px 14px', cursor: 'pointer' }}>No</button>
                </div>
            )}

            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {['bands', 'venues', 'concerts', 'messages', 'subscribers', 'reviews'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className="btn-primary"
                        style={{
                            background: activeTab === tab ? 'var(--accent)' : 'transparent',
                            color: activeTab === tab ? '#0b0c10' : 'var(--accent)',
                            padding: '8px 20px',
                            fontSize: '0.9rem'
                        }}
                    >
                        {tab === 'bands' ? 'Bandas' : tab === 'venues' ? 'Salas' : tab === 'concerts' ? 'Conciertos' : tab === 'messages' ? 'Mensajes' : tab === 'subscribers' ? `Newsletter (${subscribers.length})` : 'Reseñas'}
                    </button>
                ))}
            </div>

            <div className="glass-panel" style={{ padding: '30px' }}>
                {activeTab === 'bands' && (
                    <div>
                        <h2>{editingId.bands ? 'Editar Banda' : 'Añadir Banda'}</h2>
                        <form onSubmit={(e) => handleEntitySubmit(e, 'Banda', '/api/bands', bandForm, 'bands')} style={{ marginTop: '20px' }}>
                            <input style={inputStyle} type="text" placeholder="Nombre (ej. Mecano Revival)" required value={bandForm.name} onChange={e => setBandForm({ ...bandForm, name: e.target.value })} />
                            <input style={inputStyle} type="text" placeholder="Tributo a (ej. Meccano)" required value={bandForm.tributeTo} onChange={e => setBandForm({ ...bandForm, tributeTo: e.target.value })} />
                            <input style={inputStyle} type="text" placeholder="URL de la imagen (opcional)" value={bandForm.imageUrl} onChange={e => setBandForm({ ...bandForm, imageUrl: e.target.value })} />
                            <input style={inputStyle} type="text" placeholder="URL del vídeo (mp4/webm) (opcional)" value={bandForm.videoUrl} onChange={e => setBandForm({ ...bandForm, videoUrl: e.target.value })} />
                            <textarea style={{ ...inputStyle, resize: 'vertical' }} rows="3" placeholder="Descripción" value={bandForm.description} onChange={e => setBandForm({ ...bandForm, description: e.target.value })}></textarea>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="submit" className="btn-primary">{editingId.bands ? 'Actualizar Banda' : 'Guardar Banda'}</button>
                                {editingId.bands && <button type="button" onClick={() => cancelEdit('bands')} className="btn-primary" style={{ background: 'transparent', color: 'gray', borderColor: 'gray' }}>Cancelar</button>}
                            </div>
                        </form>

                        <h3 style={{ marginTop: '40px', marginBottom: '20px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>Bandas Registradas</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {bands.map(b => (
                                <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '5px' }}>
                                    <div>
                                        <strong>{b.name}</strong> <span style={{ color: 'var(--accent)', fontSize: '0.9rem' }}>(Tributo a {b.tributeTo})</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button onClick={() => startEdit('bands', b)} style={{ background: 'transparent', color: '#4da6ff', border: 'none', cursor: 'pointer' }}>Editar</button>
                                        <button onClick={() => handleDelete('/api/bands', b.id)} style={{ background: 'transparent', color: '#ff4d4d', border: 'none', cursor: 'pointer' }}>Eliminar</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'venues' && (
                    <div>
                        <h2>{editingId.venues ? 'Editar Sala' : 'Añadir Sala'}</h2>
                        <form onSubmit={(e) => handleEntitySubmit(e, 'Sala', '/api/venues', venueForm, 'venues')} style={{ marginTop: '20px' }}>
                            <input style={inputStyle} type="text" placeholder="Nombre de la Sala" required value={venueForm.name} onChange={e => setVenueForm({ ...venueForm, name: e.target.value })} />
                            <input style={inputStyle} type="text" placeholder="Ubicación" required value={venueForm.location} onChange={e => setVenueForm({ ...venueForm, location: e.target.value })} />
                            <input style={inputStyle} type="number" placeholder="Capacidad" required value={venueForm.capacity} onChange={e => setVenueForm({ ...venueForm, capacity: e.target.value })} />
                            <input style={inputStyle} type="text" placeholder="URL de la imagen (opcional)" value={venueForm.imageUrl} onChange={e => setVenueForm({ ...venueForm, imageUrl: e.target.value })} />
                            <input style={inputStyle} type="text" placeholder="URL del vídeo (mp4/webm) (opcional)" value={venueForm.videoUrl} onChange={e => setVenueForm({ ...venueForm, videoUrl: e.target.value })} />
                            <textarea style={{ ...inputStyle, resize: 'vertical' }} rows="3" placeholder="Descripción del espacio" value={venueForm.description} onChange={e => setVenueForm({ ...venueForm, description: e.target.value })}></textarea>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="submit" className="btn-primary">{editingId.venues ? 'Actualizar Sala' : 'Guardar Sala'}</button>
                                {editingId.venues && <button type="button" onClick={() => cancelEdit('venues')} className="btn-primary" style={{ background: 'transparent', color: 'gray', borderColor: 'gray' }}>Cancelar</button>}
                            </div>
                        </form>

                        <h3 style={{ marginTop: '40px', marginBottom: '20px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>Salas Registradas</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {venues.map(v => (
                                <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '5px' }}>
                                    <div>
                                        <strong>{v.name}</strong> <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>({v.location})</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button onClick={() => startEdit('venues', v)} style={{ background: 'transparent', color: '#4da6ff', border: 'none', cursor: 'pointer' }}>Editar</button>
                                        <button onClick={() => handleDelete('/api/venues', v.id)} style={{ background: 'transparent', color: '#ff4d4d', border: 'none', cursor: 'pointer' }}>Eliminar</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'concerts' && (
                    <div>
                        <h2>{editingId.concerts ? 'Editar Concierto' : 'Programar Concierto'}</h2>
                        <form onSubmit={(e) => handleEntitySubmit(e, 'Concierto', '/api/concerts', concertForm, 'concerts')} style={{ marginTop: '20px' }}>
                            <select style={inputStyle} required value={concertForm.band_id} onChange={e => setConcertForm({ ...concertForm, band_id: e.target.value })}>
                                <option value="" disabled style={{ color: 'gray' }}>Selecciona una Banda</option>
                                {bands.map(b => <option key={b.id} value={b.id} style={{ background: '#1f2833' }}>{b.name}</option>)}
                            </select>

                            <select style={inputStyle} required value={concertForm.venue_id} onChange={e => setConcertForm({ ...concertForm, venue_id: e.target.value })}>
                                <option value="" disabled style={{ color: 'gray' }}>Selecciona una Sala</option>
                                {venues.map(v => <option key={v.id} value={v.id} style={{ background: '#1f2833' }}>{v.name}</option>)}
                            </select>

                            <input style={inputStyle} type="datetime-local" required step="any" min="2000-01-01T00:00" max="2099-12-31T23:59" value={concertForm.date} onChange={e => setConcertForm({ ...concertForm, date: e.target.value })} />
                            <input style={inputStyle} type="url" placeholder="URL de venta de entradas (opcional)" value={concertForm.ticketUrl} onChange={e => setConcertForm({ ...concertForm, ticketUrl: e.target.value })} />
                            <input style={inputStyle} type="text" placeholder="URL del vídeo promocional (opcional)" value={concertForm.videoUrl} onChange={e => setConcertForm({ ...concertForm, videoUrl: e.target.value })} />
                            <textarea style={{ ...inputStyle, resize: 'vertical' }} rows="3" placeholder="Descripción del concierto" value={concertForm.description} onChange={e => setConcertForm({ ...concertForm, description: e.target.value })}></textarea>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="submit" className="btn-primary">{editingId.concerts ? 'Actualizar Concierto' : 'Programar Concierto'}</button>
                                {editingId.concerts && <button type="button" onClick={() => cancelEdit('concerts')} className="btn-primary" style={{ background: 'transparent', color: 'gray', borderColor: 'gray' }}>Cancelar</button>}
                            </div>
                        </form>

                        <h3 style={{ marginTop: '40px', marginBottom: '20px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>Conciertos Programados</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {concerts.map(c => (
                                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '5px' }}>
                                    <div>
                                        <strong>{c.bandName}</strong> <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>en {c.venueName} - {new Date(c.date).toLocaleDateString()}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button onClick={() => startEdit('concerts', c)} style={{ background: 'transparent', color: '#4da6ff', border: 'none', cursor: 'pointer' }}>Editar</button>
                                        <button onClick={() => handleDelete('/api/concerts', c.id)} style={{ background: 'transparent', color: '#ff4d4d', border: 'none', cursor: 'pointer' }}>Eliminar</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'messages' && (
                    <div>
                        <h2>Mensajes de Contacto</h2>
                        <h3 style={{ marginTop: '20px', marginBottom: '20px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>Bandeja de Entrada</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {messages.length === 0 ? (
                                <p style={{ color: 'gray' }}>No hay mensajes nuevos.</p>
                            ) : messages.map(msg => (
                                <div key={msg.id} style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '5px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                                <strong style={{ fontSize: '1.2rem', color: 'var(--accent)' }}>{msg.senderName}</strong>
                                                <span style={{ color: 'gray', fontSize: '0.9rem' }}>{"<"}{msg.senderEmail}{">"}</span>
                                                {msg.subscriber_id && (
                                                    <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '10px', background: 'rgba(197,160,89,0.15)', color: '#C5A059' }}>
                                                        👤 Suscriptor
                                                    </span>
                                                )}
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: '#4da6ff', marginTop: '5px', textTransform: 'uppercase', letterSpacing: '1px' }}>Asunto: {msg.type}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'gray', marginTop: '2px' }}>Recibido: {new Date(msg.created_at).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' })}</div>
                                        </div>
                                        <button onClick={() => handleDelete('/api/contact', msg.id)} style={{ background: 'transparent', color: '#ff4d4d', border: 'none', cursor: 'pointer', padding: '5px 10px', fontWeight: 'bold' }}>Eliminar</button>
                                    </div>
                                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', whiteSpace: 'pre-wrap', margin: 0, marginTop: '10px' }}>{msg.message}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'subscribers' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0 }}>Suscriptores Newsletter</h2>
                            <span style={{ background: 'rgba(197,160,89,0.15)', color: 'var(--accent)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 600 }}>
                                {subscribers.length} suscriptor{subscribers.length !== 1 ? 'es' : ''}
                            </span>
                        </div>

                        {subscribers.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'gray' }}>
                                <p style={{ fontSize: '2rem', marginBottom: '10px' }}>📭</p>
                                <p>Aún no hay suscriptores. ¡Comparte el formulario en redes sociales!</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {subscribers.map(s => (
                                    <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '14px 18px', borderRadius: '8px', gap: '12px' }}>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <strong style={{ color: 'var(--accent)' }}>{s.email}</strong>
                                            {s.name && <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginLeft: '12px' }}>{s.name}</span>}
                                            <div style={{ fontSize: '0.8rem', color: 'gray', marginTop: '4px' }}>
                                                Se suscribió: {new Date(s.subscribed_at).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' })}
                                            </div>
                                        </div>
                                        <button onClick={() => handleDelete('/api/newsletter', s.id)} style={{ background: 'transparent', color: '#ff4d4d', border: 'none', cursor: 'pointer', padding: '4px 10px', fontWeight: 'bold', flexShrink: 0 }}>Eliminar</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                {activeTab === 'reviews' && (
                    <div>
                        <h2>{editingId.reviews ? 'Editar Reseña' : 'Añadir Reseña'}</h2>
                        <form onSubmit={(e) => handleEntitySubmit(e, 'Reseña', '/api/reviews', reviewForm, 'reviews')} style={{ marginTop: '20px' }}>
                            <input style={inputStyle} type="text" placeholder="Autor (ej. María L.)" required value={reviewForm.author} onChange={e => setReviewForm({ ...reviewForm, author: e.target.value })} />
                            <textarea style={{ ...inputStyle, resize: 'vertical' }} rows="3" placeholder="Texto de la reseña" required value={reviewForm.text} onChange={e => setReviewForm({ ...reviewForm, text: e.target.value })} />
                            <input style={inputStyle} type="text" placeholder="Etiqueta del concierto (texto libre, ej. Tributo a Mecano)" value={reviewForm.concert_label} onChange={e => setReviewForm({ ...reviewForm, concert_label: e.target.value })} />

                            {/* Enlazar con concierto de la BD (opcional) */}
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Vincular concierto de la BD (opcional):</label>
                            <select style={inputStyle} value={reviewForm.concert_id} onChange={e => setReviewForm({ ...reviewForm, concert_id: e.target.value })}>
                                <option value="" style={{ background: '#1f2833' }}>— Sin vincular —</option>
                                {concerts.map(c => (
                                    <option key={c.id} value={c.id} style={{ background: '#1f2833' }}>
                                        {c.bandName} @ {c.venueName} ({c.date ? new Date(c.date).toLocaleDateString('es-ES') : 'sin fecha'})
                                    </option>
                                ))}
                            </select>

                            {/* Enlazar con suscriptor (opcional) */}
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Email del suscriptor (opcional — se vinculará si coincide con uno registrado):</label>
                            <input style={inputStyle} type="email" placeholder="email@ejemplo.com" value={reviewForm.subscriber_email} onChange={e => setReviewForm({ ...reviewForm, subscriber_email: e.target.value })} />
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '15px' }}>
                                <div>
                                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginRight: '8px' }}>Estrellas:</label>
                                    <select style={{ ...inputStyle, width: 'auto', marginBottom: 0 }} value={reviewForm.stars} onChange={e => setReviewForm({ ...reviewForm, stars: parseInt(e.target.value) })}>
                                        {[5, 4, 3, 2, 1].map(n => <option key={n} value={n} style={{ background: '#1f2833' }}>{'★'.repeat(n)} ({n})</option>)}
                                    </select>
                                </div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    <input type="checkbox" checked={reviewForm.visible} onChange={e => setReviewForm({ ...reviewForm, visible: e.target.checked })} />
                                    Visible en la web
                                </label>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="submit" className="btn-primary">{editingId.reviews ? 'Actualizar Reseña' : 'Publicar Reseña'}</button>
                                {editingId.reviews && <button type="button" onClick={() => cancelEdit('reviews')} className="btn-primary" style={{ background: 'transparent', color: 'gray', borderColor: 'gray' }}>Cancelar</button>}
                            </div>
                        </form>

                        <h3 style={{ marginTop: '40px', marginBottom: '20px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>Reseñas Publicadas</h3>
                        {reviews.length === 0 ? (
                            <p style={{ color: 'gray' }}>Aún no hay reseñas. ¡Añade la primera!</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {reviews.map(r => (
                                    <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '5px', gap: '10px' }}>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '4px' }}>
                                                <strong>{r.author}</strong>
                                                <span style={{ color: '#C5A059', fontSize: '0.9rem' }}>{'★'.repeat(r.stars)}</span>
                                                {r.concert_label && <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>({r.concert_label})</span>}
                                                <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '10px', background: r.visible ? 'rgba(80,200,120,0.15)' : 'rgba(255,100,100,0.15)', color: r.visible ? '#50c878' : '#ff6b6b' }}>
                                                    {r.visible ? 'Visible' : 'Oculta'}
                                                </span>
                                                {r.concert_id && (
                                                    <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '10px', background: 'rgba(77,166,255,0.15)', color: '#4da6ff' }}>
                                                        🎵 {r.concert_band_name} @ {r.concert_venue_name}
                                                    </span>
                                                )}
                                                {r.subscriber_id && (
                                                    <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '10px', background: 'rgba(197,160,89,0.15)', color: '#C5A059' }}>
                                                        👤 Suscriptor: {r.subscriber_email}
                                                    </span>
                                                )}
                                            </div>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, fontStyle: 'italic' }}>{r.text}</p>
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
                                            <button onClick={() => startEdit('reviews', r)} style={{ background: 'transparent', color: '#4da6ff', border: 'none', cursor: 'pointer' }}>Editar</button>
                                            <button onClick={() => handleDelete('/api/reviews', r.id)} style={{ background: 'transparent', color: '#ff4d4d', border: 'none', cursor: 'pointer' }}>Eliminar</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
