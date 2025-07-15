const materias = [
  // ... (todas tus materias, sin cambios)
];

function guardarEstado() {
  localStorage.setItem('estadoMaterias', JSON.stringify(materias));
}

function cargarEstado() {
  const datos = localStorage.getItem('estadoMaterias');
  if (datos) {
    const materiasGuardadas = JSON.parse(datos);
    materiasGuardadas.forEach((mGuardada, i) => {
      materias[i].aprobado = mGuardada.aprobado;
      materias[i].nota = mGuardada.nota;
    });
  }
}

function puedeDesbloquear(materia) {
  if (materia.aprobado) return false;
  return materia.correlatividad.every(cod => {
    const req = materias.find(m => m.codigo === cod);
    return req && req.aprobado;
  });
}

const container = document.getElementById('materias-container');
const resumenDiv = document.createElement('div');
resumenDiv.id = 'resumen';
resumenDiv.style.margin = '30px';
resumenDiv.style.fontWeight = 'bold';
document.body.insertBefore(resumenDiv, container);

function crearMateria(materia) {
  const div = document.createElement('div');
  div.className = 'materia disabled';
  div.id = `materia-${materia.codigo}`;

  const titulo = document.createElement('h3');
  titulo.innerText = materia.nombre;
  div.appendChild(titulo);

  const notaInput = document.createElement('input');
  notaInput.type = 'number';
  notaInput.min = 0;
  notaInput.max = 100;
  notaInput.value = materia.nota || '';
  notaInput.className = 'note-box';
  notaInput.onchange = () => {
    materia.nota = notaInput.value;
    guardarEstado();
    actualizarResumen();
  };
  div.appendChild(notaInput);

  div.onclick = () => {
    if (!div.classList.contains('disabled')) {
      materia.aprobado = true;
      notaInput.style.pointerEvents = 'auto';
      actualizarMateria(materia);
      desbloquearRequisitos();
      guardarEstado();
      actualizarResumen();
    }
  };

  return div;
}

function actualizarMateria(materia) {
  const div = document.getElementById(`materia-${materia.codigo}`);
  if (materia.aprobado) {
    div.classList.remove('disabled');
    div.classList.add('approved');
  }
  desbloquearRequisitos();
}

function desbloquearRequisitos() {
  materias.forEach(m => {
    if (!m.aprobado) {
      const elem = document.getElementById(`materia-${m.codigo}`);
      if (puedeDesbloquear(m)) {
        elem.classList.remove('disabled');
      } else {
        elem.classList.add('disabled');
      }
    }
  });
}

function actualizarResumen() {
  const aprobadas = materias.filter(m => m.aprobado).length;
  const total = materias.length;
  const faltantes = total - aprobadas;
  const conNotas = materias.filter(m => m.aprobado && m.nota !== null && m.nota !== '').map(m => parseFloat(m.nota));
  const promedio = conNotas.length ? (conNotas.reduce((a, b) => a + b, 0) / conNotas.length).toFixed(2) : 'N/A';

  resumenDiv.innerHTML = `✅ Materias aprobadas: ${aprobadas}/${total}  | ❌ Faltan: ${faltantes}  | 📊 Promedio: ${promedio}`;
}

function init() {
  cargarEstado();
  materias.forEach(m => {
    const materiaDiv = crearMateria(m);
    container.appendChild(materiaDiv);
    if (puedeDesbloquear(m)) {
      materiaDiv.classList.remove('disabled');
    }
    if (m.aprobado) {
      actualizarMateria(m);
      const notaInput = materiaDiv.querySelector('.note-box');
      notaInput.value = m.nota || '';
      notaInput.style.pointerEvents = 'auto';
    }
  });
  actualizarResumen();
}

init();
