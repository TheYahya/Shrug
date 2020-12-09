import React from 'react';
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTrashAlt, faChartBar, faQrcode, faClone, faEdit } from '@fortawesome/free-solid-svg-icons'
import { connect } from 'react-redux';
import { startRemoveUrl, startUpdateUrl } from '../actions/urls';
import { withComma } from '../utils';
import { Link } from 'react-router-dom';
import copy from 'copy-to-clipboard'; 
import { addData } from '../actions/qrcode'; 

const BASE_URL = process.env.API_BASE_URL

class UrlItem extends React.Component {
  state = {
    copied: false,
    onEdit: false,
    link: this.props.link,
    shortCode: this.props.shortCode
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
  editLink(id) {
    this.setState({onEdit: true})
  }
  updateLink(id) {
    this.props.startUpdateUrl({
      id: this.props.id,
      link: this.state.link,
      short_code: this.state.shortCode
    })
    this.setState({onEdit: false})
  }
  onLinkChange = (e) => {
    const link = e.target.value;
    this.setState(() => ({ link }));
  }
  onShortCodeChange = (e) => {
    const shortCode = e.target.value;
    this.setState(() => ({ shortCode }));
  }
  render() {
    const shortIt = (str) => {
      if (str.length > 33) {
        return str.substr(0, 30) + '...'
      }
      return str
    }
    var copyIcon = this.state.copied ? <FontAwesomeIcon className="text-success" icon={faCheck} /> : <FontAwesomeIcon className="theme-color" icon={faClone} />
    var link = this.state.onEdit ? <input value={this.state.link} onChange={this.onLinkChange} /> : <a href={ this.props.link } target="_blank">{shortIt(this.props.link)}</a>
    var shortUrl = this.state.onEdit ? <input value={this.state.shortCode} onChange={this.onShortCodeChange} /> : (
      <span>
        <span className="badge badge-light btn-copy" onClick={this.onCopied}>
        {copyIcon}
        </span>
        &nbsp;&nbsp;
        <a href={`http://${BASE_URL}/${this.props.shortCode}`} target="_blank">
          <code>{ BASE_URL }/{ this.props.shortCode }</code>
        </a>
      </span>
    )

    var editButton = this.state.onEdit ? 
      <a className="btn-action" onClick={() => this.updateLink(this.props.id) }><FontAwesomeIcon className="text-success" icon={faCheck}/></a> : 
      <a className="btn-action" onClick={() => this.editLink(this.props.id) }><FontAwesomeIcon icon={faEdit}/></a>
    return ( 
      <tr>
        <td>
          {link}
        </td>
        <td>
          {shortUrl}
        </td>
        <td>{ withComma(this.props.visitsCount) }</td>
        <td>
          {formatDistanceToNow(new Date(this.props.createdAt))} ago
        </td>
        <td className="text-center">
          {editButton}
          &nbsp;&nbsp;
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
  addData: (data) => dispatch(addData(data)),
  startUpdateUrl: (data) => dispatch(startUpdateUrl(data))
});

export default connect(mapSteteToProps, mapDispatchToProps)(UrlItem);
