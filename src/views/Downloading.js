import React, {Component} from 'react'
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table'

import moment from 'moment'
import bytes from 'bytes'

// Custom components
import mrEmitter from '../helpers/mrEmitter'
import AllPlaceHolder from '../placeholders/AllPlaceHolder'

// the settings loader helper
import SettingsHandler from '../helpers/SettingsHandler'

let settingsHandle = new SettingsHandler(),
stored = {},
// remove this subscription afterwards when there is no use for it
Subscriptions = []


export default class Downloading extends Component {
  state = {
    toolbar: false,
    table: true,
    tableData: [
      // {
      //   fileName: 'John Smith dsffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
      //   downloaded: 'Employed',
      //   size: '94 Mb',
      //   lastTry: '17/05/2016'
      // },
      // {
      //   fileName: 'John Smith',
      //   downloaded: 'Employed',
      //   size: '94 Mb',
      //   lastTry: '17/05/2016'
      // }
    ]
  }

  // register all adding stuff here
  componentWillMount() {
    // load all the settings
    stored = settingsHandle.stored
    // update the local data
    this.setState({tableData: stored.dldata.data})
  }

  // show or hide the table function
  componentDidMount() {
    // if table's length is zero show the EmptyPlaceHolder and hide the table
    if (!this.state.tableData.length) {
      this.setState({table: false})
      setTimeout(() => {
        this.refs.allPlaceHolder.setState({visible: true})
      }, 700)
    }
    // add emitter event listener
    Subscriptions.push(mrEmitter.addListener('onUpdateData', (updateData) => this.setState({tableData: updateData})))
  }

  componentWillUnmount() {
    // remove emitter event listeners
    for (let Subscription of Subscriptions) {
      Subscription.remove()
    }
  }

render() {
  const style = {
    table: {
      display: this.state.table ? 'table' : 'none'
    },
    tableColumn: {
      whiteSpace: 'normal'
    },
  }

  return (
    <div>
      <Table
        ref="table"
        style={style.table}
        selectable={false}
      >
        <TableHeader
          adjustForCheckbox={false}
          displaySelectAll={false}
        >
          <TableRow>
            <TableHeaderColumn>File Name</TableHeaderColumn>
            <TableHeaderColumn>Downloaded</TableHeaderColumn>
            <TableHeaderColumn>Size</TableHeaderColumn>
            <TableHeaderColumn>Last Try</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody
          displayRowCheckbox={false}
          showRowHover={true}
          stripedRows={true}
        >
          {this.state.tableData.map( (row, index) => (
            <TableRow key={index}>
              <TableRowColumn style={style.tableColumn}>{row.fileName}</TableRowColumn>
              <TableRowColumn>{bytes(row.downloaded)}</TableRowColumn>
              <TableRowColumn>{bytes(row.size)}</TableRowColumn>
              <TableRowColumn>{moment(row.lastTry).fromNow()}</TableRowColumn>
            </TableRow>
          ))}
        </TableBody>
        >
      </Table>
      <AllPlaceHolder ref="allPlaceHolder" />
    </div>
    )
  }
}
