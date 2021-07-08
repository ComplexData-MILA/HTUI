import React from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { useQuery, gql } from '@apollo/client'
import Title from './Title'
import moment from 'moment'

const GET_RECENT_CRIMES_QUERY = gql`
  {
    crimes(options: { limit: 10, sort: { date: DESC } }) {
      type
      id
      officer {
        name
        surname
      }
      last_outcome
    }
  }
`

export default function RecentCrimes() {
  const { loading, error, data } = useQuery(GET_RECENT_CRIMES_QUERY)
  if (error) return <p>Error</p>
  if (loading) return <p>Loading</p>

  return (
    <React.Fragment>
      <Title>Recent Crimes</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Crime Type</TableCell>
            <TableCell>Last Outcome</TableCell>
            <TableCell>Officer Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.crimes.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{moment(row.date).format('MMMM Do YYYY')}</TableCell>
              <TableCell>{row.type}</TableCell>
              <TableCell>{row.last_outcome}</TableCell>
              <TableCell>{`${row.officer.name} ${row.officer.surname}`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  )
}
