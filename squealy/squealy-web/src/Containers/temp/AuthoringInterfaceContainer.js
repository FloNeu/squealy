import React, {Component} from 'react'
import MainComponent from '../../Components/temp/MainComponent'
import {
  getEmptyApiDefinition, postApiRequest
} from './../../Utils'
import mockCharts from './mockCharts'
import { DOMAIN_NAME } from './../../Constant'

export default class AuthoringInterfaceContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      charts: [],
      selectedChartIndex: 0,
      apiError: false,
      apiErrorMsg: ''
    }
  }

  initializeState = () => {
    if (!this.state.charts.length) {
      let charts = [getEmptyApiDefinition()]
      this.setState({charts: charts, selectedChartIndex: 0})
    }
  }

  componentWillMount() {
    //TODO: Get charts from backend
    this.loadInitialCharts()
  }

  loadInitialCharts = (response) => {
    // if (response) {
    //TODO: format API response to match with the state
    // }
    // else {
    this.initializeState()

    // }
  }

  selectedChartChangeHandler = (key, value) => {
    let charts = JSON.parse(JSON.stringify(this.state.charts))
    charts[this.state.selectedChartIndex][key] = value
    this.setState({charts: charts})
  }

  runSuccessHandler = (response) => {
    //TODO: post processing of response to get the chart data
    this.chartDefinitionChangeHandler('chartData', response)
  }

  runErrorHandler  = (error) => {
    this.setState({apiError: true, apiErrorMsg: error})
  }

  onSuccessTest = (data) => {
    let currentChartData = [...this.state.charts]
    currentChartData[this.state.selectedChartIndex]['chartData'] = data
    this.setState({charts: currentChartData})
  }

  onErrorTest = (errorLog) => {
    console.log(errorLog)
  }

  onHandleTestButton = () => {
    //TODO: make API POST call
    let payloadObj = {
      config: {
        query: this.state.charts[this.state.selectedChartIndex].query
      },
      params: this.state.charts[this.state.selectedChartIndex].testParameters,
      transformations: this.state.charts[this.state.selectedChartIndex].transformations,
      parameters: this.state.charts[this.state.selectedChartIndex].parameters
    } 
    postApiRequest(DOMAIN_NAME+'test/', payloadObj,
                    this.onSuccessTest, this.onErrorTest, 'table')
    //let tempParam = this.state.testData[this.state.selectedApiIndex].apiParams || {}
    //let paramObj = {}
    // try {
    //   paramObj = typeof tempParam === 'string' ? JSON.parse(tempParam) : tempParam
    // } catch (e) {
    //   console.log(e)
    //   console.log('please check your object syntax. Object key and value should be wrapped up in double quotes. Expected input: {"objKey": "objVal"}')
    // }
    // let paramDef = this.processParamDef(this.state.apiDefinition[this.state.selectedApiIndex].paramDefinition)
    // format = format || 'table'
    // let payloadObj = {
    //   config: {
    //     query: this.state.apiDefinition[this.state.selectedApiIndex].sqlQuery
    //   },
    //   transformations: this.state.apiDefinition[this.state.selectedApiIndex].transformations,
    //   format: format,
    //   params: paramObj.params,
    //   parameters: paramDef,
    //   user: paramObj.session,
    //   validations: this.state.apiDefinition[this.state.selectedApiIndex].validations,
    //   columns: this.state.apiDefinition[this.state.selectedApiIndex].columns,
    //   connection: this.state.selectedDB
    // }
    // postApiRequest(DOMAIN_NAME+'test/', payloadObj,
    //                this.onSuccessTest, this.onErrorTest, format)
  }

  chartDeletionHandler = (index) => {
    if(this.state.apiDefinition.length > 1) {
      let charts = JSON.parse(JSON.stringify(this.state.charts))
      charts.splice(index, 1)
      this.setState({
        charts: charts
      })
    } else {
      this.initializeState()
    }
  }

  //Appends an empty API definition object to current API Definitions
  chartAdditionHandler = (name, url) => {
    //TODO: open the addition modal and add the new chart to state also making it the selected chart
    let charts = JSON.parse(JSON.stringify(this.state.charts)),
        newChart = getEmptyApiDefinition()
        newChart.name = name
        newChart.url = url
    charts.push(newChart) 
    this.setState({
      charts: charts
    })
  }

  //Changes the selected API index to the one which was clicked from the API list
  chartSelectionHandler = (index) => {
    this.setState({selectedChartIndex: index})
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState !== nextProps) {
      //FIXME: Need to change hardcode localstorage key name. Later we will save as project name
      return true
    }
  }

  render () {
    const { charts, selectedChartIndex, parameters} = this.state
    const { googleDefined } = this.props
    return (
      <div className="parent-div container-fluid">
        <MainComponent 
          charts={charts}
          onHandleTestButton={this.onHandleTestButton}
          selectedChartIndex={selectedChartIndex}
          googleDefined={googleDefined}
          chartAdditionHandler={this.chartAdditionHandler}
          chartSelectionHandler={this.chartSelectionHandler}
          chartDeletionHandler={this.chartDeletionHandler}
          selectedChartChangeHandler={this.selectedChartChangeHandler} 
          />
      </div>
    )
  }
}
