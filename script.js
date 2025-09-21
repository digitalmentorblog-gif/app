// 장바구니 상태 관리
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// DOM 요소 로드 후 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// 앱 초기화
function initializeApp() {
    updateCartCount();
    updateFavoriteButtons();
    setupEventListeners();
    setupFilterButtons();
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 장바구니 추가 버튼
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });

    // 좋아요 버튼
    document.querySelectorAll('.favorite-btn').forEach(button => {
        button.addEventListener('click', handleToggleFavorite);
    });

    // 메뉴 버튼
    document.querySelector('.menu-btn').addEventListener('click', handleMenuClick);

    // 장바구니 버튼
    document.querySelector('.cart-btn').addEventListener('click', handleCartClick);

    // 검색 버튼
    document.querySelector('.search-btn').addEventListener('click', handleSearchClick);

    // 장바구니 모달 닫기 버튼
    document.querySelector('.cart-modal-close').addEventListener('click', hideCartModal);

    // 모달 배경 클릭 시 닫기
    document.getElementById('cart-modal').addEventListener('click', function(event) {
        if (event.target === this) {
            hideCartModal();
        }
    });

    // 결제 버튼
    document.querySelector('.checkout-btn').addEventListener('click', handleCheckout);
}

// 필터 버튼 설정
function setupFilterButtons() {
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', function() {
            // 활성 상태 토글
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');

            // 필터 적용
            const filterType = this.textContent.trim();
            applyFilter(filterType);
        });
    });
}

// 장바구니에 상품 추가
function handleAddToCart(event) {
    const button = event.currentTarget;
    const productId = button.dataset.product;
    const productPrice = parseFloat(button.dataset.price);
    const productCard = button.closest('.product-card');
    const productName = productCard.querySelector('.product-name').textContent;
    const productImage = productCard.querySelector('.product-image img').src;

    // 장바구니에 상품 정보 추가
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
        });
    }

    // 로컬 스토리지에 저장
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // UI 업데이트
    updateCartCount();
    showNotification(`${productName}이(가) 장바구니에 추가되었습니다!`);
    
    // 버튼 애니메이션
    animateButton(button);
}

// 좋아요 토글
function handleToggleFavorite(event) {
    const button = event.currentTarget;
    const productId = button.dataset.product;
    const icon = button.querySelector('i');

    if (favorites.includes(productId)) {
        // 좋아요 제거
        favorites = favorites.filter(id => id !== productId);
        icon.classList.remove('fas');
        icon.classList.add('far');
        button.classList.remove('active');
    } else {
        // 좋아요 추가
        favorites.push(productId);
        icon.classList.remove('far');
        icon.classList.add('fas');
        button.classList.add('active');
    }

    // 로컬 스토리지에 저장
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    // 애니메이션
    animateButton(button);
}

// 장바구니 개수 업데이트
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartBtn = document.querySelector('.cart-btn');
    
    // 기존 배지 제거
    const existingBadge = cartBtn.querySelector('.cart-badge');
    if (existingBadge) {
        existingBadge.remove();
    }

    // 상품이 있을 때만 배지 표시
    if (totalItems > 0) {
        const badge = document.createElement('span');
        badge.className = 'cart-badge';
        badge.textContent = totalItems;
        badge.style.cssText = `
            position: absolute;
            top: -5px;
            right: -5px;
            background-color: #dc3545;
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            font-size: 0.75rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        `;
        cartBtn.style.position = 'relative';
        cartBtn.appendChild(badge);
    }
}

// 좋아요 버튼 상태 업데이트
function updateFavoriteButtons() {
    document.querySelectorAll('.favorite-btn').forEach(button => {
        const productId = button.dataset.product;
        const icon = button.querySelector('i');
        
        if (favorites.includes(productId)) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            button.classList.add('active');
        }
    });
}

// 필터 적용
function applyFilter(filterType) {
    const productCards = document.querySelectorAll('.product-card');
    const productsArray = Array.from(productCards);

    let sortedProducts = [];

    switch (filterType) {
        case 'A-Z':
            sortedProducts = productsArray.sort((a, b) => {
                const nameA = a.querySelector('.product-name').textContent;
                const nameB = b.querySelector('.product-name').textContent;
                return nameA.localeCompare(nameB);
            });
            break;
        
        case '$ → $$':
            sortedProducts = productsArray.sort((a, b) => {
                const priceA = parseFloat(a.querySelector('.add-to-cart-btn').dataset.price);
                const priceB = parseFloat(b.querySelector('.add-to-cart-btn').dataset.price);
                return priceA - priceB;
            });
            break;
        
        default: // Default
            // 원본 순서로 복원
            sortedProducts = productsArray;
            break;
    }

    // DOM에서 카드들을 재정렬
    const container = document.querySelector('.products-grid');
    sortedProducts.forEach(card => {
        container.appendChild(card);
    });

    // 애니메이션 효과
    productCards.forEach(card => {
        card.style.animation = 'fadeIn 0.3s ease-in-out';
    });
}

// 메뉴 클릭 핸들러
function handleMenuClick() {
    showNotification('메뉴 기능은 준비 중입니다.');
}

// 장바구니 클릭 핸들러
function handleCartClick() {
    showCartModal();
}

// 검색 클릭 핸들러
function handleSearchClick() {
    showNotification('검색 기능은 준비 중입니다.');
}

// 알림 메시지 표시
function showNotification(message) {
    // 기존 알림 제거
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // 새 알림 생성
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // 애니메이션으로 표시
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // 3초 후 제거
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// 버튼 애니메이션
function animateButton(button) {
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 100);
}

// 페이지 로드 애니메이션
function animatePageLoad() {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// 스크롤 이벤트 (성능 최적화)
let ticking = false;

function updateScrollBehavior() {
    const navbar = document.querySelector('.navbar');
    const scrolled = window.scrollY > 10;
    
    if (scrolled) {
        navbar.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
    }
    
    ticking = false;
}

window.addEventListener('scroll', function() {
    if (!ticking) {
        requestAnimationFrame(updateScrollBehavior);
        ticking = true;
    }
});

// 장바구니 모달 표시
function showCartModal() {
    const modal = document.getElementById('cart-modal');
    renderCartItems();
    updateCartTotal();
    modal.classList.add('show');
    
    // ESC 키로 닫기
    document.addEventListener('keydown', handleEscapeKey);
    
    // 바디 스크롤 방지
    document.body.style.overflow = 'hidden';
}

// 장바구니 모달 숨기기
function hideCartModal() {
    const modal = document.getElementById('cart-modal');
    modal.classList.remove('show');
    
    // ESC 키 이벤트 제거
    document.removeEventListener('keydown', handleEscapeKey);
    
    // 바디 스크롤 복원
    document.body.style.overflow = '';
}

// ESC 키 핸들러
function handleEscapeKey(event) {
    if (event.key === 'Escape') {
        hideCartModal();
    }
}

// 장바구니 아이템 렌더링
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartEmptyContainer = document.getElementById('cart-empty');
    
    // 컨테이너 초기화
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.style.display = 'none';
        cartEmptyContainer.style.display = 'block';
        return;
    }
    
    cartItemsContainer.style.display = 'block';
    cartEmptyContainer.style.display = 'none';
    
    cart.forEach(item => {
        const cartItemElement = createCartItemElement(item);
        cartItemsContainer.appendChild(cartItemElement);
    });
}

// 장바구니 아이템 요소 생성
function createCartItemElement(item) {
    const itemElement = document.createElement('div');
    itemElement.className = 'cart-item';
    itemElement.dataset.productId = item.id;
    
    itemElement.innerHTML = `
        <div class="cart-item-image">
            <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">$${item.price.toFixed(2)} 개당</div>
            <div class="cart-item-controls">
                <button class="quantity-btn decrease-btn" data-product-id="${item.id}" ${item.quantity <= 1 ? 'disabled' : ''}>
                    <i class="fas fa-minus"></i>
                </button>
                <span class="cart-item-quantity">${item.quantity}</span>
                <button class="quantity-btn increase-btn" data-product-id="${item.id}">
                    <i class="fas fa-plus"></i>
                </button>
                <button class="cart-item-delete" data-product-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    
    // 이벤트 리스너 추가
    const decreaseBtn = itemElement.querySelector('.decrease-btn');
    const increaseBtn = itemElement.querySelector('.increase-btn');
    const deleteBtn = itemElement.querySelector('.cart-item-delete');
    
    decreaseBtn.addEventListener('click', () => decreaseQuantity(item.id));
    increaseBtn.addEventListener('click', () => increaseQuantity(item.id));
    deleteBtn.addEventListener('click', () => removeFromCart(item.id));
    
    return itemElement;
}

// 수량 감소
function decreaseQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    if (item && item.quantity > 1) {
        item.quantity -= 1;
        updateCartStorage();
        renderCartItems();
        updateCartTotal();
        updateCartCount();
        
        // 애니메이션 효과
        animateCartUpdate();
    }
}

// 수량 증가
function increaseQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += 1;
        updateCartStorage();
        renderCartItems();
        updateCartTotal();
        updateCartCount();
        
        // 애니메이션 효과
        animateCartUpdate();
    }
}

// 장바구니에서 상품 제거
function removeFromCart(productId) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex !== -1) {
        const item = cart[itemIndex];
        cart.splice(itemIndex, 1);
        updateCartStorage();
        renderCartItems();
        updateCartTotal();
        updateCartCount();
        
        showNotification(`${item.name}이(가) 장바구니에서 제거되었습니다.`);
        
        // 애니메이션 효과
        animateCartUpdate();
    }
}

// 장바구니 저장
function updateCartStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// 장바구니 총합 업데이트
function updateCartTotal() {
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalPriceElement = document.getElementById('cart-total-price');
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
    
    // 장바구니가 비어있으면 결제 버튼 비활성화
    if (cart.length === 0) {
        checkoutBtn.disabled = true;
    } else {
        checkoutBtn.disabled = false;
    }
}

// 장바구니 업데이트 애니메이션
function animateCartUpdate() {
    const cartModal = document.querySelector('.cart-modal-content');
    cartModal.style.transform = 'scale(0.98)';
    setTimeout(() => {
        cartModal.style.transform = 'scale(1)';
    }, 100);
}

// 결제 핸들러
function handleCheckout() {
    if (cart.length === 0) {
        showNotification('장바구니가 비어있습니다.');
        return;
    }
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // 실제 결제 로직은 여기에 구현
    showNotification(`결제 기능은 준비 중입니다. (${totalItems}개 상품, $${totalPrice.toFixed(2)})`);
    
    // 데모용: 결제 완료 후 장바구니 비우기 (실제로는 서버 응답 후 처리)
    // cart = [];
    // updateCartStorage();
    // hideCartModal();
    // updateCartCount();
}

// 페이지 로드 시 애니메이션 실행
window.addEventListener('load', function() {
    animatePageLoad();
});

// CSS 애니메이션 추가 (동적으로 스타일 추가)
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes pulse {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
        100% {
            transform: scale(1);
        }
    }
    
    .cart-badge {
        animation: pulse 0.3s ease-in-out;
    }
`;
document.head.appendChild(style);
