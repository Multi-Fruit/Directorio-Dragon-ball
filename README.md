# Directorio Dragon Ball con React + TypeScript

Proyecto creado para desarrollar la guía de evaluación formativa basada en consumo de API REST, componentes, estados, búsqueda y manejo de errores.

## Ejecutar

```bash
npm install
npm run dev
```

Luego abre la URL local que entrega Vite, normalmente `http://localhost:5173`.

## Estructura principal

```text
src/
  components/
    Buscador.tsx
    ListaPersonajes.tsx
    PersonajeCard.tsx
  types/
    Personaje.ts
  App.tsx
  App.css
  main.tsx
  index.css
```

## Funcionalidades incluidas

- Consumo de API con `fetch`.
- Uso de `async/await`.
- Estados con `useState`.
- Renderizado de personajes con `map`.
- Búsqueda por nombre con `filter` e `includes`.
- Manejo de carga, errores y ausencia de resultados.
- Contador de personajes cargados y resultados encontrados.
- Botón para limpiar búsqueda.
- Orden alfabético.
- Diseño responsive con colores inspirados en Dragon ball Z.
