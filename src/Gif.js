import React, {Component} from 'react';

class Gif extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loaded: false,
    }
  }
  render() {
    const {images} = this.props
    const {loaded} = this.state
    return (
      <video
        className={`grid-item video ${loaded && 'loaded'}`}
        autoPlay
        src={images.original.mp4}
        loop
        onLoadedData={() => this.setState({loaded: true})}
      />
    )
  }
}

export default Gif
