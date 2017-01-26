require('./Panel.less');
var React = require('react');
var classNames = require('classnames');
var MathChart = require('./MathChart.js');

var Component_Input= require('COMPONENT/Component.Input.js');

var Panel = React.createClass({
  /* Public Method *********************************************************************/

  /* Private Method *********************************************************************/
  _setChartPara : function (){
      var minX=this.refs.minX.value();
      var maxX=this.refs.maxX.value();
      var minY=this.refs.minY.value();
      var maxY=this.refs.maxY.value();
      alert(minX+", "+maxX+", "+minY+", "+maxY);
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
  },
  render:function(){
    return(
      <div className="__panelWrap" ref="self">
          <div className="__panelLeft" ref="left" style={{"width":this.state.left+"px"}}>
              <Component_Input ref="minX" tag="Min X" left={80} width={280} value="0" customClassName="inputItem" color="#333" valueCheck={this._checkCorValue} onChanged={this._setChartPara.bind(this)}/>
              <Component_Input ref="maxX" tag="Max X" left={80} width={280} value="10" customClassName="inputItem" color="#333" valueCheck={this._checkCorValue} onChanged={this._setChartPara.bind(this)}/>
              <Component_Input ref="minY" tag="Min Y" left={80} width={280} value="0" customClassName="inputItem" color="#333" valueCheck={this._checkCorValue} onChanged={this._setChartPara.bind(this)}/>
              <Component_Input ref="maxY" tag="Max Y" left={80} width={280} value="10" customClassName="inputItem" color="#333" valueCheck={this._checkCorValue} onChanged={this._setChartPara.bind(this)}/>
          </div>
          <div className="__panelRight" ref="right" style={{"margin-left":this.state.left+"px"}}>
            <MathChart/>
          </div>
      </div>
    );
  }
});

module.exports = Panel;
