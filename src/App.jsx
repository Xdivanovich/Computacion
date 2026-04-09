import React, { useState, useEffect } from 'react';

function App() {
  const [cartas, setCartas] = useState([]);
  const [tipoCarta, setTipoCarta] = useState('arma');
  const [nombre, setNombre] = useState('');
  const [equipo, setEquipo] = useState('amantes');
  const [poder, setPoder] = useState('');
  const [bonificador, setBonificador] = useState('');
  const [arma, setArma] = useState('Kette');
  const [tipoArma, setTipoArma] = useState('Kette');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState('');

  const API_URL = "https://computacionbackend-cxbbheaegpb2agd3.spaincentral-01.azurewebsites.net";

  const opcionesArma = ['Kette', 'Stab', 'Corredor', 'Qtip', 'Duales', 'SNS', 'Mandoble'];

  const obtenerCartas = async () => {
    try {
      const res = await fetch(`${API_URL}/cartas`);
      const data = await res.json();
      setCartas(data);
    } catch (err) {
      console.error('Error al obtener cartas:', err);
    }
  };

  const convertirImagenABase64 = (archivo) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(archivo);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const manejarCambioImagen = async (e) => {
    const archivo = e.target.files?.[0];
    if (!archivo) {
      setImagen('');
      return;
    }

    try {
      const imagenBase64 = await convertirImagenABase64(archivo);
      setImagen(imagenBase64);
    } catch (error) {
      console.error('Error al leer la imagen:', error);
      alert('No se pudo cargar la imagen.');
    }
  };

  const crearCarta = async (e) => {
    e.preventDefault();

    const body =
      tipoCarta === 'jugador'
        ? {
            tipo: tipoCarta,
            nombre,
            equipo,
            poder: parseInt(poder, 10),
            arma,
            descripcion,
            imagen
          }
        : {
            tipo: tipoCarta,
            nombre,
            tipoArma,
            bonificador: parseInt(bonificador, 10),
            descripcion,
            imagen
          };

    try {
      const res = await fetch(`${API_URL}/cartas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        throw new Error('No se pudo crear la carta');
      }

      setTipoCarta('arma');
      setNombre('');
      setEquipo('amantes');
      setPoder('');
      setBonificador('');
      setArma('Kette');
      setTipoArma('Kette');
      setDescripcion('');
      setImagen('');

      const inputFile = document.getElementById('imagenCarta');
      if (inputFile) inputFile.value = '';

      obtenerCartas();
    } catch (err) {
      console.error('Error al crear carta:', err);
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
        throw new Error('No se pudo eliminar la carta');
      }

      obtenerCartas();
    } catch (err) {
      console.error('Error al eliminar carta:', err);
    }
  };

  useEffect(() => {
    obtenerCartas();
  }, []);

  return (
    <div
      style={{
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif',
        color: '#f5f5f5',
        backgroundColor: '#0f1117',
        minHeight: '100vh'
      }}
    >
      <h1 style={{ marginBottom: '24px' }}>Gestión de Cartas</h1>

      <form
        onSubmit={crearCarta}
        style={{
          marginBottom: '40px',
          background: '#1a1f2b',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid #2d3445'
        }}
      >
        <div style={{ marginBottom: '12px' }}>
          <label>
            Arma o jugador:
            <br />
            <select
              value={tipoCarta}
              onChange={(e) => setTipoCarta(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', marginTop: '4px' }}
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
              style={{ width: '100%', padding: '10px', marginTop: '4px' }}
            />
          </label>
        </div>

        {tipoCarta === 'jugador' && (
          <>
            <div style={{ marginBottom: '12px' }}>
              <label>
                Equipo:
                <br />
                <select
                  value={equipo}
                  onChange={(e) => setEquipo(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px', marginTop: '4px' }}
                >
                  <option value="amantes">Amantes</option>
                  <option value="botillo">Botillo</option>
                </select>
              </label>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label>
                Arma:
                <br />
                <select
                  value={arma}
                  onChange={(e) => setArma(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px', marginTop: '4px' }}
                >
                  {opcionesArma.map((opcion) => (
                    <option key={opcion} value={opcion}>
                      {opcion}
                    </option>
                  ))}
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
                  style={{ width: '100%', padding: '10px', marginTop: '4px' }}
                />
              </label>
            </div>
          </>
        )}

        {tipoCarta === 'arma' && (
          <>
            <div style={{ marginBottom: '12px' }}>
              <label>
                Tipo:
                <br />
                <select
                  value={tipoArma}
                  onChange={(e) => setTipoArma(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px', marginTop: '4px' }}
                >
                  {opcionesArma.map((opcion) => (
                    <option key={opcion} value={opcion}>
                      {opcion}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label>
                Bonificador:
                <br />
                <input
                  type="number"
                  placeholder="Bonificador"
                  value={bonificador}
                  onChange={(e) => setBonificador(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px', marginTop: '4px' }}
                />
              </label>
            </div>
          </>
        )}

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
              style={{ width: '100%', padding: '10px', marginTop: '4px', resize: 'vertical' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label>
            Foto de la carta:
            <br />
            <input
              id="imagenCarta"
              type="file"
              accept="image/*"
              onChange={manejarCambioImagen}
              style={{ marginTop: '8px' }}
            />
          </label>
        </div>

        {imagen && (
          <div style={{ marginBottom: '16px' }}>
            <p>Vista previa:</p>
            <img
              src={imagen}
              alt="Vista previa"
              style={{
                width: '180px',
                height: '250px',
                objectFit: 'cover',
                borderRadius: '10px',
                border: '1px solid #444'
              }}
            />
          </div>
        )}

        <button type="submit" style={{ padding: '10px 16px', cursor: 'pointer' }}>
          Crear carta
        </button>
      </form>

      <h2 style={{ marginBottom: '20px' }}>Colección de Cartas</h2>

      {cartas.length === 0 ? (
        <p>No hay cartas creadas todavía.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '24px'
          }}
        >
          {cartas.map((carta) => (
            <div
              key={carta.id}
              style={{
                background: '#1f2533',
                border: '1px solid #343c4f',
                borderRadius: '12px',
                padding: '14px',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
              }}
            >
              {carta.imagen ? (
                <img
                  src={carta.imagen}
                  alt={carta.nombre}
                  style={{
                    width: '100%',
                    height: '280px',
                    objectFit: 'cover',
                    borderRadius: '10px',
                    marginBottom: '12px'
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '280px',
                    borderRadius: '10px',
                    marginBottom: '12px',
                    background: '#2c3445',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#bbb'
                  }}
                >
                  Sin imagen
                </div>
              )}

              <h3 style={{ margin: '0 0 12px 0', fontSize: '1.4rem' }}>{carta.nombre}</h3>

              <button
                onClick={() => eliminarCarta(carta.id)}
                style={{
                  padding: '8px 12px',
                  cursor: 'pointer'
                }}
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;