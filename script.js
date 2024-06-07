document.addEventListener('DOMContentLoaded', () => {
    // Establecer la fecha y hora actuales por defecto
    const datetimeInput = document.getElementById('datetime');
    const now = new Date();
    now.setHours(now.getHours() + 2); // Añadir 2 horas para ajustar a la hora de España
    datetimeInput.value = now.toISOString().slice(0, 16); // Formato para input datetime-local

    document.getElementById('generate').addEventListener('click', () => {
        const datetime = new Date(datetimeInput.value);
        const format = document.getElementById('format').value;
        const timestamp = `<t:${Math.floor(datetime.getTime() / 1000)}:${format}>`;
        const output = document.getElementById('output');
        output.value = timestamp;

        // Mostrar la vista previa
        const previewText = getFormattedDateTime(datetime, format);
        const preview = document.getElementById('preview');
        preview.innerText = `Vista previa: ${previewText}`;
        preview.dataset.timestamp = timestamp;
    });

    document.getElementById('output').addEventListener('click', () => {
        const output = document.getElementById('output');
        output.select();
        document.execCommand('copy');
    });

    document.getElementById('preview').addEventListener('click', (event) => {
        const timestamp = event.target.dataset.timestamp;
        copyToClipboard(timestamp);
    });

    document.getElementById('reset').addEventListener('click', () => {
        datetimeInput.value = now.toISOString().slice(0, 16); // Resetear a la hora actual
        document.getElementById('format').value = 't';
        document.getElementById('output').value = '';
        document.getElementById('preview').innerText = '';
    });

    document.getElementById('theme-toggle').addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
    });
});

function getFormattedDateTime(datetime, format) {
    const options = {
        t: { hour: '2-digit', minute: '2-digit' },
        T: { hour: '2-digit', minute: '2-digit', second: '2-digit' },
        d: { year: 'numeric', month: '2-digit', day: '2-digit' },
        D: { year: 'numeric', month: 'long', day: 'numeric' },
        f: { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' },
        F: { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' },
        R: {}  // El tiempo relativo se calcula por separado
    };

    if (format === 'R') {
        const now = new Date();
        const diff = datetime.getTime() - now.getTime();
        const minutes = Math.floor(diff / (1000 * 60));
        return formatRelativeTime(minutes);
    }

    return new Intl.DateTimeFormat('es-ES', options[format]).format(datetime);
}

function formatRelativeTime(minutes) {
    const absMinutes = Math.abs(minutes);
    const days = Math.floor(absMinutes / (60 * 24));
    const hours = Math.floor((absMinutes % (60 * 24)) / 60);
    const mins = absMinutes % 60;

    let formattedTime = '';
    if (days > 0) formattedTime += `${days} día(s) `;
    if (hours > 0) formattedTime += `${hours} hora(s) `;
    if (mins > 0) formattedTime += `${mins} minuto(s)`;

    if (minutes < 0) {
        return `Hace ${formattedTime}`;
    } else if (minutes > 0) {
        return `En ${formattedTime}`;
    } else {
        return 'Ahora';
    }
}

function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}
