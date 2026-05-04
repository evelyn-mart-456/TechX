
function loadCarouselItem(product, active) {
    const carouselItem = `
    <div class="carousel-item ${active ? " active" : ""}">
        <div class="d-flex justify-content-center">    
            <div class="card" style="width: 20rem; height: 24rem;">
                <img src="product-images/${product.ProductImage}" class="card-img-top" alt="...">
                <div class="card-body">
                    <a class="link-underline-light" href="/product/${product.ProductID}"><h5 class="card-title">${product.ProductName}</h5></a>
                    <p class="card-text">${product.ProductDesc.slice(0, 60)}</p>
                    <div class="d-flex flex-wrap align-items-center gap-2">
    <a href="${product.ProductLink}" class="btn btn-primary">Source</a>
    <button 
        type="button" 
        class="btn btn-success add-to-cart-btn" 
        data-productid="${product.ProductID}">
        Add to Cart
    </button>
    <span class="ms-auto fw-bold">$${product.RetailPrice}</span>
</div>
                </div>
            </div>
        </div>
    </div>
    `;

    return carouselItem;
}

async function loadFeaturedProducts(carousel) {
    const res = await fetch('/featured-products');
    const data = await res.json();

    data.results.forEach((product, index) => {
        const active = index === 0;
        const carouselItem = loadCarouselItem(product, active);

        carousel.insertAdjacentHTML("beforeend", carouselItem);
    });
}

function registerCarouselCartHandler(container) {
    container.addEventListener('click', async (event) => {
        const button = event.target.closest('.add-to-cart-btn');
        if (!button) return;

        const productId = button.dataset.productid;
        const sessionRes = await fetch('/api/session');
        const session = await sessionRes.json();
        if (!session.loggedIn) {
            alert('Please log in to add items to cart.');
            return;
        }

        try {
            const addRes = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, quantity: 1 })
            });
            const addData = await addRes.json();
            if (addData.success) {
                alert('Item added to cart!');
            } else {
                alert('Failed to add item to cart: ' + (addData.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Failed to add item to cart:', error);
            alert('Failed to add item to cart. Please try again.');
        }
    });
}

async function buildCarousel() {
    const container = document.getElementById('featured-tech');

    container.innerHTML = `
        <h2 class="mb-4 border-bottom">Featured Tech</h2>
        <div id="featured-carousel" class="carousel slide bg-dark" data-bs-interval="5000" data-bs-ride="carousel">
            <div class="carousel-inner" id="carousel-inner">
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#featured-carousel" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#featured-carousel" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        </div>`;
    
    const carousel = document.getElementById("carousel-inner");

    await loadFeaturedProducts(carousel);
    registerCarouselCartHandler(carousel);
}

buildCarousel();