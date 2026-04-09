import React, { useEffect, useState } from 'react';

function App() {
  // URL base del backend
  const API_URL = "https://computacionbackend-cxbbheaegpb2agd3.spaincentral-01.azurewebsites.net";

  // Opciones permitidas para las armas y tipos de arma
  const OPCIONES_ARMA = ['Kette', 'Stab', 'Corredor', 'Qtip', 'Duales', 'SNS', 'Mandoble'];

  // =========================
  // ESTADOS GENERALES
  // =========================

  // Lista completa de cartas cargadas desde el backend
  const [cartas, setCartas] = useState([]);

  // Controla qué pantalla estamos mostrando:
  // - "lista" => formulario + cuadrícula
  // - "detalle" => pantalla para ver/editar una carta
  const [vista, setVista] = useState('lista');

  // Guarda la carta actualmente seleccionada para editar
  const [cartaSeleccionada, setCartaSeleccionada] = useState(null);

  // =========================
  // ESTADOS DEL FORMULARIO DE CREACIÓN
  // =========================

  const [tipoCarta, setTipoCarta] = useState('arma');
  const [nombre, setNombre] = useState('');
  const [equipo, setEquipo] = useState('amantes');
  const [poder, setPoder] = useState('');
  const [bonificador, setBonificador] = useState('');
  const [arma, setArma] = useState('Kette');
  const [tipoArma, setTipoArma] = useState('Kette');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState('');

  // =========================
  // ESTADOS DEL FORMULARIO DE EDICIÓN
  // =========================

  const [editTipo, setEditTipo] = useState('arma');
  const [editNombre, setEditNombre] = useState('');
  const [editEquipo, setEditEquipo] = useState('amantes');
  const [editPoder, setEditPoder] = useState('');
  const [editBonificador, setEditBonificador] = useState('');
  const [editArma, setEditArma] = useState('Kette');
  const [editTipoArma, setEditTipoArma] = useState('Kette');
  const [editDescripcion, setEditDescripcion] = useState('');
  const [editImagen, setEditImagen] = useState('');

  // =========================
  // CARGA INICIAL
  // =========================

  // Cuando la app se monta por primera vez, cargamos las cartas
  useEffect(() => {
    obtenerCartas();
  }, []);

  // =========================
  // FUNCIONES AUXILIARES
  // =========================

  // Convierte un archivo de imagen a base64 para poder mandarlo al backend
  const convertirImagenABase64 = (archivo) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(archivo);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  };

  // Limpia el formulario de crear
  const limpiarFormularioCrear = () => {
    setTipoCarta('arma');
    setNombre('');
    setEquipo('amantes');
    setPoder('');
    setBonificador('');
    setArma('Kette');
    setTipoArma('Kette');
    setDescripcion('');
    setImagen('');

    const input = document.getElementById('inputImagenCrear');
    if (input) input.value = '';
  };

  // Carga en el formulario de edición los datos de la carta seleccionada
  const cargarCartaEnFormularioEdicion = (carta) => {
    setEditTipo(carta.tipo || 'arma');
    setEditNombre(carta.nombre || '');
    setEditEquipo(carta.equipo || 'amantes');
    setEditPoder(carta.poder ?? '');
    setEditBonificador(carta.bonificador ?? '');
    setEditArma(carta.arma || 'Kette');
    setEditTipoArma(carta.tipoArma || 'Kette');
    setEditDescripcion(carta.descripcion || '');
    setEditImagen(carta.imagen || '');

    const input = document.getElementById('inputImagenEditar');
    if (input) input.value = '';
  };

  // =========================
  // PETICIONES AL BACKEND
  // =========================

  // Obtiene todas las cartas
  const obtenerCartas = async () => {
    try {
      const res = await fetch(`${API_URL}/cartas`);

      if (!res.ok) {
        throw new Error('No se pudieron obtener las cartas');
      }

      const data = await res.json();
      setCartas(data);
    } catch (err) {
      console.error('Error al obtener cartas:', err);
      alert('No se pudieron cargar las cartas.');
    }
  };

  // Obtiene una carta concreta por id y abre la pantalla de detalle
  const abrirDetalleCarta = async (id) => {
    try {
      const res = await fetch(`${API_URL}/cartas/${id}`);

      if (!res.ok) {
        throw new Error('No se pudo obtener la carta');
      }

      const carta = await res.json();

      setCartaSeleccionada(carta);
      cargarCartaEnFormularioEdicion(carta);
      setVista('detalle');
    } catch (err) {
      console.error('Error al cargar detalle:', err);
      alert('No se pudo cargar el detalle de la carta.');
    }
  };

  // Crea una carta nueva
  const crearCarta = async (e) => {
    e.preventDefault();

    // Construimos el body según el tipo de carta
    const body =
      tipoCarta === 'jugador'
        ? {
            tipo: tipoCarta,
            nombre,
            equipo,
            poder: Number(poder),
            arma,
            tipoArma: null,
            bonificador: null,
            descripcion,
            imagen
          }
        : {
            tipo: tipoCarta,
            nombre,
            equipo: null,
            poder: null,
            arma: null,
            tipoArma,
            bonificador: Number(bonificador),
            descripcion,
            imagen
          };

    try {
      const res = await fetch(`${API_URL}/cartas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      // Si el backend devuelve error, intentamos leer el mensaje
      if (!res.ok) {
        const textoError = await res.text();
        throw new Error(textoError || 'No se pudo crear la carta');
      }

      limpiarFormularioCrear();
      obtenerCartas();
    } catch (err) {
      console.error('Error al crear carta:', err);
      const crearCarta = async (e) => {
  e.preventDefault();

  const body =
    tipoCarta === 'jugador'
      ? {
          tipo: tipoCarta,
          nombre,
          equipo,
          poder: Number(poder),
          arma,
          tipoArma: null,
          bonificador: null,
          descripcion,
          imagen
        }
      : {
          tipo: tipoCarta,
          nombre,
          equipo: null,
          poder: null,
          arma: null,
          tipoArma,
          bonificador: Number(bonificador),
          descripcion,
          imagen
        };

  try {
    const res = await fetch(`${API_URL}/cartas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const texto = await res.text();

    if (!res.ok) {
      throw new Error(texto || 'No se pudo crear la carta');
    }

    limpiarFormularioCrear();
    obtenerCartas();
    alert('Carta creada correctamente');
  } catch (err) {
    console.error('Error al crear carta:', err);
    alert(`Error real al crear carta: ${err.message}`);
  }
};
    }
  };

  // Guarda los cambios de una carta existente
  const guardarCambiosCarta = async (e) => {
    e.preventDefault();

    if (!cartaSeleccionada) return;

    const body =
      editTipo === 'jugador'
        ? {
            tipo: editTipo,
            nombre: editNombre,
            equipo: editEquipo,
            poder: Number(editPoder),
            arma: editArma,
            tipoArma: null,
            bonificador: null,
            descripcion: editDescripcion,
            imagen: editImagen
          }
        : {
            tipo: editTipo,
            nombre: editNombre,
            equipo: null,
            poder: null,
            arma: null,
            tipoArma: editTipoArma,
            bonificador: Number(editBonificador),
            descripcion: editDescripcion,
            imagen: editImagen
          };

    try {
      const res = await fetch(`${API_URL}/cartas/${cartaSeleccionada.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const textoError = await res.text();
        throw new Error(textoError || 'No se pudo guardar la carta');
      }

      const cartaActualizada = await res.json();

      setCartaSeleccionada(cartaActualizada);
      cargarCartaEnFormularioEdicion(cartaActualizada);
      obtenerCartas();

      alert('Carta actualizada correctamente.');
    } catch (err) {
      console.error('Error al guardar cambios:', err);
      alert('No se pudieron guardar los cambios.');
    }
  };

  // Elimina una carta por id
  const eliminarCarta = async (id) => {
    const confirmar = window.confirm(`¿Seguro que quieres eliminar la carta con id ${id}?`);
    if (!confirmar) return;

    try {
      const res = await fetch(`${API_URL}/cartas/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        throw new Error('No se pudo eliminar la carta');
      }

      // Si estamos en detalle y borramos esa carta, volvemos a la lista
      if (cartaSeleccionada && cartaSeleccionada.id === id) {
        setVista('lista');
        setCartaSeleccionada(null);
      }

      obtenerCartas();
    } catch (err) {
      console.error('Error al eliminar carta:', err);
      alert('No se pudo eliminar la carta.');
    }
  };

  // =========================
  // MANEJO DE IMÁGENES
  // =========================

  // Cuando el usuario selecciona una imagen en el formulario de crear
    const manejarImagenCrear = async (e) => {
    const archivo = e.target.files?.[0];
    if (!archivo) {
      setImagen('');
      return;
    }

    // Límite: 300 KB
    const maxBytes = 1024 * 1024;

    if (archivo.size > maxBytes) {
      alert('La imagen es demasiado grande. Usa una de menos de 300 KB.');
      e.target.value = '';
      setImagen('');
      return;
    }

    try {
      const base64 = await convertirImagenABase64(archivo);
      setImagen(base64);
    } catch (err) {
      console.error('Error al cargar imagen:', err);
      alert('No se pudo leer la imagen.');
    }
  };

  // Cuando el usuario selecciona una imagen en el formulario de editar
    const manejarImagenEditar = async (e) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    const maxBytes = 1024 * 1024;
    if (archivo.size > maxBytes) {
      alert('La imagen es demasiado grande. Usa una de menos de 300 KB.');
      e.target.value = '';
      return;
    }

    try {
      const base64 = await convertirImagenABase64(archivo);
      setEditImagen(base64);
    } catch (err) {
      console.error('Error al cargar imagen en edición:', err);
      alert('No se pudo leer la imagen.');
    }
  };

  // =========================
  // VISTA DETALLE / EDICIÓN
  // =========================

  if (vista === 'detalle' && cartaSeleccionada) {
    return (
      <div
        style={{
          padding: '20px',
          maxWidth: '1000px',
          margin: '0 auto',
          fontFamily: 'Arial, sans-serif',
          color: '#f5f5f5',
          backgroundColor: '#0f1117',
          minHeight: '100vh'
        }}
      >
        <button
          onClick={() => {
            setVista('lista');
            setCartaSeleccionada(null);
          }}
          style={{ marginBottom: '20px', padding: '10px 14px', cursor: 'pointer' }}
        >
          Volver
        </button>

        <h1 style={{ marginBottom: '20px' }}>Detalle y edición de carta</h1>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '320px 1fr',
            gap: '24px'
          }}
        >
          <div
            style={{
              background: '#1a1f2b',
              border: '1px solid #2d3445',
              borderRadius: '12px',
              padding: '16px'
            }}
          >
            {editImagen ? (
              <img
                src={editImagen}
                alt={editNombre}
                style={{
                  width: '100%',
                  height: '420px',
                  objectFit: 'cover',
                  borderRadius: '10px'
                }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '420px',
                  borderRadius: '10px',
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

            <div style={{ marginTop: '16px' }}>
              <button
                onClick={() => eliminarCarta(cartaSeleccionada.id)}
                style={{ padding: '10px 14px', cursor: 'pointer', width: '100%' }}
              >
                Eliminar carta
              </button>
            </div>
          </div>

          <form
            onSubmit={guardarCambiosCarta}
            style={{
              background: '#1a1f2b',
              border: '1px solid #2d3445',
              borderRadius: '12px',
              padding: '20px'
            }}
          >
            <div style={{ marginBottom: '12px' }}>
              <label>
                Arma o jugador:
                <br />
                <select
                  value={editTipo}
                  onChange={(e) => setEditTipo(e.target.value)}
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
                  value={editNombre}
                  onChange={(e) => setEditNombre(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px', marginTop: '4px' }}
                />
              </label>
            </div>

            {editTipo === 'jugador' && (
              <>
                <div style={{ marginBottom: '12px' }}>
                  <label>
                    Equipo:
                    <br />
                    <select
                      value={editEquipo}
                      onChange={(e) => setEditEquipo(e.target.value)}
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
                      value={editArma}
                      onChange={(e) => setEditArma(e.target.value)}
                      required
                      style={{ width: '100%', padding: '10px', marginTop: '4px' }}
                    >
                      {OPCIONES_ARMA.map((opcion) => (
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
                      value={editPoder}
                      onChange={(e) => setEditPoder(e.target.value)}
                      required
                      style={{ width: '100%', padding: '10px', marginTop: '4px' }}
                    />
                  </label>
                </div>
              </>
            )}

            {editTipo === 'arma' && (
              <>
                <div style={{ marginBottom: '12px' }}>
                  <label>
                    Tipo:
                    <br />
                    <select
                      value={editTipoArma}
                      onChange={(e) => setEditTipoArma(e.target.value)}
                      required
                      style={{ width: '100%', padding: '10px', marginTop: '4px' }}
                    >
                      {OPCIONES_ARMA.map((opcion) => (
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
                      value={editBonificador}
                      onChange={(e) => setEditBonificador(e.target.value)}
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
                  value={editDescripcion}
                  onChange={(e) => setEditDescripcion(e.target.value)}
                  required
                  rows="6"
                  style={{ width: '100%', padding: '10px', marginTop: '4px', resize: 'vertical' }}
                />
              </label>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label>
                Cambiar imagen:
                <br />
                <input
                  id="inputImagenEditar"
                  type="file"
                  accept="image/*"
                  onChange={manejarImagenEditar}
                  style={{ marginTop: '8px' }}
                />
              </label>
            </div>

            <button type="submit" style={{ padding: '10px 16px', cursor: 'pointer' }}>
              Guardar cambios
            </button>
          </form>
        </div>
      </div>
    );
  }

  // =========================
  // VISTA PRINCIPAL
  // =========================

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
                  {OPCIONES_ARMA.map((opcion) => (
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
                  {OPCIONES_ARMA.map((opcion) => (
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
              id="inputImagenCrear"
              type="file"
              accept="image/*"
              onChange={manejarImagenCrear}
              style={{ marginTop: '8px' }}
            />
          </label>
        </div>

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
              onClick={() => abrirDetalleCarta(carta.id)}
              style={{
                background: '#1f2533',
                border: '1px solid #343c4f',
                borderRadius: '12px',
                padding: '14px',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                cursor: 'pointer'
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

              <h3 style={{ margin: 0, fontSize: '1.4rem' }}>{carta.nombre}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;