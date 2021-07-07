import React, { Component } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

const DEFAULT_QUERY = "Nokia";
const DEFAULT_HPP = "100";

const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "/?query=";
const PARAM_PAGE = "page=";
const PARAM_HPP = "hitsPerPage=";

// const list=[
//   {
//     title:'React ',
//     url:'https://react.js.org/',
//     author:'Jordan Walke ',
//     num_comments:3,
//     points:4,
//     objectID:0,
//   },
//   {
//     title:'Reduxe ',
//     url:'https://redux.js.org/',
//     author:'Dan Abramov, Andrew Clark ',
//     num_comments:2,
//     points:5,
//     objectID:1,
//   }
// ];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: null,
      searchKey: "",
      searchTerm: DEFAULT_QUERY,
      error: null,
      //list
    };
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
  }
  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  }
  fetchSearchTopStories(searchTerm, page = 0) {
    fetch(
      `${PATH_BASE}${PATH_SEARCH}${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`
    )
      .then((response) => response.json())
      .then((result) => this.setSearchTopStories(result))
      .catch((error) => this.setState({ error }));
  }
  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm);
    if (this.needToTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }
    event.preventDefault();
  }
  setSearchTopStories(result) {
    const { hits, page } = result;
    const { searchKey, results } = this.state;
    const oldHits =
      results && results[searchKey] ? results[searchKey].hits : [];
    const updatedHits = [...oldHits, ...hits];
    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page },
      },
    });
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm);
  }
  onDismiss(id) {
    const { results, searchKey } = this.state;
    const { page, hits } = results[searchKey];
    const isNotId = (item) => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);
    this.setState({
      result: { ...results, [searchKey]: { hits: updatedHits, page } },
    });
  }
  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  render() {
    const { searchTerm, results, searchKey, error } = this.state;
    const page =
      (results && results[searchKey] && results[searchKey].page) || 0;
    const list =
      (results && results[searchKey] && results[searchKey].hits) || [];
    if (error) {
      return <p class="text-primary">Что-то произошло не так.</p>;
    }
    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Поиск
          </Search>
        </div>
        {error ? (
          <div className="interactions">
            <p class="text-primary">Что-то пошло не по плану.</p>
          </div>
        ) : (
          <Table list={list} onDismiss={this.onDismiss} />
        )}
        <div className="interactions">
          <Button
            onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}
          >
            Больше историй
          </Button>
        </div>
      </div>
    );
  }
}

const Search = ({ value, onChange, children, onSubmit }) => (
  <form onSubmit={onSubmit} class="form-inline">
    <div class="form-group mx-sm-2 mb-2">
      <input type="text" value={value} onChange={onChange} />
    </div>

    <button
      className="interactions"
      data-toggle="buttons"
      class="btn btn-primary mb-2"
      type="submit"
    >
      {children}
    </button>
  </form>
);

const Table = ({ list, onDismiss }) => (
  <div className="table">
    {list.map((item) => (
      <div key={item.objectID} className="table-row bg-light">
        <span style={{ width: "40%" }}>
          <a href={item.url}>{item.title}</a>
        </span>
        <span style={{ width: "30%" }}>{item.author}</span>
        <span style={{ width: "10%" }}>{item.num_comments}</span>
        <span style={{ width: "10%" }}>{item.points}</span>
        <span>
          <Button
            onClick={() => onDismiss(item.objectID)}
            className="button-inline"
          >
            Отбросить
          </Button>
        </span>
      </div>
    ))}
  </div>
);

const Button = ({ onClick, className = "", children }) => (
  <button
    onClick={onClick}
    type="button"
    className={className}
    class="btn btn-outline-primary btn-sm"
  >
    {children}
  </button>
);

export default App;

export { Button, Search, Table };
