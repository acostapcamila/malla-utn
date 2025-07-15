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
const materias = [
  { codigo: 'Int1', nombre: 'Integración I', correlatividad: [], aprobado: false, nota: null },
  { codigo: 'IngSoc', nombre: 'Ingeniería y Sociedad', correlatividad: [], aprobado: false, nota: null },
  { codigo: 'AlgGeo', nombre: 'Álgebra y Geometría Analítica', correlatividad: [], aprobado: false, nota: null },
  { codigo: 'AM1', nombre: 'Análisis Matemático I', correlatividad: [], aprobado: false, nota: null },
  { codigo: 'AM2', nombre: 'Análisis Matemático II', correlatividad: ['AM1'], aprobado: false, nota: null },
  { codigo: 'QG', nombre: 'Química General', correlatividad: [], aprobado: false, nota: null },
  { codigo: 'SR', nombre: 'Sistemas de Representación', correlatividad: [], aprobado: false, nota: null },
  { codigo: 'FI', nombre: 'Fundamentos de Informática', correlatividad: [], aprobado: false, nota: null },
  { codigo: 'Int2', nombre: 'Integración II', correlatividad: ['Int1'], aprobado: false, nota: null },
  { codigo: 'PE', nombre: 'Probabilidad y Estadística', correlatividad: [], aprobado: false, nota: null },
  { codigo: 'QI', nombre: 'Química Inorgánica', correlatividad: [], aprobado: false, nota: null },
  { codigo: 'F1', nombre: 'Física I', correlatividad: ['AM1'], aprobado: false, nota: null },
  { codigo: 'F2', nombre: 'Física II', correlatividad: ['F1'], aprobado: false, nota: null },
  { codigo: 'QO', nombre: 'Química Orgánica', correlatividad: [], aprobado: false, nota: null },
  { codigo: 'I1', nombre: 'Inglés I', correlatividad: [], aprobado: false, nota: null },
  { codigo: 'MSA', nombre: 'Matemática Superior Aplicada', correlatividad: [], aprobado: false, nota: null },
  { codigo: 'Int3', nombre: 'Integración III', correlatividad: ['Int2'], aprobado: false, nota: null },
  { codigo: 'Termo', nombre: 'Termodinámica', correlatividad: [], aprobado: false, nota: null },
  { codigo: 'Eco', nombre: 'Economía', correlatividad: [], aprobado: false, nota: null },
  { codigo: 'Leg', nombre: 'Legislación', correlatividad: [], aprobado: false, nota: null },
  { codigo: 'MEI', nombre: 'Mecánica Eléctrica Industrial', correlatividad: [], aprobado: false, nota: null },
  { codigo: 'FQ', nombre: 'Físico Química', correlatividad: ['F2'], aprobado: false, nota: null },
  { codigo: 'FT', nombre: 'Fenómenos de Transporte', correlatividad: [], aprobado: false, nota: null },
  { codigo: 'QA', nombre: 'Química Analítica', correlatividad: [], aprobado: false, nota: null },
  { codigo: 'I2', nombre: 'Inglés II', correlatividad: [], aprobado: false, nota: null },
  { codigo: 'Int4', nombre: 'Integración IV', correlatividad: ['Int3'], aprobado: false, nota: null },
  { codigo: 'OU1', nombre: 'Operaciones Unitarias I', correlatividad: [], aprobado: false, nota: null },
  { codigo: 'TET', nombre: 'Tecnología de la Energía Térmica', correlatividad: [], aprobado: false, nota: null },
  { codigo: 'Bio', nombre: 'Biotecnología', correlatividad: [], aprobado: false, nota: null },
  { codigo: 'OU2', nombre: 'Operaciones Unitarias II', correlatividad: ['OU1'], aprobado: false, nota: null },
  { codigo: 'IRQ', nombre: 'Ing. de las Reacciones Químicas', correlatividad: [], aprobado: false, nota: null },
  { codigo: 'CEP', nombre: 'Control Estadístico de Procesos', correlatividad: [], aprobado: false, nota: null },
  { codigo: 'OI', nombre: 'Organización Industrial', correlatividad: [], aprobado: false, nota: null },
  { codigo: 'CAP', nombre: 'Control Automático de Procesos', correlatividad: [], aprobado: false, nota: null },
  { codigo: 'PF', nombre: 'Proyecto Final - Integración V', correlatividad: ['Int4'], aprobado: false, nota: null }
];

function puedeDesbloquear(materia) {
  if (materia.aprobado) return false;
  return materia.correlatividad.every(cod => {
    const req = materias.find(m => m.codigo === cod);
    return req && req.aprobado;
  });
}

const container = document.getElementById('materias-container');

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
  div.appendChild(notaInput);

  div.onclick = () => {
    if (!div.classList.contains('disabled')) {
      materia.aprobado = true;
      notaInput.style.pointerEvents = 'auto';
      actualizarMateria(materia);
      desbloquearRequisitos();
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

ffunction init() {
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
}
}

init();
