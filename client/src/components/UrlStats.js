import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { 
  startAddDays, 
  startAddBrowsersStats, 
  startAddOSStats, 
  startaddOverviewStats, 
  cleanUpStats, 
  startAddCityStats, 
  startAddRefererStats 
} from '../actions/stats';
import { faEye, faMapMarkedAlt, faLink, faGlobe } from '@fortawesome/free-solid-svg-icons' 
import { faWindows, faChrome } from '@fortawesome/free-brands-svg-icons'
import { Link } from 'react-router-dom';
import { withComma } from '../utils';
import { useParams } from "react-router-dom";
import TotalViews from './stats/TotalViews';
import Tile from './stats/Tile';
import StatsBarChart from './stats/StatsBarChart';

const BASE_URL = process.env.API_BASE_URL

const  UrlStats = (props) =>  { 
  const params = useParams();
  const id = params.id
  useEffect(()=>{
    props.cleanUpStats();
    props.startaddOverviewStats(id);
    props.startAddDays(id);
    props.startAddBrowsersStats(id);
    props.startAddOSStats(id);
    props.startAddRefererStats(id);
    props.startAddCityStats(id);
  }, [])

  const topLocation = props.stats.overview.top_location.length >= 12 ? props.stats.overview.top_location.substr(0, 10) + '...' : props.stats.overview.top_location;
  return ( 
    <div>
      <div className="url-stats">
        <div className="url-overview p-3 rounded m-2">
          <h3><a href={`http://${BASE_URL}/${props.stats.overview.code}`} target="_blank">{BASE_URL}/{props.stats.overview.code}</a></h3>
          <p>To: {props.stats.overview.link}</p>
        </div>
        <div className="container">
          <div className="tiles">
            <div className="row">
              <Tile 
                icon={faEye} 
                title="Total Views" 
                info={withComma(props.stats.overview.total_views)} 
                percent={props.stats.overview.total_views_percent} 
              />
              <Tile 
                icon={faWindows} 
                title="Top OS" 
                info={props.stats.overview.top_os} 
                secondInfo={props.stats.overview.top_os_count}
                percent={props.stats.overview.top_os_percent} 
              />
              <Tile 
                icon={faChrome} 
                title="Top Browser" 
                info={props.stats.overview.top_browser} 
                secondInfo={props.stats.overview.top_browser_count}
                percent={props.stats.overview.top_browser_percent} 
              />
              <Tile 
                icon={faMapMarkedAlt} 
                title="Top Location" 
                info={topLocation} 
                secondInfo={props.stats.overview.top_location_count}
                percent={props.stats.overview.top_location_percent} 
              />
            </div>
          </div>
          <TotalViews data={props.stats.days} />
          <div className="row">
            <StatsBarChart data={props.stats.browsers} title="Browsers." icon={faChrome} />
            <StatsBarChart data={props.stats.os} title="OS." icon={faWindows} />
          </div>
          <div className="row">
            <StatsBarChart data={props.stats.referer} title="Referers." icon={faLink} />
            <StatsBarChart data={props.stats.city} title="cities." icon={faGlobe} />
          </div>
          <div className="text-center m-4 p-3">
            <Link className="btn btn-shrug" to="/">Go back to dashboard</Link>
          </div>
        </div>
      </div>
    </div> 
  );
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
  startAddCityStats: (id) => dispatch(startAddCityStats(id)),
  startAddRefererStats: (id) => dispatch(startAddRefererStats(id)),
  cleanUpStats: () => dispatch(cleanUpStats())
});

export default connect(mapSteteToProps, mapDispatchToProps)(UrlStats);
