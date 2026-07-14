import { useEffect, useMemo, useState } from 'react';
import './App.css';
import Buscador from './components/Buscador';
import ListaPersonajes from './components/ListaPersonajes';
import type { ApiPersonaje, Personaje } from './types/Personaje';

const shenLongArtwork = new URL('../Shen_Long_Artwork.png', import.meta.url).href;
const esferaDragon = new URL('../esfera_del_dragon_de_1_estrella_render_hd_png_by_todoanimeoficial_d92t5g9-fullview.png', import.meta.url).href;

const API_URL = 'https://dragonball-api.com/api/characters?limit=1000';

function normalizarPersonaje(personajeApi: ApiPersonaje, indice: number): Personaje {
  return {
    id: String(personajeApi.id ?? personajeApi._id ?? indice),
    nombre: personajeApi.name ?? personajeApi.Nombre ?? personajeApi.nombre ?? 'Sin nombre',
    imagen: personajeApi.image ?? personajeApi.Imagen ?? personajeApi.imagen ?? '',
    raza: personajeApi.race ?? personajeApi.Raza ?? personajeApi.raza ?? 'Sin información',
    ki: personajeApi.ki ?? personajeApi.Ki ?? 'Sin información',
    afiliacion:
      personajeApi.affiliation ?? personajeApi.Afiliacion ?? personajeApi.afiliacion ?? 'Sin información',
  };
}

function obtenerArregloPersonajes(data: unknown): ApiPersonaje[] {
  if (Array.isArray(data)) {
    return data as ApiPersonaje[];
  }

  if (typeof data === 'object' && data !== null) {
    const respuesta = data as {
      items?: ApiPersonaje[];
      docs?: ApiPersonaje[];
      results?: ApiPersonaje[];
      personajes?: ApiPersonaje[];
    };

    return respuesta.items ?? respuesta.docs ?? respuesta.results ?? respuesta.personajes ?? [];
  }

  return [];
}

function App() {
  const [personajes, setPersonajes] = useState<Personaje[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [textoBusqueda, setTextoBusqueda] = useState<string>('');
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [mostrarSoloFavoritos, setMostrarSoloFavoritos] = useState<boolean>(false);
  const [ordenAscendente, setOrdenAscendente] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<'nombre' | 'ki'>('nombre');
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const t = localStorage.getItem('theme');
      return (t === 'light' ? 'light' : 'dark');
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    try {
      const almacenados = localStorage.getItem('favoritos');
      if (almacenados) {
        setFavoritos(JSON.parse(almacenados));
      }
    } catch {
      setFavoritos([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('theme', theme);
    } catch {}

    document.body.classList.toggle('theme-light', theme === 'light');
    document.body.classList.toggle('theme-dark', theme === 'dark');
  }, [theme]);

  function toggleFavorito(id: string) {
    setFavoritos((prev) => {
      const existe = prev.includes(id);
      const siguiente = existe ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem('favoritos', JSON.stringify(siguiente));
      } catch {
        // ignore storage errors
      }
      return siguiente;
    });
  }

  function toggleMostrarSoloFavoritos() {
    setMostrarSoloFavoritos((v) => !v);
  }

  function toggleOrden() {
    setOrdenAscendente((v) => !v);
  }

  function setThemeTo(t: 'dark' | 'light') {
    setTheme(t);
  }

  const [detalleId, setDetalleId] = useState<string | null>(null);
  const [detalleData, setDetalleData] = useState<any | null>(null);
  const [detalleCargando, setDetalleCargando] = useState<boolean>(false);
  const [detalleError, setDetalleError] = useState<string>('');

  async function abrirDetalle(id: string) {
    setDetalleId(id);
    setDetalleData(null);
    setDetalleError('');
    setDetalleCargando(true);

    try {
      const resp = await fetch(`https://dragonball-api.com/api/characters/${id}`);
      if (!resp.ok) throw new Error('No se pudo obtener el detalle del personaje.');
      const json = await resp.json();
      // API may return { items: [...] } or an object
      const item = Array.isArray(json) ? json[0] : json.items ? json.items[0] : json;
      setDetalleData(item ?? json);
    } catch (e) {
      setDetalleError(e instanceof Error ? e.message : String(e));
    } finally {
      setDetalleCargando(false);
    }
  }

  function cerrarDetalle() {
    setDetalleId(null);
    setDetalleData(null);
    setDetalleError('');
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') cerrarDetalle();
    }

    if (detalleId) {
      window.addEventListener('keydown', onKey);
    }

    return () => {
      window.removeEventListener('keydown', onKey);
    };
  }, [detalleId]);

  const detalleExcludedKeys = new Set([
    'name',
    'image',
    'description',
    'descripcion',
    'race',
    'Raza',
    'raza',
    'gender',
    'ki',
    'Ki',
    'maxKi',
    'affiliation',
    'Afiliacion',
  ]);

  const detalleExtraEntries = detalleData
    ? Object.entries(detalleData).filter(([k]) => !detalleExcludedKeys.has(k))
    : [];

  const detalle_description = detalleData?.description ?? detalleData?.descripcion ?? '';
  const detalle_race = detalleData?.race ?? detalleData?.Raza ?? detalleData?.raza ?? '';
  const detalle_gender = detalleData?.gender ?? '';
  const detalle_ki = detalleData?.ki ?? detalleData?.Ki ?? '';
  const detalle_maxKi = detalleData?.maxKi ?? '';
  const detalle_affiliation = detalleData?.affiliation ?? detalleData?.Afiliacion ?? '';
  const detalle_transformaciones = detalleData?.transformations ?? detalleData?.transformaciones ?? detalleData?.transformationsList ?? [];

  function parseKiToNumber(ki?: string): number {
    if (!ki) return NaN;
    // try to extract a numeric portion like "60.000.000" or "5,000,000"
    const match = String(ki).match(/[0-9.,]+/);
    if (!match) return NaN;
    // remove thousand separators (dots), replace comma with dot for decimals
    const cleaned = match[0].replace(/\./g, '').replace(/,/g, '.');
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : NaN;
  }

  useEffect(() => {
    async function cargarPersonajes() {
      try {
        setCargando(true);
        setError('');

        const respuesta = await fetch(API_URL);

        if (!respuesta.ok) {
          throw new Error('La API no respondió correctamente.');
        }

        const data: unknown = await respuesta.json();
        const personajesApi = obtenerArregloPersonajes(data);

        if (personajesApi.length === 0) {
          throw new Error('La API no entregó personajes.');
        }

        const personajesNormalizados = personajesApi.map(normalizarPersonaje);
        setPersonajes(personajesNormalizados);
      } catch (errorDesconocido) {
        const mensaje =
          errorDesconocido instanceof Error
            ? errorDesconocido.message
            : 'Ocurrió un error inesperado.';

        setError(mensaje);
      } finally {
        setCargando(false);
      }
    }

    cargarPersonajes();
  }, []);

  const personajesFiltrados = useMemo(() => {
    const busqueda = textoBusqueda.trim().toLowerCase();

    let resultado = personajes.filter((personaje) => personaje.nombre.toLowerCase().includes(busqueda));

    if (mostrarSoloFavoritos) {
      resultado = resultado.filter((p) => favoritos.includes(p.id));
    }

    if (sortBy === 'nombre') {
      resultado = resultado.sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else {
      resultado = resultado.sort((a, b) => {
        const va = parseKiToNumber(a.ki);
        const vb = parseKiToNumber(b.ki);

        const aIsNaN = Number.isNaN(va);
        const bIsNaN = Number.isNaN(vb);

        if (aIsNaN && bIsNaN) return a.nombre.localeCompare(b.nombre);
        if (aIsNaN) return 1;
        if (bIsNaN) return -1;

        return va - vb;
      });
    }

    if (!ordenAscendente) {
      resultado = resultado.reverse();
    }

    return resultado;
  }, [personajes, textoBusqueda, favoritos, mostrarSoloFavoritos, ordenAscendente, sortBy]);

  function limpiarBusqueda() {
    setTextoBusqueda('');
  }

  return (
    <main className="app">
      <header className="header">
        <div className="header-title-row">
          <img src={shenLongArtwork} alt="Shen Long" className="header-icon" />
          <h1>Directorio Dragon Ball Z</h1>
          <img src={esferaDragon} alt="Esfera del Dragón" className="header-icon" />
        </div>
        <p>Consulta personajes de Dragon Ball Z desde la API pública oficial.</p>
      </header>

      <section className="contenido">
        <Buscador
          textoBusqueda={textoBusqueda}
          setTextoBusqueda={setTextoBusqueda}
          limpiarBusqueda={limpiarBusqueda}
        />

        <div className="controls-row">
          <div className="contador">
            <span>Total cargados: {personajes.length}</span>
            <span>Resultados encontrados: {personajesFiltrados.length}</span>
            <span>Favoritos: {favoritos.length}</span>
          </div>

          <div className="controls">
            <button
              type="button"
              className={`control-btn ${mostrarSoloFavoritos ? 'active' : ''}`}
              onClick={toggleMostrarSoloFavoritos}
            >
              {mostrarSoloFavoritos ? 'Mostrar todos' : 'Mostrar favoritos'}
            </button>

            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#ffd84c', fontWeight: 700 }}>Ordenar por</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'nombre' | 'ki')}
                className="control-select"
              >
                <option value="nombre">Nombre</option>
                <option value="ki">Ki</option>
              </select>
            </label>

            <button
              type="button"
              className="control-btn"
              onClick={toggleOrden}
              title="Alternar orden ascendente/descendente"
            >
              Orden: {ordenAscendente ? 'Asc' : 'Desc'}
            </button>
            
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#ffd84c', fontWeight: 700 }}>Tema</span>
              <select
                value={theme}
                onChange={(e) => setThemeTo(e.target.value as 'dark' | 'light')}
                className="control-select"
              >
                <option value="dark">Oscuro</option>
                <option value="light">Claro</option>
              </select>
            </label>
          </div>
        </div>

        {cargando && <p className="mensaje-info">Cargando personajes...</p>}
        {error && <p className="mensaje-error">{error}</p>}
        {!cargando && !error && (
          <ListaPersonajes
            personajes={personajesFiltrados}
            favoritos={favoritos}
            toggleFavorito={toggleFavorito}
            onSelect={abrirDetalle}
          />
        )}
      </section>

      {detalleId && (
        <div className="detalle-overlay" onClick={cerrarDetalle} role="dialog" aria-modal="true">
          <div className="detalle-card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="detalle-close"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                cerrarDetalle();
              }}
              aria-label="Cerrar detalle"
            >
              ✕
            </button>

            {detalleCargando && <p className="mensaje-info">Cargando detalle...</p>}
            {detalleError && <p className="mensaje-error">{detalleError}</p>}

            {detalleData && (
              <div>
                <div className="detalle-grid">
                  <div>
                    {detalleData.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={detalleData.image} alt={detalleData.name ?? 'Imagen'} className="detalle-imagen" />
                    )}
                  </div>

                  <div>
                    <h2 style={{ margin: 0, color: '#ffd84c' }}>{detalleData.name ?? detalleData.nombre}</h2>
                    {detalle_description && <p className="detalle-description">{detalle_description}</p>}

                    <div className="detalle-stats">
                      {detalle_race && (
                        <div className="stat">
                          <strong>Raza</strong>
                          <div>{detalle_race}</div>
                        </div>
                      )}
                      {detalle_gender && (
                        <div className="stat">
                          <strong>Género</strong>
                          <div>{detalle_gender}</div>
                        </div>
                      )}
                      {detalle_ki && (
                        <div className="stat">
                          <strong>Ki</strong>
                          <div>{detalle_ki}</div>
                        </div>
                      )}
                      {detalle_maxKi && (
                        <div className="stat">
                          <strong>Max Ki</strong>
                          <div>{detalle_maxKi}</div>
                        </div>
                      )}
                      {detalle_affiliation && (
                        <div className="stat">
                          <strong>Afiliación</strong>
                          <div>{detalle_affiliation}</div>
                        </div>
                      )}
                    </div>

                    <div className="detalle-transformations" style={{ marginTop: '20px' }}>
                      <h3 style={{ margin: '0 0 10px 0', color: '#ffd84c' }}>Transformaciones</h3>
                      {detalle_transformaciones.length > 0 ? (
                        <ul style={{ margin: 0, paddingLeft: '20px', color: '#e0e0e0' }}>
                          {detalle_transformaciones.map((transformation: any, idx: number) => (
                            <li key={idx} style={{ marginBottom: '8px' }}>
                              {typeof transformation === 'string'
                                ? transformation
                                : transformation?.name ||
                                  transformation?.nombre ||
                                  transformation?.Nombre ||
                                  'Transformación desconocida'}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p style={{ color: '#ffd84c', fontStyle: 'italic', margin: 0 }}>Sin transformaciones</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
