document.addEventListener('DOMContentLoaded', () => {
  const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
  const cartContainer = document.getElementById('cart-container');
  const cartBadge = document.getElementById('cart-badge');

  // Fetch and display the cart when the page loads
  fetchAndDisplayCart();

  addToCartButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const productId = button.dataset.productId;

      try {
        const response = await fetch(`/products/${productId}/add-to-cart`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ productId })
        });

        if (!response.ok) {
          throw new Error('Error adding product to cart');
        }

        fetchAndDisplayCart();
      } catch (error) {
        alert('Error adding product to cart');
        console.error('Error adding product to cart:', error);
      }
    });
  });

  async function fetchAndDisplayCart() {
    try {
      const cartResponse = await fetch('/cart', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (cartResponse.ok) {
        const cart = await cartResponse.json();
        updateCartDisplay(cart.products);
        cartContainer.style.display = 'block';
      } else {
        throw new Error('Error retrieving cart data');
      }
    } catch (error) {
      console.error('Error fetching and displaying cart:', error);
    }
  }

  function updateCartDisplay(products) {
    cartContainer.innerHTML = ''; 

    console.log('Products:', products);

    products.forEach(cartItem => {
      const product = cartItem.product; 
      const quantity = cartItem.quantity;

      const cartItemElement = document.createElement('div');
      cartItemElement.classList.add('cart-item');
      cartItemElement.innerHTML = `
        <p>${product.title} - Quantity: ${quantity} - Price: $${product.price}</p>
        <button class="remove-from-cart-btn" data-product-id="${product._id}">Remove</button>
      `;
      cartContainer.appendChild(cartItemElement);
    });

    const totalItems = products.reduce((total, cartItem) => total + cartItem.quantity, 0);
    cartBadge.textContent = totalItems;

    cartContainer.style.display = 'block';

    const removeFromCartButtons = document.querySelectorAll('.remove-from-cart-btn');
    removeFromCartButtons.forEach(button => {
      button.addEventListener('click', async () => {
        const productId = button.dataset.productId;

        try {
          const response = await fetch(`/cart/removeProductCart/${productId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            throw new Error('Error removing product from cart');
          }

          // Fetch and display the updated cart data
          fetchAndDisplayCart();
        } catch (error) {
          alert('Error removing product from cart');
          console.error('Error removing product from cart:', error);
        }
      });
    });

  }

});
