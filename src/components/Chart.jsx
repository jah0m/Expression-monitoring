import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../styles/Chart.css'

export default function Chart(props) {
  let {data} = props
  return (
    <div className='chart-box'>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <XAxis dataKey="time" />
            <YAxis domain={[-1, 1]}/>
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="score" stroke="#8884d8" isAnimationActive={false} dot={false}/>
          </LineChart>
        </ResponsiveContainer>
      </div>
  )
}

