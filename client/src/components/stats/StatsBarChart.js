import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWindows } from '@fortawesome/free-brands-svg-icons'

class StatsBarChart extends React.Component {
  render() {
    return (
      <div className="col-6">
        <div className=" chart-wrapper rounded">
          <h4 className="chart__title"><FontAwesomeIcon icon={ this.props.icon } /> { this.props.title }</h4>
          <ResponsiveContainer
            width="100%"
            height={window.innerWidth < 468 ? 240 : 320}
          >
            <BarChart
              data={this.props.data}
              margin={{
                top: 20, right: 30, left: 20, bottom: 10,
              }}
              barSize={10}
            >
              <XAxis dataKey="key" scale="point" padding={{ left: 10, right: 10 }} />
              <YAxis /> 
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#F77D71" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    )
  }
}

export default StatsBarChart;