import type { Personaje } from '../types/Personaje';
import PersonajeCard from './PersonajeCard';

interface ListaPersonajesProps {
  personajes: Personaje[];
  favoritos: string[];
  toggleFavorito: (id: string) => void;
  onSelect: (id: string) => void;
}

function ListaPersonajes({ personajes, favoritos, toggleFavorito, onSelect }: ListaPersonajesProps) {
  if (personajes.length === 0) {
    return <p className="mensaje-info">No se encontraron personajes.</p>;
  }

  return (
    <section className="lista-personajes" aria-label="Lista de personajes">
      {personajes.map((personaje) => (
        <PersonajeCard
          key={personaje.id}
          personaje={personaje}
          isFavorito={favoritos.includes(personaje.id)}
          onToggleFavorito={toggleFavorito}
          onSelect={() => onSelect(personaje.id)}
        />
      ))}
    </section>
  );
}

export default ListaPersonajes;
