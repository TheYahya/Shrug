import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class Tile extends React.Component {
  render() {
    return (
      <div className="col-3">
        <div className="tile rounded">
          <div className="row">
            <div className="col-8">
              <p className="tile__title"><FontAwesomeIcon icon={this.props.icon} /> {this.props.title}</p>
              <h3 className="tile__info">{ this.props.info }<span className="tile__info__count">{ this.props.secondInfo && `(${this.props.secondInfo})`}</span></h3>
            </div>
            <div className="col-4 tile__change">
              <div className={`pie p${this.props.percent}`}></div>
            </div> 
          </div>
        </div>
      </div>
    )
  }
}

export default Tile;