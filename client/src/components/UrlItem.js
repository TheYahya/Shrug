import React from 'react';
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTrashAlt, faChartBar, faQrcode, faClone } from '@fortawesome/free-solid-svg-icons'
import { connect } from 'react-redux';
import { startRemoveUrl } from '../actions/urls';
import { withComma } from '../utils';
import { Link } from 'react-router-dom';
import copy from 'copy-to-clipboard'; 
import { addData } from '../actions/qrcode'; 

const BASE_URL = process.env.API_BASE_URL

class UrlItem extends React.Component {
  state = {
    copied: false
  }
  constructor(props) {
    super(props); 
    this.onCopied = this.onCopied.bind(this);
  }
  onCopied() {
      copy(`http://${BASE_URL}/${this.props.shortCode}`)
      this.setState({copied: true})
      setTimeout(() => {
        this.setState({copied: false})
      }, 1000)
  }
  removeItem(id) { 
    let d = confirm("Would you like to delete this?")
    if (d) {
      this.props.startRemoveUrl(id)
    }
  }
  render() {
    const shortIt = (str) => {
      if (str.length > 33) {
        return str.substr(0, 30) + '...'
      }
      return str
    }
    var copyIcon = this.state.copied ? <FontAwesomeIcon className="text-success" icon={faCheck} /> : <FontAwesomeIcon className="theme-color" icon={faClone} />

    return ( 
      <tr>
        <td>
          <a href={ this.props.link } target="_blank">{shortIt(this.props.link)}</a>
        </td>
        <td>
          <span className="badge badge-light btn-copy" onClick={this.onCopied}>
            {copyIcon}
          </span>
          &nbsp;&nbsp;
          <a href={`http://${BASE_URL}/${this.props.shortCode}`} target="_blank">
            <code>{ BASE_URL }/{ this.props.shortCode }</code>
          </a>
        </td>
        <td>{ withComma(this.props.visitsCount) }</td>
        <td>
          {formatDistanceToNow(new Date(this.props.createdAt))} ago
        </td>
        <td className="text-center">
          <a className="btn-action" onClick={() => this.props.addData(`http://${BASE_URL}/${this.props.shortCode}`) }><FontAwesomeIcon icon={faQrcode} /></a>
          &nbsp;&nbsp;
          <Link className="btn-action" to={"/stats/" + this.props.id}><FontAwesomeIcon icon={faChartBar} /></Link>
          &nbsp;&nbsp;
          <a className="btn-action" onClick={() => this.removeItem(this.props.id) }><FontAwesomeIcon icon={faTrashAlt}/></a>
        </td>
      </tr>  
    )
  }
} 
 
const mapSteteToProps = (state) => {
  return {
    auth: state.auth
  };
};

const mapDispatchToProps = (dispatch) => ({
  startRemoveUrl: (id) => dispatch(startRemoveUrl({id})),
  addData: (data) => dispatch(addData(data))
});

export default connect(mapSteteToProps, mapDispatchToProps)(UrlItem);
