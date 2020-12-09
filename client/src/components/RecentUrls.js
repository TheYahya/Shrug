import React from 'react';
import { connect } from 'react-redux';
import UrlItem from './UrlItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faCalendar, faCut, faLink, faListAlt, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons' 
import { startGetUrls } from '../actions/urls';
import EmptyUrls from './EmptyUrls';

class RecentUrls extends React.Component {
  state = {
    search: ''
  }
  constructor(props) {
    super(props); 
    
    this.nextPage = this.nextPage.bind(this);
    this.previousPage = this.previousPage.bind(this);
    this.onChangeSearch = this.onChangeSearch.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  limit(limit = 10) {
    this.props.startGetUrls(this.props.urls.offset, limit, this.props.urls.search)
  }
  nextPage() {
    this.props.startGetUrls(this.props.urls.offset + this.props.urls.limit, this.props.urls.limit, this.props.urls.search)
  }
  previousPage() {
    this.props.startGetUrls(this.props.urls.offset - this.props.urls.limit, this.props.urls.limit, this.props.urls.search)
  }
  onChangeSearch(e) {
    const search = e.target.value
    this.setState({
      search: search
    })
  }
  onSubmit(e) {
    e.preventDefault();
    this.props.startGetUrls(this.props.urls.offset, this.props.urls.limit, this.state.search)
  }
  render() { 
    if (this.props.urls.urls.length == 0 && this.props.urls.search == '') {
      return (
        <EmptyUrls />
      )
    }
    return (
      <div className="recent-urls">
        <h2 className="recent-urls__title"><FontAwesomeIcon icon={faListAlt} /> All shortened links</h2>
        <table className="table table-bordered table-sm">
          <thead>
            <tr>
              <th className="border-0">
                <form className="form-search" onSubmit={this.onSubmit}>
                  <input className="bg-none" placeholder="Search" onChange={this.onChangeSearch} value={this.state.search}></input>
                </form>
              </th> 
              <th className="border-0"></th>
              <th className="border-0"></th>
              <th className="text-right border-0">
                <button className="btn btn-light btn-sm" onClick={this.limit.bind(this, 10)}>10</button>
                &nbsp;
                <button className="btn btn-light btn-sm" onClick={this.limit.bind(this, 20)}>20</button>
                &nbsp;
                <button className="btn btn-light btn-sm" onClick={this.limit.bind(this, 50)}>50</button>
              </th>
              <th scope="col" className="text-center border-0">
                <button className="btn btn-light btn-sm pl-3 pr-3" onClick={this.previousPage}><FontAwesomeIcon icon={faAngleLeft} /></button> 
                &nbsp;
                <button className="btn btn-light btn-sm pl-3 pr-3" onClick={this.nextPage}><FontAwesomeIcon icon={faAngleRight} /></button>
              </th>
            </tr>
          </thead>
          <thead>
            <tr>
              <th scope="col"><FontAwesomeIcon icon={faLink} /> Original URL</th>
              <th scope="col"><FontAwesomeIcon icon={faCut} /> Short URL</th>
              <th scope="col"><FontAwesomeIcon icon={faEye} /> Views</th>
              <th scope="col"><FontAwesomeIcon icon={faCalendar} /> Created</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            { this.props.urls.urls.map((url) => {
              return <UrlItem key={url.id} {...url} />
            })}
          </tbody>
          <tfoot>
            <tr>
              <th className="border-0"></th>
              <th className="border-0"></th>
              <th className="border-0"></th>
              <th className="border-0"></th>
              <th scope="col" className="border-0 text-right">
                <button className="btn btn-light btn-sm pl-3 pr-3" onClick={this.previousPage}><FontAwesomeIcon icon={faAngleLeft} /></button> 
                &nbsp;
                <button className="btn btn-light btn-sm pl-3 pr-3" onClick={this.nextPage}><FontAwesomeIcon icon={faAngleRight} /></button>
              </th>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  }
}

const mapSteteToProps = (state) => {
  return {
    urls: state.urls
  };
};

const mapDispatchToProps = (dispatch) => ({
  startGetUrls: (offset = 0, limit = 0, search = '') => dispatch(startGetUrls(offset, limit, search))
});

export default connect(mapSteteToProps, mapDispatchToProps)(RecentUrls);
