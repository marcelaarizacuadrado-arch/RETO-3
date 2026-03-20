// Archivo principal de JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar contador de visitas
    initVisitCounter();
    
    // Inicializar funcionalidades según la página
    initPageSpecificFeatures();
    
    // Inicializar búsqueda
    initSearch();
    
    // Inicializar filtros (solo en página de productos)
    initFilters();
    
    // Asegurarse que las funciones globales estén disponibles
    window.getAllProducts = getAllProducts;
    window.getProductById = getProductById;
    window.filterProducts = filterProducts;
    window.renderProducts = renderProducts;
    window.renderFeaturedProducts = renderFeaturedProducts;
    
    // Actualizar contador del carrito
    if (typeof cart !== 'undefined') {
        cart.updateCartCount();
    }
});

// Contador de visitas
function initVisitCounter() {
    const visitCountElement = document.getElementById('visitCounter');
    if (visitCountElement) {
        let visits = localStorage.getItem('techstore_visits') || 0;
        visits = parseInt(visits) + 1;
        localStorage.setItem('techstore_visits', visits);
        visitCountElement.textContent = visits;
    }
}

// Inicializar características específicas de cada página
function initPageSpecificFeatures() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    switch (currentPage) {
        case 'index.html':
        case '':
            initHomePage();
            break;
        case 'productos.html':
            initProductsPage();
            break;
        case 'carrito.html':
            initCartPage();
            break;
        case 'contacto.html':
            initContactPage();
            break;
    }
}

// Inicializar página de inicio
function initHomePage() {
    window.renderFeaturedProducts();
}

// Inicializar página de productos
function initProductsPage() {
    window.renderProducts(window.getAllProducts());
}

// Inicializar página del carrito
function initCartPage() {
    if (typeof cart !== 'undefined') {
        cart.renderCartItems();
    }
}

// Inicializar página de contacto
function initContactPage() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
}

// Manejar envío del formulario de contacto
function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        nombre: formData.get('nombre') || document.getElementById('nombre').value,
        email: formData.get('email') || document.getElementById('email').value,
        telefono: formData.get('telefono') || document.getElementById('telefono').value,
        asunto: formData.get('asunto') || document.getElementById('asunto').value,
        mensaje: formData.get('mensaje') || document.getElementById('mensaje').value
    };
    
    // Validación básica
    if (!data.nombre || !data.email || !data.asunto || !data.mensaje) {
        alert('Por favor, completa todos los campos obligatorios.');
        return;
    }
    
    // Simulación de envío
    showLoadingMessage();
    
    setTimeout(() => {
        hideLoadingMessage();
        alert('¡Mensaje enviado con éxito! Te contactaremos pronto.');
        e.target.reset();
    }, 2000);
}

// Mostrar mensaje de carga
function showLoadingMessage() {
    const submitBtn = document.querySelector('#contactForm button[type="submit"]');
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Enviando...';
        submitBtn.disabled = true;
    }
}

// Ocultar mensaje de carga
function hideLoadingMessage() {
    const submitBtn = document.querySelector('#contactForm button[type="submit"]');
    if (submitBtn) {
        submitBtn.innerHTML = 'Enviar Mensaje';
        submitBtn.disabled = false;
    }
}

// Inicializar funcionalidad de búsqueda
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                performSearch(this.value);
            }, 300); // Debounce de 300ms
        });
        
        // Búsqueda al presionar Enter
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(this.value);
            }
        });
    }
}

// Realizar búsqueda
function performSearch(searchTerm) {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    if (currentPage === 'productos.html') {
        // Si estamos en la página de productos, filtrar directamente
        const categoryFilter = document.getElementById('categoryFilter')?.value || '';
        const priceFilter = document.getElementById('priceFilter')?.value || '';
        const filteredProducts = window.filterProducts(categoryFilter, priceFilter, searchTerm);
        window.renderProducts(filteredProducts);
    } else if (searchTerm.trim()) {
        // Si estamos en otra página, redirigir a productos con búsqueda
        window.location.href = `productos.html?search=${encodeURIComponent(searchTerm)}`;
    }
}

// Inicializar filtros
function initFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }
    
    if (priceFilter) {
        priceFilter.addEventListener('change', applyFilters);
    }
    
    // Aplicar filtros desde URL si existen
    applyFiltersFromURL();
}

// Aplicar filtros
function applyFilters() {
    const categoryFilter = document.getElementById('categoryFilter')?.value || '';
    const priceFilter = document.getElementById('priceFilter')?.value || '';
    const searchInput = document.getElementById('searchInput')?.value || '';
    
    const filteredProducts = window.filterProducts(categoryFilter, priceFilter, searchInput);
    window.renderProducts(filteredProducts);
}

// Aplicar filtros desde parámetros URL
function applyFiltersFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('search');
    
    if (searchTerm) {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = searchTerm;
            performSearch(searchTerm);
        }
    }
}

// Función para simular login básico
function simulateLogin() {
    const username = prompt('Ingresa tu nombre de usuario:');
    if (username) {
        localStorage.setItem('techstore_user', username);
        alert(`¡Bienvenido, ${username}!`);
        updateUserInterface();
    }
}

// Función para logout
function logout() {
    localStorage.removeItem('techstore_user');
    alert('Sesión cerrada');
    updateUserInterface();
}

// Actualizar interfaz según estado de login
function updateUserInterface() {
    const user = localStorage.getItem('techstore_user');
    // Aquí podrías actualizar la UI para mostrar/ocultar elementos según el estado de login
    console.log('Usuario actual:', user || 'No logueado');
}

// Utilidades adicionales
function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
}

// Función para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}