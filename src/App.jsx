import React, { useState, useEffect } from 'react';

function App() {
  const [equipos, setEquipos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [jugadores, setJugadores] = useState('');
  const [puntos, setPuntos] = useState('');

  const API_URL = "https://computacionbackend-cxbbheaegpb2agd3.spaincentral-01.azurewebsites.net";

  const obtenerEquipos = async () => {
    try {
      const res = await fetch(`${API_URL}/equipos`);
      const data = await res.json();
      setEquipos(data);
    } catch (err) {
      console.error("Error al obtener equipos:", err);
    }
  };

  const crearEquipo = async (e) => {
    e.preventDefault();

    const jugadoresArray = jugadores
      .split(',')
      .map(j => j.trim())
      .filter(j => j !== '');

    try {
      const res = await fetch(`${API_URL}/equipos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          jugadores: jugadoresArray,
          puntos: parseInt(puntos, 10)
        })
      });

      if (!res.ok) {
        throw new Error("No se pudo crear el equipo");
      }

      setNombre('');
      setJugadores('');
      setPuntos('');
      obtenerEquipos();
    } catch (err) {
      console.error("Error al crear equipo:", err);
    }
  };

  const eliminarEquipo = async (id) => {
    const confirmar = window.confirm(`¿Seguro que quieres eliminar el equipo con id ${id}?`);
    if (!confirmar) return;

    try {
      const res = await fetch(`${API_URL}/equipos/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error("No se pudo eliminar el equipo");
      }

      obtenerEquipos();
    } catch (err) {
      console.error("Error al eliminar equipo:", err);
    }
  };

  useEffect(() => {
    obtenerEquipos();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Gestión de Equipos</h1>

      <form onSubmit={crearEquipo} style={{ marginBottom: '30px' }}>
        <div>
          <input
            type="text"
            placeholder="Nombre del equipo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div>
          <input
            type="text"
            placeholder="Jugadores separados por comas"
            value={jugadores}
            onChange={(e) => setJugadores(e.target.value)}
            required
          />
        </div>

        <div>
          <input
            type="number"
            placeholder="Puntos"
            value={puntos}
            onChange={(e) => setPuntos(e.target.value)}
            required
          />
        </div>

        <button type="submit">Crear equipo</button>
      </form>

      <h2>Ranking de Equipos</h2>
      <ul>
        {equipos.map((equipo, index) => (
          <li key={equipo.id} style={{ marginBottom: '15px' }}>
            <strong>
              #{index + 1} - {equipo.nombre}
            </strong>
            <br />
            ID: {equipo.id}
            <br />
            Puntos: {equipo.puntos}
            <br />
            Jugadores: {equipo.jugadores?.join(', ')}
            <br />
            <button onClick={() => eliminarEquipo(equipo.id)}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;