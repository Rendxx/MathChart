require('./Component.Input.less');
var React = require('react');
var classNames = require('classnames');

var Input = React.createClass({
  /* Public Method *********************************************************************/
  visible: function (t) {
      this.setState({
          visible: t == true
      });
  },
  enable: function (t) {
      this.setState({
          enabled: t == true
      });
  },
  expand: function (t) {
      this.setState({
          expanded: t == true
      });

      if (this.state.expanded){
          window.addEventListener('click', this._hideFunction.bind(this), true);
          this.refs.input.focus();
          this.setState({textBackup:this.refs.input.value});
      }else{
          window.removeEventListener('click', this._hideFunction.bind(this), true);
          this.refs.input.blur();
          if (this.state.changed){
              if (this.props.valueCheck) this.refs.input.value = this.props.valueCheck(this.refs.input.value);
              this.setState({changed:false});
              setTimeout((function(){this.props.onChanged && this.props.onChanged(this.refs.input.value);}).bind(this),1);
          }
      }
  },
  value: function (v) {
      if (v===undefined||v===null) return this.refs.input.value;
      this.refs.input.value=v;
  },

  /* Private Method *********************************************************************/
  _hideFunction: function(e){
      if (!this._checkClickInside(e)) this.expand(false);
      var h = this.refs.container.offsetHeight;
  },
  _checkClickInside: function (e) {
      var node = e.target;
      while (node != null) {
          if (node === this.refs.container) return true;
          node = node.parentNode;
      }
      return false;
  },

  /* React Method *********************************************************************/
  getInitialState: function() {
    return {
      visible: this.props.hasOwnProperty('visible') ? (this.props.visible !==false) : true,
      enabled: this.props.hasOwnProperty('enabled') ? (this.props.enabled !== false) : true,
      expanded: false,
      left: this.props.left||100,
      width: this.props.width||240,
      changed: false,
      textBackup: this.props.value
    };
  },
  componentDidMount:function(){
      this.refs.container.addEventListener('click', function (e) {
          if (!this.state.enabled||this.state.expanded) return;
          this.expand(true);
      }.bind(this));
      this.refs.input.addEventListener('keydown', function (e) {
        this.setState({changed:true});
        if (e.which == 27) {
            // ESC
            this.refs.input.value = this.state.textBackup;
            this.expand(false);
            return false;
        } else if (e.which == 13) {
            // ENTER
            this.expand(false);
            return false;
        }
      }.bind(this));

      if (this.props.hasOwnProperty('value')) {
          this.refs.input.value=this.props.value;
      }
  },
  render:function(){
    var className = {
        '__visible': this.state.visible,
        '__enabled': this.state.enabled,
        '__expanded': this.state.expanded
    };
    if (this.props.hasOwnProperty('customClassName')) className[this.props.customClassName] = true;
    return(
      <div className={classNames('__componet_input', className)} ref="container"
          style={{
            "width":this.state.width+"px",
            "color":this.props.color||"#333"
          }}>
          <div className="__componet_input_bg"></div>
          <div className="__componet_input_inner">
              <div className="__componet_input_tag"
                   style={{
                     "width":this.state.left+"px",
                     "border-color": this.props.color||"#333"
                   }}>
                   {this.props.tag}
              </div>
              <input className="__componet_input_content"
                    ref="input"
                    type={this.props.type||"text"}
                    placeholder={this.props.placeholder}
                    style={{"padding-left":this.state.left+"px"}}/>
          </div>
      </div>
    );
  }
});

module.exports = Input;
