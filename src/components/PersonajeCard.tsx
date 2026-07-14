import type { Personaje } from '../types/Personaje';

interface PersonajeCardProps {
  personaje: Personaje;
  isFavorito: boolean;
  onToggleFavorito: (id: string) => void;
  onSelect?: () => void;
}

function PersonajeCard({ personaje, isFavorito, onToggleFavorito, onSelect }: PersonajeCardProps) {
  const imagenPorDefecto = 'https://upload.wikimedia.org/wikipedia/en/0/02/Homer_Simpson_2006.png';

  return (
    <article className="personaje-card" onClick={() => onSelect && onSelect()} role={onSelect ? 'button' : undefined} tabIndex={onSelect ? 0 : undefined} onKeyDown={(e) => {
      if (onSelect && (e.key === 'Enter' || e.key === ' ')) onSelect();
    }}>
      <div className="imagen-contenedor">
        <button
          type="button"
          className={`favorito-btn ${isFavorito ? 'activo' : ''}`}
          aria-pressed={isFavorito}
          aria-label={isFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          onClick={() => onToggleFavorito(personaje.id)}
        >
          {isFavorito ? '★' : '☆'}
        </button>

        <img
          src={personaje.imagen || imagenPorDefecto}
          alt={`Imagen de ${personaje.nombre}`}
          className="personaje-imagen"
          onError={(evento) => {
            evento.currentTarget.src = imagenPorDefecto;
          }}
        />
      </div>

      <div className="personaje-info">
        <h2>{personaje.nombre}</h2>
        <p>
          <strong>Raza:</strong> {personaje.raza || 'Sin información'}
        </p>
        <p>
          <strong>Ki:</strong> {personaje.ki || 'Sin información'}
        </p>
        <p>
          <strong>Afiliación:</strong> {personaje.afiliacion || 'Sin información'}
        </p>
      </div>
    </article>
  );
}

export default PersonajeCard;
