import React, {Component} from 'react';
import Gif from './Gif';
import './css/main.css';
import loader from './images/loader.svg';
import clearButton from './images/close-icon.svg';

const Header = ({clearSearch, hasResults}) => (
  <div className="header grid">
    {hasResults ? (
      <button onClick={clearSearch}>
        <img src={clearButton}  alt="clear button" />
      </button>
    ) : (
      <h1 className="title" onClick={clearSearch}>Jiffy</h1>)}
  </div>
)

const randomChoice = arr => {
  const randIndex = Math.floor(Math.random() * arr.length);
  return arr[randIndex]
}

const UserHint = ({loading, hintText}) => (
  <div className="user-hint">
    {loading ?
      <img src={loader} alt="loading" className="block mx-auto" /> :
      hintText
  }</div>
)

class App extends Component {

  constructor(props) {
    super(props)
    this.textInput = React.createRef();
    this.state = {
      loading: false,
      searchTerm: '',
      hintText: '',
      gif: null,
      gifs: []
    };
  }

  searchGiphy = async searchTerm => {
    this.setState({
      loading: true
    });
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=l4j1bLLlYYlv7btc04P3TBEDaNZIAfCr&q=${searchTerm}&limit=25&offset=0&rating=PG&lang=en`
      );
      const {data} = await response.json();

      if (!data.length) {
        throw `Nothing found for ${searchTerm}`
      }

      const randomGif = randomChoice(data)

      this.setState((prevState, props) => ({
        ...prevState,
        gif: randomGif,
        gifs: [...prevState.gifs, randomGif],
        loading: false,
        hintText: `Hint enter to see more ${searchTerm}`
      }))

    } catch (error) {
      this.setState((prevState, props) => ({
        ...prevState,
        hintText: error,
        loading: false
      }));
      console.log(error)
    }
  }


  handleChange = event => {
    const {value} = event.target
    this.setState((prevState, props) => ({
      ...prevState,
      searchTerm: value,
      hintText: value.length > 2 ? `Hit enter to search ${value}` : ''
    }))
  }

  handleKeyPress = event => {
    const {value} = event.target
    if (value.length > 2 && event.key === 'Enter'){
      this.searchGiphy(value)
    }
  }

  clearSearch = () => {
    this.setState((prevState, props) => ({
      searchTerm: '',
      hintText: '',
      gifs: []
    }))
    this.textInput.current.focus();
  }

  render() {
    const { searchTerm, gifs } = this.state
    const hasResults = gifs.length
    return (
      <div className="page">
        <Header clearSearch={this.clearSearch} hasResults={hasResults}/>
        <div className='search grid'>
          {}
          {this.state.gifs.map(gif =>
            <Gif {...gif}/>
          )}
          <input
            className='input grid-item'
            placeholder='Type something'
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
            ref={this.textInput}
            value={searchTerm}/>
        </div>
        <UserHint {...this.state}/>
      </div>
    );
  }
}

export default App;
