'use strict';
fetch("js/data.json")
    .then(response => response.json())
    .then(products => {
        const saveProducts = prods => localStorage.setItem('products', JSON.stringify(prods));
        saveProducts(products);

        const productsOffersContainer = document.querySelector('.sectionOffers__container');
        const productsNewArrivalContainer = document.querySelector('.sectionNewArrival__container');

        const seeMoreElectricBtn = document.querySelector('.header__electric');
        const seeMoreAcousticBtn = document.querySelector('.header__acoustic');
        const seeDiscountsBtn = document.querySelector('.header__discount');
        const seeMoreOffersBtn = document.querySelector('#seeMoreOffers');
        const seeMoreNewSeasonBtn = document.querySelector('#seeMoreNewSeason');

        class Producto {
            constructor(obj) {
                this.name = obj.name;
                this.price = obj.price;
                this.image = obj.image;
                this.stock = obj.stock;
                this.id = obj.id;
                this.discount = obj.discount;
                this.discountMoney = obj.discountMoney;
                this.newSeason = obj.newSeason;
            }
        }

        const productsOffer = products.filter(e => e.discount);
        const productsOfferSorted = productsOffer.sort((a, b) => b.discount - a.discount);

        const productsNewArrival = products.filter(e => e.newArrival);

        const numberFormat = new Intl.NumberFormat('es-ES');

        const productCreator = prod => {
            return `
        <div class="sectionSales__sale" data-key="${prod.id}">
            <div class="sale__imgContainer">
                <img src="${prod.frontImg}" class="sale__img">
            </div>
            <div class="sale__text">
                <p class="sale__title">${prod.name}</p>
                <p class="sale__price">${prod.discount ? `<span>$${numberFormat.format(prod.price + prod.discount)}</span> ` : ''}$${numberFormat.format(prod.price)}</p>
                <div class="sale__addCart">Agregar al carrito</div>
            </div>
        </div>
        `
        }

        productsOfferSorted.forEach((prod, i) => {
            if (i < 4) {
                productsOffersContainer.innerHTML += productCreator(prod);
            }
        })

        productsNewArrival.forEach((prod, i) => {
            if (i < 4) {
                productsNewArrivalContainer.innerHTML += productCreator(prod);
            }
        })

        const saveFilters = filter => {
            localStorage.setItem('filters', JSON.stringify([filter]));
        }

        seeMoreElectricBtn.onclick = () => {
            saveFilters('electric');
        }
        seeMoreAcousticBtn.onclick = () => {
            saveFilters('acoustic');
        }
        seeDiscountsBtn.onclick = () => {
            saveFilters('offers');
        }
        seeMoreOffersBtn.onclick = () => {
            saveFilters('offers');
        }
        seeMoreNewSeasonBtn.onclick = () => {
            saveFilters('newArrivals');
        }

        // CARGAR CARRITO (script "cart.js")
        cargarCarrito()
    })

