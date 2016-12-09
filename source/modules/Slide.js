import React, { Component, PropTypes } from 'react'
import { Match } from 'react-router'
import { ThemeProvider } from 'styled-components'
import { presentationContext, slideContext } from './PropTypes'

export default class Slide extends Component {
  static childContextTypes = {
    slide: slideContext.isRequired
  };

  static contextTypes = {
    pluginProps: PropTypes.object.isRequired,
    presentation: presentationContext.isRequired
  };

  static propTypes = {
    component: PropTypes.any,
    render: PropTypes.any
  };

  constructor (props, context) {
    super(props, context)

    this._stepIndex = 0

    this._renderComponent = this._renderComponent.bind(this)
  }

  componentWillMount () {
    const { presentation } = this.context
    const { pattern, slideIndex } = presentation.getSlideMetadata(this)

    this._pattern = pattern
    this._slideIndex = slideIndex
  }

  componentWillUnmount () {
    this._stepIndex = 0
  }

  getChildContext () {
    return {
      slide: this
    }
  }

  getNumSteps () {
    return this._numSteps || this._stepIndex + 1
  }

  registerStep (index) {
    this._stepIndex = Math.max(this._stepIndex, index)
  }

  render () {
    return (
      <Match
        pattern={this._pattern}
        render={this._renderComponent}
      />
    )
  }

  setNumSteps (numSteps: number) {
    this._numSteps = numSteps
  }

  _renderComponent () {
    const { pluginProps, presentation } = this.context
    const { component: Component, render } = this.props

    const { isPresenterMode } = pluginProps

    const slideIndex = this._slideIndex
    const stepIndex = presentation.getStepIndex()

    let rendered

    if (typeof render === 'function') {
      rendered = render({ isPresenterMode, slideIndex, stepIndex })
    } else {
      rendered = (
        <Component
          isPresenterMode={isPresenterMode}
          slideIndex={slideIndex}
          stepIndex={stepIndex}
        />
      )
    }

    const providerKey = String(Boolean(isPresenterMode))
    return (
      <ThemeProvider theme={{ isPresenterMode }} key={providerKey}>
        {rendered}
      </ThemeProvider>
    )
  }
}
