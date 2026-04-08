import React, { useState, useEffect } from 'react';

function App() {
  const [cartas, setCartas] = useState([]);
  const [tipo, setTipo] = useState('arma');
  const [nombre, setNombre] = useState('');
  const [equipo, setEquipo] = useState('amantes');
  const [poder, setPoder] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const API_URL = "https://computacionbackend-cxbbheaegpb2agd3.spaincentral-01.azurewebsites.net";

  const obtenerCartas = async () => {
    try {
      const res = await fetch(`${API_URL}/cartas`);
      const data = await res.json();
      setCartas(data);
    } catch (err) {
      console.error("Error al obtener cartas:", err);
    }
  };

  const crearCarta = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/cartas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo,
          nombre,
          equipo,
          poder: parseInt(poder, 10),
          descripcion
        })
      });

      if (!res.ok) {
        throw new Error("No se pudo crear la carta");
      }

      setTipo('arma');
      setNombre('');
      setEquipo('amantes');
      setPoder('');
      setDescripcion('');
      obtenerCartas();
    } catch (err) {
      console.error("Error al crear carta:", err);
    }
  };

  const eliminarCarta = async (id) => {
    const confirmar = window.confirm(`¿Seguro que quieres eliminar la carta con id ${id}?`);
    if (!confirmar) return;

    try {
      const res = await fetch(`${API_URL}/cartas/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error("No se pudo eliminar la carta");
      }

      obtenerCartas();
    } catch (err) {
      console.error("Error al eliminar carta:", err);
    }
  };

  useEffect(() => {
    obtenerCartas();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>Gestión de Cartas</h1>

      <form onSubmit={crearCarta} style={{ marginBottom: '30px' }}>
        <div style={{ marginBottom: '12px' }}>
          <label>
            Tipo:
            <br />
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            >
              <option value="arma">Arma</option>
              <option value="jugador">Jugador</option>
            </select>
          </label>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>
            Nombre:
            <br />
            <input
              type="text"
              placeholder="Nombre de la carta"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>
            Equipo:
            <br />
            <select
              value={equipo}
              onChange={(e) => setEquipo(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            >
              <option value="amantes">Amantes</option>
              <option value="botillo">Botillo</option>
            </select>
          </label>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>
            Poder:
            <br />
            <input
              type="number"
              placeholder="Poder"
              value={poder}
              onChange={(e) => setPoder(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label>
            Descripción:
            <br />
            <textarea
              placeholder="Escribe una descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
              rows="5"
              style={{ width: '100%', padding: '8px', marginTop: '4px', resize: 'vertical' }}
            />
          </label>
        </div>

        <button type="submit" style={{ padding: '10px 16px' }}>
          Crear carta
        </button>
      </form>

      <h2>Lista de Cartas</h2>

      {cartas.length === 0 ? (
        <p>No hay cartas creadas todavía.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {cartas.map((carta) => (
            <li
              key={carta.id}
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '16px'
              }}
            >
              <strong>{carta.nombre}</strong>
              <br />
              ID: {carta.id}
              <br />
              Tipo: {carta.tipo}
              <br />
              Equipo: {carta.equipo}
              <br />
              Poder: {carta.poder}
              <br />
              Descripción:
              <br />
              <span style={{ whiteSpace: 'pre-wrap' }}>{carta.descripcion}</span>
              <br />
              <br />
              <button onClick={() => eliminarCarta(carta.id)}>
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;