import React, { useState, useEffect } from 'react';

function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [nombre, setNombre] = useState('');
  const [id, setId] = useState('');
  // REEMPLAZA ESTA URL POR LA DE TU BACKEND EN AZURE
  const API_URL = "https://computacionbackend-cxbbheaegpb2agd3.spaincentral-01.azurewebsites.net";

  // Función para obtener los usuarios
  const obtenerUsuarios = async () => {
    try {
      const res = await fetch(`${API_URL}/usuarios`);
      const data = await res.json();
      setUsuarios(data);
    } catch (err) {
      console.error("Error al obtener:", err);
    }
  };

  // Función para crear un usuario
  const crearUsuario = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, nombre })
      });
      setNombre('');
      setId('');
      obtenerUsuarios(); // Refrescar lista
    } catch (err) {
      console.error("Error al crear:", err);
    }
  };

  //Función Eliminar datos
  const eliminarUsuario = async (id) => {
  const confirmar = window.confirm(`¿Seguro que quieres eliminar el usuario con id ${id}?`);
  if (!confirmar) return;

  try {
    const res = await fetch(`${API_URL}/usuarios/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      throw new Error('No se pudo eliminar el usuario');
    }

    obtenerUsuarios(); // refresca la lista
  } catch (err) {
    console.error("Error al eliminar:", err);
  }
};

  useEffect(() => { obtenerUsuarios(); }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Búsqueda de Equipos</h1>
      
      <form onSubmit={crearUsuario} style={{ marginBottom: '2rem' }}>
        <input placeholder="ID" value={id} onChange={e => setId(e.target.value)} required />
        <input placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} required />
        <button type="submit">Crear Usuario</button>
      </form>

      <h2>Lista de Equipos</h2>
      <ul>
        {usuarios.map((u) => (
          <li key={u.id}>
            {u.nombre} (ID: {u.id})
              <button onClick={() => eliminarUsuario(u.id)}>
                Eliminar
              </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;