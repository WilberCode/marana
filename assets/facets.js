document.addEventListener("DOMContentLoaded", function () {
  const filterForm = document.querySelector('#FacetFiltersForm');
  const productContainer = document.querySelector('[data-products]'); 
  if (!filterForm || !productContainer) return;

  filterForm.addEventListener('change', function () {
    const url = new URL(window.location.href);
    const formData = new FormData(filterForm);
    const params = new URLSearchParams();

    for (const [key, value] of formData.entries()) {
      params.append(key, value);
    }

    url.search = params.toString();

    fetch(url.toString())
      .then(res => res.text())
      .then((html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Replace product list
        const newProducts = doc.querySelector('[data-products]');
        if (newProducts) productContainer.innerHTML = newProducts.innerHTML;

        // Update URL without reload
        window.history.pushState({}, '', url.toString());
      })
      .catch(err => {
        console.error('Error updating products via AJAX', err);
      });
  });
});
