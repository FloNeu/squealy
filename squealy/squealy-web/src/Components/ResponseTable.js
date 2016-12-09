import React, {Component} from 'react'
import { RESPONSE_FORMATS, PARAM_FORMAT_OPTIONS, COLUMN_TYPE } from '../Constant'
import ReactTable from 'react-table'
import Select from 'react-select'
import 'react-table/react-table.css'
import {Modal} from 'react-bootstrap'
import { preProcessResponse } from '../Utils'

export class QueryResponseTable extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    const {columnDefinition, onChangeApiDefinition} = this.props
    const response = preProcessResponse(this.props.response)
    let responseColumn = []
    response.columns.map((column, i) => {
      let newCol = {
        accessor: column.header,
        header: <ResponseTableHeader 
                  headerName={column.header}
                  columnDefinition={columnDefinition}
                  selectedColumn={column.accessor}
                  onChangeApiDefinition={onChangeApiDefinition} />
      }
      responseColumn.push(newCol)
    })
    return (
      <div className="query-response-wrapper">
        <div className="hidash-api-response hidash-query-response-grid">
        {(response.data.length > 0 && response.columns.length > 0)?
            <ReactTable
              data={response.data}
              columns={responseColumn}
              pageSize={10}
              minRows={3}
          />
        :
          <div>Loading...</div>
        }
        </div>
      </div>)
  }
}


export class ResponseTableHeader extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedClmDataType: 'string',
      selectedColumnType: 'dimension',
      showModal: false
    }
  }

  selectedColumnDataTypeChangeHandler = (selectedClmDataType) => {
    this.setState({selectedClmDataType: selectedClmDataType.value})
  }

  selectedColumnTypeChangeHandler = (selectedColumnType) => {
    this.setState({selectedColumnType: selectedColumnType.value})
  }
  
  close = () => {
    this.setState({ showModal: false })
  }


  editColumnProperties = (e, selectedColumn) => {
    this.setState({ showModal: true }, () => {
      let columnDefinition = Object.assign({}, this.props.columnDefinition)
      let selectedColumnDef = columnDefinition[selectedColumn]
      let columnType = selectedColumnDef.type || 'Dimension'
      this.refs.colKey.value = selectedColumn
      this.refs.colName.value = selectedColumn
      this.setState({
        selectedClmDataType: selectedColumnDef.data_type,
        selectedColumnType: columnType
      })
      e.stopPropagation()
    });
  }

  saveEditColDefHandler = (selectedColumn) => {
    let columnDefinition = Object.assign({}, this.props.columnDefinition)
    let refObj = this.refs
    columnDefinition[refObj.colName.value] = {
      key: refObj.colKey.value,
      type: this.state.selectedColumnType,
      data_type: this.state.selectedClmDataType
    }
    this.props.onChangeApiDefinition('columns', columnDefinition)
    this.setState({ showModal: false });
  }

  render () {
    const {headerName, selectedColumn, columnDefinition} = this.props
    let editColumnModalContent = 
      <div className="edit-col-modal">
        <div className="row">
          <label htmlFor="col-key" className="col-md-3">Key: </label>
          <div className="col-md-8 col-def-form">
            <input type="text" id="col-key" ref="colKey"/>
          </div>
        </div>
        <div className="row">
          <label htmlFor="col-name" className="col-md-3">Column Name: </label>
          <div className="col-md-8 col-def-form">
            <input type="text" id="col-name" ref="colName"/>
          </div>
        </div>
        <div className="row">
          <label htmlFor="col-type" className="col-md-3">Type: </label>
          <div className="col-md-8">
            <Select
              name="col-type"
              options={COLUMN_TYPE}
              value={this.state.selectedColumnType}
              placeholder='Select Column Type'
              clearableValue={false}
              onChange={this.selectedColumnTypeChangeHandler}
            />
          </div>
        </div>
        <div className="row">
          <label htmlFor="col-data-type" className="col-md-3">Data Type: </label>
          <div className="col-md-8">
            <Select
              name="col-data-type"
              options={PARAM_FORMAT_OPTIONS}
              value={this.state.selectedClmDataType}
              placeholder='Select Column Data type'
              clearableValue={false}
              onChange={this.selectedColumnDataTypeChangeHandler}
            />
          </div>
        </div>
      </div>

    return (<th className="respone-table-header">
              <span>{headerName}</span>
              <i className="fa fa-pencil" 
                onClick={(e) => this.editColumnProperties(e, selectedColumn)}>
              </i>
              <Modal show={this.state.showModal} onHide={this.close}>
                <Modal.Header closeButton>
                  <Modal.Title>Edit Column Definition</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {editColumnModalContent}
                </Modal.Body>
                <Modal.Footer>
                  <button onClick={this.close} className="btn btn-default">Close</button>
                  <button onClick={() => this.saveEditColDefHandler(selectedColumn)} className="btn btn-info">Save</button>
                </Modal.Footer>
              </Modal>
            </th>)
  }
}
