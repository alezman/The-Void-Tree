## If you want to keep upgrades upon acquiring something, here's an example of how it works using doReset(resettingLayer):
```js
doReset(resettingLayer) {
    if (temp[resettingLayer].row > temp.p.row) {
        // the three lines here
        let keep = []
        if (hasUpgrade('e', 12)) keep.push("upgrades")
        layerDataReset('p', keep) 
    }               
},
```

## If you want to get rid of the nodes in the layers and alternatively use tabs like Antimatter Dimensions, replace:
```js
addLayer("tree-tab", {
    tabFormat: [["tree", function() {return (layoutInfo.treeLayout ? layoutInfo.treeLayout : TREE_LAYERS)}]],
    previousTab: "",
    leftTab: true,
})
```
## with (you can replace your custom layers with embedLayer() and use it):
```js
addLayer("tree-tab", {
    tabFormat: {
        "Test": {
            embedLayer() { return "p" }
            unlocked() { return hasUpgrade('p', 15)}},
    },
    previousTab: "",
    leftTab: true,
})
```

## If you want to keep custom stuff on reset, use this:
```js
doReset(resettingLayer) {
        if (temp[resettingLayer].row > temp.p.row) {
            // the three lines here
            let keep = []
            let specialUpgs = [11]
            if (hasMilestone('s', 0)) specialUpgs.push("upgrades")
            layerDataReset('p', keep)
            for(i in specialUpgs) {
                if (!player[this.layer].upgrades.includes(specialUpgs[i])) {
                player[this.layer].upgrades.push(specialUpgs[i])
            }
        } 
    }
},
```
