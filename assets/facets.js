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
                // Parche: forzar scroll pequeño para "despertar" el lazyload
        window.scrollBy(0, 1);
        window.scrollBy(0, -1);
      })
      .catch(err => {
        console.error('Error updating products via AJAX', err);
      });
  });
});


document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".accordion-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const parent = btn.closest(".accordion-item");
      parent.classList.toggle("active");
    });
  });
});

// Script para manejar el botón "Agregar al carrito" y mostrar notificaciones
document.addEventListener('DOMContentLoaded', function() {
  // Manejar el agregar al carrito
  document.querySelectorAll('.add-to-cart-btn:not([disabled])').forEach(button => {
    button.addEventListener('click', async function(e) {
      e.preventDefault();
      const form = this.closest('form');
      
      try {
        // Mostrar loader
        this.classList.add('loading');
        const originalText = this.innerHTML;
        this.innerHTML = '<span>Agregando...</span>';
        
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            items: [{
              id: form.querySelector('input[name="id"]').value,
              quantity: 1
            }]
          })
        });
        
        const result = await response.json();
         
        // Actualizar el carrito
        if (typeof Shopify !== 'undefined' && Shopify.theme.cart) {
          Shopify.theme.cart.getCart();
        }
        
        // Mostrar notificación
        showNotification('Producto agregado al carrito');
        
      } catch (error) {
        console.error('Error:', error);
        showNotification('Error al agregar el producto', true);
      } finally {
        if (button && !button.disabled) {
          button.classList.remove('loading');
          button.innerHTML = '<span>Agregar al carrito</span>'; 
        } 
      }
    });
  });

  function showNotification(message, isError = false) {
    const notification = document.createElement('div');
    notification.className = `cart-notification ${isError ? 'error' : ''}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }
});


 // Script para insertar CSS en el head del iframe de la aplicación de carrito
  document.addEventListener("DOMContentLoaded", function () { 
   setTimeout(()=>{
     const iframe = document.getElementById("cro-cart-app-iframe"); 
if (iframe && iframe.contentDocument) { 
    const iframeHead = iframe.contentDocument.head;

    if (iframeHead) {
        const style = iframe.contentDocument.createElement('style');
        style.type = 'text/css';
        style.innerHTML = ` .CROCart__sc-1a3j46a-4 p::before, .sc-hVcFVo.kvvalc>div:nth-child(2)::before,.CROCart__sc-srrv9y-2::before, .sc-lnsjTu>span::before, .sc-iEYVpv.bWoTyo::before, .sc-iqziPC.bJfsxJ::before, .sc-BCDEK.bJfPsG::before{
        content: "S/";
    }
        `;
        iframeHead.appendChild(style);
        console.log('CSS insertado exitosamente en el head del iframe.');
    } else {
        console.error('No se pudo acceder al head del iframe.');
    }
} else {
    console.error('El iframe o su contentDocument no están disponibles.');
}
   },2000)
  }); 