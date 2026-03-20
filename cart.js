// Clase para manejar el carrito de compras
class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.updateCartCount();
    }

    // Cargar carrito desde localStorage
    loadCart() {
        const savedCart = localStorage.getItem('techstore_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    // Guardar carrito en localStorage
    saveCart() {
        localStorage.setItem('techstore_cart', JSON.stringify(this.items));
    }

    // Agregar producto al carrito
    addItem(productId, quantity = 1) {
        // Usaremos la función de products.js para obtener los productos correctos
        const product = window.getAllProducts().find(p => p.id === productId);
        
        if (!product) {
            console.error('Producto no encontrado');
            return false;
        }

        const existingItem = this.items.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: productId,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }

        this.saveCart();
        this.updateCartCount();
        this.showAddToCartMessage(product.name);
        return true;
    }

    // Remover producto del carrito
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
        this.renderCartItems();
    }

    // Actualizar cantidad de un producto
    updateQuantity(productId, newQuantity) {
        if (newQuantity <= 0) {
            this.removeItem(productId);
            return;
        }

        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
            this.saveCart();
            this.updateCartCount();
            this.renderCartItems();
        }
    }

    // Obtener cantidad total de items
    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    // Obtener precio total
    getTotalPrice() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Actualizar contador del carrito en la UI
    updateCartCount() {
        const cartCountElements = document.querySelectorAll('#cartCount');
        const totalItems = this.getTotalItems();
        
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
            element.style.display = totalItems > 0 ? 'inline' : 'none';
        });
    }

    // Mostrar mensaje de producto agregado
    showAddToCartMessage(productName) {
        // Crear toast notification
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.innerHTML = `
            <div class="alert alert-success alert-dismissible fade show position-fixed" 
                 style="top: 20px; right: 20px; z-index: 9999; min-width: 300px;">
                <i class="fas fa-check-circle me-2"></i>
                <strong>${productName}</strong> agregado al carrito
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 3000);
    }

    // Renderizar items del carrito
    renderCartItems() {
        const container = document.getElementById('cartItems');
        if (!container) return;

        if (this.items.length === 0) {
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                    <h4>Tu carrito está vacío</h4>
                    <p class="text-muted">Agrega algunos productos para comenzar</p>
                    <a href="productos.html" class="btn btn-primary">Ver Productos</a>
                </div>
            `;
            this.updateCartSummary();
            return;
        }

        container.innerHTML = this.items.map(item => `
            <div class="cart-item">
                <div class="row align-items-center">
                    <div class="col-md-2">
                        <img src="${item.image}" class="img-fluid rounded" alt="${item.name}">
                    </div>
                    <div class="col-md-4">
                        <h6>${item.name}</h6>
                        <p class="text-muted mb-0">$${item.price}</p>
                    </div>
                    <div class="col-md-3">
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="cart.updateQuantity(${item.id}, ${item.quantity - 1})">
                                <i class="fas fa-minus"></i>
                            </button>
                            <input type="number" class="quantity-input" value="${item.quantity}" 
                                   onchange="cart.updateQuantity(${item.id}, parseInt(this.value))" min="1">
                            <button class="quantity-btn" onclick="cart.updateQuantity(${item.id}, ${item.quantity + 1})">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <strong>$${(item.price * item.quantity).toFixed(2)}</strong>
                    </div>
                    <div class="col-md-1">
                        <button class="btn btn-outline-danger btn-sm" onclick="cart.removeItem(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        this.updateCartSummary();
    }

    // Actualizar resumen del carrito
    updateCartSummary() {
        const subtotal = this.getTotalPrice();
        const shipping = subtotal > 0 ? 10 : 0;
        const total = subtotal + shipping;

        const subtotalElement = document.getElementById('subtotal');
        const totalElement = document.getElementById('total');

        if (subtotalElement) {
            subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        }
        
        if (totalElement) {
            totalElement.textContent = `$${total.toFixed(2)}`;
        }
    }

    // Vaciar carrito
    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartCount();
        this.renderCartItems();
    }
}

// Instancia global del carrito
const cart = new ShoppingCart();

// Función global para agregar al carrito (llamada desde los botones)
function addToCart(productId, quantity = 1) {
    cart.addItem(productId, quantity);
}

// Función para proceder al checkout
function checkout() {
    if (cart.items.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }

    // Simulación de proceso de pago
    const total = cart.getTotalPrice() + 10; // Incluir envío
    const confirmed = confirm(`¿Confirmar compra por $${total.toFixed(2)}?`);
    
    if (confirmed) {
        alert('¡Compra realizada con éxito! Recibirás un email de confirmación.');
        cart.clearCart();
        window.location.href = 'index.html';
    }
}