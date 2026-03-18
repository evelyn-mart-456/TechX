
function loadCarouselItem(product, active) {
    const carouselItem = `
    <div class="carousel-item ${active ? " active" : ""}">
        <div class="d-flex justify-content-center">    
            <div class="card" style="width: 20rem; height: 24rem;">
                <img src="product-images/${product.ProductImage}" class="card-img-top" alt="...">
                <div class="card-body">
                    <a class="link-underline-light" href="/product/${product.ProductID}"><h5 class="card-title">${product.ProductName}</h5></a>
                    <p class="card-text">${product.ProductDesc.slice(0, 60)}</p>
                    <a href="${product.ProductLink}" class="btn btn-primary me-1">Source</a><span>$${product.RetailPrice}</span>
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

async function buildCarousel() {
    const container = document.getElementById("featured-tech");

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
            </div>
        </div>`;
    
    const carousel = document.getElementById("carousel-inner");

    loadFeaturedProducts(carousel);
}

buildCarousel();