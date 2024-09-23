const query = `
	    {
	      products(first: 10) {
	        edges {
	          node {
	            title
	            description
	            variants(first: 1) { edges { node { price { amount currencyCode } compareAtPrice{ amount currencyCode } } } }
	            images(first: 2) { edges { node { url altText } } }
	          }
	        }
	      }
	    }
	  `;

	  const url = 'https://tsodykteststore.myshopify.com/api/2023-01/graphql.json';
	  const token = '7e174585a317d187255660745da44cc7';

	  const fetchShopifyData = async () => {
	    const response = await fetch(url, {
	      method: 'POST',
	      headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': token },
	      body: JSON.stringify({ query })
	    });

	    const { data } = await response.json();
	    const productList = document.getElementById('product-list');

	    data.products.edges.forEach(({ node: { title, description, variants, images } }, index) => {
	      const price = `${variants.edges[0].node.price.amount}`;
	      const compareAtPrice = `${variants.edges[0].node.compareAtPrice.amount}`;
	      const image = images.edges[0]?.node.url || '';
	      const altText = images.edges[0]?.node.altText || 'Изображение продукта';
	      const secondImage = images.edges[1]?.node.url || image; // Якщо нема другого зображення, використовується перше

	      productList.innerHTML += `
	        <div class="product" data-index="${index}">
	          <img class="product-image" src="${image}" alt="${altText}" data-original="${image}" data-hover="${secondImage}">
	          <h2 class="product-title">${title}</h2>
	          <p class="product-description">${description}</p>
	          <p class="product-price">
	            ${compareAtPrice ? `<span class="price-product price-old">${compareAtPrice}</span>` : ''}
	            <span class="price-product">${price}</span>
	          </p>
	        </div>
	      `;
	    });

	    const products = document.querySelectorAll('.product');
	    products.forEach(product => {
	      const productImage = product.querySelector('.product-image');

	      product.addEventListener('mouseenter', () => {
	        productImage.src = productImage.dataset.hover;
	      });

	      product.addEventListener('mouseleave', () => {
	      	productImage.src = productImage.dataset.original; 
	      });
	    });
	  };

	  fetchShopifyData().catch(console.error);
document.addEventListener('DOMContentLoaded', () => {
  const toggles = document.querySelectorAll('.accordion__toggle');
  
  toggles.forEach(toggleButton => {
    toggleButton.addEventListener('click', () => {
  
      const content = toggleButton.parentElement.nextElementSibling;

      content.style.display = content.style.display === 'block' ? 'none' : 'block';

      toggleButton.textContent = toggleButton.textContent === '+' ? '-' : '+';

       const accordion = toggleButton.closest('.accordion');
      accordion.classList.toggle('active');
    });
  });
});

