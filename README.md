# js-orgChart-2
Organizational Chart JavaScript Library

<h2><a name="usage" class="anchor" href="#usage"><span class="mini-icon mini-icon-link"></span></a>usage</h2>

You need to include the the js-orgChart libraries. For example:

```html
<script language="javascript" src="js/js-orgchart-2.js"></script>
```

The core CSS is optional. 

```html
<link rel="stylesheet" type="text/css" href="js/js-orgchart-2.css">
```
<h2><a name="thehtml" class="anchor" href="#thehtml"><span class="mini-icon mini-icon-link"></span></a>The HTML</h2>

```html
<body>
    <div id="form" style="">
        <div id="orgchart"></div>
    </div>
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

Create the child nodes of rood node.

```js
var pOrgChildNode = null;
var nodeChildParams = {
    options: {
        targetName: "orgchart",
        subTargetName: "orgnode",
        clsName: "org-node",
        width: 16,
        height: 16,
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

<h2><a name="template" class="anchor" href="#template"><span class="mini-icon mini-icon-link"></span></a>Template</h2>

Use of the id attribute in an HTML document. This is necessary.

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
