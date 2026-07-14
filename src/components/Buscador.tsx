interface BuscadorProps {
  textoBusqueda: string;
  setTextoBusqueda: (texto: string) => void;
  limpiarBusqueda: () => void;
}

function Buscador({ textoBusqueda, setTextoBusqueda, limpiarBusqueda }: BuscadorProps) {
  return (
    <section className="buscador-contenedor" aria-label="Buscador de personajes">
      <input
        className="buscador-input"
        type="text"
        placeholder="Buscar personaje, por ejemplo: Bulma"
        value={textoBusqueda}
        onChange={(evento) => setTextoBusqueda(evento.target.value)}
      />

      <button className="boton-limpiar" type="button" onClick={limpiarBusqueda}>
        Limpiar
      </button>
    </section>
  );
}

export default Buscador;
