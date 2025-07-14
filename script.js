const materias = [
    { codigo: 'Int1', nombre: 'Integración I', correlatividad: [], aprobado: false, nota: null },
    { codigo: 'AnalMat1', nombre: 'Análisis Matemático I', correlatividad: [], aprobado: false, nota: null },
    { codigo: 'AlgGeometria', nombre: 'Algebra y Geometría Analítica', correlatividad: [], aprobado: false, nota: null },
    { codigo: 'Fisica1', nombre: 'Física I', correlatividad: ['AnalMat1'], aprobado: false, nota: null },
    { codigo: 'Int2', nombre: 'Integración II', correlatividad: ['Int1'], aprobado: false, nota: null },
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

    const btnAprobar = document.createElement('button');
    btnAprobar.className = 'btn';
    btnAprobar.innerText = 'Aprobar';
    btnAprobar.onclick = () => {
        if (!div.classList.contains('disabled')) {
            materia.aprobado = true;
            actualizarMateria(materia);
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
    };
    div.appendChild(notaInput);

    return div;
}

function actualizarMateria(materia) {
    const div = document.getElementById(`materia-${materia.codigo}`);
    if (materia.aprobado) {
        div.classList.remove('disabled');
        div.classList.add('approved');
        const btn = div.querySelector('.btn');
        btn.disabled = true;
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

function init() {
    materias.forEach(m => {
        const materiaDiv = crearMateria(m);
        container.appendChild(materiaDiv);
        if (puedeDesbloquear(m)) {
            materiaDiv.classList.remove('disabled');
        }
    });
}

init();
