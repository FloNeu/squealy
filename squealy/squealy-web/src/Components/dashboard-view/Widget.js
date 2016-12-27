import React, {Component} from 'react'

import GoogleChartComponent from '../GoogleChartComponent'
import Rnd from 'react-resizable-and-movable'
import EditIcon from '../../images/Edit_icon.png'
import {getApiRequest} from '../../Utils'

const style = {
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};


export default class Widget extends Component {

  constructor(props) {
    super(props)
    this.state = {
      width: props.widgetData.width,
      height: props.widgetData.height,
      top: props.widgetData.top,
      left: props.widgetData.left
    }
  }
  componentWillMount() {
    const url = 'http://localhost:8000/squealy-apis/'+this.props.widgetData.api_url
    getApiRequest(url, null, (data)=> this.setState({chartData: data}), ()=>{}, null)
  }
  // Sets the width and height of the widget and rnd component in widget's state
  widgetResizeHandler = (direction, styleSize) => {
    this.setState({
      width: styleSize.width,
      height: styleSize.height
    })
  }

  // Sets the position of the widget in its state
  widgetPositionHandler = (event, uiState) => {
    this.setState({
      top: uiState.position.top,
      left: uiState.position.left
    }, () => {
      // Update the position of the widget in the state of dashboard container
      const {selectedDashboardIndex, index} = this.props
      this.props.widgetRepositionHandler(selectedDashboardIndex, index, this.state.top, this.state.left)
    })
  }

  // Toggles the edit mode of this component
  editModeToggler = () => {
    this.setState({editMode: !this.state.editMode})
  }

  // Updates the size of the widget in the state of dashboard container
  widgetSizeUpdator = () => {
    const {selectedDashboardIndex, index} = this.props
    this.props.widgetResizeHandler(
      selectedDashboardIndex,
      index,
      this.state.width,
      this.state.height
    )
  }


  render() {
    const {top, left, height, width, chartData} = this.state
    const {
      modalVisibilityEnabler,
      index,
      widgetData
    } = this.props
    return(
      <Rnd
        ref={'widget'+index}
        x={left}
        y={top}
        width={width}
        height={height}
        onResize={this.widgetResizeHandler}
        onResizeStop={this.widgetSizeUpdator}
        onDragStop={this.widgetPositionHandler}
        resizeGrid={[10,10]}
        moveGrid={[10,10]}
      >
        <div
          onMouseEnter={this.editModeToggler}
          onMouseLeave={this.editModeToggler}
        >
          <h3>
            {widgetData.title}
          </h3>
          {this.state.editMode?
            <img src={EditIcon}
             className='edit-icon'
             onClick={()=>modalVisibilityEnabler(index)}
            />
            :
            null
          }
        </div>
        <GoogleChartComponent config={{
            ...chartData,
            index: index,
            width: width,
            height: height,
            chartType: widgetData.chartType,
            chartStyles: widgetData.chartStyles
          }}
        />
      </Rnd>
    )
  }
}
