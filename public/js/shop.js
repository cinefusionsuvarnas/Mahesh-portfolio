(function() {
const cartCountHeader = document.querySelector('#cartCountHeader');
const toast = document.querySelector('#purchaseToast');
const storeGrid = document.querySelector('.product-store-grid');
const cartToggleBtn = document.querySelector('#cartToggleBtn');

const cartOverlay = document.querySelector('#cartOverlay');
const cartSidebar = document.querySelector('#cartSidebar');
const cartCloseBtn = document.querySelector('#cartCloseBtn');
const continueShoppingBtn = document.querySelector('#continueShoppingBtn');
const cartEmptyState = document.querySelector('#cartEmptyState');
const cartItemsList = document.querySelector('#cartItemsList');
const cartFooter = document.querySelector('#cartFooter');
const cartTotalAmount = document.querySelector('#cartTotalAmount');

const checkoutForm = document.querySelector('#checkoutForm');
const checkoutMessage = document.querySelector('#checkoutMessage');
const submitCheckoutBtn = document.querySelector('#submitCheckoutBtn');

let cartItems = [];
let cartTotal = 0;

function updateCartUI() {
  // Update header count
  if (cartCountHeader) {
    cartCountHeader.textContent = cartItems.length;
  }
  
  // Calculate total
  cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  
  if (cartItems.length === 0) {
    // Show empty state
    if(cartEmptyState) cartEmptyState.style.display = 'flex';
    if(cartItemsList) cartItemsList.style.display = 'none';
    if(cartFooter) cartFooter.style.display = 'none';
  } else {
    // Show items
    if(cartEmptyState) cartEmptyState.style.display = 'none';
    if(cartItemsList) {
      cartItemsList.style.display = 'flex';
      cartItemsList.innerHTML = cartItems.map((item, index) => `
        <div class="cart-item">
          ${item.image ? `<img src="../${item.image}" alt="${item.name}" class="cart-item-img">` : `<div class="cart-item-img-placeholder"></div>`}
          <div class="cart-item-info">
            <span class="cart-item-title">${item.name}</span>
            <span class="cart-item-price">?${item.price.toFixed(2)}</span>
          </div>
          <button type="button" class="cart-close" style="font-size:18px;" onclick="removeCartItem(${index})" aria-label="Remove item">&times;</button>
        </div>
      `).join('');
    }
    if(cartFooter) {
      cartFooter.style.display = 'block';
      if(cartTotalAmount) cartTotalAmount.textContent = cartTotal.toFixed(2);
    }
  }
}

// Function exposed globally to remove items
window.removeCartItem = (index) => {
  cartItems.splice(index, 1);
  updateCartUI();
};

function handleBuyClick(productName, productPrice, productImage) {
  cartItems.push({ name: productName, price: parseFloat(productPrice) || 0, image: productImage || '' });
  updateCartUI();
  
  if (toast) {
    toast.textContent = `${productName} added to cart.`;
    toast.classList.add('show');
    window.setTimeout(() => toast.classList.remove('show'), 2600);
  }
  
  // Optionally open the cart automatically when an item is added
  // openCart();
}

function openCart() {
  if (cartOverlay && cartSidebar) {
    cartOverlay.classList.add('active');
    cartSidebar.classList.add('open');
  }
}

function closeCart() {
  if (cartOverlay && cartSidebar) {
    cartOverlay.classList.remove('active');
    cartSidebar.classList.remove('open');
  }
}

// Event delegation for dynamic elements (Buy buttons)
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('buy-button')) {
    handleBuyClick(e.target.dataset.product, e.target.dataset.price, e.target.dataset.image);
  }
});

// Sidebar Event Listeners
if (cartToggleBtn) cartToggleBtn.addEventListener('click', openCart);
if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
if (cartOverlay) cartOverlay.addEventListener('click', closeCart);
if (continueShoppingBtn) continueShoppingBtn.addEventListener('click', closeCart);

// Checkout Form Submission
if (checkoutForm) {
  const proceedToPayBtn = document.querySelector('#proceedToPayBtn');
  const backToStep1Btn = document.querySelector('#backToStep1Btn');
  const checkoutStep1 = document.querySelector('#checkoutStep1');
  const checkoutStep2 = document.querySelector('#checkoutStep2');
  const qrAmountDisplay = document.querySelector('#qrAmountDisplay');
  const customerName = document.querySelector('#customerName');
  const customerEmail = document.querySelector('#customerEmail');
  const customerPhone = document.querySelector('#customerPhone');
  const cartSuccessState = document.querySelector('#cartSuccessState');
  const closeSuccessBtn = document.querySelector('#closeSuccessBtn');

  if (closeSuccessBtn) {
    closeSuccessBtn.addEventListener('click', () => {
      // Reset cart and UI after manual dismiss
      cartItems = [];
      updateCartUI();
      checkoutForm.reset();
      checkoutStep2.style.display = 'none';
      checkoutStep1.style.display = 'flex';
      
      if(cartSuccessState) cartSuccessState.style.display = 'none';
      
      closeCart();
      
      // Restore buttons
      submitCheckoutBtn.style.display = 'block';
      if (backToStep1Btn) backToStep1Btn.style.display = 'block';
    });
  }

  if (proceedToPayBtn) {
    proceedToPayBtn.addEventListener('click', () => {
      // Validate Step 1 fields properly
      const step1Valid = customerName.checkValidity() && customerEmail.checkValidity() && customerPhone.checkValidity();
      if (!step1Valid) {
        checkoutForm.reportValidity();
        return;
      }
      checkoutStep1.style.display = 'none';
      checkoutStep2.style.display = 'flex';
      if (qrAmountDisplay) {
        qrAmountDisplay.textContent = cartTotal.toFixed(2);
      }
    });
  }

  if (backToStep1Btn) {
    backToStep1Btn.addEventListener('click', () => {
      checkoutStep2.style.display = 'none';
      checkoutStep1.style.display = 'flex';
    });
  }

  checkoutForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) return;
    
    if (!document.getElementById('transactionId').value.trim()) {
      checkoutMessage.style.display = 'block';
      checkoutMessage.style.color = '#ff5f5f';
      checkoutMessage.textContent = 'Please enter your Transaction ID.';
      return;
    }
    
    submitCheckoutBtn.textContent = 'Submitting...';
    
    const formData = new FormData(checkoutForm);
    const checkoutData = {
      customer_name: formData.get('customer_name'),
      customer_email: formData.get('customer_email'),
      customer_phone: formData.get('customer_phone'),
      transaction_id: formData.get('transaction_id'),
      total_amount: cartTotal.toFixed(2),
      items: cartItems
    };
    
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkoutData)
      });
      const data = await res.json();
      
      if (data.success) {
        // Show dedicated success state instead of a small message
        if (cartFooter) cartFooter.style.display = 'none';
        if (cartItemsList) cartItemsList.style.display = 'none';
        if (cartSuccessState) cartSuccessState.style.display = 'block';
        
      } else {
        checkoutMessage.style.display = 'block';
        checkoutMessage.style.color = '#ff5f5f';
        checkoutMessage.textContent = data.message || 'Submission failed.';
      }
    } catch (error) {
      console.error(error);
      checkoutMessage.style.display = 'block';
      checkoutMessage.style.color = '#ff5f5f';
      checkoutMessage.textContent = 'Network error. Please try again.';
    }
    
    submitCheckoutBtn.innerHTML = 'Confirm Order';
  });
}

// Initial UI sync
updateCartUI();

})();
