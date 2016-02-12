/*
 * js-orgChart - 2.00
 * Copyright (c) 2013 - 2015 rchockxm (rchockxm.silver@gmail.com)
 * Copyright (c) 2009 Surnfu composition
 *
 * Licensed - under the terms of the MIT License
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Based on: Surnfu - Email:Surnfu@126.com - QQ:31333716
 *           2009 Surnfu composition http://www.on-cn.com
 */

/*
params = {
    options: {
        width: 64,
        height: 64,
        minWidth: 32,
        minHeight: 32,
        maxWidth: 128,
        maxHeight: 128,
        template: "<div id=\"{id}\" class=\"{class}\"></div>"
    },
    event: {
        onProcess: null,
        onClick: null,
        onMouseMove: null,
        onMouseOver: null,
        onMouseOut: null
    },
    customParams: {
        caption: "Test",
        description: "Demo Nodes"
    }
}
*/

function OrgNodeV2(userParams) {
    
    this.options = {
        targetName: "orgchart",
        subTargetName: "orgnode",
        clsName: "org-node",
        uniqueIDLen: 14,
        uniqueIDT1Len: 10,
        prefixID: "node",
        width: 0,
        height: 0,
        minWidth: 0,
        minHeight: 0,
        maxWidth: 0,
        maxHeight: 0,
        template: ""
    };
    
    this.event = {
        onProcess: null,
        onClick: null,
        onMouseMove: null,
        onMouseOver: null,
        onMouseOut: null
    };
    
    this.customParams = null;
    
    this.node = {
        id: null,
        idt1: null,
        parent: null,
        groupID: 0,
        orderID: 0,
        instance: null,
        offsetWidth: 0,
        offsetHeight: 0,
        top: -1,
        left: -1,
        depth: 0,
        line: {
            top: null,
            bottom: null
        },
        isInit: false
    };
    
    this.nodes = [];
    
    this.ctor(userParams);
    
}

OrgNodeV2.prototype = {
    constructor: OrgNodeV2,
    ctor: function(userNodeParams) {
        var ret = false;
        
        if (typeof userNodeParams === "object" 
            && userNodeParams !== null) {
                
            if (typeof userNodeParams.options === "object" 
                && userNodeParams.options !== null) {
                
                this.options = this.getDiffParams(this.options, userNodeParams.options);
            }
            
            if (typeof userNodeParams.event === "object" 
                && userNodeParams.event !== null) {
                
                this.event = this.getDiffParams(this.event, userNodeParams.event);
            }
            
            if (typeof userNodeParams.customParams === "object" 
                && userNodeParams.customParams !== null) {
                
                this.customParams = userNodeParams.customParams;
            }
            
            this.node.id = this.getUniqueID(this.options.uniqueIDLen, this.options.subTargetName, 0);
            this.node.idt1 = this.getUniqueID(this.options.uniqueIDT1Len, this.options.subTargetName, 1);
            
            ret = true;
        }
        
        return ret;
    },
    render: function(globChart, globParams, globEvent) {
        var ret = {
            offsetWidth: 0,
            offsetHeight: 0,
            isInit: false
        };
        
        // Set the value for default variable.
        // TODO
        
        // Set the global setting for Chart and params.
        if (typeof globChart === "object" && globChart !== null) {
            // TODO
        }
        
        if (typeof globParams === "object" 
            && globParams !== null) {
            
            this.options.width = (this.options.width <= 0 
                || this.options.width > globParams.node.width) ? globParams.node.width : this.options.width;
            this.options.height = (this.options.height <= 0 
                || this.options.height > globParams.node.height) ? globParams.node.height : this.options.height;
            this.options.minWidth = (this.options.minWidth <= 0 
                || this.options.minWidth > globParams.node.minWidth) ? globParams.node.minWidth : this.options.minWidth;
            this.options.minHeight = (this.options.minHeight <= 0 
                || this.options.minHeight > globParams.node.minHeight) ? globParams.node.minHeight : this.options.minHeight;
            this.options.maxWidth = (this.options.maxWidth <= 0 
                || this.options.maxWidth > globParams.node.maxWidth) ? globParams.node.maxWidth : this.options.maxWidth;
            this.options.maxHeight = (this.options.maxHeight <= 0 
                || this.options.maxHeight > globParams.node.maxHeight) ? globParams.node.maxHeight : this.options.maxHeight;
            
            if (typeof this.options.template !== "string" 
                || this.options.template.length == 0) {
                
                this.options.template = globParams.node.template;
            }
        }
        
        if ((typeof globEvent === "object" 
            && globEvent !== null)
                && (typeof globEvent.node === "object" 
                    && globEvent.node !== null)) {
            
            this.event.onProcess = (typeof this.event.onProcess === "function") ? this.event.onProcess : globEvent.node.onProcess;
            this.event.onClick = (typeof this.event.onClick === "function") ? this.event.onClick : globEvent.node.onClick;
            this.event.onMouseMove = (typeof this.event.onMouseMove === "function") ? this.event.onMouseMove : globEvent.node.onMouseMove;
            this.event.onMouseOver = (typeof this.event.onMouseOver === "function") ? this.event.onMouseOver : globEvent.node.onMouseOver;
            this.event.onMouseOut = (typeof this.event.onMouseOut === "function") ? this.event.onMouseOut : globEvent.node.onMouseOut;
        }
        
        if (typeof this.event.onProcess === "function") {
            this.event.onProcess(this.node, this.nodes);
        }
        
        // Create node element for Chart.
        var docTempDiv = document.createElement("div");
        
        docTempDiv.id = this.node.id;
        docTempDiv.innerHTML = "<div class='" 
            + this.options.clsName 
            + "' org-custom=\"node-childs\" style=\"width: 0px; height: 0px;\"></div>";
        docTempDiv.style.width = 0;
        docTempDiv.style.height = 0;
        
        // Custom params for HTML template.
        var strTempHTML = this.options.template; // this.options.template;
        
        strTempHTML = strTempHTML.replace("{id}", this.node.idt1);
        
        if (typeof this.customParams === "object" 
            && this.customParams !== null) {
            
            for (var k in this.customParams) {
                strTempHTML = strTempHTML.replace("{" + k + "}", this.customParams[k]);
            }
        }
        
        //docTempDiv.innerHTML = strTempHTML;
        
        if (typeof docTempDiv.firstChild === "object" 
            && typeof docTempDiv.firstChild !== null) {
            
            docTempDiv.firstChild.innerHTML = strTempHTML;
        }
        else {
            docTempDiv.innerHTML = strTempHTML;
        }
        
        // Check the assign DOM is exists and append to it's parent.
        var docRootElement = document.getElementById(this.options.targetName);
        
        if (typeof docRootElement == "object" 
            && docRootElement !== null) {
            
            docRootElement.appendChild(docTempDiv);
        }
        else {
            document.body.appendChild(docTempDiv);
        }
        
        // Set the instance for render Node and set width and height.
        this.node.instance = document.getElementById(this.node.idt1);
        
        // Set the Chart Node event.
        
        // Set the Chart Node width and height.
        if (typeof this.node.instance === "object" 
            && this.node.instance !== null) {
            
            var nodeOffset = this.getOffset(this.node.instance);
            
            if (this.options.minWidth > 0) {
                this.node.instance.style.minWidth = this.options.minWidth + "px";
            }
            
            if (this.options.width > 0 
                && nodeOffset.width < this.options.width) {
                
                this.node.instance.style.width = this.options.width + "px";
                
                nodeOffset = this.getOffset(this.node.instance);
                
                if (nodeOffset.width > this.options.width) {
                    this.node.instance.style.width = (this.options.width 
                        - parseFloat(nodeOffset.width - this.options.width)) + "px";
                }
            }
            
            if (this.options.minHeight > 0) {
                this.node.instance.style.minHeight = this.options.minHeight + "px";
            }
            
            if (this.options.height > 0 
                && nodeOffset.height < this.options.height) {
                
                this.node.instance.style.height = this.options.height + "px";
                
                nodeOffset = this.getOffset(this.node.instance);
                
                if (nodeOffset.height > this.options.height) {
                    this.node.instance.style.height = (this.options.height 
                        - parseFloat(nodeOffset.height - this.options.height)) + "px";
                }
            }
            
            nodeOffset = this.getOffset(this.node.instance);
            
            this.node.offsetWidth = nodeOffset.width;
            this.node.offsetHeight = nodeOffset.height;
            this.node.isInit = true;
            
            if (typeof this.event.onClick === "function") {
                this.node.instance.onclick = this.event.onClick;
            }
            
            if (typeof this.event.onMouseMove === "function") {
                this.node.instance.onmousemove = this.event.onMouseMove;
            }
            
            if (typeof this.event.onMouseOver === "function") {
                this.node.instance.onmouseover = this.event.onMouseOver;
            }
            
            if (typeof this.event.onMouseOut === "function") {
                this.node.instance.onmouseout = this.event.onMouseOut;
            }
            
            ret.offsetWidth = this.node.offsetWidth;
            ret.offsetHeight = this.node.offsetHeight;
            ret.isInit = this.node.isInit;
        }
        
        return ret;
    },
    add: {
        nodes: function(orgChildNode) {
            return OrgNodeV2.prototype.addNodes(orgChildNode);
        }
    },
    addNodes: function(orgChildNode) {
        var ret = false;
        
        if ((typeof orgChildNode === "object" 
            && orgChildNode !== null) 
                && (typeof orgChildNode.node === "object" 
                    && orgChildNode.node !== null)) {
                
            orgChildNode.node.parent = this;
            
            this.nodes[this.nodes.length] = orgChildNode;
            
            ret = true;
        }
        
        return ret;
    },
    get: {
        options: function() {
            return OrgNodeV2.prototype.getOptions();
        },
        event: function() {
            return OrgNodeV2.prototype.getEvent();
        },
        customParams: function() {
            return OrgNodeV2.prototype.getCustomParams();
        },
        offset: function(sender) {
            return OrgNodeV2.prototype.getOffset();
        },
        uniqueID: function(length, prefix, index) {
            return OrgNodeV2.prototype.getUniqueID();
        },
        diffParams: function(sourceParams, mappingParams) {
            return OrgNodeV2.prototype.getDiffParams();
        }
    },
    getOptions: function() {
        return this.options;
    },
    getEvent: function() {
        return this.event;
    },
    getCustomParams: function() {
        return this.customParams;
    },
    getOffset: function(sender) {
        var ret = {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        };
        
        if (typeof sender === "object" && sender !== null) {
            ret.x = sender.offsetLeft;
            ret.y = sender.offsetTop;
            ret.width = sender.offsetWidth;
            ret.height = sender.offsetHeight;
            
            var nodeParent = sender.offsetParent;
            
            while (nodeParent != null) {
                ret.x += nodeParent.offsetLeft;
                ret.y += nodeParent.offsetTop;
                
                nodeParent = nodeParent.offsetParent;
            }
            
            if (typeof sender.currentStyle === "object" 
                && sender.currentStyle !== null) {
                
                if (ret.width == 0) {
                    ret.width += (isNaN(sender.currentStyle.width === false 
                        && sender.currentStyle.width !== null)) ? sender.currentStyle.width : 0;
                    ret.width += (isNaN(sender.currentStyle.paddingRight === false 
                        && sender.currentStyle.paddingRight !== null)) ? sender.currentStyle.paddingRight : 0;
                    ret.width += (isNaN(sender.currentStyle.paddingLeft === false 
                        && sender.currentStyle.paddingLeft !== null)) ? sender.currentStyle.paddingLeft : 0;
                    ret.width += (isNaN(sender.currentStyle.borderWidth === false
                        && sender.currentStyle.borderWidth !== null)) ? (sender.currentStyle.borderWidth * 2) : 0;
                }
                
                if (ret.height == 0) {
                    ret.height += (isNaN(sender.currentStyle.height === false 
                        && sender.currentStyle.height !== null)) ? sender.currentStyle.height : 0;
                    ret.height += (isNaN(sender.currentStyle.paddingTop === false 
                        && sender.currentStyle.paddingTop !== null)) ? sender.currentStyle.paddingTop : 0;
                    ret.height += (isNaN(sender.currentStyle.paddingBottom === false 
                        && sender.currentStyle.paddingBottom !== null)) ? sender.currentStyle.paddingBottom : 0;
                    ret.height += (isNaN(sender.currentStyle.borderWidth === false 
                        && sender.currentStyle.borderWidth !== null)) ? (sender.currentStyle.borderWidth * 2) : 0;
                }
            }
        }
        
        return ret;
    },
    getUniqueID: function(length, prefix, index) {
        var ret = "";
        
        length = (typeof length === "number") ? parseInt(length) : this.options.uniqueIDLen;
        prefix = (typeof prefix === "string") ? prefix : this.options.prefixID;
        index = (typeof index === "number") ? parseInt(index) : 0;
        
        var pAlpha = {
            max: 122,
            min: 97
        };
        
        for (var i = 1; i <= length; i ++) {
            var nCode = parseInt(Math.floor(Math.random() 
                * (pAlpha.max - pAlpha.min + 1)) 
                + pAlpha.min);
            
            if (typeof nCode !== "number") {
                nCode = pAlpha.min;
            }
            
            ret += String.fromCharCode(nCode);
        }
        
        return prefix + "-" + ret + "-" + index;
    },
    getDiffParams: function(sourceParams, mappingParams) {
        var ret = sourceParams;
        
        if ((typeof sourceParams === "object" 
            && sourceParams !== null) 
                && (typeof mappingParams === "object" 
                    && mappingParams !== null)) {
            
            for (var k in mappingParams) {
                if (typeof sourceParams[k] === "undefined" 
                    || (typeof mappingParams[k] === "undefined"
                    || mappingParams[k] === null)) {
                    
                    continue;
                }
                
                if (typeof mappingParams[k] === "number" 
                    || typeof mappingParams[k] === "boolean" 
                    || typeof mappingParams[k] === "string" 
                    || typeof mappingParams[k] === "function") {
                    
                    ret[k] = mappingParams[k];
                }
                else {
                    if (mappingParams[k] !== null) {
                        ret[k] = this.getDiffParams(sourceParams[k], mappingParams[k]);
                    }
                }
            }
        }
        
        return ret;
    }
}

/*
params = {
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
            maxWidth: 100,
            maxHeight: 100,
            template: ""
        },
        parentOffset: false
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
    nodes: null
}
*/

function OrgChartV2(chartParams) {
    
    this.consts = {
        line: {
            type: {
                group: 1,
                self: 2
            }
        }
    };
    
    this.options = {
        top: 0,
        left: 0,
        line: {
            size: 0,
            color: ""
        },
        node: {
            width: 0,
            height: 0,
            minWidth: 0,
            minHeight: 0,
            maxWidth: 0,
            maxHeight: 0,
            template: "<div id=\"{id}\"></div>"
        },
        parentOffset: false,
        expandTarget: true
    };
    
    this.event = {
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
    };
    
    this.nodes = null;
    this.nodesDepths = [];
    this.depthGroup = []; 
    
    // Global chart setting and calc.
    this.chart = {
        targetName: "",
        subTargetName: "",
        clsName: "",
        width: 0,
        height: 0,
        intervalWidth: 100,
        intervalHeight: 30,
        top: 0,
        left: 0,
        depth: 0,
        line: {
            color: "#3388dd",
            size: 1
        },
        total: {
            nodes: 0,
            error: {
                setNodeLeft: 0
            }
        }
    };
    
    this.ctor(chartParams);
    
}

OrgChartV2.prototype = {
    constructor: OrgChartV2,
    ctor: function(userChartParams) {
        var ret = false;
        
        if ((typeof userChartParams === "object" 
            && userChartParams !== null)
                && (typeof userChartParams.nodes === "object" 
                    && userChartParams.nodes !== null)) {
            
            if (typeof userChartParams.nodes.getDiffParams === "function") {
                this.nodes = userChartParams.nodes;
                
                if (typeof userChartParams.options === "object" 
                    && userChartParams.options !== null) {
                    
                    this.options = this.nodes.getDiffParams(this.options, userChartParams.options)
                }
                
                if (typeof userChartParams.event === "object" 
                    && userChartParams.event !== null) {
                    
                    this.event = this.nodes.getDiffParams(this.event, userChartParams.event);
                }
                
                ret = true;
            }
        }
        
        return ret;
    },
    render: function() {
        var ret = false;
        
        if ((typeof this.nodes !== "object" 
            || this.nodes === null)
                || (typeof this.nodes.nodes !== "object" 
                    || typeof this.nodes.nodes === null)
            /*|| (this.nodes.nodes.length == 0)*/) {
            
            return ret;
        }
        
        this.drawNodesInit(this.nodes, this.chart, this.options, this.event);
        this.setDepth(this.nodes);
        this.setDepthHeight();
        
        var rootNode = this.nodesDepths[0];
        var parentDOM = document.getElementById(rootNode.options.targetName);
        var parentOffset = this.getElementOffsetParents("");
        
        if (this.options.parentOffset === true) {
            parentOffset = this.getElementOffsetParents(rootNode.options.targetName);
        }
        
        this.chart.left = parentOffset.offsetLeft;
        this.chart.top = parentOffset.offsetTop;
        
        if (typeof this.options === "object" && this.options !== null) {
            this.chart.left += (typeof this.options.left === "number") ? this.options.left : 0;
            this.chart.top += (typeof this.options.top === "number") ? this.options.top : 0;
            
            this.chart.line.color = (typeof this.options.line.color === "string") ? this.options.line.color : this.chart.line.color;
            this.chart.line.size = (typeof this.options.line.size === "number") ? this.options.line.size : this.chart.line.size;
        }
        
        if (typeof this.event.onCreate === "function") {
            this.event.onCreate();
        }
        
        // Set the depth top of all nodes.
        for (var i = 1; i <= this.chart.depth; i ++) {
            var nodeTop = (this.chart.top + this.getDepthHeightToRoot(i));
            var nodes = this.depthGroup[i].nodes;
            
            for (var j = 0; j < nodes.length; j ++) {
                nodes[j].node.top = nodeTop;
            }
        }
        
        // Set the depth group of all nodes.
        for (var i = this.chart.depth; i >= 1; i --) {
            var depthNodes = this.depthGroup[i].nodes;
            var depthNodeLength = depthNodes.length;
            
            if (i == this.chart.depth) {
                for (var j = 0; j < depthNodeLength; j ++){
                    if (j == 0) {
                        depthNodes[j].node.left = 0;
                    }
                    else {
                        depthNodes[j].node.left = (depthNodes[j - 1].node.left 
                            + depthNodes[j - 1].node.offsetWidth 
                            + this.chart.intervalWidth);
                    }
                }
            }
            else {
                for (var j = 0; j < depthNodeLength; j ++) {
                    if (depthNodes[j].nodes.length > 0) {
                        var nodeLeft = (depthNodes[j].nodes[0].node.left 
                            + (this.getGroupWidth(depthNodes[j].nodes[0]) / 2));
                        
                        nodeLeft -= (depthNodes[j].node.offsetWidth / 2);
                        depthNodes[j].node.left = nodeLeft;
                    }
                    
                    if (depthNodes[j].node.left == -1) {
                        this.chart.total.error.setNodeLeft = 0;
                        this.setNodeLeft(depthNodes, j, "LTR");
                    }
                }
                
                for (var j = 1; j < depthNodeLength; j ++) {
                    var errDistance = (this.chart.intervalWidth 
                        - (depthNodes[j].node.left - depthNodes[j - 1].node.left 
                        - depthNodes[j - 1].node.offsetWidth));
                    
                    if (errDistance > 0) {
                        var n = j;
                        
                        for (n; n < depthNodeLength; n ++) {
                            this.setNodeLeftAmend(depthNodes[n], errDistance);
                        }
                    }
                }
            }
        }
        
        this.setDepthGroupsWidth();
        
        // Set the nodes max left of all nodes.
        var nodeMaxLeft = this.nodesDepths[0].node.left;
        var nodesLength = this.nodesDepths.length; 
        
        for (var i = 1; i < nodesLength; i ++) {
            if (nodeMaxLeft > this.nodesDepths[i].node.left) {
                nodeMaxLeft = this.nodesDepths[i].node.left;
            }
        }
        
        nodeMaxLeft = ((-nodeMaxLeft) + this.chart.left);
        
        for (var i = 0; i < nodesLength; i ++) {
            this.nodesDepths[i].node.left += nodeMaxLeft;
            
            if (typeof this.nodesDepths[i].node.instance === "object" 
                && this.nodesDepths[i].node.instance !== null) {
                
                this.nodesDepths[i].node.instance.style.left = this.nodesDepths[i].node.left + "px";
                this.nodesDepths[i].node.instance.style.top = this.nodesDepths[i].node.top + "px";
            }
            
            if (this.nodesDepths[i].node.left >= this.chart.width) {
                this.chart.width = this.nodesDepths[i].node.left;
            }
            
            if (this.nodesDepths[i].node.top >= this.chart.height) {
                this.chart.height = this.nodesDepths[i].node.top;
            }
        }
        
        this.chart.width += (this.chart.left + this.chart.intervalWidth);
        this.chart.height += (this.chart.top + this.chart.intervalHeight);
        
        if (this.options.expandTarget == true) {
            if (typeof parentDOM === "object" 
                && parentDOM !== null) {
                
                parentDOM.style.width = this.chart.width + "px";
                parentDOM.style.height = this.chart.height + "px";
            }
        }
        
        // Draw the line of all nodes.
        for (var i = 1; i <= this.chart.depth; i ++) {
            var depthNodes = this.depthGroup[i].nodes;
            
            for (var j = 0; j < depthNodes.length; j ++) {
                if (i != this.chart.depth) {
                    if (depthNodes[j].nodes.length != 0) {
                        var nodeLineLeft = (depthNodes[j].node.left + (depthNodes[j].node.offsetWidth / 2));
                        var nodeLineHeight = ((this.chart.intervalHeight - this.chart.line.size) / 2);
                       
                        /*if (depthNodes[j].nodes.length % 2 == 0) {
                            nodeLineHeight = (nodeLineHeight / 2);
                        }
                        else if (depthNodes[j].nodes.length == 1) {
                            nodeLineHeight = (nodeLineHeight - (this.chart.intervalHeight / 2));
                        }*/
                        
                        nodeLineHeight += (this.depthGroup[i].depthHeight - depthNodes[j].node.offsetHeight);
                        
                        var drawLineParams = {
                            id: "line-bottom-" + depthNodes[j].node.idt1,
                            top: (depthNodes[j].node.top + depthNodes[j].node.offsetHeight),
                            left: nodeLineLeft,
                            longLength: nodeLineHeight,
                            size: this.chart.line.size,
                            color: this.chart.line.color
                        };
                        
                        var drawLineBottom = this.drawLine(parentDOM, this.consts.line.type.self, drawLineParams);
                        
                        depthNodes[j].node.line.bottom = drawLineBottom.instance;
                    }
                }
                
                if (i != 1) {
                    var nodeLineLeft = (depthNodes[j].node.left + (depthNodes[j].node.offsetWidth / 2));
                    var nodeLineHeight = ((this.chart.intervalHeight - this.chart.line.size) / 2);
                    
                    if (this.depthGroup[depthNodes[j].node.depth].nodeGroups[depthNodes[j].node.groupID].length == 1) {
                        var nodeBottomLine = (parseFloat(depthNodes[j].node.parent.node.line.bottom.style.height) + this.chart.line.size);
                        
                        depthNodes[j].node.parent.node.line.bottom.style.height = (nodeLineHeight + nodeBottomLine) + "px";
                    }
                    else {
                        var drawLineParams = {
                            id: "line-top-" + depthNodes[j].node.idt1,
                            top: (depthNodes[j].node.top - nodeLineHeight),
                            left: nodeLineLeft,
                            longLength: nodeLineHeight,
                            size: this.chart.line.size,
                            color: this.chart.line.color
                        };
                        
                        var drawLineTop = this.drawLine(parentDOM, this.consts.line.type.self, drawLineParams);
                        
                        depthNodes[j].node.parent.node.line.top = drawLineTop.instance;
                    }
                }
            }
        }
        
        for (var i = 2; i <= this.chart.depth; i ++) {
            var nodeGroups = this.depthGroup[i].nodeGroups;
            
            for (var j = 0; j < nodeGroups.length; j ++) {
                if (nodeGroups[j].length != 1) {
                    var nodeLineWidth = (nodeGroups[j].depthGroupWidth 
                        - (nodeGroups[j][0].node.offsetWidth / 2) 
                        + this.chart.line.size);
                    
                    nodeLineWidth -= (nodeGroups[j][nodeGroups[j].length - 1].node.offsetWidth / 2);
                    
                    var nodeLineTop = (nodeGroups[j][0].node.top 
                        - ((this.chart.intervalHeight - this.chart.line.size) / 2) 
                        - this.chart.line.size);
                    var nodeLineLeft = (nodeGroups[j][0].node.left 
                        + (nodeGroups[j][0].node.offsetWidth / 2));
                    
                    var drawLineParams = {
                        id: "line-group-" + nodeGroups[j][0].node.idt1,
                        top: nodeLineTop,
                        left: nodeLineLeft,
                        longLength: nodeLineWidth,
                        size: this.chart.line.size,
                        color: this.chart.line.color
                    };
                    
                    var drawLineGroup = this.drawLine(parentDOM, this.consts.line.type.group, drawLineParams);
                }
            }
        }
        
        if (typeof this.event.onFinish === "function") {
            this.event.onFinish();
        }
        
        return ret;
    },
    set: {
        depth: function(orgNodes) {
            return OrgChartV2.prototype.setDepth(orgNodes);
        },
        depthWidth: function() {
            
        },
        depthGroupsWidth: function() {
            return OrgChartV2.prototype.setDepthGroupsWidth();
        },
        depthHeight: function() {
            return OrgChartV2.prototype.setDepthHeight();
        },
        nodeLeft: function(depthNodes, nodeID, tagID) {
            return OrgChartV2.prototype.setNodeLeft(depthNodes, nodeID, tagID);
        },
        nodeLeftAmend: function(orgNode, errDistance) {
            return OrgChartV2.prototype.setNodeLeftAmend(orgNode, errDistance);
        }
    },
    setDepth: function(orgNodes) {
        if ((typeof orgNodes === "object" && orgNodes !== null)
            && (typeof orgNodes.node === "object" && orgNodes.node !== null)) {
            
            this.nodesDepths[this.nodesDepths.length] = orgNodes;
            orgNodes.node.depth = (this.chart.depth == 0) ? (this.chart.depth + 1) : (orgNodes.node.parent.node.depth + 1);
            
            this.chart.depth = (orgNodes.node.depth > this.chart.depth) ? orgNodes.node.depth : this.chart.depth;
            
            if (typeof this.depthGroup[orgNodes.node.depth] !== "object") {
                this.depthGroup[orgNodes.node.depth] = [];
                this.depthGroup[orgNodes.node.depth].node = orgNodes.node;
                this.depthGroup[orgNodes.node.depth].nodes = [];
                this.depthGroup[orgNodes.node.depth].nodeGroups = [];
            }
            
            this.depthGroup[orgNodes.node.depth].nodes[this.depthGroup[orgNodes.node.depth].nodes.length] = orgNodes;
            
            if (orgNodes.node.depth == 1) {
                this.depthGroup[orgNodes.node.depth].nodeGroups[0] = [];
                this.depthGroup[orgNodes.node.depth].nodeGroups[0][0] = orgNodes;
                
                orgNodes.node.groupID = 0;
                orgNodes.node.orderID = 0;
            }
            else {
                if (this.depthGroup[orgNodes.node.depth].nodeGroups.length == 0) {
                    this.depthGroup[orgNodes.node.depth].nodeGroups[0] = [];
                    this.depthGroup[orgNodes.node.depth].nodeGroups[0][0] = orgNodes;
                    
                    orgNodes.node.groupID = 0;
                    orgNodes.node.orderID = 0;
                }
                else {
                    var groupsLength = this.depthGroup[orgNodes.node.depth].nodeGroups.length;
                    var groupNodesLength = this.depthGroup[orgNodes.node.depth].nodeGroups[groupsLength - 1].length;
                    
                    if (orgNodes.node.parent == this.depthGroup[orgNodes.node.depth].nodeGroups[groupsLength - 1][groupNodesLength - 1].node.parent) {
                        this.depthGroup[orgNodes.node.depth].nodeGroups[groupsLength - 1][groupNodesLength] = orgNodes;
                        
                        orgNodes.node.groupID = (groupsLength - 1);
                        orgNodes.node.orderID = groupNodesLength;
                    }
                    else {
                        if (typeof this.depthGroup[orgNodes.node.depth].nodeGroups[groupsLength] !== "object") {
                            this.depthGroup[orgNodes.node.depth].nodeGroups[groupsLength] = [];
                        }
                        
                        groupNodesLength = this.depthGroup[orgNodes.node.depth].nodeGroups[groupsLength].length;
                        
                        this.depthGroup[orgNodes.node.depth].nodeGroups[groupsLength][groupNodesLength] = orgNodes;
                        
                        orgNodes.node.groupID = groupsLength;
                        orgNodes.node.orderID = groupNodesLength;
                    }
                }
            }
            
            if (orgNodes.nodes.length > 0) {
                for (var i = 0; i < orgNodes.nodes.length; i ++) {
                    this.setDepth(orgNodes.nodes[i]);
                }
            }
        }
    },
    setDepthWidth: function() {
        
    },
    setDepthGroupsWidth: function() {
        for (var i = 1; i <= this.chart.depth; i ++) {
            if ((typeof this.depthGroup[i] !== "object" || this.depthGroup[i] === null)
                || (typeof this.depthGroup[i].nodeGroups !== "object" || this.depthGroup[i].nodeGroups === null)) {
                
                continue;
            }
            
            var groupsNodes = this.depthGroup[i].nodeGroups;
            
            for (var j = 0; j < groupsNodes.length; j ++) {
                //groupsNodes[j].node.offsetWidth = this.getGroupWidth(groupsNodes[j][0]);
                groupsNodes[j].depthGroupWidth = this.getGroupWidth(groupsNodes[j][0]);
            }
        }
    },
    setDepthHeight: function() {
        for (var i = 1; i <= this.chart.depth; i ++) {
            if ((typeof this.depthGroup[i] !== "object" || this.depthGroup[i] === null)
                || (typeof this.depthGroup[i].nodes !== "object" || this.depthGroup[i].nodes === null)) {
                
                continue;
            }
            
            var nodes = this.depthGroup[i].nodes;
            var maxHeight = 0;
            
            for (var j = 0; j < nodes.length; j ++) {
                var offsetHeight = (isNaN(nodes[j].node.offsetHeight) === false 
                    && nodes[j].node.offsetHeight !== null) ? nodes[j].node.offsetHeight : 0;
                //var optHeight = (isNaN(nodes[j].options.height) === false && nodes[j].options.height !== null) ? nodes[j].options.height : 0;
                //var optMaxHeight = (isNaN(nodes[j].options.maxHeighth) === false && nodes[j].options.maxHeight !== null) ? nodes[j].options.maxHeight : 0;
                
                if (offsetHeight > maxHeight) {
                    maxHeight = offsetHeight;
                }
            }
            
            /*if (maxHeight > 0) {
                maxHeight -= (maxHeight / 2);
            }*/
            
            this.depthGroup[i].depthHeight = maxHeight;
            //this.depthGroup[i].node.offsetHeight = maxHeight;
        }
    },
    setNodeLeft: function(depthNodes, nodeID, tagID) {
        var ret = false;
        
        this.chart.total.error.setNodeLeft += 1;
        
        if (this.chart.total.error.setNodeLeft > this.chart.total.nodes) {
            return false;
        }
        
        if (nodeID == depthNodes.length - 1 
            && tagID == "LTR") {
            
            return this.setNodeLeft(depthNodes, nodeID, "RTL");
        }
        
        if (nodeID == 0 
            && tagID == "RTL") {
            
            return this.setNodeLeft(depthNodes, nodeID, "LTR");
        }
        
        var findIndex = false;
        
        if (tagID == "LTR") {
            var i = (nodeID + 1);
            
            for (i; i < depthNodes.length; i ++) {
                if (depthNodes[i].node.left != -1) {
                    findIndex = i; 
                    
                    break;
                }
            }
            
            if (findIndex === false) {
                return this.setNodeLeft(depthNodes, nodeID, "RTL");
            }
            else {
                i = (findIndex - 1);
                
                for (i; i >= nodeID; i --) {
                    depthNodes[i].node.left = (depthNodes[i + 1].node.left 
                        - this.chart.intervalWidth - depthNodes[i].node.offsetWidth);
                }
            }
            
            ret = true;
        }
        
        if (tagID == "RTL") {
            var i = (nodeID - 1);
            
            for (i; i >= 0; i --) {
                if (depthNodes[i].node.left != -1) {
                    findIndex = i; 
                    
                    break;
                }
                
                if (findIndex === false) {
                    return this.setNodeLeft(depthNodes, nodeID, "LTR");
                }
                else {
                    i = (findIndex + 1);
                    
                    for (i; i <= nodeID; i ++) {
                        depthNodes[i].node.left = (depthNodes[i - 1].node.left 
                            + this.chart.intervalWidth + depthNodes[i - 1].node.offsetWidth);
                    }
                }
            }
            
            ret = true;
        }
        
        return ret;
    },
    setNodeLeftAmend: function(orgNode, errDistance) {
        orgNode.node.left = (orgNode.node.left + errDistance);
        
        if (orgNode.nodes.length != 0) {
            var nodeLength = orgNode.nodes.length;
            
            for (var i = 0; i < nodeLength; i ++) {
                this.setNodeLeftAmend(orgNode.nodes[i], errDistance);
            }
        }
    },
    get: {
        consts: function() {
            return OrgChartV2.prototype.getConsts();
        },
        elementParents: function(element) {
            return OrgChartV2.prototype.getElementParents(element);
        },
        elementOffsetParents: function(element) {
            return OrgChartV2.prototype.getElementOffsetParents(element);
        },
        elementOffsetPosition: function(element) {
            return OrgChartV2.prototype.getElementOffsetPosition(element);
        },
        firstLeftPosition: function(orgNode) {
            return OrgChartV2.prototype.getFirstLeftPosition(orgNode);
        },
        nodesWidth: function(orgNodes) {
            return OrgChartV2.prototype.getNodesWidth(orgNodes);
        },
        nodesDepth: function(orgNodes) {
            return OrgChartV2.prototype.getNodesDepth(orgNodes);
        },
        groupWidth: function(orgNode) {
            return OrgChartV2.prototype.getGroupWidth(orgNode);
        },
        depthHeightToRoot: function(depthID) {
            return OrgChartV2.prototype.getDepthHeightToRoot(depthID);
        }
    },
    getConsts: function() {
        return this.consts;
    },
    getElementParents: function(element) {
        var ret = [];
        
        element = (typeof element === "string") ? document.getElementById(element) : element;
        
        if ((typeof element === "object" 
            && element !== null)
                && (element.nodeName !== null)
                && (element.parentNode !== null)) {
            
            var i = 0;
            
            while (element !== null 
                && typeof element.nodeName === "string") {
                
                element = element.parentNode;
                
                if (element.nodeName != "HTML") {
                    ret[i] = element;
                    i += 1;
                    
                    continue;
                }
                else {
                    break;
                }
            }
        }
        
        return ret;
    },
    getElementOffsetParents: function(element) {
        var ret = {
            elements: [],
            offsetLeft: 0,
            offsetTop: 0
        };
        
        element = (typeof element === "string" 
            && element != "") ? document.getElementById(element) : element;
        
        if ((typeof element === "object" 
            && element !== null)
                && (element.nodeName !== null)
                && (element.parentNode !== null)) {
            
            var i = 0;
            
            while (element !== null 
                && typeof element.nodeName === "string") {
                
                element = element.parentNode;
                
                if (element.nodeName != "HTML") {
                    ret.elements[i] = {
                        instance: element,
                        offsetLeft: element.offsetLeft,
                        offsetTop: element.offsetTop
                    };
                    
                    ret.offsetLeft += ret.elements[i].offsetLeft;
                    ret.offsetTop += ret.elements[i].offsetTop;
                    
                    i += 1;
                    
                    continue;
                }
                else {
                    break;
                }
            }
        }
        
        return ret;
    },
    getElementOffsetPosition: function(element) {
        var ret = {
            offsetLeft: 0,
            offsetTop: 0
        };
        
        element = (typeof element === "string" 
            && element != "") ? document.getElementById(element) : element;
        
        if ((typeof element === "object" 
            && element !== null)
                && (isNaN(element.offsetLeft) === false 
                    && element.offsetLeft !== null)
                && (isNaN(element.offsetTop) === false 
                    && element.offsetTop !== null)) {
            
            ret.offsetLeft = element.offsetLeft;
            ret.offsetTop = element.offsetTop;
            
            var parentElement = element.offsetParent;
            
            while (parentElement !== null 
                || typeof parentElement === "undefined") {
                
                ret.offsetLeft += element.offsetLeft;
                ret.offsetTop += element.offsetTop;
                parentElement = parentElement.offsetParent;
            }
        }
        
        return ret;
    },
    getFirstLeftPosition: function(orgNode) {
        var ret = 0;
        
        if (typeof orgNode === "object" 
            && orgNode !== null) {
            
            var nodeLeft = (isNaN(orgNode.node.left) === false 
                && orgNode.node.left !== null) ? orgNode.node.left : 0;
            var nodeWidth = 0;
            var nodeOffsetWidth = (isNaN(orgNode.node.offsetWidth) === false) ? orgNode.node.offsetWidth : 0;
            
            if (isNaN(orgNode.node.orderID) === true 
                || orgNode.node.orderID == 0) {
                
                ret = nodeLeft;
            }
            else {
                for (var i = 0; i <= orgNode.node.orderID; i ++) {
                    var nodeDepth = (isNaN(orgNode.node.depth) === false 
                        && orgNode.node.depth !== null) ? orgNode.node.depth : 0;
                    var nodeGroupID = (isNaN(orgNode.node.groupID) === false 
                        && orgNode.node.groupID !== null) ? orgNode.node.groupID : 0;
                    
                    if (nodeDepth == 0 
                        || nodeGroupID == 0) {
                        
                        continue;
                    }
                    
                    if (typeof this.depthGroup[nodeDepth] !== "object" 
                        || this.depthGroup[nodeDepth] === null) {
                        
                        continue;
                    }
                    
                    var groupsNode = this.depthGroup[nodeDepth].nodeGroups[nodeGroupID][i];
                    
                    var offsetWidth = (isNaN(groupsNode.node.offsetWidth) === false 
                        && groupsNode.node.offsetWidth !== null) ? groupsNode.node.offsetWidth : 0;
                    //var optWidth = (isNaN(groupsNode.options.width) === false && groupsNode.options.width !== null) ? groupsNode.options.width : 0;
                    //var optMaxWidth = (isNaN(groupsNode.options.maxWidth) === false && groupsNode.options.maxWidth !== null) ? groupsNode.options.maxWidth : 0;
                    
                    //nodeWidth += offsetWidth + ((optWidth > optMaxWidth || optWidth < 0) ? optMaxWidth : optWidth);
                    
                    nodeWidth += offsetWidth;
                }
            }
            
            nodeWidth += (orgNode.node.orderID * this.chart.intervalWidth);
            ret = ((nodeLeft - nodeWidth) + (nodeOffsetWidth / 2));
        }
        
        return ret;
    },
    getNodesWidth: function(orgNodes) {
        var ret = 0;
        
        if (typeof orgNodes === "object" 
            && orgNodes !== null) {
            
            var defaultWidth = (isNaN(this.options.node.width) === false 
                && this.options.node.width !== null) ? this.options.node.width : 0;
            
            if (isNaN(this.options.node.maxWidth) === false 
                && (defaultWidth > this.options.node.maxWidth || defaultWidth < 0)) {
                
                defaultWidth = this.options.node.maxWidth;
            }
            
            for (var i = 0; i < orgNodes.nodes.length; i ++) {
                var offsetWidth = (isNaN(orgNodes.nodes[i].node.offsetWidth) === false 
                    && orgNodes.nodes[i].node.offsetWidth !== null) ? orgNodes.nodes[i].node.offsetWidth : 0;
                var optWidth = (isNaN(orgNodes.nodes[i].options.width) === false 
                    && orgNodes.nodes[i].options.width !== null) ? orgNodes.nodes[i].options.width : 0;
                var optMinWidth = (isNaN(orgNodes.nodes[i].options.minWidth) === false 
                    && orgNodes.nodes[i].options.minWidth !== null) ? orgNodes.nodes[i].options.minWidth : 0;
                var optMaxWidth = (isNaN(orgNodes.nodes[i].options.maxWidth) === false 
                    && orgNodes.nodes[i].options.maxWidth !== null) ? orgNodes.nodes[i].options.maxWidth : 0;
                
                var nodeWidth = ((optWidth < optMinWidth || optWidth < 0) ? optMinWidth : optWidth);
                
                nodeWidth = ((nodeWidth > optMaxWidth || nodeWidth < 0) ? optMaxWidth : nodeWidth);
                ret += (offsetWidth + nodeWidth);
                
                //ret += offsetWidth + ((optWidth > optMaxWidth || optWidth < 0) ? optMaxWidth : optWidth);
            }
        }
        
        return ret;
    },
    getNodesDepth: function(orgNodes) {
        
    },
    getGroupWidth: function(orgNode) {
        var ret = 0;
        
        if (typeof orgNode === "object" 
            && orgNode !== null) {
            
            var nodeDepth = (isNaN(orgNode.node.depth) === false 
                && orgNode.node.depth !== null) ? orgNode.node.depth : 0;
            var nodeGroupID = (isNaN(orgNode.node.groupID) === false 
                && orgNode.node.groupID !== null) ? orgNode.node.groupID : 0;
            
            if (typeof this.depthGroup[nodeDepth] === "object" 
                && this.depthGroup[nodeDepth] !== null) {
                
                var groupsNode = this.depthGroup[nodeDepth].nodeGroups[nodeGroupID];
                
                ret = (groupsNode[groupsNode.length - 1].node.left - groupsNode[0].node.left);
                ret += groupsNode[groupsNode.length - 1].node.offsetWidth;
            }
        }
        
        return ret;
    },
    getDepthHeightToRoot: function(depthID) {
        var ret = 0;
        var i = (isNaN(depthID) === false && depthID !== null) ? depthID : 0;
        
        for(i; i >= 1; i --) {
            if (typeof this.depthGroup[i] !== "object" 
                || this.depthGroup[i] === null) {
                
                continue;
            }
            
            /*if ((typeof this.depthGroup[i].node !== "object" || this.depthGroup[i].node === null)
                || (typeof this.depthGroup[i].options !== "object" || this.depthGroup[i].options === null)) {
                
                continue;
            }*/
            
            //var offsetHeight = (isNaN(this.depthGroup[i].node.offsetHeight) === false && this.depthGroup[i].node.offsetHeight !== null) ? this.depthGroup[i].node.offsetHeight : 0;
            //var optHeight = (isNaN(this.depthGroup[i].options.height) === false && this.depthGroup[i].options.height !== null) ? this.depthGroup[i].options.height : 0;
            //var optMaxHeight = (isNaN(this.depthGroup[i].options.maxHeighth) === false && this.depthGroup[i].options.maxHeight !== null) ? this.depthGroup[i].options.maxHeight : 0;
            //ret += (offsetHeight + ((optHeight > optMaxHeight || optHeight < 0) ? optMaxHeight : optHeight));
            
            ret += this.depthGroup[i].depthHeight;
        }
        
        if (typeof this.depthGroup[depthID] === "object" 
            && this.depthGroup[depthID] !== null) {
            
            //ret += (this.depthGroup[depthID].node.offsetHeight * (depthID - 1));
            ret += (this.chart.intervalHeight * (depthID - 1));
            ret -= this.depthGroup[depthID].depthHeight;
            
            //var dDepthOffsetHeight = (isNaN(this.depthGroup[depthID].node.offsetHeight) === false && this.depthGroup[depthID].node.offsetHeight !== null) ? this.depthGroup[depthID].node.offsetHeight : 0;
            //ret -= dDepthOffsetHeight;
        }
        
        return ret;
    },
    draw: {
        nodesInit: function(orgNodes, globChart, globParams) {
            return OrgChartV2.prototype.drawNodesInit(orgNodes, globChart, globParams);
        },
        line: function(parentDOM, lineType, lineParams) {
            return OrgChartV2.prototype.drawLine(parentDOM, lineType, lineParams);
        },
        getPx: function(px) {
            return OrgChartV2.prototype.drawLineGetPx(px);
        }
    },
    drawNodesInit: function(orgNodes, globChart, globParams, globEvent) {
        var ret = false;
        
        if (typeof orgNodes === "object" 
            && orgNodes !== null) {
            
            var render = orgNodes.render(globChart, globParams, globEvent);
            
            this.chart.total.nodes += 1;
            
            if (this.chart.total.nodes == 1) {
                this.chart.targetName = orgNodes.options.targetName;
                this.chart.subTargetName = orgNodes.options.subTargetName;
                this.chart.clsName = orgNodes.options.clsName;
            }
            
            if (orgNodes.nodes.length > 0) {
                for (var i = 0; i < orgNodes.nodes.length; i ++) {
                    var result = this.drawNodesInit(orgNodes.nodes[i], globChart, globParams, globEvent);
                    
                    if (result === false) {
                        continue;
                    }
                }
            }
            
            ret = true;
        }
        
        return ret;
    },
    drawLine: function(parentDOM, lineType, lineParams) {
        var ret = {
            id: "",
            instance: null,
            top: "",
            left: "",
            longLength: "",
            size: "1px",
            color: "#000000"
        };
        
        if (typeof lineParams === "object" 
            && lineParams !== null) {
            
            ret.id = (typeof lineParams.id === "string") ? lineParams.id : ret.id;
            ret.top = (typeof lineParams.top === "string" 
                || typeof lineParams.top === "number") ? this.drawLineGetPx(lineParams.top) : ret.top;
            ret.left = (typeof lineParams.left === "string" 
                || typeof lineParams.left === "number") ? this.drawLineGetPx(lineParams.left) : ret.left;
            ret.longLength = (typeof lineParams.longLength === "string" 
                || typeof lineParams.longLength === "number") ? this.drawLineGetPx(lineParams.longLength) : ret.longLength;
            ret.size = (typeof lineParams.size === "string" 
                || typeof lineParams.size === "number") ? this.drawLineGetPx(lineParams.size) : ret.size;
            ret.color = (typeof lineParams.color === "string") ? lineParams.color : ret.color;
            
            ret.instance = document.createElement("div");
            ret.instance.id = ret.id;
            ret.instance.innerText = ".";
            ret.instance.style.position = "absolute";
            ret.instance.style.top = ret.top + "px";
            ret.instance.style.left = ret.left + "px";
            ret.instance.style.overflow = "hidden";
            
            if (lineType == this.consts.line.type.group) {
                ret.instance.style.borderTopColor = ret.color;
                ret.instance.style.borderTopWidth = ret.size + "px";
                ret.instance.style.borderTopStyle = "solid";
                ret.instance.style.width = ret.longLength + "px";
                ret.instance.style.height = "0px";
            }
            else {
                ret.instance.style.borderLeftColor = ret.color;
                ret.instance.style.borderLeftWidth = ret.size + "px";
                ret.instance.style.borderLeftStyle = "solid";
                ret.instance.style.height = ret.longLength + "px";
                ret.instance.style.width = "0px";
            }
            
            parentDOM = (typeof parentDOM === "object" 
                && parentDOM !== null) ? parentDOM : document.body;
            parentDOM.appendChild(ret.instance);
        }
        
        return ret;
    },
    drawLineGetPx: function(px) {
        var ret = (typeof px === "number") ? px + "px" : px;
         
        return ((typeof px === "string") 
            && px.substr(px.length - 2).toLowerCase() != "px") ? px + "px" : px;
    }
}
