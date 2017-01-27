require('./Panel.less');
var React = require('react');
var classNames = require('classnames');
var MathChart = require('./MathChart.js');

var Component_Input= require('COMPONENT/Component.Input.js');

var Panel = React.createClass({
  /* Public Method *********************************************************************/

  /* Private Method *********************************************************************/
  _setChartPara : function (){
      var xStart=this.refs.xStart.value();
      var yStart=this.refs.yStart.value();
      var xInterval=this.refs.xInterval.value();
      var yInterval=this.refs.yInterval.value();
      this.refs.chart.setOption({
        intervalNumber: {x:Number(xInterval), y:Number(yInterval)},
        start: {x:Number(xStart), y:Number(yStart)}
      });
  },
  _checkCorValue: function (v){
      return parseFloat(v)||0;
  },
  /* React Method *********************************************************************/
  getInitialState: function() {
    return {
      left: this.props.left||300,
    };
  },
  componentDidMount:function(){
      window.add = this.refs.chart.addFormula.bind(this);
      console.log("[Example]  add('function(x){return x;}','#990000');");
  },
  render:function(){
    return(
      <div className="__panelWrap" ref="container">
          <div className="__panelLeft" ref="left" style={{"width":this.state.left+"px"}}>
              <Component_Input ref="xStart" tag="X Start" left={80} width={260} value="0" customClassName="inputItem" color="#333" valueCheck={this._checkCorValue} onChanged={this._setChartPara.bind(this)}/>
              <Component_Input ref="xInterval" tag="X Interval" left={80} width={260} value="1" customClassName="inputItem" color="#333" valueCheck={this._checkCorValue} onChanged={this._setChartPara.bind(this)}/>
              <br/>
              <Component_Input ref="yStart" tag="Y Start" left={80} width={260} value="0" customClassName="inputItem" color="#333" valueCheck={this._checkCorValue} onChanged={this._setChartPara.bind(this)}/>
              <Component_Input ref="yInterval" tag="Y Interval" left={80} width={260} value="1" customClassName="inputItem" color="#333" valueCheck={this._checkCorValue} onChanged={this._setChartPara.bind(this)}/>
          </div>
          <div className="__panelRight" ref="right" style={{"margin-left":this.state.left+"px"}}>
              <MathChart ref="chart" />
          </div>
      </div>
    );
  }
});

module.exports = Panel;
