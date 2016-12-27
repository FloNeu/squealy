import React, {Component} from 'react'
import DashboardNavigator from '../Components/dashboard-view/DashboardNavigator'
import {getEmptyDashboardDefinition, getEmptyWidgetDefinition, getApiRequest, postApiRequest} from '../Utils'
import DashboardHeader from '../Components/dashboard-view/DashboardHeader'

export const APIURI = 'http://localhost:8000'

export default class DashboardContainer extends Component {
  constructor() {
    super()
    this.state = {
      dashboardDefinitions: []
    }
  }

  // If no definitions are present in the local storage, fill in an
  // empty database definition
  componentWillMount() {
    // TODO: Get dashboard definitions from local storage
    let apiUrl = APIURI+'/squealy-dashboard-design/'
    getApiRequest(apiUrl, null, this.setDashboardDefinitions, this.setDefaultDashboardDef, null)
  }

  setDashboardDefinitions = (response) => {
    this.setState({dashboardDefinitions: response, selectedDashboardIndex: response.length-1})
  }

  setDefaultDashboardDef = (response) => {
     this.setState({
       dashboardDefinitions: [getEmptyDashboardDefinition()],
       selectedDashboardIndex: 0
     })
  }

  dashboardAdditionHandler = () => {
    let dashboardList = this.state.dashboardDefinitions.slice()
    dashboardList.push(getEmptyDashboardDefinition())
    this.setState({dashboardDefinitions: dashboardList,
      selectedDashboardIndex: dashboardList.length-1
    })
  }

  deleteDashboard = (index) => {
    let dashboards = this.state.dashboardDefinitions.slice()
    dashboards.splice(index,1)
    let selectedDashboard = this.state.selectedDashboardIndex
    selectedDashboard = selectedDashboard===0 ? 0 : selectedDashboard-1
    this.setState({dashboardDefinitions: dashboards},()=>{this.setState({selectedDashboardIndex: selectedDashboard})})
  }

  selectDashboard = (index) => {
    this.setState({selectedDashboardIndex: index})
  }


  // Adds a new widget definition to a certain dashboard definition
  widgetAdditionHandler = (dashboardDefinitionIndex, newWidget) => {
    let newdashboardDefinitions = this.state.dashboardDefinitions.slice()
    newdashboardDefinitions[dashboardDefinitionIndex].widgets.push(newWidget)
    newdashboardDefinitions[dashboardDefinitionIndex].widgetsParams.push({})
    this.setState({
      dashboardDefinitions: newdashboardDefinitions,
    })
  }

  filterAdditionHandler = (dashboardDefinitionIndex, newFilter) => {
    let newDashboardDefinitions = this.state.dashboardDefinitions.slice()
    newDashboardDefinitions[dashboardDefinitionIndex].filters.push(newFilter)
    this.setState({
      dashboardDefinitions: newDashboardDefinitions
    })
  }

  saveDashboard = () => {
    let apiUrl = APIURI+'/squealy-dashboard-design/'
    let requestData = this.state.dashboardDefinitions.slice()
    postApiRequest(apiUrl, requestData, ()=>{
      document.getElementById('save-dashboard-btn').classList.remove('btn-danger')
      document.getElementById('save-dashboard-btn').classList.add('btn-success')},
      ()=>{},null)
  }

  // Updates the widget's postion in the main state
  widgetRepositionHandler = (dashboardIndex, widgetIndex, top, left) => {
    let newDashboardDefinitions = this.state.dashboardDefinitions.slice()
    newDashboardDefinitions[dashboardIndex].widgets[widgetIndex].top = top
    newDashboardDefinitions[dashboardIndex].widgets[widgetIndex].left = left
    this.setState({dashboardDefinitions: newDashboardDefinitions})
  }

  // Updates the widget's size in the main state
  widgetResizeHandler = (dashboardIndex, widgetIndex, width, height) => {
    let newDashboardDefinitions = this.state.dashboardDefinitions.slice()
    newDashboardDefinitions[dashboardIndex].widgets[widgetIndex].width = width
    newDashboardDefinitions[dashboardIndex].widgets[widgetIndex].height = height
    this.setState({dashboardDefinitions: newDashboardDefinitions})
  }

  // Updates the widget Definition in the state
  updateWidgetDefinition = (dashboardIndex, widgetIndex, updatedDefinition) => {
    let dashboardDefinitions= this.state.dashboardDefinitions.slice()
    let definitionToUpdate = dashboardDefinitions[dashboardIndex].widgets[widgetIndex]
    definitionToUpdate.title = updatedDefinition.title
    dashboardDefinitions[dashboardIndex].widgetsParams[widgetIndex] = updatedDefinition.apiParams
    definitionToUpdate.chartType = updatedDefinition.chartType
    definitionToUpdate.chartStyles = updatedDefinition.chartStyles
    this.setState({dashboardDefinitions: dashboardDefinitions})
  }

  // Updates a dashboard definition in the state
  updateDashboardDefinition = (dashboardIndex, keyToUpdate, updatedValue) => {
    let newDashboardDefinitions = this.state.dashboardDefinitions.slice()
    newDashboardDefinitions[dashboardIndex][keyToUpdate] = updatedValue
    this.setState({dashboardDefinitions: newDashboardDefinitions})
  }

  filterRepositionHandler = (dashboardIndex, filterIndex, top, left) => {
    let newDashboardDefinitions = this.state.dashboardDefinitions.slice()
    newDashboardDefinitions[dashboardIndex].filters[filterIndex].top = top
    newDashboardDefinitions[dashboardIndex].filters[filterIndex].left = left
    this.setState({dashboardDefinitions: newDashboardDefinitions})
  }

  filterResizeHandler = (dashboardIndex, filterIndex, width, height) => {
    let newDashboardDefinitions = this.state.dashboardDefinitions.slice()
    newDashboardDefinitions[dashboardIndex].filters[filterIndex].width = width
    newDashboardDefinitions[dashboardIndex].filters[filterIndex].height = height
    this.setState({dashboardDefinitions: newDashboardDefinitions})
  }

  deleteFilter = (dashboardIndex, filterIndex) => {
    let newDashboardDefinitions = JSON.parse(JSON.stringify(this.state.dashboardDefinitions.slice()))
    newDashboardDefinitions[dashboardIndex].filters.splice(filterIndex,1)
    this.setState({dashboardDefinitions: newDashboardDefinitions})
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.state.dashboardDefinitions!==prevState.dashboardDefinitions) {
      document.getElementById('save-dashboard-btn').classList.add('btn-danger');
      document.getElementById('save-dashboard-btn').classList.remove('btn-success');
    }
  }

  render() {
    const {dashboardDefinitions, selectedDashboardIndex} = this.state
    return (
      <div>
        <DashboardHeader saveDashboard={this.saveDashboard}/>
        <DashboardNavigator
          selectDashboard={this.selectDashboard}
          deleteDashboard={this.deleteDashboard}
          selectedDashboardIndex={selectedDashboardIndex}
          dashboardDefinition={dashboardDefinitions}
          dashboardAdditionHandler={this.dashboardAdditionHandler}
          widgetAdditionHandler={this.widgetAdditionHandler}
          widgetRepositionHandler={this.widgetRepositionHandler}
          widgetResizeHandler={this.widgetResizeHandler}
          updateWidgetDefinition={this.updateWidgetDefinition}
          updateDashboardDefinition={this.updateDashboardDefinition}
          filterAdditionHandler={this.filterAdditionHandler}
          deleteFilter={this.deleteFilter}
          filterRepositionHandler={this.filterRepositionHandler}
          filterResizeHandler={this.filterResizeHandler}
        />
      </div>
    )
  }
}
