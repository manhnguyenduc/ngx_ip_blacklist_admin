define("echarts/chart/eventRiver", ["require", "./base", "../layout/eventRiver", "zrender/shape/Polygon", "../component/axis", "../component/grid", "../component/dataZoom", "../config", "../util/ecData", "../util/date", "zrender/tool/util", "zrender/tool/color", "../chart"], function (e) {
    function t(e, t, n, a, o) {
        i.call(this, e, t, n, a, o);
        var r = this;
        r._ondragend = function () {
            r.isDragend = !0
        }, this.refresh(a)
    }

    var i = e("./base"), n = e("../layout/eventRiver"), a = e("zrender/shape/Polygon");
    e("../component/axis"), e("../component/grid"), e("../component/dataZoom");
    var o = e("../config");
    o.eventRiver = {
        zlevel: 0,
        z: 2,
        clickable: !0,
        legendHoverLink: !0,
        itemStyle: {
            normal: {
                borderColor: "rgba(0,0,0,0)",
                borderWidth: 1,
                label: {show: !0, position: "inside", formatter: "{b}"}
            }, emphasis: {borderColor: "rgba(0,0,0,0)", borderWidth: 1, label: {show: !0}}
        }
    };
    var r = e("../util/ecData"), s = e("../util/date"), l = e("zrender/tool/util"), h = e("zrender/tool/color");
    return t.prototype = {
        type: o.CHART_TYPE_EVENTRIVER, _buildShape: function () {
            var e = this.series;
            this.selectedMap = {}, this._dataPreprocessing();
            for (var t = this.component.legend, i = [], a = 0; a < e.length; a++)if (e[a].type === this.type) {
                e[a] = this.reformOption(e[a]), this.legendHoverLink = e[a].legendHoverLink || this.legendHoverLink;
                var o = e[a].name || "";
                if (this.selectedMap[o] = t ? t.isSelected(o) : !0, !this.selectedMap[o])continue;
                this.buildMark(a), i.push(this.series[a])
            }
            n(i, this._intervalX, this.component.grid.getArea()), this._drawEventRiver(), this.addShapeList()
        }, _dataPreprocessing: function () {
            for (var e, t, i = this.series, n = 0, a = i.length; a > n; n++)if (i[n].type === this.type) {
                e = this.component.xAxis.getAxis(i[n].xAxisIndex || 0);
                for (var o = 0, r = i[n].data.length; r > o; o++) {
                    t = i[n].data[o].evolution;
                    for (var l = 0, h = t.length; h > l; l++)t[l].timeScale = e.getCoord(s.getNewDate(t[l].time) - 0), t[l].valueScale = Math.pow(t[l].value, .8)
                }
            }
            this._intervalX = Math.round(this.component.grid.getWidth() / 40)
        }, _drawEventRiver: function () {
            for (var e = this.series, t = 0; t < e.length; t++) {
                var i = e[t].name || "";
                if (e[t].type === this.type && this.selectedMap[i])for (var n = 0; n < e[t].data.length; n++)this._drawEventBubble(e[t].data[n], t, n)
            }
        }, _drawEventBubble: function (e, t, i) {
            var n = this.series, o = n[t], s = o.name || "", l = o.data[i], m = [l, o], V = this.component.legend, U = V ? V.getColor(s) : this.zr.getColor(t), d = this.deepMerge(m, "itemStyle.normal") || {}, p = this.deepMerge(m, "itemStyle.emphasis") || {}, c = this.getItemStyleColor(d.color, t, i, l) || U, u = this.getItemStyleColor(p.color, t, i, l) || ("string" == typeof c ? h.lift(c, -.2) : c), y = this._calculateControlPoints(e), g = {
                zlevel: this.getZlevelBase(),
                z: this.getZBase(),
                clickable: this.deepQuery(m, "clickable"),
                style: {
                    pointList: y,
                    smooth: "spline",
                    brushType: "both",
                    lineJoin: "round",
                    color: c,
                    lineWidth: d.borderWidth,
                    strokeColor: d.borderColor
                },
                highlightStyle: {color: u, lineWidth: p.borderWidth, strokeColor: p.borderColor},
                draggable: "vertical",
                ondragend: this._ondragend
            };
            g = new a(g), this.addLabel(g, o, l, e.name), r.pack(g, n[t], t, n[t].data[i], i, n[t].data[i].name), this.shapeList.push(g)
        }, _calculateControlPoints: function (e) {
            var t = this._intervalX, i = e.y, n = e.evolution, a = n.length;
            if (!(1 > a)) {
                for (var o = [], r = [], s = 0; a > s; s++)o.push(n[s].timeScale), r.push(n[s].valueScale);
                var l = [];
                l.push([o[0], i]);
                var s = 0;
                for (s = 0; a - 1 > s; s++)l.push([(o[s] + o[s + 1]) / 2, r[s] / -2 + i]);
                for (l.push([(o[s] + (o[s] + t)) / 2, r[s] / -2 + i]), l.push([o[s] + t, i]), l.push([(o[s] + (o[s] + t)) / 2, r[s] / 2 + i]), s = a - 1; s > 0; s--)l.push([(o[s] + o[s - 1]) / 2, r[s - 1] / 2 + i]);
                return l
            }
        }, ondragend: function (e, t) {
            this.isDragend && e.target && (t.dragOut = !0, t.dragIn = !0, t.needRefresh = !1, this.isDragend = !1)
        }, refresh: function (e) {
            e && (this.option = e, this.series = e.series), this.backupShapeList(), this._buildShape()
        }
    }, l.inherits(t, i), e("../chart").define("eventRiver", t), t
}), define("echarts/layout/eventRiver", ["require"], function () {
    function e(e, o, r) {
        function s(e, t) {
            var i = e.importance, n = t.importance;
            return i > n ? -1 : n > i ? 1 : 0
        }

        function l(e, t) {
            if (e.indexOf)return e.indexOf(t);
            for (var i = 0, n = e.length; n > i; i++)if (e[i] === t)return i;
            return -1
        }

        for (var h = 5, m = o, V = 0; V < e.length; V++) {
            for (var U = 0; U < e[V].data.length; U++) {
                null == e[V].data[U].weight && (e[V].data[U].weight = 1);
                for (var d = 0, p = 0; p < e[V].data[U].evolution.length; p++)d += e[V].data[U].evolution[p].valueScale;
                e[V].data[U].importance = d * e[V].data[U].weight
            }
            e[V].data.sort(s)
        }
        for (var V = 0; V < e.length; V++) {
            null == e[V].weight && (e[V].weight = 1);
            for (var d = 0, U = 0; U < e[V].data.length; U++)d += e[V].data[U].weight;
            e[V].importance = d * e[V].weight
        }
        e.sort(s);
        for (var c = Number.MAX_VALUE, u = 0, V = 0; V < e.length; V++)for (var U = 0; U < e[V].data.length; U++)for (var p = 0; p < e[V].data[U].evolution.length; p++) {
            var y = e[V].data[U].evolution[p].timeScale;
            c = Math.min(c, y), u = Math.max(u, y)
        }
        for (var g = i(Math.floor(c), Math.ceil(u)), b = 0, V = 0; V < e.length; V++)for (var U = 0; U < e[V].data.length; U++) {
            var f = e[V].data[U];
            f.time = [], f.value = [];
            for (var p = 0; p < e[V].data[U].evolution.length; p++)f.time.push(e[V].data[U].evolution[p].timeScale), f.value.push(e[V].data[U].evolution[p].valueScale);
            var k = l(f.value, Math.max.apply(Math, f.value)), x = n(g, f.time[k], f.time[k + 1]), p = 0;
            for (f.y = x + f.value[k] / 2 + h, p = 0; p < f.time.length - 1; p++) {
                var _ = n(g, f.time[p], f.time[p + 1]);
                f.y - f.value[p] / 2 - h < _ && (f.y = _ + f.value[p] / 2 + h)
            }
            var _ = n(g, f.time[p], f.time[p] + m);
            for (f.y - f.value[p] / 2 - h < _ && (f.y = _ + f.value[p] / 2 + h), e[V].y = f.y, b = Math.max(b, f.y + f.value[k] / 2), p = 0; p < f.time.length - 1; p++)a(g, f.time[p], f.time[p + 1], f.y + f.value[p] / 2);
            a(g, f.time[p], f.time[p] + m, f.y + f.value[p] / 2)
        }
        t(e, r, b, h)
    }

    function t(e, t, i, n) {
        for (var a = t.y, o = (t.height - n) / i, r = 0; r < e.length; r++) {
            e[r].y = e[r].y * o + a;
            for (var s = e[r].data, l = 0; l < s.length; l++) {
                s[l].y = s[l].y * o + a;
                for (var h = s[l].evolution, m = 0; m < h.length; m++)h[m].valueScale *= 1 * o
            }
        }
    }

    function i(e, t) {
        var n = {left: e, right: t, leftChild: null, rightChild: null, maxValue: 0};
        if (t > e + 1) {
            var a = Math.round((e + t) / 2);
            n.leftChild = i(e, a), n.rightChild = i(a, t)
        }
        return n
    }

    function n(e, t, i) {
        if (1 > i - t)return 0;
        var a = Math.round((e.left + e.right) / 2), o = 0;
        if (t == e.left && i == e.right)o = e.maxValue; else if (a >= i && null != e.leftChild)o = n(e.leftChild, t, i); else if (t >= a && null != e.rightChild)o = n(e.rightChild, t, i); else {
            var r = 0, s = 0;
            null != e.leftChild && (r = n(e.leftChild, t, a)), null != e.rightChild && (s = n(e.rightChild, a, i)), o = r > s ? r : s
        }
        return o
    }

    function a(e, t, i, n) {
        if (null != e) {
            var o = Math.round((e.left + e.right) / 2);
            e.maxValue = e.maxValue > n ? e.maxValue : n, (Math.floor(10 * t) != Math.floor(10 * e.left) || Math.floor(10 * i) != Math.floor(10 * e.right)) && (o >= i ? a(e.leftChild, t, i, n) : t >= o ? a(e.rightChild, t, i, n) : (a(e.leftChild, t, o, n), a(e.rightChild, o, i, n)))
        }
    }

    return e
});