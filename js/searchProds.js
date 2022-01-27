'use strict';
window.onload = () => {
    const products = JSON.parse(localStorage.getItem('products'));

    // Llamadas con jquery
    const resultsContainer = $('.results__section')[0];
    const resultsTitle = $('.results__title')[0];
    const resultsSelect = $('.results__select')[0];

    const filterContainer = document.querySelector('.filter__filtersContainer');
    const filterTextContainer = document.querySelector('.filter__textContainer');
    const filtersBtn = document.querySelector('.filter__btn');
    const filterArrowIcon = document.querySelector('.filter__icon');
    const filterCheckBox = [...document.querySelectorAll('#filterCheckBox')];

    const showFiltersContainer = document.querySelector('.results__showFilters');
    const filterTagContainer = document.querySelector('.results__filterTagContainer');

    resultsTitle.innerHTML = `${products.length} resultados`

    const numberFormat = new Intl.NumberFormat('es-ES');

    const productCreator = prod => {
        return `
            <div class="sectionSales__sale" data-key="${prod.id}">
                <div class="sale__imgContainer">
                    <img src="../${prod.frontImg}" class="sale__img">
                </div>
                <div class="sale__text">
                    <p class="sale__title">${prod.name}</p>
                    <p class="sale__price">${prod.discount ? `<span>$${numberFormat.format(prod.price + prod.discount)}</span> ` : ''}$${numberFormat.format(prod.price)}</p>
                    <div class="sale__addCart">Agregar al carrito</div>
                </div>
            </div>
            `
    }

    products.sort((a, b) => b.popularity - a.popularity).forEach(prod => {
        resultsContainer.innerHTML += productCreator(prod);
    });

    let sortOption;

    resultsSelect.addEventListener('change', () => {
        sortOption = resultsSelect.options[resultsSelect.selectedIndex].value;
        showResults(sortProducts(sortOption));
        updateAddCartBtn();
    });

    const sortProducts = (option = 'relevantes') => {
        let arr = []
        let sortArray = [...products];
        if (filters.length >= 1) {
            sortArray = [...filteredArr];
        }
        switch (option) {
            case 'relevantes':
                arr = sortArray.sort((a, b) => b.popularity - a.popularity);
                break;
            case 'precioMen':
                arr = sortArray.sort((a, b) => a.price - b.price);
                break;
            case 'precioMay':
                arr = sortArray.sort((a, b) => b.price - a.price);
                break;
        }
        return arr;
    };

    filterTextContainer.onclick = () => {
        filterArrowIcon.classList.toggle('fa-chevron-up');
        filterContainer.classList.toggle('d-none');
    };

    const showResults = arr => {
        resultsContainer.innerHTML = '';
        arr.forEach(el => {
            resultsContainer.innerHTML += productCreator(el);
        });
        resultsTitle.innerHTML = `${arr.length} resultados`;
    }

    let filteredArr = [];
    let filters = JSON.parse(localStorage.getItem('filters')) || [];


    const checkBoxStatus = () => {
        filterCheckBox.forEach(cb => {
            if (filters.includes(cb.value)) cb.checked = true;
            else cb.checked = false;
        })
    }
    const getCheckBoxSelected = () => {
        filters = [];
        filterCheckBox.forEach(cb => {
            if (cb.checked) filters.push(cb.value);
        })
        localStorage.setItem('filters', JSON.stringify(filters));
    }
    const closeFilter = () => {
        const closeFilterTag = [...document.querySelectorAll('#filterTagDeleteBtn')];
        closeFilterTag.forEach(btn => {
            btn.onclick = () => {
                filters = filters.filter(e => e !== btn.parentNode.dataset.value);
                localStorage.setItem('filters', JSON.stringify(filters));
                checkBoxStatus();
                sortProducts(sortOption);
                filterFunc();
                updateAddCartBtn();
            }
        });
    }
    const filterFunc = () => {
        if (filters.length >= 1) {
            filterTagContainer.innerHTML = '';
            resultsContainer.innerHTML = '';
            filters.forEach(filter => {
                let selectedFilter = '';
                switch (filter) {
                    case 'offers':
                        filteredArr = products.filter(e => e.discount);
                        selectedFilter = 'Ofertas';
                        break;
                    case 'newArrivals':
                        filteredArr = products.filter(e => e.newArrival);
                        selectedFilter = 'Recien Llegados';
                        break;
                    case 'electric':
                        if (filters.length >= 2) {
                            filteredArr = filteredArr.filter(e => e.type === 'electric');
                        } else {
                            filteredArr = products.filter(e => e.type === 'electric');
                        }
                        selectedFilter = 'Electricas';
                        break;
                    case 'acoustic':
                        if (filters.length >= 2) {
                            filteredArr = filteredArr.filter(e => e.type === 'acoustic');
                        } else {
                            filteredArr = products.filter(e => e.type === 'acoustic');
                        }
                        selectedFilter = 'Acusticas';
                        break;
                    case 'classical':
                        if (filters.length >= 2) {
                            filteredArr = filteredArr.filter(e => e.type === 'classical');
                        } else {
                            filteredArr = products.filter(e => e.type === 'classical');
                        }
                        selectedFilter = 'Clasicas';
                        break;
                }
                filterTagContainer.innerHTML += `
                    <span class="results__filterTag" data-value="${filter}">${selectedFilter}
                        <i class="fas fa-times" id="filterTagDeleteBtn"></i>
                    </span>`;
            })
            closeFilter();

            showFiltersContainer.classList.remove('d-none');
        } else {
            showFiltersContainer.classList.add('d-none');
        }
        showResults(sortProducts(sortOption));
    }

    if (filters.length >= 1) {
        filterFunc();
        checkBoxStatus();
    }

    filtersBtn.onclick = () => {
        getCheckBoxSelected();
        filterFunc();
        updateAddCartBtn();
        filterArrowIcon.classList.toggle('fa-chevron-up');
        filterContainer.classList.toggle('d-none');
    }

    cargarCarrito('../');
}