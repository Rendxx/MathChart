require('./MathChart.less');
var React = require('react');
var classNames = require('classnames');

var Chart = React.createClass({
    /* Public Method *********************************************************************/
    setOption: function({
        intervalPixel = {},
        intervalNumber = {},
        start = {},
        decimal = undefined,
    }) {
        let _intervalPixel = {
            x: intervalPixel.x || this.state.intervalPixel.x,
            y: intervalPixel.y || this.state.intervalPixel.y
        };
        let _intervalNumber = {
            x: intervalNumber.x || this.state.intervalNumber.x,
            y: intervalNumber.y || this.state.intervalNumber.y
        };
        let _start = {
            x: start.x==undefined?this.state.start.x:start.x,
            y: start.y==undefined?this.state.start.y:start.y
        };
        let _decimal = decimal==undefined?this.state.decimal:decimal;
        this.setState({
            intervalPixel: _intervalPixel,
            intervalNumber: _intervalNumber,
            start: _start,
            decimal: _decimal
        });
    },
    resize: function(w, h) {
        this.refs.self.style.width = w + "px";
        this.refs.self.style.height = h + "px";
        this.refs.self.style.marginTop = -(h >> 1) + "px";
        this.refs.self.style.marginLeft = -(w >> 1) + "px";
        this.setState({
            width: w,
            height: h
        });
        this._render();
    },
    addFormula: function(f, color) {
        var d = {
            str: f,
            color: color,
            func: null
        };
        eval("d.func=" + f);

        this.state.formula.push(d);
        this._render();
    },

    /* Private Method *********************************************************************/
    _render: function() {
        if (this.state.ctx == null) return;
        let ctx = this.state.ctx,
            w = this.state.width,
            h = this.state.height,
            interval = this.state.intervalPixel,
            num = this.state.intervalNumber,
            start = this.state.start,
            textSpace = this.state.textSpace,
            decimal = this.state.decimal,
            ori = [textSpace, h - textSpace],
            outer = 4,
            borderColor = '#6699dd',
            bgColor = '#F1F6Fb',
            gridColor = '#ffffff';

        // draw scene ------------------------------------
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = bgColor;
        ctx.fillRect(textSpace, outer, w - textSpace - outer, h - textSpace - outer);

        ctx.lineWidth = 1;
        let tmp = 0;

        // draw grid ------------------------------------
        {
            ctx.beginPath();
            //ctx.setLineDash([5, 3]);
            // x grid
            tmp = ori[0] + interval.x + 0.5;
            while (tmp < w) {
                ctx.moveTo(tmp, ori[1]);
                ctx.lineTo(tmp, 0);
                tmp += interval.x;
            }
            // y grid
            tmp = ori[1] - interval.y + 0.5;
            while (tmp > 0) {
                ctx.moveTo(ori[0], tmp);
                ctx.lineTo(w, tmp);
                tmp -= interval.y;
            }
            ctx.strokeStyle = gridColor;
            ctx.stroke();
            ctx.setLineDash([0, 0]);
        }

        // draw formula and clear outside ----------------------
        {
            this._renderFormula();
            ctx.clearRect(0, 0, textSpace, h);
            ctx.clearRect(0, h - textSpace, w, h);
            ctx.clearRect(0, 0, w, outer);
            ctx.clearRect(w - outer, 0, w, h);
            ctx.lineWidth = 1;
        }

        // draw border ------------------------------------------
        {
            ctx.beginPath();
            // x
            ctx.moveTo(ori[0] + 0.5 - outer, ori[1] + 0.5);
            ctx.lineTo(w + 0.5, ori[1] + 0.5);
            // y
            ctx.moveTo(ori[0] + 0.5, ori[1] + 0.5 + outer);
            ctx.lineTo(ori[0] + 0.5, 0 + 0.5);

            ctx.strokeStyle = borderColor;
            ctx.stroke();
        }

        // draw unit ------------------------------------
        {
            // x coordinate
            ctx.beginPath();
            tmp = ori[0] + interval.x + 0.5;
            while (tmp < w) {
                ctx.moveTo(tmp, ori[1]);
                ctx.lineTo(tmp, ori[1] - 4);
                tmp += interval.x;
            }
            // y coordinate
            tmp = ori[1] - interval.y + 0.5;
            while (tmp > 0) {
                ctx.moveTo(ori[0], tmp);
                ctx.lineTo(ori[0] + 4, tmp);
                tmp -= interval.y;
            }
            ctx.strokeStyle = borderColor;
            ctx.stroke();
        }

        // draw text ----------------------------------------
        {
            // x text
            tmp = ori[0] + interval.x;
            let n = num.x;
            while (tmp < w) {
                this._drawText_x((start.x + n).toFixed(decimal), [tmp, ori[1]], borderColor);
                tmp += interval.x;
                n += num.x;
            }
            // y text
            tmp = ori[1] - interval.y;
            n = num.y;
            while (tmp > 0) {
                this._drawText_y((start.y + n).toFixed(decimal), [ori[0], tmp], borderColor);
                tmp -= interval.y;
                n += num.y;
            }
        }
    },
    _getCoordinate: function(pos) {
        let x = (pos[0] - this.state.start.x) / this.state.intervalNumber.x * this.state.intervalPixel.x,
            y = (pos[1] - this.state.start.y) / this.state.intervalNumber.y * this.state.intervalPixel.y;
        return [x + this.state.textSpace, this.state.height - y - this.state.textSpace];
    },
    _drawText_x: function(text, pos, color) {
        let ctx = this.state.ctx;
        ctx.font = "10px Arial";
        ctx.fillStyle = color;
        ctx.textAlign = "center";
        ctx.fillText(text, pos[0], pos[1] + 20);
    },
    _drawText_y: function(text, pos, color) {
        let ctx = this.state.ctx;
        ctx.font = "10px Arial";
        ctx.fillStyle = color;
        ctx.textAlign = "right";
        ctx.fillText(text, pos[0] - 10, pos[1] + 7);
    },
    _renderFormula: function() {
        let ctx = this.state.ctx,
            w = this.state.width,
            h = this.state.height,
            interval = this.state.intervalPixel,
            num = this.state.intervalNumber,
            start = this.state.start,
            count = ~~(w / interval.x);
        let run = function(idx, f) {
            try {
                var coordinates = [];
                for (var i = 0; i <= count; i++) {
                    let x = start.x + i * num.x;
                    coordinates.push([x, f.func(x)]);
                }
                this._drawLine(coordinates, f.color);
            } catch (e) {
                console.log('[ERROR] ' + f.str + "  (" + idx + ")");
                console.log(e);
                alert(e.message);
            }
        }.bind(this);

        for (var i = 0; i < this.state.formula.length; i++) {
            run(i, this.state.formula[i]);
        }
    },
    _drawLine: function(coordinates, color) {
        let ctx = this.state.ctx;
        ctx.beginPath();
        ctx.lineWidth = 2;
        let pos = this._getCoordinate(coordinates[0]);
        ctx.moveTo(pos[0] + 0.5, pos[1] + 0.5);
        for (var i = 1; i < coordinates.length; i++) {
            pos = this._getCoordinate(coordinates[i]);
            ctx.lineTo(pos[0] + 0.5, pos[1] + 0.5);
        }
        ctx.strokeStyle = color;
        ctx.stroke();
    },

    /* React Method *********************************************************************/
    getInitialState: function() {
        return {
            ctx: null,
            width: 800,
            height: 600,
            intervalPixel: {
                x: 40,
                y: 30
            },
            intervalNumber: {
                x: 1,
                y: 1
            },
            start: {
                x: 0,
                y: 0
            },
            textSpace: 40,
            decimal:2,
            formula: []
        };
    },
    componentDidMount: function() {
        this.setState({
            ctx: this.refs.scene.getContext("2d")
        });
        this.resize(this.state.width, this.state.height);
    },
    componentDidupdate: function() {
        this._render();
    },
    render: function() {
        this._render();
        return (
          <div className="mathChart" ref="self" >
            <canvas className="scene" ref="scene" width={this.state.width} height={this.state.height}></canvas>
          </div>
        );
    }
});

module.exports = Chart;
