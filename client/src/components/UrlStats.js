import React from 'react';
import { connect } from 'react-redux';
import { startAddDays, startAddBrowsersStats, startAddOSStats, startaddOverviewStats, cleanUpStats } from '../actions/stats';
import { faEye, faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons' 
import { faWindows, faChrome } from '@fortawesome/free-brands-svg-icons'
import { Link } from 'react-router-dom';
import { withComma } from '../utils';
import TotalViews from './stats/TotalViews';
import Browsers from './stats/Browsers';
import Tile from './stats/Tile';
import Os from './stats/Os';

const BASE_URL = process.env.API_BASE_URL

class UrlStats extends React.Component { 
  componentDidMount() {
    const id = this.props.match.params.id;
    this.props.cleanUpStats();
    this.props.startaddOverviewStats(id);
    this.props.startAddDays(id);
    this.props.startAddBrowsersStats(id);
    this.props.startAddOSStats(id);
  }
  render() {
    const topLocation = this.props.stats.overview.top_location.length >= 12 ? this.props.stats.overview.top_location.substr(0, 10) + '...' : this.props.stats.overview.top_location;
    return ( 
      <div>
        <div className="url-stats">
          <div className="url-overview p-3 rounded m-2">
            <h3><a href={`http://${BASE_URL}/${this.props.stats.overview.code}`} target="_blank">{BASE_URL}/{this.props.stats.overview.code}</a></h3>
            <p>To: {this.props.stats.overview.link}</p>
          </div>
          <div className="container">
            <div className="tiles">
              <div className="row">
                <Tile 
                  icon={faEye} 
                  title="Total Views" 
                  info={withComma(this.props.stats.overview.total_views)} 
                  percent={this.props.stats.overview.total_views_percent} 
                />
                <Tile 
                  icon={faWindows} 
                  title="Top OS" 
                  info={this.props.stats.overview.top_os} 
                  secondInfo={this.props.stats.overview.top_os_count}
                  percent={this.props.stats.overview.top_os_percent} 
                />
                <Tile 
                  icon={faChrome} 
                  title="Top Browser" 
                  info={this.props.stats.overview.top_browser} 
                  secondInfo={this.props.stats.overview.top_browser_count}
                  percent={this.props.stats.overview.top_browser_percent} 
                />
                <Tile 
                  icon={faMapMarkedAlt} 
                  title="Top Location" 
                  info={topLocation} 
                  secondInfo={this.props.stats.overview.top_location_count}
                  percent={this.props.stats.overview.top_location_percent} 
                />
              </div>
            </div>
            <TotalViews data={this.props.stats.days} />
            <div className="row">
              <Browsers data={this.props.stats.browsers} />
              <Os data={this.props.stats.os} />
            </div>
            <div className="text-center m-4 p-3">
              <Link className="btn btn-shrug" to="/">Go back to dashboard</Link>
            </div>
          </div>
        </div>
      </div> 
    );
  } 
}
 
const mapSteteToProps = (state) => {
  return {
    auth: state.auth,
    stats: state.stats
  };
};

const mapDispatchToProps = (dispatch) => ({
  startAddDays: (id) => dispatch(startAddDays(id)),
  startAddBrowsersStats: (id) => dispatch(startAddBrowsersStats(id)),
  startAddOSStats: (id) => dispatch(startAddOSStats(id)),
  startaddOverviewStats: (id) => dispatch(startaddOverviewStats(id)),
  cleanUpStats: () => dispatch(cleanUpStats())
});

export default connect(mapSteteToProps, mapDispatchToProps)(UrlStats);
