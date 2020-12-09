import React from 'react';
import {
  XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-solid-svg-icons' 

class TotalViews extends React.Component {
  render() {
    return (
      <div className="row">
        <div className="col-12">
          <div className=" chart-wrapper rounded">
          <h4 className="chart__title"><FontAwesomeIcon icon={faEye} /> Total views.</h4>
          <ResponsiveContainer
            width="100%"
            height={window.innerWidth < 468 ? 240 : 320}
          > 
            <AreaChart 
            data={this.props.data}
            margin={{
              top: 20, right: 30, left: 20, bottom: 10,
            }}
          > 
            <XAxis dataKey="key" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="#e96c60" fill="#F77D71" />
          </AreaChart>
          </ResponsiveContainer>
          
          </div>
        </div>
      </div>
    )
  }
}

export default TotalViews;