var { Component, Rect } = scene

export default class WSLiveVideo extends Rect {

  _draw(ctx) {

    this._ctx = ctx

    if(!this._player) {

      var client = new WebSocket( this.model.url );

      this._player = new jsmpeg(client, {
        ondecodeframe: this.drawDecoded.bind(this)
      })

    }

    if(this._isPlaying){
      ctx.drawImage(
        this._player.canvas,
        0,
        0,
        this._player.width,
        this._player.height,
        this.model.left,
        this.model.top,
        this.model.width,
        this.model.height
      )

      if(this._isHover) {
        this.drawStopButton(ctx)
      }

      // this.drawComponentFrame(ctx)

    } else {
      // this.drawComponentFrame(ctx)
      var { left, top, width, height } = this.model

      ctx.beginPath()
      ctx.rect(left, top, width, height)
      this.drawFill(ctx)
      this.drawSymbol(ctx)
      this.drawPlayButton(ctx)

    }

    this.drawComponentFrame(ctx)

  }

  drawSymbol(ctx) {
    var image = new Image();
    image.src = 'data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjUxMnB4IiBoZWlnaHQ9IjUxMnB4IiB2aWV3Qm94PSIwIDAgMzQ3Ljg0NiAzNDcuODQ2IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAzNDcuODQ2IDM0Ny44NDY7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8Zz4KCQk8Zz4KCQkJPHBhdGggZD0iTTI1OS4wOTUsMjcwLjkxM2MzOC40OS0yNi45NjIsNjMuNzExLTcxLjU5LDYzLjcxMS0xMjIuMDQyQzMyMi44MDYsNjYuNzg2LDI1Ni4wMzIsMCwxNzMuOTIzLDAgICAgIEM5MS44MjgsMCwyNS4wNCw2Ni43ODYsMjUuMDQsMTQ4Ljg3MWMwLDUwLjk1LDI1LjcxNiw5NS45NjMsNjQuODIyLDEyMi44MUM3MCwyNzkuNzg4LDU5LjE4OSwyOTAuNjIsNTkuMTg5LDMwMi44MSAgICAgYzAsMjkuMjQ0LDU5Ljg5OCw0NS4wMzYsMTE2LjI2NSw0NS4wMzZjNTYuMzQ5LDAsMTE2LjIzNS0xNS43OTIsMTE2LjIzNS00NS4wMzYgICAgIEMyOTEuNjg4LDI5MC4xODIsMjgwLjIxMywyNzkuMDkxLDI1OS4wOTUsMjcwLjkxM3ogTTE3My41NjUsNDYuMjIyYzYuOTQ3LDAsMTIuNTU5LDUuNjI2LDEyLjU1OSwxMi41NjggICAgIGMwLDYuOTM2LTUuNjExLDEyLjU2OC0xMi41NTksMTIuNTY4Yy02LjkyNCwwLTEyLjU1Ni01LjYzMy0xMi41NTYtMTIuNTY4QzE2MS4wMDksNTEuODQ5LDE2Ni42NDIsNDYuMjIyLDE3My41NjUsNDYuMjIyeiAgICAgIE0xNzMuOTIzLDg1LjAyMmMzNS4yMjQsMCw2My44NjYsMjguNjQ4LDYzLjg2Niw2My44NTRzLTI4LjY0Myw2My44NzMtNjMuODY2LDYzLjg3M2MtMzUuMjE1LDAtNjMuODY0LTI4LjY1NS02My44NjQtNjMuODczICAgICBDMTEwLjA1OSwxMTMuNjY1LDEzOC43MDgsODUuMDIyLDE3My45MjMsODUuMDIyeiBNMTc1LjQ1NCwzMzUuMjg0Yy02NC4yMzYsMC0xMDMuNjgyLTE4LjkyMi0xMDMuNjgyLTMyLjQ3NSAgICAgYzAtNy44MywxMi4xOTMtMTYuNDQsMzEuODY4LTIyLjczM2MyMC45NTEsMTEuMjg5LDQ0Ljg4MywxNy42OSw3MC4yODksMTcuNjljMjUuODYyLDAsNTAuMTc2LTYuNjQyLDcxLjM3OS0xOC4yNzkgICAgIGMyMC42MDMsNi4yODEsMzMuODMxLDE1LjI4OCwzMy44MzEsMjMuMzIyQzI3OS4xMjcsMzE2LjM2MiwyMzkuNjg4LDMzNS4yODQsMTc1LjQ1NCwzMzUuMjg0eiIgZmlsbD0iIzAwMDAwMCIvPgoJCTwvZz4KCQk8Zz4KCQkJPHBhdGggZD0iTTE3My45MjMsMTkxLjM3OWMyMy40MzEsMCw0Mi41MDItMTkuMDY4LDQyLjUwMi00Mi40OTZjMC0yMy40MjQtMTkuMDcxLTQyLjQ5My00Mi41MDItNDIuNDkzICAgICBjLTIzLjQyOCwwLTQyLjQ4NCwxOS4wNjgtNDIuNDg0LDQyLjQ5M0MxMzEuNDM4LDE3Mi4zMTEsMTUwLjQ5NSwxOTEuMzc5LDE3My45MjMsMTkxLjM3OXoiIGZpbGw9IiMwMDAwMDAiLz4KCQk8L2c+Cgk8L2c+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==';
    ctx.drawImage(
      image,
      0,
      0,
      image.width,
      image.height,
      this.model.left + this.model.width * 0.25,
      this.model.top + this.model.height * 0.25,
      this.model.width * 0.5,
      this.model.height * 0.5
    );

  }

  drawComponentFrame(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.model.left, this.model.top);
    ctx.lineTo(this.model.left+ this.model.width, this.model.top);
    ctx.lineTo(this.model.left+ this.model.width, this.model.top + this.model.height);
    ctx.lineTo(this.model.left, this.model.top + this.model.height);
    ctx.lineTo(this.model.left, this.model.top);
    ctx.stroke();
    ctx.closePath();
  }

  drawPlayButton(ctx) {
    // this.drawActionButton(ctx, "data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDQxLjk5OSA0MS45OTkiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQxLjk5OSA0MS45OTk7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4Ij4KPHBhdGggZD0iTTM2LjA2OCwyMC4xNzZsLTI5LTIwQzYuNzYxLTAuMDM1LDYuMzYzLTAuMDU3LDYuMDM1LDAuMTE0QzUuNzA2LDAuMjg3LDUuNSwwLjYyNyw1LjUsMC45OTl2NDAgIGMwLDAuMzcyLDAuMjA2LDAuNzEzLDAuNTM1LDAuODg2YzAuMTQ2LDAuMDc2LDAuMzA2LDAuMTE0LDAuNDY1LDAuMTE0YzAuMTk5LDAsMC4zOTctMC4wNiwwLjU2OC0wLjE3N2wyOS0yMCAgYzAuMjcxLTAuMTg3LDAuNDMyLTAuNDk0LDAuNDMyLTAuODIzUzM2LjMzOCwyMC4zNjMsMzYuMDY4LDIwLjE3NnoiIGZpbGw9IiMwMDAwMDAiLz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==");
    this.drawActionButton(ctx, "data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTguMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTI7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4Ij4KPHBhdGggZD0iTTI1NiwwQzExNC42MTcsMCwwLDExNC42MTUsMCwyNTZzMTE0LjYxNywyNTYsMjU2LDI1NnMyNTYtMTE0LjYxNSwyNTYtMjU2UzM5Ny4zODMsMCwyNTYsMHogTTM0NC40OCwyNjkuNTdsLTEyOCw4MCAgYy0yLjU5LDEuNjE3LTUuNTM1LDIuNDMtOC40OCwyLjQzYy0yLjY2OCwwLTUuMzQtMC42NjQtNy43NTgtMi4wMDhDMTk1LjE1NiwzNDcuMTcyLDE5MiwzNDEuODIsMTkyLDMzNlYxNzYgIGMwLTUuODIsMy4xNTYtMTEuMTcyLDguMjQyLTEzLjk5MmM1LjA4Ni0yLjgzNiwxMS4zMDUtMi42NjQsMTYuMjM4LDAuNDIybDEyOCw4MGM0LjY3NiwyLjkzLDcuNTIsOC4wNTUsNy41MiwxMy41NyAgUzM0OS4xNTYsMjY2LjY0MSwzNDQuNDgsMjY5LjU3eiIgZmlsbD0iIzAwMDAwMCIvPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K");
  }

  drawStopButton(ctx) {
    // this.drawActionButton(ctx, "data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDI3Ny4zMyAyNzcuMzMiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDI3Ny4zMyAyNzcuMzM7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8cGF0aCBkPSJNMjMxLjY3NywwSDQ1LjY2NUMyMC40NSwwLDAsMjAuNDQyLDAsNDUuNjU3djE4Ni4wMjFjMCwyNS4yMDcsMjAuNDUsNDUuNjUyLDQ1LjY2NSw0NS42NTJoMTg2LjAxMiAgIGMyNS4yMjMsMCw0NS42NTMtMjAuNDQ1LDQ1LjY1My00NS42NTJWNDUuNjU3QzI3Ny4zMzgsMjAuNDM0LDI1Ni44OTksMCwyMzEuNjc3LDB6IiBmaWxsPSIjMDAwMDAwIi8+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==");
    this.drawActionButton(ctx, "data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTguMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTI7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4Ij4KPHBhdGggZD0iTTI1NiwwQzExNC42MTUsMCwwLDExNC42MTUsMCwyNTZzMTE0LjYxNSwyNTYsMjU2LDI1NnMyNTYtMTE0LjYxNSwyNTYtMjU2UzM5Ny4zODUsMCwyNTYsMHogTTMzNiwzMjAgIGMwLDguODM3LTcuMTYzLDE2LTE2LDE2SDE5MmMtOC44MzcsMC0xNi03LjE2My0xNi0xNlYxOTJjMC04LjgzNyw3LjE2My0xNiwxNi0xNmgxMjhjOC44MzcsMCwxNiw3LjE2MywxNiwxNlYzMjB6IiBmaWxsPSIjMDAwMDAwIi8+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=");
  }

  drawActionButton(ctx, imageData) {
    var image = new Image()
    image.src = imageData;
    ctx.drawImage(
      image,
      0,
      0,
      image.width,
      image.height,
      this.model.left + image.width,
      this.model.top + this.model.height - image.height * 2,
      image.width,
      image.height
    );

    this._playButtonArea = {
      left : this.model.left + image.width,
      top : this.model.top + this.model.height - image.height * 2,
      width : this.model.left + image.width * 2,
      height : this.model.top + this.model.height - image.height
    }
  }


  drawDecoded(scope, canvas) {
    if(this._isPlaying) {
      this.invalidate();
    }

  }

  play() {
    this._isPlaying = true;
    if(!this._player || !this._player.client){
      return
    }

    if(this._player.client.readyState === WebSocket.CLOSED) {
      this.reconnect();
    }
  }

  stop() {
    this._isPlaying = false;
    this.invalidate();
  }

  reconnect() {
    if(this._player) {
      this._player = null
      this._player.stop();
    } else {
      this._player = null
    }
  }

  onchange(after, before) {
    if(!after.hasOwnProperty('url'))
      return

    var self = this
    var isChanged = after.url != before.url


    if(isChanged) {
      self.reconnect()
    }
  }

  onclick(e) {

    var point = this.transcoordC2S(e.offsetX, e.offsetY)
    var playButtonArea = this._playButtonArea

    if(!(point.x >= playButtonArea.left && point.x <= playButtonArea.width )) {
      return;
    }

    if(!(point.y >= playButtonArea.top && point.y <= playButtonArea.height )) {
      return;
    }

    if(this._isPlaying) {
      this.stop();
    } else {
      this.play();
    }


  }

  onmouseenter(e) {
    this._isHover = true;
  }

  onmouseleave(e) {
    this._isHover = false;
  }

}

Component.register('ws-live-video', WSLiveVideo)
