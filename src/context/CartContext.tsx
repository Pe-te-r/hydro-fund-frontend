import React, { createContext, useContext, useEffect, useState } from 'react';

interface CartItem {
    id: string;
    // name: string;
    // price: number;
    quantity: number;
    // image?: string;
}

interface CartContextType {
    cartItems: CartItem[];
    itemCount: number;
    addToCart: (item: Omit<CartItem, 'quantity'>) => void;
    removeFromCart: (itemId: string) => void;
    deleteItem: (itemId: string) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [itemCount, setItemCount] = useState(0);

    // Initialize cart from localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            const parsedCart = JSON.parse(savedCart) as CartItem[];
            setCartItems(parsedCart);
            updateItemCount(parsedCart);
        }
    }, []);

    // Update localStorage and item count when cart changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
        updateItemCount(cartItems);
    }, [cartItems]);

    const updateItemCount = (items: CartItem[]) => {
        const count = items.reduce((total, item) => total + item.quantity, 0);
        setItemCount(count);
    };

    const addToCart = (item: Omit<CartItem, 'quantity'>) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(cartItem => cartItem.id === item.id);

            if (existingItem) {
                return prevItems.map(cartItem =>
                    cartItem.id === item.id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
            }

            return [...prevItems, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (itemId: string) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === itemId);

            if (existingItem?.quantity === 1) {
                return prevItems.filter(item => item.id !== itemId);
            }

            return prevItems.map(item =>
                item.id === itemId
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            );
        });
    };

    const deleteItem = (itemId: string) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                itemCount,
                addToCart,
                removeFromCart,
                deleteItem,
                clearCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};