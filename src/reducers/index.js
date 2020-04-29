const initialState = {
  books: [],
  cartItems: [],
  loading: true,
  orderedTotal: 0,
  numberOfBooks: 0,
  error: false,
  errorMessage: "",
};

const updateCart = (state, action, amount) => {
  const bookId = action.payload;
  const book = state.books.find((item) => item.id === bookId);
  const bookInCart = state.cartItems.find((item) => item.id === bookId);
  state.orderedTotal += book.price * amount;
  state.numberOfBooks += amount;
  if (bookInCart) {
    const cartItems = state.cartItems.map((item) => {
      if (item.id === bookInCart.id) {
        item.count += amount;
        item.total += book.price * amount;
      }
      return item;
    });
    if (bookInCart.count === 0) {
      return {
        ...state,
        cartItems: state.cartItems.filter((item) => item.id !== bookId),
      };
    } else {
      return { ...state, cartItems };
    }
  } else {
    const newItem = {
      id: book.id,
      name: book.title,
      total: book.price,
      count: 1,
    };
    return {
      ...state,
      cartItems: state.cartItems.concat(newItem),
    };
  }
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "BOOKS_LOADED":
      return {
        ...state,
        books: action.payload,
        loading: false,
      };
    case "BOOKS_LOADING":
      return {
        ...state,
        loading: true,
      };
    case "BOOKS_ERROR":
      return {
        ...state,
        loading: false,
        error: true,
        errorMessage: action.payload,
      };
    case "ALL_BOOKS_REMOVED_FROM_CART":
      const bookId = action.payload;
      const item = state.cartItems.find((item) => item.id === bookId);
      return {
        ...state,
        cartItems: state.cartItems.filter((item) => item.id !== bookId),
        orderedTotal: state.orderedTotal - item.total,
        numberOfBooks: state.numberOfBooks - item.count,
      };
    case "BOOK_REMOVED_FROM_CART":
      return updateCart(state, action, -1);
    case "BOOK_ADDED_TO_CART":
      return updateCart(state, action, 1);
    default:
      return state;
  }
};

export default reducer;
