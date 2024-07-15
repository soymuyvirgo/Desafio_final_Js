document.getElementById('convertir').addEventListener('click', async () => {
    const monto = document.getElementById('monto').value;
    const moneda = document.getElementById('moneda').value;
    const resultadoDiv = document.getElementById('resultado');
    const historialChart = document.getElementById('historialChart').getContext('2d');

    try {
        const response = await fetch('https://mindicador.cl/api/' + moneda);
        const data = await response.json();

        if (data.serie.length === 0) {
            throw new Error('No se encontraron datos para la moneda seleccionada.');
        }

        const tasaCambio = data.serie[0].valor;
        const resultado = (monto / tasaCambio).toFixed(3);
        resultadoDiv.textContent = `Resultado: $${resultado}`;

        const labels = data.serie.slice(0, 10).map(entry => entry.fecha.slice(0, 10));
        const valores = data.serie.slice(0, 10).map(entry => entry.valor);

        new Chart(historialChart, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Historial últimos 10 días',
                    data: valores,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    } catch (error) {
        resultadoDiv.textContent = `Error: ${error.message}`;
    }
});
