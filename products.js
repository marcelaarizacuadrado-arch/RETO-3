// Base de datos de productos
const products = [
    {
        id: 1,
        name: "MacBook Pro 14\"",
        price: 2000000,
        originalPrice: 2500000,
        category: "laptop",
        // image: "https://via.placeholder.com/300x200/007bff/ffffff?text=MacBook+Pro",
        image: "macbook.jpg",
        description: "Laptop profesional con chip M2 Pro, perfecta para desarrollo y diseño.",
        stock: 15,
        featured: true
    },
    
    {
        id: 2,
        name: "iPhone 15 Pro",
        price: 999,
        originalPrice: 1099,
        category: "smartphone",
        image: "https://via.placeholder.com/300x200/007bff/ffffff?text=iPhone+15",
        description: "Descubre el iPhone 15 Pro, un smartphone de última generación diseñado para ofrecer máximo rendimiento y una experiencia premium. Cuenta con el potente chip A17 Pro, cámara profesional de alta calidad para fotos y videos increíbles, y un diseño elegante y resistente. Ideal para quienes buscan potencia, innovación y estilo en un solo dispositivo..",
        stock: 25,
        featured: true
    },
    {
        id: 3,
        name: "Dell XPS 13",
        price: 1299,
        originalPrice: 1499,
        category: "laptop",
        image: "https://via.placeholder.com/300x200/007bff/ffffff?text=Dell+XPS",
        description: "La Dell XPS 13 es una laptop ultradelgada y potente, perfecta para trabajar, estudiar o crear contenido. Su pantalla InfinityEdge ofrece una experiencia visual impresionante, mientras que su procesador Intel i7 garantiza velocidad y eficiencia. Su diseño compacto y moderno la convierte en una excelente opción para quienes necesitan rendimiento y portabilidad",
        stock: 12,
        featured: false
    },
    {
        id: 4,
        name: "Samsung Galaxy S24",
        price: 2500000,
        originalPrice: 2500000,
        category: "smartphone",
        image: "https://via.placeholder.com/300x200/007bff/ffffff?text=Galaxy+S24",
        description: "Smartphone potente y elegante con excelente rendimiento, cámara de alta calidad y diseño moderno ideal para el día a día...",
        stock: 30,
        featured: true
    },
    {
        id: 5,
        name: "AirPods Pro 2",
        price: 150000,
        originalPrice: 150000,
        category: "accesorio",
        image: "https://via.placeholder.com/300x200/007bff/ffffff?text=AirPods+Pro",
        description: "Audífonos inalámbricos con cancelación de ruido, excelente calidad de sonido y comodidad para uso diario..",
        stock: 50,
        featured: false
    },
    {
        id: 6,
        name: "iPad Air 5",
        price: 599000,
        originalPrice: 699000,
        category: "accesorio",
        image: "https://via.placeholder.com/300x200/007bff/ffffff?text=iPad+Air",
        description: "Tablet potente y ligera con pantalla de alta calidad, ideal para estudiar, trabajar y disfrutar contenido multimedia..",
        stock: 20,
        featured: true
    }, 
    {
        id: 7,
        name: "HP Spectre x360",
        price: 1399099,
        originalPrice: 1599000,
        category: "laptop",
        image: "https://via.placeholder.com/300x200/007bff/ffffff?text=HP+Spectre",
        description: "La HP Spectre x360 es una laptop convertible elegante y potente, ideal para productividad y creatividad. Su pantalla táctil de alta resolución y su diseño 2 en 1 permiten trabajar o disfrutar contenido con gran comodidad.",
        stock: 10,
        featured: false
    },
    {
        id: 8,
        name: "Lenovo ThinkPad X1",
        price: 1499000,
        originalPrice: 1699000,
        category: "laptop",
        image: "https://via.placeholder.com/300x200/007bff/ffffff?text=ThinkPad+X1",
        description: "La Lenovo ThinkPad X1 es una laptop empresarial de alto rendimiento con teclado cómodo, gran duración de batería y procesadores Intel de última generación. Perfecta para profesionales que necesitan confiabilidad y potencia.",
        stock: 18,
        featured: true
    },
    {
        id: 9,
        name: "Xiaomi 13 Pro",
        price: 699000,
        originalPrice: 799000,
        category: "smartphone",
        image: "https://via.placeholder.com/300x200/007bff/ffffff?text=Xiaomi+13+Pro",
        description: "Smartphone de alto rendimiento con cámara avanzada, pantalla de gran calidad y diseño elegante, ideal para usuarios exigentes..",
        stock: 22,
        featured: true
    },
    {
        id: 10,
        name: "Google Pixel 8",
        price: 999999,
        originalPrice: 899000,
        category: "smartphone",
        image: "https://via.placeholder.com/300x200/007bff/ffffff?text=Pixel+8",
        description: "Un excelente celular con una gran tecnología.",
        stock: 16,
        featured: false
    },

];

// Función para obtener todos los productos
function getAllProducts() {
    return products;
}

// Función para obtener productos destacados
function getFeaturedProducts() {
    return products.filter(product => product.featured);
}

// Función para obtener un producto por ID
function getProductById(id) {
    return products.find(product => product.id === parseInt(id));
}

// Función para filtrar productos
function filterProducts(category = '', priceRange = '', searchTerm = '') {
    let filteredProducts = products;

    // Filtrar por categoría
    if (category) {
        filteredProducts = filteredProducts.filter(product => 
            product.category === category
        );
    }

    // Filtrar por rango de precio
    if (priceRange) {
        filteredProducts = filteredProducts.filter(product => {
            const price = product.price;
            switch (priceRange) {
                case '0-500':
                    return price >= 0 && price <= 500;
                case '500-1000':
                    return price > 500 && price <= 1000;
                case '1000+':
                    return price > 1000;
                default:
                    return true;
            }
        });
    }

    // Filtrar por término de búsqueda
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(term) ||
            product.description.toLowerCase().includes(term)
        );
    }

    return filteredProducts;
}

// Función para crear HTML de tarjeta de producto
function createProductCard(product) {
    const discountPercentage = product.originalPrice ? 
        Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

    return `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card product-card h-100">
                <img src="${product.image}" class="card-img-top product-image" alt="${product.name}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text flex-grow-1">${product.description}</p>
                    <div class="price-section mb-3">
                        <span class="price">$${product.price}</span>
                        ${product.originalPrice ? `<span class="original-price ms-2">$${product.originalPrice}</span>` : ''}
                        ${discountPercentage > 0 ? `<span class="badge bg-danger ms-2">${discountPercentage}% OFF</span>` : ''}
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">Stock: ${product.stock}</small>
                        <button class="btn btn-primary" onclick="addToCart(${product.id})">
                            <i class="fas fa-cart-plus me-1"></i>Agregar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Función para renderizar productos en el grid
function renderProducts(productsToRender, containerId = 'productsGrid') {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (productsToRender.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center">
                <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>
                    No se encontraron productos que coincidan con los filtros seleccionados.
                </div>
            </div>
        `;
        return;
    }

    container.innerHTML = productsToRender.map(product => createProductCard(product)).join('');
}

// Función para renderizar productos destacados
function renderFeaturedProducts() {
    const featuredProducts = getFeaturedProducts().slice(0, 3); // Solo mostrar 3 productos destacados
    renderProducts(featuredProducts, 'featuredProducts');
}