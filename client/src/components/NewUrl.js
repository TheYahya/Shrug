import React from 'react';
import { connect } from 'react-redux';
import { startAddUrl } from '../actions/urls';
import AuthButtons from './AuthButtons'

const BASE_URL = process.env.API_BASE_URL

class NewUrl extends React.Component {
  state = {
    link: '',
    address: '',
    showOptions: false
  }
  onUrlChange = (e) => {
    const link = e.target.value;
    this.setState(() => ({ link }));
  }
  onAddressChange = (e) => {
    const address = e.target.value;
    this.setState(() => ({ address }));
  }
  onSubmit = (e) => { 
    e.preventDefault(); 
    const url = {
      link: this.state.link,
      short_code: this.state.address
    }
    this.props.startAddUrl(url)
    this.setState(() => ({ link: "", address: "" }));
  }
  onChangeOptions = (e) => {
    const showOptions = e.target.checked;
    this.setState(() => ({
      link: this.state.link,
      showOptions: showOptions
    }))
  }
  render() {
    if (! this.props.auth.isAuthenticated) {
      return (
        <div className="new-link text-center">
          <p>
            <img src="/images/shrug-ir.png" />
          </p>
          <h1>Shrink your urls with a <code>shrug</code></h1>
          <br/>
          <AuthButtons />
        </div>
        )
    }
    return (
      <div className="new-link">
        <form onSubmit={this.onSubmit}>
          <div className="form-row"> 
              <div className="form-group col-12">
                <input type="text" id="url" className="form-control" onChange={this.onUrlChange} value={this.state.link} placeholder="Your loooooong URL" autoComplete="off" autoFocus/>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-12">
                <input id="more-options-input" name="more-options" onChange={this.onChangeOptions} type="checkbox"/> Custom url
              </div>
            </div>
            <div className="more-options" style={{display: this.state.showOptions ? 'block' : 'none'}}>
              <div className="form-row">
                <div className="form-group col-6">
                  <label>{BASE_URL}/</label>
                  <input type="text" id="custom-address" className="form-control form-control-sm" onChange={this.onAddressChange} value={this.state.address} placeholder="Custom url (optional)" autoComplete="off"/>
                </div> 
              </div> 
            </div>
          <small>Press <code>Enter</code> to shorten the URL.</small>
          <p><code>{ this.props.urls.addUrlError }</code></p>
          <input type="submit" style={{display: 'none'}} />
        </form>
      </div>
    )
  }
}
const mapSteteToProps = (state) => {
  return {
    auth: state.auth,
    urls: state.urls
  };
};

const mapDispatchToProps = (dispatch) => ({
  startAddUrl: (url) => dispatch(startAddUrl(url))
});

export default connect(mapSteteToProps, mapDispatchToProps)(NewUrl);
