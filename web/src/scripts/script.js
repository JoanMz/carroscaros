document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'http://192.168.100.2:3003'; // La URL base de tu API de carros
    const carsContainer = document.getElementById('cars-container');
    const filterForm = document.getElementById('filter-form');
    const loadingMessage = document.getElementById('loading-message');
    const clearFiltersButton = document.getElementById('clear-filters');

    // --- Función para obtener y mostrar los carros ---
    const fetchAndDisplayCars = async (filters = {}) => {
        // Muestra el mensaje de carga y limpia resultados anteriores
        loadingMessage.style.display = 'block';
        carsContainer.innerHTML = ''; // Limpia contenedor antes de cargar nuevos resultados
        carsContainer.appendChild(loadingMessage); // Vuelve a añadir el mensaje de carga temporalmente

        // Construye la URL con los parámetros de filtro
        const queryParams = new URLSearchParams();
        for (const key in filters) {
            if (filters[key]) { // Solo añade el parámetro si tiene valor
                queryParams.append(key, filters[key]);
            }
        }
        const url = `${API_BASE_URL}/carros/buscar?${queryParams.toString()}`;

        console.log("Fetching URL:", url); // Para depuración

        try {
            const response = await fetch(url);
            if (!response.ok) {
                // Si la respuesta no es exitosa (ej. error 500), lanza un error
                throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
            }
            const cars = await response.json();

            // Oculta el mensaje de carga
            loadingMessage.style.display = 'none';

            // Muestra los carros o un mensaje si no hay resultados
            if (cars.length > 0) {
                displayCars(cars);
            } else {
                displayNoResults();
            }
        } catch (error) {
            // Manejo de errores (problemas de red, error del servidor, etc.)
            console.error("Error al obtener los carros:", error);
            loadingMessage.style.display = 'none'; // Oculta carga en caso de error
            carsContainer.innerHTML = '<p id="no-results-message">Error al cargar los vehículos. Por favor, inténtalo de nuevo más tarde.</p>';
        }
    };

    // --- Función para renderizar los carros en el HTML ---
    const displayCars = (cars) => {
        carsContainer.innerHTML = ''; // Limpia mensajes previos
        cars.forEach(car => {
            const carCard = document.createElement('div');
            carCard.classList.add('car-card');
            const formattedPrice = car.Price ? `$${car.Price.toLocaleString()}` : 'Consultar';
            const formattedMileage = car.Mileage ? `${car.Mileage.toLocaleString()} km` : 'N/A';
            carCard.innerHTML = `
                <h3>${car.Make || 'Marca no disponible'} ${car.Model || 'Modelo no disponible'} (${car.Year || 'Año no disponible'})</h3>
                <p><strong>Color:</strong> ${car.Color || 'N/A'}</p>
                <p><strong>Kilometraje:</strong> ${formattedMileage}</p>
                <p><strong>Tipo:</strong> ${car['Body Type'] || 'N/A'}</p>
                <p><strong>Cilindros:</strong> ${car.Cylinders || 'N/A'}</p>
                <p><strong>Transmisión:</strong> ${car.Transmission || 'N/A'}</p>
                <p><strong>Combustible:</strong> ${car['Fuel Type'] || 'N/A'}</p>
                <p><strong>Descripción:</strong> ${car.Description || 'Sin descripción.'}</p>
                <p class="price">Precio: ${formattedPrice}</p>
                <div class="card-actions">
                    <button class="buy-btn" data-id="${car.id}">Comprar</button>
                    <button class="visit-btn" data-id="${car.id}">Agendar Visita</button>
                </div>
            `;
            carsContainer.appendChild(carCard);
        });
        // Asignar eventos a los botones recién creados
        document.querySelectorAll('.buy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const carId = e.target.getAttribute('data-id');
                buyCar(carId);
            });
        });
        document.querySelectorAll('.visit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const carId = e.target.getAttribute('data-id');
                scheduleVisit(carId);
            });
        });
    };

    async function buyCar(carId) {
        // Verifica si hay usuario autenticado (por ejemplo, almacenado en localStorage)
        const user = localStorage.getItem('user');
        if (!user) {
            alert("Debes iniciar sesión para comprar un vehículo.");
            window.location.href = './login.html';
            return;
        }
        // En un flujo real probablemente solicites el método de pago y total
        const metodoPago = prompt("Ingresa método de pago:");
        const total = prompt("Ingresa el total a pagar:");
        const usuarioEmail = JSON.parse(user).email;
        try {
            const response = await fetch('http://192.168.100.2:3002/comprasyvistas/venta', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    usuarioEmail,
                    vehiculoId: carId,
                    metodoPago,
                    total
                })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error);
            }
            alert("¡Compra realizada con éxito!");
        } catch (error) {
            console.error(error);
            alert("Ocurrió un error al procesar la compra.");
        }
    }

    async function scheduleVisit(carId) {
        const user = localStorage.getItem('user');
        if (!user) {
            alert("Debes iniciar sesión para agendar una visita.");
            window.location.href = './login.html';
            return;
        }
        const fecha = prompt("Ingresa la fecha y hora para la visita (YYYY-MM-DD HH:mm):");
        const usuarioEmail = JSON.parse(user).email;
        try {
            const response = await fetch('http://192.168.100.2:3002/comprasyvistas/visita', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    usuarioEmail,
                    vehiculoId: carId,
                    fecha
                })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error);
            }
            alert("¡Visita agendada con éxito!");
        } catch (error) {
            console.error(error);
            alert("Ocurrió un error al agendar la visita.");
        }
    }

    // --- Función para mostrar mensaje de "No se encontraron resultados" ---
    const displayNoResults = () => {
        carsContainer.innerHTML = '<p id="no-results-message">No se encontraron vehículos que coincidan con los filtros aplicados.</p>';
    };

    // --- Event Listener para el formulario de filtros ---
    filterForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Evita que el formulario recargue la página

        // Recolecta los valores de los filtros
        const filters = {
            make: document.getElementById('filter-make').value.trim(),
            model: document.getElementById('filter-model').value.trim(),
            year: document.getElementById('filter-year').value.trim(),
            priceMin: document.getElementById('filter-priceMin').value.trim(),
            priceMax: document.getElementById('filter-priceMax').value.trim(),
            millageMin: document.getElementById('filter-millageMin').value.trim(),
            millageMax: document.getElementById('filter-millageMax').value.trim(),
        };

        // Llama a la función para obtener y mostrar carros con los filtros aplicados
        fetchAndDisplayCars(filters);
    });

     // --- Event Listener para el botón de limpiar filtros ---
    clearFiltersButton.addEventListener('click', () => {
        filterForm.reset(); // Resetea los campos del formulario
        fetchAndDisplayCars(); // Vuelve a cargar todos los carros sin filtros
    });

    // --- Carga inicial de todos los carros al cargar la página ---
    fetchAndDisplayCars();
});