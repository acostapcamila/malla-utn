
// Definición de materias y requisitos
const materias = [
    { codigo: 'Int1', nombre: 'Integración I', correlatividad: [], aprobado: false, nota: null },
    { codigo: 'Ingeniería y Sociedad', nombre: 'Ingeniería y Sociedad', correlatividad: [], aprobado: false, nota: null },
    { codigo: 'AlgGeometría', nombre: 'Álgebra y Geometría Analítica', correlatividad: [], aprobado: false, nota: null },
    { codigo: 'AnalMat1', nombre: 'Análisis Matemático I', correlatividad: [], aprobado: false, nota: null },
    { codigo: 'AnalMat2', nombre: 'Análisis Matemático II', correlatividad: ['AnalMat1'], aprobado: false, nota: null },
    { codigo: 'QuímicaGen', nombre: 'Química General', correlatividad: [], aprobado: false, nota: null },
    { codigo: 'SistemasRep', nombre: 'Sistemas de Representación', correlatividad: [], aprobado: false, nota: null },
    { codigo: 'FundInformatica', nombre: 'Fundamentos de Informática', correlatividad: [], aprobado: false, nota: null },

    { codigo: 'Int2', nombre: 'Integración II', correlatividad: ['Int1'], aprobado: false, nota: null },
    { codigo: 'ProbEst', nombre: 'Probabilidad y Estadística', correlatividad: [], aprobado: false, nota: null },
    { codigo: 'QInorg', nombre: 'Química Inorgánica', correlatividad: [], aprobado: false, nota: null },
    { codigo: 'Fisica1', nombre: 'Física I', correlatividad: [], aprobado: false, nota: null },
    { codigo: 'Fisica2', nombre: 'Física II', correlatividad: ['Fisica1'], aprobado: false, nota: null },
    { codigo: 'QOrganica', nombre: 'Química Orgánica', correlatividad: [], aprobado: false, nota: null },
    { codigo: 'Ingles1', nombre: 'Inglés I', correlatividad: [], aprobado: false, nota: null },
    { codigo: 'MatSup', nombre: 'Matemática Superior Aplicada', correlatividad: [], aprobado: false, nota: null },

    { codigo: 'Int3', nombre: 'Integración III', correlatividad: ['Int2'], aprobado: false, nota: null },
    { codigo: 'Termo', nombre: 'Termodinámica', correlatividad: [], aprobado: false, nota: null },
    { codigo: 'Economia', nombre: 'Economía', correlatividad: [], aprobado: false, nota: null },
    { codigo: 'Legislacion', nombre: 'Legislación', correlatividad: [], aprobado: false, nota: null },
    { codigo: 'MecanicaElectrica', nombre: 'Mecánica Eléctrica Industrial', correlatividad: [], aprobado: false, nota: null },
    { codigo: 'FisicoQ', nombre: 'Físico Química', correlatividad: ['Fisica2'], aprobado: false, nota: null },
    { codigo: 'FenTransporte', nombre: 'Fenómenos de Transporte', correlatividad: [], aprobado: false, nota: null },
    { codigo: 'QAnalitica', nombre: 'Química Analítica', correlatividad: [], aprobado: false, nota: null },
    { codigo: 'Ingles2', nombre: 'Inglés II', correlatividad: [], aprobado: false, nota: null },

    { codigo: 'Int4', nombre: 'Integración IV', correlatividad: ['Int3'], aprobado: false, nota: null },
    { codigo: 'OperUnit1', nombre: 'Operaciones Unitarias I', correlatividad: [], aprobado: false, nota: null },
    { codigo: 'EnergiaTermica', nombre: 'Tecnología de la Energía Térmica', correlatividad: [], aprobado: false, nota: null },
    { codigo: 'Biotecnologia', nombre: 'Biotecnología', correlatividad: [], aprobado: false, nota: null },
    { codigo: 'OperUnit2', nombre: 'Operaciones Unitarias II', correlatividad: ['OperUnit1'], aprobado: false, nota: null },
    { codigo: 'ReaccionesQuimicas', nombre: 'Ingeniería de las Reacciones Químicas', correlatividad: [], aprobado: false, nota: null },
    { codigo: 'ControlProcesos', nombre: 'Control Estadísticos de Procesos', correlatividad: [], aprobado: false, nota: null },
    { codigo: 'OrganizacionIndustrial', nombre: 'Organización Industrial', correlatividad: [], aprobado: false, nota: null },

    { codigo: 'ControlAutomatico', nombre: 'Control Automático de Procesos', correlatividad: [], aprobado: false, nota: null },
    { codigo: 'ProyectoFinal', nombre: 'Proyecto Final - Integración V', correlatividad: ['Int4'], aprobado: false, nota: null }
];

// Función para verificar si una materia puede ser desbloqueada
function puedeDesbloquear(materia) {
    if (materia.aprobado) return false; // Si ya está aprobado, no se bloquea
    // Verificar que todos los requisitos estén aprobados
    return materia.correlatividad.every(cod => {
        const req = materias.find(m => m.codigo === cod);
        return req && req.aprobado;
    });
}

// Crear elementos de la malla
const container = document.getElementById('materias-container');

function crearMateria(materia) {
    const div = document.createElement('div');
    div.className = 'materia disabled';
    div.id = `materia-${materia.codigo}`;

    const titulo = document.createElement('h3');
    titulo.innerText = materia.nombre;
    div.appendChild(titulo);

    const btnAprobar = document.createElement('button');
    btnAprobar.className = 'btn';
    btnAprobar.innerText = 'Aprobar';
    btnAprobar.onclick = () => {
        if (!div.classList.contains('disabled')) {
            materia.aprobado = true;
            actualizarMateria(materia);
            // Desbloquear materias que dependan de esta
            desbloquearRequisitos();
        }
    };
    div.appendChild(btnAprobar);

    const notaLabel = document.createElement('div');
    notaLabel.innerText = 'Nota Final:';
    div.appendChild(notaLabel);

    const notaInput = document.createElement('input');
    notaInput.type = 'number';
    notaInput.min = 0;
    notaInput.max = 100;
    notaInput.value = materia.nota || '';
    notaInput.className = 'note-box';
    notaInput.onchange = () => {
        materia.nota = notaInput.value;
        // Guardar cambio si quieres persistir
    };
    div.appendChild(notaInput);

    return div;
}

function actualizarMateria(materia) {
    const div = document.getElementById(`materia-${materia.codigo}`);
    if (materia.aprobado) {
        div.classList.remove('disabled');
        div.classList.add('approved');
        // Desactivar botón de aprobar
        const btn = div.querySelector('.btn');
        btn.disabled = true;
    }
    // Actualizar estado de desbloqueo
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

// Inicializar
function init() {
    materias.forEach(m => {
        const materiaDiv = crearMateria(m);
        container.appendChild(materiaDiv);
        // Desbloquear si puede
        if (puedeDesbloquear(m)) {
            materiaDiv.classList.remove('disabled');
        }
    });
}

init();
