import React, { Component } from "react";
import BookListItem from "../book-list-item";
import { connect } from "react-redux";
import Spinner from "../spinner";
import ErrorNetwork from "../error-network";
import { withBookstoreService } from "../hoc";
import { compose } from "../../utils";
import {
  booksLoaded,
  booksLoading,
  booksError,
  bookAddedToCart,
} from "../../actions";

import "./book-list.css";

const BookList = ({ books, bookAddedToCart }) => {
  return (
    <ul className="book-list">
      {books.map((book) => {
        return (
          <li key={book.id}>
            <BookListItem book={book} bookAddedToCart={bookAddedToCart} />
          </li>
        );
      })}
    </ul>
  );
};

class BookListContainer extends Component {
  componentDidMount() {
    const { bookstoreService, booksLoaded, booksError } = this.props;
    booksLoading();
    bookstoreService
      .getBooks()
      .then((data) => booksLoaded(data))
      .catch((error) => booksError(error));
  }

  render() {
    const { books, loading, error, bookAddedToCart } = this.props;

    if (loading) {
      return <Spinner />;
    }

    if (error) {
      return <ErrorNetwork />;
    }

    return <BookList books={books} bookAddedToCart={bookAddedToCart} />;
  }
}

const mapStateToProps = ({ books, loading, error }) => {
  return { books, loading, error };
};

const mapDispatchToProps = {
  booksLoaded,
  booksLoading,
  booksError,
  bookAddedToCart,
};

export default compose(
  withBookstoreService(),
  connect(mapStateToProps, mapDispatchToProps)
)(BookListContainer);
