import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart, useOrder } from "../CartContext";

jest.mock("@data/app.json", () => ({
  footer: {
    contact: {
      items: [
        { label: "Телефон \n за резервации", value: "+359 89 4766273" },
      ],
    },
  },
}));

function wrapper({ children }) {
  return <CartProvider>{children}</CartProvider>;
}

const sampleItem = { title: "Козе сирене", amount: "200г", price: "14.00" };
const sampleItem2 = { title: "Карпачо", amount: "150г", price: "17.99" };

describe("CartContext", () => {
  // 1. useCart throws when used outside CartProvider
  test("useCart throws when used outside CartProvider", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useCart())).toThrow(
      "useOrder must be used within an OrderProvider (CartProvider)"
    );
    consoleSpy.mockRestore();
  });

  // 2. Provides initial empty state
  test("provides initial values with empty order", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.cartTotal).toBe(0);
    expect(result.current.totalCount).toBe(0);
    expect(result.current.orderItems).toHaveLength(0);
    expect(result.current.cartItems).toHaveLength(0);
    expect(result.current.isAnimating).toBe(false);
  });

  // 3. addItem adds an item with quantity 1 and increments totalCount
  test("addItem adds a new item and increments totalCount by 1", () => {
    const { result } = renderHook(() => useOrder(), { wrapper });

    act(() => {
      result.current.addItem(sampleItem);
    });

    expect(result.current.totalCount).toBe(1);
    expect(result.current.orderItems).toHaveLength(1);
    expect(result.current.orderItems[0].title).toBe("Козе сирене");
    expect(result.current.orderItems[0].quantity).toBe(1);
  });

  // 4. addItem increments quantity for duplicate items
  test("addItem increments quantity when same item added multiple times", () => {
    const { result } = renderHook(() => useOrder(), { wrapper });

    act(() => {
      result.current.addItem(sampleItem);
      result.current.addItem(sampleItem);
      result.current.addItem(sampleItem);
    });

    expect(result.current.totalCount).toBe(3);
    expect(result.current.orderItems).toHaveLength(1);
    expect(result.current.orderItems[0].quantity).toBe(3);
  });

  // 5. removeItem decrements quantity by 1
  test("removeItem decrements item quantity by 1", () => {
    const { result } = renderHook(() => useOrder(), { wrapper });

    act(() => {
      result.current.addItem(sampleItem);
      result.current.addItem(sampleItem);
    });
    expect(result.current.totalCount).toBe(2);

    act(() => {
      result.current.removeItem(sampleItem.title, sampleItem.amount);
    });

    expect(result.current.totalCount).toBe(1);
    expect(result.current.orderItems[0].quantity).toBe(1);
  });

  // 6. removeItem removes item entirely when quantity reaches 0
  test("removeItem removes item from list when quantity drops to 0", () => {
    const { result } = renderHook(() => useOrder(), { wrapper });

    act(() => {
      result.current.addItem(sampleItem);
    });

    act(() => {
      result.current.removeItem(sampleItem.title, sampleItem.amount);
    });

    expect(result.current.totalCount).toBe(0);
    expect(result.current.orderItems).toHaveLength(0);
  });

  // 7. removeItem with non-existent item doesn't crash
  test("removeItem with non-existent item does not crash", () => {
    const { result } = renderHook(() => useOrder(), { wrapper });

    act(() => {
      result.current.removeItem("Non-existent item", "");
    });

    expect(result.current.totalCount).toBe(0);
    expect(result.current.orderItems).toHaveLength(0);
  });

  // 8. getItemQuantity returns correct quantity
  test("getItemQuantity returns correct quantity for an item", () => {
    const { result } = renderHook(() => useOrder(), { wrapper });

    expect(result.current.getItemQuantity(sampleItem.title, sampleItem.amount)).toBe(0);

    act(() => {
      result.current.addItem(sampleItem);
      result.current.addItem(sampleItem);
    });

    expect(result.current.getItemQuantity(sampleItem.title, sampleItem.amount)).toBe(2);
  });

  // 9. updateNotes updates notes for an existing item
  test("updateNotes changes notes for a specific item", () => {
    const { result } = renderHook(() => useOrder(), { wrapper });

    act(() => {
      result.current.addItem(sampleItem);
    });

    act(() => {
      result.current.updateNotes(sampleItem.title, sampleItem.amount, "Без лук");
    });

    expect(result.current.orderItems[0].notes).toBe("Без лук");
  });

  // 10. clearOrder empties the order
  test("clearOrder removes all items", () => {
    const { result } = renderHook(() => useOrder(), { wrapper });

    act(() => {
      result.current.addItem(sampleItem);
      result.current.addItem(sampleItem2);
    });
    expect(result.current.orderItems).toHaveLength(2);

    act(() => {
      result.current.clearOrder();
    });

    expect(result.current.orderItems).toHaveLength(0);
    expect(result.current.totalCount).toBe(0);
  });

  // 11. Multiple different items tracked independently
  test("tracks multiple different items independently", () => {
    const { result } = renderHook(() => useOrder(), { wrapper });

    act(() => {
      result.current.addItem(sampleItem);
      result.current.addItem(sampleItem);
      result.current.addItem(sampleItem2);
    });

    expect(result.current.orderItems).toHaveLength(2);
    expect(result.current.totalCount).toBe(3);
    expect(result.current.getItemQuantity(sampleItem.title, sampleItem.amount)).toBe(2);
    expect(result.current.getItemQuantity(sampleItem2.title, sampleItem2.amount)).toBe(1);
  });

  // 12. getOrderText builds correct order summary
  test("getOrderText builds formatted order text", () => {
    const { result } = renderHook(() => useOrder(), { wrapper });

    act(() => {
      result.current.addItem(sampleItem);
    });

    const text = result.current.getOrderText();
    expect(text).toContain("Бих искал/а да поръчам");
    expect(text).toContain("Козе сирене");
    expect(text).toContain("(200г)");
    expect(text).toContain("x1");
    expect(text).toContain("Благодаря!");
  });

  // 13. getOrderText returns empty string with no items
  test("getOrderText returns empty string when no items", () => {
    const { result } = renderHook(() => useOrder(), { wrapper });
    expect(result.current.getOrderText()).toBe("");
  });

  // 14. generateWhatsAppLink includes phone and order text
  test("generateWhatsAppLink generates correct URL", () => {
    const { result } = renderHook(() => useOrder(), { wrapper });

    act(() => {
      result.current.addItem(sampleItem);
    });

    const link = result.current.generateWhatsAppLink();
    expect(link).toMatch(/^https:\/\/wa\.me\/\+359894766273\?text=/);
  });

  // 15. generatePhoneCallLink returns tel: link
  test("generatePhoneCallLink returns correct tel link", () => {
    const { result } = renderHook(() => useOrder(), { wrapper });
    expect(result.current.generatePhoneCallLink()).toBe("tel:+359894766273");
  });

  // 16. Legacy aliases are present
  test("legacy aliases (cartTotal, cartItems, isAnimating) are exposed", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current).toHaveProperty("cartTotal");
    expect(result.current).toHaveProperty("cartItems");
    expect(result.current).toHaveProperty("isAnimating");
    expect(result.current).toHaveProperty("addToCart");
    expect(result.current).toHaveProperty("removeFromCart");
    expect(result.current).toHaveProperty("removeItemByIndex");
    expect(result.current).toHaveProperty("updateItemQuantity");
  });

  // 17. useOrder alias works the same as useCart
  test("useOrder and useCart return the same context", () => {
    const { result: orderResult } = renderHook(() => useOrder(), { wrapper });
    const { result: cartResult } = renderHook(() => useCart(), { wrapper });

    expect(Object.keys(orderResult.current).sort()).toEqual(
      Object.keys(cartResult.current).sort()
    );
  });
});
