// Demo data.
var lpszDemoSets = ["Frank", "Fred", "France", "James", "Jon", "Jonic", "Shannon", "Jessice", "Josh", "Alex", "Alan", "Bob"];
var lpszDemoMaps = [];

// Create params for root node.
var nodeParams = {
    options: {
        targetName: "orgchart",
        subTargetName: "orgnode",
        clsName: "org-node"
    },
    customParams: {
        caption: "Root",
        description: "Demo Root Nodes"
    }
};

var pOrgNodes = new OrgNodeV2(nodeParams);

// Create random children nodes.
var pOrgChildNode = {};
var pOrgChildNodes = null;

for (var i = 0; i < lpszDemoSets.length; i ++) {
    var lpszDemoData = lpszDemoSets[i];
    
    var nodeChildParams = {
        options: {
            targetName: "orgchart",
            subTargetName: "orgnode",
            clsName: "org-node"
        },
        customParams: {
            caption: lpszDemoData,
            description: "Demo Child Nodes"
        }
    };
    
    pOrgChildNode[lpszDemoData] = new OrgNodeV2(nodeChildParams);
    lpszDemoMaps[i] = lpszDemoData;
    
    if (i == 0) {
        pOrgChildNodes = pOrgChildNode[lpszDemoData];
    }
    else {
        var lIndex = Math.round(Math.random() * (lpszDemoMaps.length - 0));
        
        lIndex = (lIndex > lpszDemoMaps.length) ? (lpszDemoMaps.length - 1) : lIndex;
        
        if (typeof lpszDemoMaps[lIndex] === "string") {
            pOrgChildNode[lpszDemoMaps[lIndex]].addNodes(pOrgChildNode[lpszDemoData]);
        }
    }
}

// Add children nodes to root node.
pOrgNodes.addNodes(pOrgChildNodes);

// Custom event for select.
function onChanged(node) {
    var parentNode = node.parentNode.parentNode;
    var nodeList = parentNode.childNodes;
    
    if (nodeList.length >= 2) {
        var strCaption = nodeList[0].innerText;
        var strDescription = nodeList[1].innerText;
        
        alert("Caption: " + strCaption + " Description: " + strDescription);
    }
};

(function() {
    // Create params for chart.
    var chartParams = {
        options: {
            top: 12,
            left: 12,
            line: {
                size: 2,
                color: "#3388dd"
            },
            node: {
                width: 64,
                height: 64,
                maxWidth: 128,
                maxHeight: 128,
                template: "<div id=\"{id}\"><p class=\"node-caption\">{caption}</p><span class=\"node-description\">{description}</span><p><select onchange=\"onChanged(this)\"><option>All</option><option>Taiwan</option></select></p></div>"
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
    
    // Create OrgChartV2.
    var pChart = new OrgChartV2(chartParams);
    
    // Init.
    pChart.render();
})();
