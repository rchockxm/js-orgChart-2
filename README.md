# js-orgChart-2
Organizational Chart JavaScript Library

<img src="https://img.shields.io/dub/l/vibe-d.svg" />

Features:

* No external library required. Code written in Pure JavaScript.
* Height flexible. Nodes can use any custom HTML template with CSS.
* Unlimited child nodes in node depths.

<h2><a name="usage" class="anchor" href="#usage"><span class="mini-icon mini-icon-link"></span></a>Usage</h2>

You need to include the js-orgChart libraries. For example:

```html
<script language="javascript" src="js/js-orgchart-2.js"></script>
```

The core CSS is optional. 

```html
<link rel="stylesheet" type="text/css" href="js/js-orgchart-2.css">
```
<h2><a name="thehtml" class="anchor" href="#thehtml"><span class="mini-icon mini-icon-link"></span></a>The HTML</h2>

Target container is necessary include <code>id=""</code> of attribute.

```html
<body>
    <div id="form" style="">
        <div id="orgchart"></div>
    </div>
</body>
```

```html
<body>
    <div id="orgchart"></div>
</body>
```

<h2><a name="foramt" class="anchor" href="#foramt"><span class="mini-icon mini-icon-link"></span></a>Data Format</h2>

Create the root node of the chart.

```js
var nodeParams = {
    options: {
        targetName: "orgchart",
        subTargetName: "orgnode",
        clsName: "org-node",
        width: 64,
        height: 32,
        minWidth: 0,
        minHeight: 0,
        maxWidth: 0,
        maxHeight: 0,
        template: ""
    },
    customParams: {
        caption: "Root",
        description: "Demo Nodes"
    }
};

var pOrgNodes = new OrgNodeV2(nodeParams);
```

Create the child nodes of rood node. Use <code>OrgNodeV2.addNodes</code> method as a child of the current node.

```js
var pOrgChildNode = null;
var nodeChildParams = {
    options: {
        targetName: "orgchart",
        subTargetName: "orgnode",
        clsName: "org-node",
        width: 16,
        height: 16,
        minWidth: 0,
        minHeight: 0,
        maxWidth: 0,
        maxHeight: 0,
        template: ""
    },
    customParams: {
        caption: "Child",
        description: "Demo Child Nodes"
    }
};

pOrgChildNode = new OrgNodeV2(nodeChildParams);
pOrgNodes.addNodes(pOrgChildNodes);
```

Custom params with Template.

```js
customParams: {
    caption: "Root",
    description: "Demo Nodes"
}
```

<h2><a name="loading" class="anchor" href="#loading"><span class="mini-icon mini-icon-link"></span></a>Loading</h2>

Set the chart with params and use <code>OrgChartV2.render()</code> method to load.

```js
var chartParams = {
    options: {
        top: 12,
        left: 12,
        lineSize: 2,
        lineColor: "#3388dd",
        node: {
            width: 64,
            height: 64,
            minWidth: 32,
            minHeight: 32,
            maxWidth: 128,
            maxHeight: 128,
            template: "<div id=\"{id}\">{caption} {description}</div>"
        }
    },
    event: {
        node: {
            onProcess: null,
            onClick: null,
            onMouseMove: null,
            onMouseOver: null,
            onMouseOut: null
        },
        onCreate: null,
        onError: null,
        onFinish: null
    },
    nodes: pOrgNodes
};

var pChart = new OrgChartV2(chartParams);
pChart.render();
```

<h2><a name="template" class="anchor" href="#template"><span class="mini-icon mini-icon-link"></span></a>Template</h2>

Use of the <code>id="{id}"</code> attribute in an HTML document. This is necessary.

```html
<div id="{id}"></div>
```

Use another attribute with custom param.

```js
var nodeChildParams = {
    options: {
        template: "<div id=\"{id}\" class=\"{className}\">{userName}</div>"
    },
    customParams: {
        className: "orgnode-demo",
        userName: "Rchockxm"
    }
};
```

```css
div.orgnode-demo {
    background-color: #edf7ff;
}
```

<h2><a name="event" class="anchor" href="#event"><span class="mini-icon mini-icon-link"></span></a>Event</h2>

```js
var chartParams = {
        event: {
            node: {
                onProcess: function(node, nodes) {
                    console.log("node.onProcess");
                },
                onClick: function() {
                    console.log("node.onClick");
                },
                onMouseMove: function() {
                    console.log("node.onMouseMove");
                },
                onMouseOver: function() {
                    console.log("node.onMouseOver");
                },
                onMouseOut: function() {
                    console.log("node.onMouseOut");
                }
            },
            onCreate: function() {
                console.log("onCreate");
            },
            onError: null,
            onFinish: function() {
                console.log("onFinish");
            }
        },
    };
```

You can view a demo of this <a href="http://jsfiddle.net/gh/get/library/pure/rchockxm/js-orgChart-2/tree/master/demo">here</a>.

<h2><a name="author" class="anchor" href="#author"><span class="mini-icon mini-icon-link"></span></a>Author</h2>
* 2015 rchockxm (rchockxm.silver@gmail.com)

<h2><a name="credits" class="anchor" href="#credits"><span class="mini-icon mini-icon-link"></span></a>Credits</h2>

* Avatar images: <a href="https://www.iconfinder.com/Naf_Naf">Anna Litviniuk</a>
