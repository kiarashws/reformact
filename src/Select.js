import React, {Component} from 'react'

export default class Select extends Component {
  state = {
    hasError: false,
    errors: [],
    value: this.props.defaultValue || (
      this.props.multiSelect
      ? []
      : ''),
    options: this.props.options || [],
    optionsVisible: false
  }
  openOptions = () => {
    this.setState({optionsVisible: true})
  }
  closeOptions = () => {
    this.setState({optionsVisible: false})
  }
  selectOption = (op) => {
    const {multiSelect} = this.props
    if (multiSelect)
      this.setState({
        value: [
          op, ...this.state.value
        ],
        options: this.state.options.filter(o => o !== op)
      }, this.handleChange)
    else {
      this.setState({
        value: op
      }, this.handleChange)
      this.closeOptions()
    }
  }
  handleChange = () => {
    this.props.onChange({
      target: {
        value: this.state.value,
        name: this.props.name
      }
    })
  }
  removeValue = (op) => {
    this.setState({
      value: this.state.value.filter(v => v !== op),
      options: [
        ...this.state.options,
        op
      ]
    }, this.handleChange)
  }
  render() {
    const {
      placeholder,
      requiredPhrase,
      required,
      selectHandle,
      hasPlaceholder,
      multiSelect,
      needsToFill
    } = this.props
    const {hasError, value, errors, optionsVisible, options} = this.state
    return (<div className="input-holder">
      <span className={(
          multiSelect && value[0]) || (!multiSelect && value)
          ? 'with-value'
          : ''}>{placeholder}{
          required
            ? '*'
            : ''
        }</span>
      <div onClick={this.openOptions} className={hasError || (needsToFill && value.length === 0)
          ? 'input input-select input-err'
          : 'input input-select '}>
        {
          multiSelect
            ? value.length > 0
              ? value.map((v, index) => <div key={index} className="val-one" onBlur={this.closeOptions}>
                {v.label || value}
                <a onClick={() => this.removeValue(v)}>x</a>
              </div>)
              : hasPlaceholder !== false
                ? placeholder
                : ' asd'
            : value.label
              ? value.label
              : value !== ''
                ? value
                : hasPlaceholder!== false
                  ? placeholder
                  : <i>&nbsp;</i>
        }
        <div className="ops-handle">
          {
            selectHandle
              ? selectHandle
              : <i className="ops-triangle"/>
          }
        </div>
        <input type="select" onBlur={this.closeOptions}/>
      </div>
      <div className={optionsVisible && options.length !== 0
          ? "reformact-select-options vis"
          : "reformact-select-options"}>
        {
          options.map((op, index) => <div key={index} className="op" onClick={() => this.selectOption(op)}>
            {op.label}
          </div>)
        }
      </div>
      <ul className={errors.length > 0 || needsToFill
          ? "input-errors vis"
          : "input-errors"}>
        {needsToFill && value.length === 0 && <li>{requiredPhrase || 'This field is required.'}</li>}
        {errors.map((error, index) => <li key={index}>{error}</li>)}
      </ul>
    </div>)
  }
}
