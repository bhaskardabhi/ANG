import React from 'react';
import './App.css';
import logo from "./logo.jpg";
import { withRouter } from 'react-router-dom';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";

class App extends React.Component {
  state  = {
    value: null,
    unit: 'c',
    result: null
  }

  componentDidMount = () => {
    var params = this.props.match.params;

    if (params.arg1 && !params.arg2){
      this.setState({
        value: params.arg1
      }, () => {
        this.convert();
      });

    } else if (params.arg1 && params.arg2){
      var unit = "c";
      if (['c', 'f', 'k'].indexOf(params.arg1) > -1){
        unit = params.arg1;
      }

      this.setState({
        value: params.arg2,
        unit: params.arg1
      }, () => {
        this.convert();
      });
    }
  }

  handleChange(field, value) {
    this.setState({
      [field]: value
    });
  }

  convert = () => {
    if(this.state.value === null){
      alert("Please enter value");
      return false;
    }

    if(this.state.unit === null){
      alert("Please enter unit");
      return false;
    }

    if(this.state.unit == "f"){
      var value = this.convertFtoC(this.state.value);
    } else if (this.state.unit == "k"){
      var value = this.convertKtoC(this.state.value);
    } else {
      var value = this.state.value;
    }

    this.setState({
      result: this.convertCtoAjayNiGand(value)
    })
  }

  convertFtoC = (value) => {
    return (value - 32) * (5/9);
  }

  convertKtoC = (value) => {
    return (value - 273.15);
  }

  convertCtoAjayNiGand = (value) => {
    return value / (Math.pow(10, 32) - 273.15);
  }

  getDisplayUnit = () => {
    if (this.state.unit == "f") {
      return "F";
    } else if (this.state.unit == "k") {
      return "K";
    } else {
      return String.fromCharCode(8451);
    }
  }

  longnumberstring = (n) => {
    var str, 
      str2 = '', 
      data = n.toExponential().replace('.', '').split(/e/i),
      str = data[0], 
      mag = Number(data[1]);

      if (mag >= 0 && str.length > mag) {
      mag += 1;
      return str.substring(0, mag) + '.' + str.substring(mag);
    }
    if (mag < 0) {
      while (++mag) str2 += '0';
      return '0.' + str2 + str;
    }
    mag = (mag - str.length) + 1;
    while (mag > str2.length) {
      str2 += '0';
    }
    return str + str2;
  }

  ColorLuminance = (hex, lum) => {

    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;

    // convert to decimal and change luminosity
    var rgb = "#", c, i;
    for (i = 0; i < 3; i++) {
      c = parseInt(hex.substr(i * 2, 2), 16);
      c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
      rgb += ("00" + c).substr(c.length);
    }

    return rgb;
  }

  getDisplayResult = () => {
    return this.longnumberstring(this.state.result);
  }

  getBackgroundColor = () => {
    if(this.state.result === null){
      return 'white';
    }
    console.log(this.ColorLuminance('FF0000', 0.2));

    return this.ColorLuminance('FF0000',0.2);
  }

  render(){
    console.log(this.props);
    return (
      <div style={{position: 'fixed',top: 0, left:0, right:0,bottom: 0}}>
        <h2 className="text-center mb-4 mt-4">Convert to ANG</h2>
        <div className="container">
          <div className="row">
            <div class="col-md-6 mt-1 offset-md-3">
              <div class="text-center">
                <img style={{height: '200px', marginBottom: '40px'}} src={logo}/>
              </div>
              <div class="row">
                <div class="col-md-8">
                  <input type="number" 
                    class="form-control mr-4 form-control-lg" 
                    value={this.state.value} 
                    onChange={(event) => this.handleChange('value',event.target.value)}
                    placeholder="Enter value" />
                </div>
                <div class="col-md-4">
                  <select value={this.state.unit} onChange={(event) => this.handleChange('unit', event.target.value)} class="form-control mr-4 form-control-lg">
                    <option value="c">&#8451;</option>
                    <option value="f">F</option>
                    <option value="k">Kelvin</option>
                  </select>
                </div>
              </div>
              <div class="mt-3">
                <button type="button" onClick={this.convert} class="btn btn-primary btn-lg btn-block">Convert</button>
              </div>
            </div>
            <div class="col-md-10 mt-1 offset-md-1">
              {this.state.result && <div class="mt-3">
                <div class="jumbotron text-center">
                  <p class="lead">{this.state.value} {this.getDisplayUnit(this.state.unit)} = {this.getDisplayResult()} ANG</p>
                </div>
              </div>}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(App);
