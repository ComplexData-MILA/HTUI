import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import {
  Bar,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
  BarChart,
} from 'recharts'
import { useQuery, gql } from '@apollo/client'
import Title from './Title'

const GET_DATA_QUERY = gql`
  {
    people(options: { limit: 5, sort: [{ nhs_no: DESC }] }) {
      name
      num_related_people
    }
  }
`

export default function RatingsChart() {
  const theme = useTheme()

  const { loading, error, data } = useQuery(GET_DATA_QUERY)
  if (error) return <p>Error</p>
  if (loading) return <p>Loading</p>

  return (
    <React.Fragment>
      <Title>Connections Distribution</Title>
      <ResponsiveContainer>
        <BarChart
          data={data.people}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis dataKey="name" stroke={theme.palette.text.secondary} />
          <YAxis stroke={theme.palette.text.secondary}>
            <Label
              angle={270}
              position="left"
              style={{ textAnchor: 'middle', fill: theme.palette.text.primary }}
            >
              Number of Relations
            </Label>
          </YAxis>
          <Bar
            dataKey="num_related_people"
            fill={theme.palette.primary.main}
          ></Bar>
        </BarChart>
      </ResponsiveContainer>
    </React.Fragment>
  )
}
