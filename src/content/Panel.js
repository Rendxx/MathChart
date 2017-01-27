require('./Panel.less');
var React = require('react');
var classNames = require('classnames');
var MathChart = require('./MathChart.js');

var Component_Input= require('COMPONENT/Component.Input.js');

var Panel = React.createClass({
  /* Public Method *********************************************************************/
  /* Private Method *********************************************************************/
  _resize: function() {
      let w = this.refs.right.offsetWidth
        , h = this.refs.right.offsetHeight
        ;
      this.refs.chart.resize(w-40,h-40);
  },
  _setChartPara : function (){
      let xStart=this.refs.xStart.value()
        , yStart=this.refs.yStart.value()
        , xInterval=this.refs.xInterval.value()
        , yInterval=this.refs.yInterval.value()
        , xDecimal=this.refs.xDecimal.value()
        , yDecimal=this.refs.yDecimal.value()
        , xDis=this.refs.xDis.value()
        , yDis=this.refs.yDis.value()
        ;
      this.refs.chart.setOption({
        intervalNumber: {x:Number(xInterval), y:Number(yInterval)},
        intervalPixel: {x:Number(xDis), y:Number(yDis)},
        start: {x:Number(xStart), y:Number(yStart)},
        decimal: {x:Number(xDecimal), y:Number(yDecimal)}
      });
  },
  _checkCorValue: function (v){
      return parseFloat(v)||0;
  },
  _checkInteger:function(v){
      return parseInt(v)||0;
  },
  /* React Method *********************************************************************/
  getInitialState: function() {
    return {
      left: this.props.left||300,
    };
  },
  componentDidMount:function(){
      window.add = this.refs.chart.addFormula.bind(this.refs.chart);
      window.remove = this.refs.chart.removeFormula.bind(this.refs.chart);
      window.addEventListener('resize',this._resize.bind(this));
      setTimeout(this._resize.bind(this),1)
      console.log("[Example]  add('function(x){return x;}','#990000');");
  },
  render:function(){
    let itemClass = "inputItem"
      , left = 80
      , w = 260
      , color = "#333"
      , color2 = "#06f"
      ;
    return(
      <div className="__panelWrap" ref="container">
          <div className="__panelLeft" ref="left" style={{"width":this.state.left+"px"}}>
              <Component_Input ref="xStart" tag="X Start" left={left} width={w} value="0" customClassName={itemClass} color={color} valueCheck={this._checkCorValue} onChanged={this._setChartPara.bind(this)}/>
              <Component_Input ref="xInterval" tag="X Interval" left={left} width={w} value="1" customClassName={itemClass} color={color} valueCheck={this._checkCorValue} onChanged={this._setChartPara.bind(this)}/>
              <br/>
              <Component_Input ref="yStart" tag="Y Start" left={left} width={w} value="0" customClassName={itemClass} color={color} valueCheck={this._checkCorValue} onChanged={this._setChartPara.bind(this)}/>
              <Component_Input ref="yInterval" tag="Y Interval" left={left} width={w} value="1" customClassName={itemClass} color={color} valueCheck={this._checkCorValue} onChanged={this._setChartPara.bind(this)}/>
              <br/><br/>
              <Component_Input ref="xDecimal" tag="X Decimal" left={left} width={w} value="2" customClassName={itemClass} color={color2} valueCheck={this._checkInteger} onChanged={this._setChartPara.bind(this)}/>
              <Component_Input ref="yDecimal" tag="Y Decimal" left={left} width={w} value="2" customClassName={itemClass} color={color2} valueCheck={this._checkInteger} onChanged={this._setChartPara.bind(this)}/>
              <br/>
              <Component_Input ref="xDis" tag="X Ditance" left={left} width={w} value="40" customClassName={itemClass} color={color2} valueCheck={this._checkInteger} onChanged={this._setChartPara.bind(this)}/>
              <Component_Input ref="yDis" tag="Y Ditance" left={left} width={w} value="30" customClassName={itemClass} color={color2} valueCheck={this._checkInteger} onChanged={this._setChartPara.bind(this)}/>
          </div>
          <div className="__panelRight" ref="right" style={{"margin-left":this.state.left+"px"}}>
              <MathChart ref="chart" />
          </div>
      </div>
    );
  }
});

module.exports = Panel;
