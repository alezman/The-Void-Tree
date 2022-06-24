addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "🌌", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        best: new Decimal(0),
        total: new Decimal(0)
    }},
    color: "#6f00ff",
    tooltip: "The Void: Starting Place",
    requires() {
        req = new Decimal(5)
        if (inChallenge('p',11)) req = req.mul(2)
        return req
    }, // Can be a function that takes requirement increases into account
    resource: "void point(s)", // Name of prestige currency
    baseResource: "points of chaos", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() {
        exp = 0.35
        if (inChallenge('p',11)) exp = exp/2
        return exp
    }, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('p',13)) mult=mult.times(upgradeEffect('p',13))
        if (player.m.isEnabled == true) mult=mult.div(tmp.m.buyables[11].effect.y1)
        if (player.m.isEnabled2 == true) mult=mult.mul(tmp.m.buyables[12].effect.x1)
        if (player.m.isEnabled3 == true  && !hasMilestone('m',0)) mult=mult.mul(tmp.m.buyables[13].effect.x1)
        if (hasUpgrade('d',21) && !inChallenge('c',11)) mult = mult.mul(upgradeEffect('d',21))
        if (hasUpgrade('d',22) && !inChallenge('c',11)) mult = mult.pow(1.05)
        if (player.a.unlocked) mult = mult.mul(tmp.a.effect.y)
        if (hasUpgrade('a',12)) mult=mult.mul(tmp.a.effect.z)
        if (hasUpgrade('d',32)) mult=mult.mul(upgradeEffect('d',32))
        if (hasUpgrade('p',42)) mult=mult.mul(10000)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(0.75)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "v", description: "V: Gather some void points with your hands.", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        {key: "p", description: "P: Pause the game.", onPress(){player.paused = !player.paused}}
    ],
    challenges: {
        11: {
            name: "You're Afraid",
            challengeDescription: "You're lost in the void, you have no answers, you want to get out. Dream & void points are resetted. Resetting for void points exits the challenge.",
            goalDescription: "50 points of chaos",
            rewardDescription: "Dreamension Upgrade 2 ('Points Left Behind') is no longer hardcapped at 2, dreamension exponent is ×2.5 and more content.",
            canComplete: function() {return player.points.gte(50)},
            unlocked() {
                return hasUpgrade('d',12)
            },
            onEnter() {
                player.p.points = new Decimal(0)
                player.p.best = new Decimal(0)
                player.p.total = new Decimal(0)
                player.d.unlocked = false
                player.d.best = new Decimal(0)
                player.d.total = new Decimal(0)
                doReset('l', true)
            }
        },
    },
    layerShown(){return true},
    upgrades: {
        11: {
            title: "The Void Awakens",
            description: "Shall the chaos commence. (generates 2 points per second).",
            cost: new Decimal(1),
            unlocked() {
                return true
            }
        },
        12: {
            title: "Attempt?",
            description: ()=> {return "You tried to remember. (multiplies point gain by ×" + format(upgradeEffect('p',12)) + ")"},
            cost: new Decimal(3),
            effect() {
                let x = player.p.points.add(1).log(2).pow(1.75).add(1)
                if (hasUpgrade('d',13) && !inChallenge('c',11)) x = player.p.total.add(1).log(1.7).pow(1.2).add(1)
                if (hasUpgrade('a',14)) x = x.mul(upgradeEffect('a',14).y)
                return x
            },
            unlocked() {
                if (hasUpgrade('p',11)) return true
            }
        },
        13: {
            title: "Headache",
            description: ()=> {return "But you couldn't. (multiplies void point gain by ×" + format(upgradeEffect('p',13)) + ")"},
            cost: new Decimal(10),
            effect() {
                let x = player.points.add(1).log(10).pow(0.5).add(1)
                if (hasUpgrade('d',13) && !inChallenge('c',11)) x = x.pow(1.5)
                return x
            },
            unlocked() {
                if (hasUpgrade('p',12)) return true
            }
        },
        14: {
            title: "Focus",
            description: () => {return "You tried to focus. (multiplies point gain by ×" + format(upgradeEffect('p',14)) + ")"},
            cost: new Decimal(20),
            effect(){
                let x = player.points.add(1).log(300).pow(0.5).add(1)
                if (hasUpgrade('d',13) && !inChallenge('c',11)) x = player.points.add(1).log(200).pow(0.8).add(1)
                if (hasUpgrade('p',22)) x = x.pow(1.2)
                if (hasUpgrade('a',14)) x = x.mul(upgradeEffect('a',14).y)
                if (hasUpgrade('p',34)) x = x.pow(2.2)
                return x
            },
            unlocked() {
                if (hasUpgrade('p',13)) return true
            }
        },
        15: {
            title: "TRUE VOID?",
            description() {return "Multiplies the void core softcap by ×" + format(upgradeEffect('p',15)) + ", based on void points."},
            cost: new Decimal("333333333"),
            effect() {
                let x = player.p.points.add(1).log(200).pow(0.75).add(1)
                return x
            },
            unlocked() {
                if (getBuyableAmount('c',11).gte(2)) return true
            }
        },
        21: {
            title: "Furious",
            description: () => {return "Unlock new row of dream upgrades."},
            cost: new Decimal(250000),
            unlocked() {
                return hasMilestone('m',1)
            }
        },
        22: {
            title: "Dream Station",
            description: "'Focus' is ^1.2",
            cost: new Decimal(500000),
            unlocked() {
                return hasMilestone('m',1)
            }
        },
        23: {
            title: "Memory Station",
            description: "'Points Left Behind' is ^1.1'",
            cost: new Decimal(1000000),
            unlocked() {
                return hasMilestone('m',1)
            }
        },
        24: {
            title: "Void Station",
            description: "'Attempt' is ^1.05",
            cost: new Decimal(2500000),
            unlocked() {
                return hasMilestone('m',1)
            }
        },
        25: {
            title: "Darker Void",
            description() {return "Adds to the void core effect base by +" + format(upgradeEffect('p',25)) + ", based on void points."},
            cost: new Decimal("7.5e8"),
            effect() {
                let x = player.p.points.add(1).log(370).pow(0.34).div(1.2).add(1)
                return x
            },
            unlocked() {
                if (getBuyableAmount('c',11).gte(2)) return true
            }
        },
        31: {
            title: "Enlightenment I",
            description() {return "Base point gain becomes 10,000/s."},
            cost: new Decimal("1e18"),
            unlocked() {
                if (hasUpgrade('a',25)) return true
            }
        },
        32: {
            title: "Enlightenment II",
            description() {return "A. Light effect is buffed."},
            cost: new Decimal("5e18"),
            unlocked() {
                if (hasUpgrade('a',25)) return true
            }
        },
        33: {
            title: "Enlightenment III",
            description() {return "Light point gain is ×" + format(upgradeEffect('p',33)) + ", based on void points."},
            cost: new Decimal("1e20"),
            effect() {
                let x = player.p.points.add(1).log(10).add(1)
                return x
            },
            unlocked() {
                if (hasUpgrade('a',25)) return true
            }
        },
        34: {
            title: "Enlightenment IV",
            description() {return "'Focus' is ^2.2"},
            cost: new Decimal("5e20"),
            unlocked() {
                if (hasUpgrade('a',25)) return true
            }
        },
        35: {
            title: "Enlightenment V",
            description() {return "Light effect is buffed by ×" + format(upgradeEffect('p',35)) + ", based on void points."},
            cost: new Decimal("1e22"),
            effect() {
                let x = player.p.points.add(1).log(1.14).pow(2.1).add(1).log(1.24).add(1)
                return x
            },
            unlocked() {
                if (hasUpgrade('a',25)) return true
            }
        },
        41: {
            title: "Enlightenment VI",
            description() {return "Dream point gain is buffed by ×" + format(upgradeEffect('p',41)) + ", based on void cores."},
            cost: new Decimal("3.33e22"),
            effect() {
                let x = player.c.points.add(1).log(2).pow(1.1).add(1)
                return x
            },
            unlocked() {
                if (hasUpgrade('a',25)) return true
            }
        },
        42: {
            title: "Enlightenment VII",
            description() {return "Void point gain is ×10,000."},
            cost: new Decimal("1e24"),
            unlocked() {
                if (hasUpgrade('a',25)) return true
            }
        },
        43: {
            title: "Enlightenment VIII",
            description() {return "The Void Core softcap is ×32 times higher."},
            cost: new Decimal("1e27"),
            unlocked() {
                if (hasUpgrade('a',25)) return true
            }
        },
        44: {
            title: "Enlightenment IX",
            description() {
                return "Point gain is multiplied by ×" + format(upgradeEffect('p',44)) + ", based on itself."
            },
            cost: new Decimal("5e27"),
            effect() {
                let x = player.points.add(1).log(1.00001).pow(1.3).add(1)
                return x
            }
        },
        45: {
            title: "Enlightenment X",
            description: "Fully enlighten The Void.",
            cost: new Decimal("1e30"),
            canAfford() {
                return true
            },
            unlocked() {
                if (hasUpgrade('a',25)) return true
            }
        }
    },
    tabFormat: {
        "Void": {
            content: [
                "main-display",
                "blank",
                "prestige-button",
                "blank",
                "resource-display",
                "blank",
                "upgrades",

            ]   
        },
        "Challenges": {
            content: [
                "main-display",
                "blank",
                "challenges",
            ],
            unlocked() {return hasUpgrade('d',12)}
        },
    },
    doReset(resettingLayer) {
        if (temp[resettingLayer].row > temp[this.layer].row) {
            // the three lines here
        let keep = []
        if (hasMilestone('d', 0)) keep.push("upgrades")
        if (hasMilestone('c', 0)) keep.push("upgrades")
        keep.push("challenges")
        layerDataReset('p', keep) 
        }         
    },    
    passiveGeneration() {
        return hasMilestone('d',1)
    }         
})
addLayer("l", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},

    color: "#4800ab",                       // The color for this layer, which affects many elements.
    resource: "lore'th",                    // The name of this layer's main prestige resource.
    row: 'side',                                 // The row this layer is on (0 is the first row).
    tooltip: "Lore",
    baseResource: "points",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(10),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "none",                           // Determines the formula used for calculating prestige currency.
    exponent: 0.5,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() { return true },          // Returns a bool for if this layer's node should be visible in the tree.

    tabFormat:[
        () => {
            while (true) return ["infobox", "lore"]
        },
        () => {
            if (player.d.unlocked) return ["infobox","lore2"]
        },
        () => {
            if (hasUpgrade('d',12)) return ["infobox","lore3"]
        },
        () => {
            if (player.m.unlocked) return ["infobox","lore4"]
        },
        () => {
            if (player.c.unlocked) return ["infobox","lore5"]
        },
        () => {
            if (hasChallenge('c',11)) return ["infobox","lore6"]
        },
        () => {
            if (player.a.unlocked) return ["infobox","lore7"]
        },
        () => {
            if (hasUpgrade('c',14)) return ["infobox","lore8"]
        },
        () => {
            if (hasUpgrade('m',25)) return ["infobox","lore9"]
        },
        () => {
            if (hasUpgrade('d',34)) return ["infobox","lore10"]
        }
    ],
    infoboxes: {
        lore: {
            title: "<span style='color:#ffffff;'>Welcome to the Void.</span>",
            body() { return "The Void is a place filled with strange stuff. Every time a living being from an universe forgets something, it gets stored here, sometimes permanently (the entity cannot remember the thing), sometimes temporarily (the entity manages to remember what it forgot). It's a neverending process.<br><br>Over the course of the many years since the creation of the multiverse and the universes, many, MANY things have been forgotten.<br>You may question your existance here, but that is not clear yet. Your only mission here is to traverse through the void." },
            style: {
                "background-color": "#4800ab",
                "border-color": "#4800ab",
                "color": "#ffffff",
            }
        },
        lore2: {
            title: "<span style='color:#000000;'>The Cycle of Dreams.</span>",
            body() { return "Even if living creatures sometimes forget forever stuff, sometimes it returns to them through dreams. They dream, 'remember' stuff they forgot, and it gets back. However, this is not the case with humans. Humans dream and see memories long lost, however, they do not exactly remember the memory since it's so stuck in the depths of the void.<br><br>This part of the void is called the 'dreamension' because it's where some memories make it and are thrown away from the void to a living being's dreams.<br>You wonder, what are you doing here?<br><br>...<br><br>But you got no answer. Better keep searching!" },
            style: {
                "background-color": "#59ffa1",
                "border-color": "#59ffa1",
                "color": "#000000",
            },
            titleStyle: {
                "background-color": "#59ffa1",
                "border-color": "#59ffa1",
                "color": "#000000",
            }
        },
        lore3: {
            title: "<span style='color:#ffffff'>You're afraid.</span>",
            body() { 
                if (hasChallenge('p',11)) return "Seeing all these memories jump here and there, seeing some scary ones, sad ones, happy ones, angry ones makes you feel afraid. You still don't know where you are, nor why you are here, nor what is the exist, nor how did you end here, nor anything related to details about your presence in the void.<br><br>Being unable to explain all these things, you sit somewhere in the starting place, hoping to find an answer.<br><br>You start to think, and you think this is all maybe a mistake? You might need to reach out to the actual memories and get out? You tried to find the Dreamension, but, you forgot the way back in. Maybe some natural instinct will help you find your way back there."
                return "Seeing all these memories jump here and there, seeing some scary ones, sad ones, happy ones, angry ones makes you feel afraid. You still don't know where you are, nor why you are here, nor what is the exist, nor how did you end here, nor anything related to details about your presence in the void.<br><br>Being unable to explain all these things, you sit somewhere in the starting place, hoping to find an answer." 
            },
            style: {
                "background-color": "#2e1259",
                "border-color": "#2e1259",
                "color": "#ffffff",
            },
            titleStyle: {
                "background-color": "#2e1259",
                "border-color": "#2e1259",
                "color": "#ffffff",
            }
        },
        lore4: {
            title: "<span style='color:#000000'>Pool of Memories</span>",
            body() {
                return "After relaxing a little, you tried to concentrate, and this time you managed to do it! You decide it's a good idea to literally just dive in to the memories.<br><br>You learn how to communicate with the memories, and see what's inside them. Some memories are full of joy and make you feel happy. Some memories are tragedies and make you feel sad. Some memories are negative and make you feel angry. Some other memories make you feel other emotions, however you think it's not a good idea to check those memories. There's already too many with these 3 main emotions!<br><br>Even if you are a bit confused on the reason you're here, you think this was a mistake to end up here and there probably is an exit."
            },
            style: {
                "background-color": "#474747",
                "border-color": "#474747",
                "color": "#000000",
            },
            titleStyle: {
                "background-color": "#474747",
                "border-color": "#474747",
                "color": "#000000",
            }
        },
        lore5: {
            title: "<span style='color:#FFFFFF;'>Makes no sense...</span>",
            body() {
                return "Upon reaching this point in The Void, you've realized something. There's probably not an actual exit as you'd normally expect. The further you go actually means getting deeper and deeper onto The Void, which is rather contradictory to what you're looking for.<br><br>You're feeling lost, again. You feel like it's worthless to keep trying. You're perhaps stuck here by mistake, but there's no exit. You're feeling lost, really...<br><br>Although, there is nothing to fear about! You just need to dive deeper, perhaps there's something below the Dark Void. There's even a strange machine here! It seems to power up the whole void. Perhaps you could try and make good use of it?"
            },
            style: {
                "background-color": "#0a0021",
                "border-color": "#0a0021",
                "color": "#FFFFFF",
            },
            titleStyle: {
                "background-color": "#0a0021",
                "border-color": "#0a0021",
                "color": "#FFFFFF",
            }
        },
        lore6: {
            title: "<span style='color:#ffffff'>You're lost.</span>",
            body() { 
                return "Seeing as going deeper did not benefit you at all, you tried to calm down. However, this was not effective. You needed some time to relax, but you couldn't find it because you were afraid that something could go wrong with THE VOID ENGINE.<br><br>However, you remembered that you ended up here because you slept?<br>It is a really vague memory, but you can remember it, as if you were there somehow.<br><br>You also found a paper showing you how the Dark Void was and how it worked. You felt a <b>decent amount of satisfaction</b>, because you weren't feeling lost anymore. Although, the memories in The Vault of Memories got more intense..."
            },
            style: {
                "background-color": "#2e1259",
                "border-color": "#2e1259",
                "color": "#ffffff",
            },
            titleStyle: {
                "background-color": "#2e1259",
                "border-color": "#2e1259",
                "color": "#ffffff",
            }
        },   
        lore7: {
            title: "<span style='color:#000000'>Absolute Light</span>",
            body() {
                return "This is the deepest you can go. You just hit a place known as the Absolute Light, White Void, Light Space, and any kind of strange name you'd like think about. It's just white here and there, there's not really anything under this. Even if so, you still haven't understood why you're here, nor what is the exist. Although, you DID find something interesting: Enlightenments! These strange things seem to clear out mysteries in every layer and place you've visited.<br><br>You might be able to find the ultimate solution to your problem if you achieve to enlighten all of the places you've visited?"
            },
            style: {
                "background-color": "#ffffff",
                "border-color": "#ffffff",
                "color": "#000000",
            },
            titleStyle: {
                "background-color": "#ffffff",
                "border-color": "#ffffff",
                "color": "#000000",                
            }
        },
        lore8: {
            title: "<span style='color:#0000000'>Light Void?</span>",
            body() {
                return "The Dark Void has been successfully been enlightened, you can feel it isn't as dark as it was, and it also boosted everything else! Perhaps you're near to finding a solution?<br><br>You might wanna generate some light yourself though, because even if you enlightened the Dark Void, the path to the rest of the places is still dark, and it will take a lot for your eyes to accustom to the darkness again."
            },
            style: {
                "background-color": "#5124ab",
                "border-color": "#5124ab",
                "color": "#000000",
            },
            titleStyle: {
                "background-color": "#5124ab",
                "border-color": "#5124ab",
                "color": "#000000",
            },
        },
        lore9: {
            title: "<span style='color:#000000'>Light Memories?</span>",
            body() {
                return "The Vault of Memories has been successfully enlightened, and each time you see each memory, you can feel it being brighter and brighter, as if the real meaning of the memory was uncovered the moment you enlightened the vault.<br><br>Just as you were done with this enlightenment, you saw something. It was a neutral memory. You looked down to it, and you saw someone that looked like you sleeping, holding a knife, ready to stab himself. Just as it stabbed itself, the memory stopped. You freaked out after that."
            },
            style: {
                "background-color": "#969696",
                "border-color": "#969696",
                "color": "#000000",
            },
            titleStyle: {
                "background-color": "#969696",
                "border-color": "#969696",
                "color": "#000000",
            },
        },
        lore10: {
            title: "<span style='color:#000000'>The Real Dreamension</span>",
            body: "Just as you finished enlightening the Dreamension, you saw an entrance to something that looked like the Dreamension, however somehow it was different. Dreams were being produc<span style='color:#102E1D'>e</span><span style='color:#18462C'>d</span><span style='color:#318B58'> a</span><span style='color:#49D184'>t</span><span style='color:#49D184'>...</span><br><br>It seems this information is classified.",
            style: {
                "background-color": "#59ffa1",
                "border-color": "#59ffa1",
                "color": "#000000",
            },
            titleStyle: {
                "background-color": "#59ffa1",
                "border-color": "#59ffa1",
                "color": "#000000",
            }
        }
    }
})
addLayer("d", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
        best: new Decimal(0),
        total: new Decimal(0),
    }},
    symbol: "💤",
    position: 0,
    color: "#59ffa1",
    resource: "dream point(s)",            // The name of this layer's main prestige resource.
    row: 1,                                 // The row this layer is on (0 is the first row).

    baseResource: "void points",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.p.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(100),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.45,                        // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        let gain = new Decimal(1)
        if (player.m.isEnabled3 == true && !hasMilestone('m',0)) gain=gain.mul(tmp.m.buyables[13].effect.x1)
        if (hasUpgrade('d',23)) gain=gain.mul(upgradeEffect('d',23))
        if (hasUpgrade('d',31)) gain = gain.mul(upgradeEffect('d',31))
        if (hasUpgrade('p',41)) gain = gain.mul(upgradeEffect('p',41))
        return gain                         // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        let x = new Decimal(0.25)
        if (hasChallenge('p',11)) x = x.mul(2.5)        
        if (hasUpgrade('d',23)) x=x.mul(upgradeEffect('d',23))
        return x
    },

    layerShown() { 
        if (hasUpgrade('p',14) && player.p.total.gte(75)) return true
        else if (player.d.total.gte(1)) return true
        else if (inChallenge('p',11)) return false
        else if (player.m.unlocked) return true
        else if (player.c.unlocked) return true
        else if (hasChallenge('p',11)) return true
        else if (hasChallenge('c',11)) return true
        else return false
    },          // Returns a bool for if this layer's node should be visible in the tree.

    upgrades: {
        // Look in the upgrades docs to see what goes here!
    },
    branches: ['p'],
    effect() {
        let v = player.d.points
        let w = player.p.points
        let x = v.add(1).log(5).pow(1.2).mul(w.add(1).log(7).pow(0.45).add(1)).add(1).max(1)
        if (hasUpgrade('d',11)) x = player.d.best.add(1).log(5).pow(1.2).mul(w.add(1).log(7).pow(0.45).add(1)).add(1).max(1)
        if (hasUpgrade('c',12)) x = x.mul(1.2).mul(upgradeEffect('c',12))
        if (hasUpgrade('a',14)) x = x.mul(upgradeEffect('a',14).y)
        if (hasUpgrade('a',22)) x = x.mul(1.4).pow(1.5)
        return x
    },
    effectDescription(){
        return "which is/are multiplying point gain by ×" + format(tmp.d.effect) + ", based on dream points and void points."
    },
    tooltip: "Dreamension",
    milestones: {
        0: {
            requirementDescription: "3 dream points",
            effectDescription: "But you couldn't focus. (Keep void upgrades on reset).",
            done() { return player.d.points.gte(3) },
            unlocked() {
                if (player.d.best.gte(3)) return true
                if (hasMilestone('c',1) && !player.d.best.gte(3)) return true
            },
        },
        1: {
            requirementDescription: "10 dream points & You're Afraid completed",
            effectDescription: "It feels better now. (Generate 100% of void points per second).",
            done() { return player.d.points.gte(10) && hasChallenge('p',11) },
            unlocked() {return player.d.best.gte(7)}
        }
    },
    upgrades: {
        11: {
            title: "Smart Benefits",
            fullDisplay: () => {return "<b><h3>Smart Benefits</h3></b><br>The effect of the layer is based on best points instead of current points.<br><br>Req: 4 dream points"},
            canAfford() {
                return player.d.points.gte(4)
            }
        },
        12: {
            title: "Points Left Behind",
            description: () => {return "You are afraid. (Point gain is multiplied by ×"+ format(upgradeEffect('d',12)) +", also new challenge)"},
            cost() {
                return player.d.points.max(5).min("1e1700")},
            effect() {
                let x = player.d.points.add(1).log(3).pow(1.12).add(1).min(100)
                let y = player.d.points.add(1).log(50).pow(0.75).add(1)
                if(hasUpgrade('d',14)) x = x.pow(1.6)
                if(!hasChallenge('p',11)) x = x.min(2)
                if (hasUpgrade('p',23)) x = x.pow(1.1)
                if (x.gte(100)) x.mul(y)
                if (inChallenge('c',11)) x = new Decimal(1)
                if (hasUpgrade('a',14)) x = x.mul(upgradeEffect('a',14).y)
                return x
            }
        },
        13: {
            title: "Totally Unreal",
            description: () => {return "You're more calm now. (Void Upgrade 2, 3 and 4 are buffed)."},
            cost: new Decimal(7),
            canAfford() { return hasChallenge('p',11) }
        },
        14: {
            title: "Really Left Behind",
            description: () => {return "You try to find something. (Dreamension Upg 2 is buffed)."},
            cost: new Decimal(20),
            canAfford() { return hasChallenge('p',11) }
        },
        21: {
            title: "Raging",
            description: () => {return "Void Point gain is multiplied by ×" + format(upgradeEffect('d',21)) + "."},
            cost: new Decimal(50),
            unlocked() {
                return hasUpgrade('p',21)
            },
            effect() {
                let x = player.d.points.add(1).log(50).pow(0.5).add(1)
                if (inChallenge('c',11)) x = x.mul(0)
                return x
            }
        },
        22: {
            title: "Fallen Dreams",
            description: () => {return "Void Point gain is ^1.05"},
            cost: new Decimal(75),
            unlocked() {
                return hasUpgrade('p',21)
            }
        },
        23: {
            title: "Dreamaster",
            description: () => {return "Multiply dream point gain by ×" + format(upgradeEffect('d',23)) + "."},
            cost: new Decimal(90),
            unlocked() {
                return hasUpgrade('p',21)
            },
            effect() {
                let x = player.d.points.add(1).log(500).pow(0.25).add(1)
                if (inChallenge('c',11)) x = new Decimal(1)
                return x
            }
        },
        24: {
            title: "Nerf the nerfs",
            description: () => {return "Memory negative effects are divided by /1.25."},
            cost: new Decimal(250),
            unlocked() {
                return hasUpgrade('p',21)
            }
        },
        31: {
            title: "Enlightenment I",
            description: () => {return "Dream Point gain is boosted by ×" + format(upgradeEffect('d',31)) + ", based on dream points itselves."},
            cost: new Decimal("5e10"),
            effect() {
                let x = player.d.points.add(1).log(40).add(1).log(2).add(1)
                return x
            },
            unlocked() {
                return hasUpgrade('a',21)
            }
        },
        32: {
            title: "Enlightenment II",
            description: () => { return "Void Point gain is boosted by ×" + format(upgradeEffect('d',32)) + ", based on void points." },
            cost: new Decimal("2e11"),
            effect() {
                let x = player.p.points.add(1).pow(1.2).add(1).log(3).add(1).log(2).add(1)
                return x
            },
            unlocked() {
                return hasUpgrade('a',21)
            }
        },
        33: {
            title: "Enlightenment III",
            description: () => {
                return "Point gain is boosted by ×" + format(upgradeEffect('d',33)) + ", based on memory vessels."
            },
            cost: new Decimal("5e11"),
            effect() {
                let x = player.m.points.add(1).pow(1.5).add(1).log(2).add(1).log(3).add(1)
                return x
            },
            unlocked() {
                return hasUpgrade('a',21)
            }
        },
        34: {
            title: "Enlightenment IV",
            description: "Unlock a layer that <b>defines the ending of the tree.</b>",
            cost: new Decimal("1e12"),
            unlocked() {
                return hasUpgrade('a',21)
            }
        }
    },
    hotkeys: [
        {key: "d", description: "D: Put your hands in the air, hoping to catch a fallen dream.", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    doReset(resettingLayer) {
        if (temp[resettingLayer].row > temp.d.row) {
            // the three lines here
            let keep = []
            if (hasMilestone('c', 1)) keep.push("upgrades")
            if (hasMilestone('c', 1)) keep.push("milestones")
            layerDataReset('d', keep) 
        }               
    },
    passiveGeneration() {
        return hasMilestone('c',4)
    }  
})

addLayer("m", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
        best: new Decimal(0),
        total: new Decimal(0),
        isEnabled: false,
        isEnabled2: false,
        isEnabled3: false,
    }},
    among() {
        if (player.m.unlocked) {
            let sus = new Decimal(1)
            if (hasUpgrade('m',15)) sus = sus.add(4)
            if (player.m.isEnabled3) sus = sus.mul(tmp.m.buyables[13].effect.y1)            
            if (getBuyableAmount('c',11).gte(4)) sus = sus.mul(buyableEffect('c',11).x)
            if (hasUpgrade('c',11)) sus = sus.mul(upgradeEffect('c',11))
            return sus
        }
    },

    color: "#474747",                       // The color for this layer, which affects many elements.
    resource: "memory vessel(s)",            // The name of this layer's main prestige resource.
    row: 1,                                 // The row this layer is on (0 is the first row).
    position: 1,
    symbol: "💭",
    tooltip: "The Vault of Memories",
    baseResource: "points",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(5000),           // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.00000000000000000000000005, // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(0)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1e-496)
    },

    layerShown() { return hasChallenge('p',11) },          // Returns a bool for if this layer's node should be visible in the tree.

    upgrades: {
        // Look in the upgrades docs to see what goes here!
    },
    branches:['d'],
    tabFormat: [
        "main-display",
        ["display-text", () => {return "(" + format(tmp.m.among) + " memory vessel(s)/s)"}],
        () => {
            if (player.m.unlocked == false) return "prestige-button"
            else return "blank"
        },
        "resource-display",
        "blank",
        ["display-text", "<b><h2>Warning!</h2></b><br>Selling buyables will NOT give anything in return, and it does a Memory Vessel Reset."],
        "blank",
        "milestones",
        "blank",
        "buyables",
        "blank",
        "clickables",
        "blank",
        "upgrades",
    ],
    componentStyles: {
        "clickable"() { return {'height': '200px', 'width': '200px'} },
    },
    update(diff) {
        if (player.m.unlocked) {
            let x = new Decimal(1)
            if (hasUpgrade('m',15)) x = x.add(4)
            if (hasUpgrade('m',25)) x = new Decimal(625)
            let y = diff
            if (player.m.isEnabled3) x = x.mul(tmp.m.buyables[13].effect.y1)
            if (getBuyableAmount('c',11).gte(4)) x = x.mul(buyableEffect('c',11).x)
            if (hasUpgrade('c',11)) x = x.mul(upgradeEffect('c',11))
            addPoints('m', x.times(y))
        }
        if (hasMilestone('m',0)) {
            player.m.isEnabled3 = true
        }
        if (hasMilestone('c',6)) {
            player.m.isEnabled = true
            player.m.isEnabled2 = true
            player.m.isEnabled3 = true
            if (player.m.points.gte(tmp.m.buyables[11].cost)) {                
                setBuyableAmount(this.layer, 11, getBuyableAmount(this.layer, 11).add(1))
            }
            if (player.m.points.gte(tmp.m.buyables[12].cost)) {                
                setBuyableAmount(this.layer, 12, getBuyableAmount(this.layer, 12).add(1))
            }
            if (player.m.points.gte(tmp.m.buyables[13].cost)) {                
                setBuyableAmount(this.layer, 13, getBuyableAmount(this.layer, 13).add(1))
            }
        }
    },
    prestigeButtonText() {
        return "Dive in to the fallen memories!"
    },
    buyables: {
        11:{   
            title: "Memory 1",
            display() {
                return "This memory is happy. It boosts point gain based on memory vessels but divides void point gain based on dream points.<br>Enabled:"+ player.m.isEnabled +"<br>Cost: " + format(tmp.m.buyables[11].cost) + " memories.<br>Level:"+ formatWhole(getBuyableAmount('m',this.id)) +"<br><br>Effect 1: ×" + format(tmp.m.buyables[11].effect.x1) + "<br>Effect 2: /" +format(tmp.m.buyables[11].effect.y1)        
            },
            cost(x) {
                let z = new Decimal(10).pow(new Decimal(1.1).pow(x))
                if (hasUpgrade('m',11)) z = z.div(1.5)
                if (hasChallenge('c',11)) z = z.pow(1.3)
                if (inChallenge('c',12)) z = z.mul(5)
                if (hasUpgrade('m',21)) z = z.div(2.25)
                return z
            },
            effect() {
                let x = player.m.points.add(1).log(3).mul(new Decimal(1).add(getBuyableAmount('m',11).div(20))).add(1)
                if (hasUpgrade('a',14)) x = x.mul(upgradeEffect('a',14).y)
                let y = player.d.points.max(1).add(1).log(40).mul(new Decimal(1).sub(getBuyableAmount('m',11).div(20))).add(1)
                if (hasUpgrade('d',24) && !inChallenge('c',11)) y = y.div(1.5)
                if (hasUpgrade('m',12)) x = x.mul(upgradeEffect('m',12))
                if (hasChallenge('c',11)) {
                    x = x.pow(1.4)
                    y = y.mul(2.2)
                }
                return {
                    x1: x,
                    y1: y
                }
            },        
            buy() {
                if (!hasMilestone('c',6)) player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                player.m.isEnabled = true
                player.m.isEnabled2 = false
                player.m.isEnabled3 = false
            },
            canSellAll() {
                return getBuyableAmount(this.layer, this.id).gte(1)
            },
            canAfford() {
                return player.m.points.gte(tmp.m.buyables[this.id].cost)
            },
            sellAll() {
                setBuyableAmount(this.layer, this.id, new Decimal(0))
                doReset("m", true)
            }
        },
        12:{   
            title: "Memory 2",
            display() {
                return "This memory is sad. It boosts void point gain based on memory vessels but divides point gain based on void points.<br>Enabled:"+ player.m.isEnabled2 +"<br>Cost: " + format(tmp.m.buyables[12].cost) + " memories.<br>Level:"+ formatWhole(getBuyableAmount('m',this.id)) +"<br><br>Effect 1: ×" + format(tmp.m.buyables[12].effect.x1) + "<br>Effect 2: /" +format(tmp.m.buyables[12].effect.y1)        
            },
            cost(x) {
                let z = new Decimal(10).pow(new Decimal(1.1).pow(x))
                if (hasUpgrade('m',11)) z = z.div(1.5)
                if (hasChallenge('c',11)) z = z.pow(1.3)
                if (inChallenge('c',12)) z = z.mul(5)
                if (hasUpgrade('m',21)) z = z.div(2.25)
                return z
            },
            effect() {
                let x = player.m.points.add(1).log(6).mul(new Decimal(1).add(getBuyableAmount('m',11).div(20))).add(1)
                let y = player.d.points.max(1).add(1).log(25).mul(new Decimal(1).sub(getBuyableAmount('m',11).div(20))).add(1).max(1)
                if (hasUpgrade('d',24) && !inChallenge('c',11)) y = y.div(1.5)
                if (hasUpgrade('m',13)) x = x.mul(upgradeEffect('m',12))
                if (hasChallenge('c',11)) {
                    x = x.pow(1.4)
                    y = y.mul(2.2)
                }
                return {
                    x1: x,
                    y1: y
                }
            },        
            buy() {
                if (!hasMilestone('c',6)) player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                player.m.isEnabled = false
                player.m.isEnabled2 = true
                player.m.isEnabled3 = false
            },
            canSellAll() {
                return getBuyableAmount(this.layer, this.id).gte(1)
            },
            canAfford() {
                return player.m.points.gte(tmp.m.buyables[this.id].cost)
            },
            sellAll() {
                setBuyableAmount(this.layer, this.id, new Decimal(0))
                doReset("m", true)
            }
        },
        13:{   
            title: "Memory 3",
            display() {
                return "This memory is angry. It nullifies any other gains but memory vessel gain is multiplied by the memory vessels itself.<br>Enabled:"+ player.m.isEnabled3 +"<br>Cost: " + format(tmp.m.buyables[13].cost) + " memories.<br>Level:"+ formatWhole(getBuyableAmount('m',this.id)) + "<br><br>Effect 1: ×" + format(tmp.m.buyables[13].effect.x1) + "<br>Effect 2: ×" +format(tmp.m.buyables[13].effect.y1)        
            },
            cost(x) {
                let z = new Decimal(10).pow(new Decimal(1.1).pow(x))
                if (hasUpgrade('m',11)) z = z.div(1.5)
                if (hasChallenge('c',11)) z = z.pow(1.2)
                if (inChallenge('c',12)) z = z.mul(5)
                if (hasUpgrade('m',21)) z = z.div(2.25)
                return z
            },
            effect() {
                let x = new Decimal(0)
                let y = player.m.points.add(1).log(3).pow(new Decimal(0.75).add(getBuyableAmount('m',13).div(20))).add(1)
                if (hasUpgrade('m',14)) {
                    x = x.add(0.5)
                    y = y.mul(upgradeEffect('m',14))
                }
                return {
                    x1: x,
                    y1: y
                }
            },        
            buy() {
                if (!hasMilestone('m',0))player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                player.m.isEnabled = false
                player.m.isEnabled2 = false
                player.m.isEnabled3 = true
            },
            canSellAll() {
                return getBuyableAmount(this.layer, this.id).gte(1)
            },
            canAfford() {
                return player.m.points.gte(tmp.m.buyables[this.id].cost)
            },
            sellAll() {
                setBuyableAmount(this.layer, this.id, new Decimal(0))
                doReset("m", true)
            }
        },
    },
    clickables: {
        11: {
            title: "Memory 4",
            display() { return "This memory has nothing special in it. You feel neutral when you see it. Removes any effect provided by any of the above memories. It does not cost anything, nor does it reset anything, however you STILL have to purchase other memories to enable them again." },
            canClick() {
                if (player.m.isEnabled) return true
                if (player.m.isEnabled2) return true
                if (player.m.isEnabled3) return true
            },
            onClick() {
                player.m.isEnabled = false
                player.m.isEnabled2 = false
                player.m.isEnabled3 = false
            }
        }
    },
    upgrades: {
        11: {
            title: "Very Cool Sale",
            description: "Memories are 50% cheaper.",
            cost: new Decimal(100)
        },
        12: {
            title: "Excitement",
            description: "Memory 1's effect 1 is buffed.",
            cost: new Decimal(250),
            effect() {
                let x = player.d.points.add(1).pow(1.3).log(3).add(1)
                if (hasUpgrade('m',22)) x = x.pow(1.5)
                return x.mul(1.2)
            }
        },
        13: {
            title: "Misery",
            description: "Memory 2's effect 1 is buffed.",
            cost: new Decimal(500),
            effect() {
                let x = player.m.points.add(1).pow(1.3).log(3).add(1)
                if (hasUpgrade('m',23)) x = x.pow(1.5)
                return x
            }
        },
        14: {
            title: "Wrath",
            description: "Memory 3's effect 2 is buffed and effect 1 does not nullify currencies.",
            cost: new Decimal(750),
            effect() {
                let x = player.p.points.add(1).pow(1.05).log(5).add(1)
                if (hasUpgrade('m',24)) x = x.pow(1.5)
                return x
            }
        },
        15: {
            title: "Vessel²",
            description: "Base memory vessel gain is 5/s now.",
            cost: new Decimal(1000)
        },
        21: {
            title: "Enlightenment I",
            description: "Memories are 125% cheaper.",
            cost: new Decimal(2500000),
            unlocked() {
                return hasUpgrade('a',13)
            }
        },
        22: {
            title: "Enlightenment II",
            description: "Excitement is ^1.5.",
            cost: new Decimal(3500000),
            unlocked() {
                return hasUpgrade('a',13)
            }
        },
        23: {
            title: "Enlightenment III",
            description: "Misery is ^1.5.",
            cost: new Decimal(5000000),
            unlocked() {
                return hasUpgrade('a',13)
            }
        },
        24: {
            title: "Enlightenment IV",
            description: "Wrath is ^1.5.",
            cost: new Decimal(7500000),
            unlocked() {
                return hasUpgrade('a',13)
            }
        },
        25: {
            title: "Enlightenment V",
            description: "Base memory vessel gain is 625/s now.",
            cost: new Decimal(1e7),
            unlocked() {
                return hasUpgrade('a',13)
            }
        }
    },
    milestones: {
        0: {
            requirementDescription: "200 memory vessels",
            effectDescription: "The third memory will always be on, leaving space for another one to be enabled as well, it costs nothing, and also effect 1 is disabled.",
            done() {
                return player.m.points.gte(200)
            },
        },
        1: {
            requirementDescription: "1,000 memory vessels",
            effectDescription: "Unlock new row of Void Upgrades.",
            done() {
                return player.m.points.gte(1000)
            }
        }
    },
    doReset(resettingLayer) {
        if (temp[resettingLayer].row > temp.m.row) {
            // the three lines here
            let keep = []
            if (hasMilestone('c', 2)) keep.push("milestones")
            if (hasMilestone('c', 3)) keep.push("upgrades")
            layerDataReset('m', keep) 
        }               
    },
})

addLayer("c", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
        best: new Decimal(0),
        total: new Decimal(0)
    }},

    color: "#330987",                       // The color for this layer, which affects many elements.
    resource: "void core(s)",         // The name of this layer's main prestige resource.
    row: 2,                                 // The row this layer is on (0 is the first row).
    symbol: "⚫",
    tooltip: "Dark Void",    
    hotkeys: [
        {key: "c", description: "C: Extract a void core from the Dark Void.", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],

    baseResource: "points",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(1e9),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "static",                         // Determines the formula used for calculating prestige currency.
    exponent: 1.00,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(0.74)
    },
    branches:['m'],

    layerShown() { return hasMilestone('m',1) || player.c.total.gte(1)},          // Returns a bool for if this layer's node should be visible in the tree.

    milestones: {
        0: {
            requirementDescription: "2 void cores",
            effectDescription: "You keep Void Upgrades on reset.",
            done() {
                return player.c.points.gte(2)
            }
        },
        1: {
            requirementDescription: "3 void cores",
            effectDescription: "You keep Dreamension Upgrades and Milestones on reset.",
            done() {
                return player.c.points.gte(3)
            }
        },
        2: {
            requirementDescription: "4 void cores",
            effectDescription: "You keep Memory Vessel Milestones on reset.",
            done() {
                return player.c.points.gte(4)
            }
        },
        3: {
            requirementDescription: "5 void cores",
            effectDescription: "You keep Memory Vessel Upgrades on reset.",
            done() {
                return player.c.points.gte(5)
            }
        },
        4: {
            requirementDescription: "6 void cores",
            effectDescription: "You gain 100% of dream points every second.",
            done() {
                return player.c.points.gte(6)
            }
        },
        5: {
            requirementDescription: "7 void cores",
            effectDescription: "Unlocks... THE VOID ENGINE.",
            done() {
                return player.c.points.gte(7)
            }
        },
        6: {
            requirementDescription: "10 void cores",
            effectDescription: "All of the Memories will always be free, will be enabled at all times and they will be automatically bought.",
            done() {
                return player.c.points.gte(10)
            }
        }
    },
    effect() {
        let softcap = new Decimal(1024)
        let amongi = new Decimal(2)
        if (hasUpgrade('p',15)) softcap = softcap.mul(upgradeEffect('p',15))
        if (player.a.unlocked) softcap = softcap.mul(tmp.a.effect.x)
        if (hasUpgrade('p',25)) amongi = amongi.add(upgradeEffect('p',25))
        if (hasUpgrade('c',14)) softcap = softcap.mul(upgradeEffect('c',14))
        if (hasUpgrade('p',43)) softcap = softcap.mul(32)
        let x = amongi.pow(player.c.points).min(softcap)
        if (hasUpgrade('a',14)) x = x.mul(upgradeEffect('a',14).y)
        return x
    },
    effectDescription() {
        return "multiplies point gain by ×" + format(tmp.c.effect) + ", based on void cores."
    },
    tabFormat: {
        "Main": {
            content:[
                "main-display",
                "blank",
                "prestige-button",
                "blank",
                "resource-display",
                "milestones",
                "blank",
                "upgrades",
            ]
        },
        "THE VOID ENGINE": {
            content: [
                "main-display",
                "blank",
                "buyables",
                "blank",
                "challenges",
            ],
            unlocked() {
                return hasMilestone('c',5)
            }
        }
    },
    buyables: {
        11: {
            title: "THE VOID ENGINE",
            display() {
                if (getBuyableAmount('c',11).gte(5)) return "There's something keeping the void working as it does currently. This thing, known as THE VOID ENGINE, it keeps the void stable, and it works based on fallen memories and fallen dreams. Dreams and memories that do not have a way of coming back to the surface, those are sent down here to be fuel for THE VOID ENGINE. THE VOID ENGINE sometimes opens doors to unknown places based on extra dreams and memories you throw into it.<br><br>Cost 1: " + format(tmp.c.buyables[11].cost.y) + " dreams.<br>Cost 2: " + format(tmp.c.buyables[11].cost.z) + " memory vessels.<br><br>By throwing extra memories and dreams to THE VOID ENGINE, you've unlocked:<br>2 new challenges.<br>2 new Void Upgrades.<br>Bonus ×" + format(buyableEffect('c',11).x) + " multiplier to Memory Vessels.<br>A new layer...?"
                if (getBuyableAmount('c',11).gte(4)) return "There's something keeping the void working as it does currently. This thing, known as THE VOID ENGINE, it keeps the void stable, and it works based on fallen memories and fallen dreams. Dreams and memories that do not have a way of coming back to the surface, those are sent down here to be fuel for THE VOID ENGINE. THE VOID ENGINE sometimes opens doors to unknown places based on extra dreams and memories you throw into it.<br><br>Cost 1: " + format(tmp.c.buyables[11].cost.y) + " dreams.<br>Cost 2: " + format(tmp.c.buyables[11].cost.z) + " memory vessels.<br><br>By throwing extra memories and dreams to THE VOID ENGINE, you've unlocked:<br>2 new challenges.<br>2 new Void Upgrades.<br>Bonus ×" + format(buyableEffect('c',11).x) + " multiplier to Memory Vessels."
                if (getBuyableAmount('c',11).gte(3)) return "There's something keeping the void working as it does currently. This thing, known as THE VOID ENGINE, it keeps the void stable, and it works based on fallen memories and fallen dreams. Dreams and memories that do not have a way of coming back to the surface, those are sent down here to be fuel for THE VOID ENGINE. THE VOID ENGINE sometimes opens doors to unknown places based on extra dreams and memories you throw into it.<br><br>Cost 1: " + format(tmp.c.buyables[11].cost.y) + " dreams.<br>Cost 2: " + format(tmp.c.buyables[11].cost.z) + " memory vessels.<br><br>By throwing extra memories and dreams to THE VOID ENGINE, you've unlocked:<br>2 new challenges.<br>2 new Void Upgrades."
                if (getBuyableAmount('c',11).gte(2)) return "There's something keeping the void working as it does currently. This thing, known as THE VOID ENGINE, it keeps the void stable, and it works based on fallen memories and fallen dreams. Dreams and memories that do not have a way of coming back to the surface, those are sent down here to be fuel for THE VOID ENGINE. THE VOID ENGINE sometimes opens doors to unknown places based on extra dreams and memories you throw into it.<br><br>Cost 1: " + format(tmp.c.buyables[11].cost.y) + " dreams.<br>Cost 2: " + format(tmp.c.buyables[11].cost.z) + " memory vessels.<br><br>By throwing extra memories and dreams to THE VOID ENGINE, you've unlocked:<br>A new challenge.<br>2 new Void Upgrades."
                if (getBuyableAmount('c',11).gte(1)) return "There's something keeping the void working as it does currently. This thing, known as THE VOID ENGINE, it keeps the void stable, and it works based on fallen memories and fallen dreams. Dreams and memories that do not have a way of coming back to the surface, those are sent down here to be fuel for THE VOID ENGINE. THE VOID ENGINE sometimes opens doors to unknown places based on extra dreams and memories you throw into it.<br><br>Cost 1: " + format(tmp.c.buyables[11].cost.y) + " dreams.<br>Cost 2: " + format(tmp.c.buyables[11].cost.z) + " memory vessels.<br><br>By throwing extra memories and dreams to THE VOID ENGINE, you've unlocked:<br>A new challenge."
                return "There's something keeping the void working as it does currently. This thing, known as THE VOID ENGINE, it keeps the void stable, and it works based on fallen memories and fallen dreams. Dreams and memories that do not have a way of coming back to the surface, those are sent down here to be fuel for THE VOID ENGINE. THE VOID ENGINE sometimes opens doors to unknown places based on extra dreams and memories you throw into it.<br><br>Cost 1: " + format(tmp.c.buyables[11].cost.y) + " dreams.<br>Cost 2: " + format(tmp.c.buyables[11].cost.z) + " memory vessels."
            },
            cost(x) {
                let y = new Decimal(100).pow(new Decimal(1.28).pow(x))
                let z = new Decimal(1000).pow(new Decimal(1.26).pow(x.div(2)))
                return {
                    y: y,
                    z: z
                }
            },
            canAfford() {
                return player.d.points.gte(tmp.c.buyables[11].cost.y) && player.m.points.gte(tmp.c.buyables[11].cost.z)
            },
            buy() {
                player.d.points = player.d.points.sub(tmp.c.buyables[11].cost.y)
                player.m.points = player.m.points.sub(tmp.c.buyables[11].cost.z)                
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit() {
                return new Decimal(5)
            },
            effect() {
                let x = player.c.points.add(1).log(400).pow(0.75).div(1.2).add(1)
                return {
                    x: x
                }
            }
        }
    },    
    componentStyles: {
        "buyable"() { return {'height': '400px', 'width': '400px'} },
    },
    challenges: {
        11: {
            name: "You're Lost",
            challengeDescription: "You're lost in the void, this time you're stuck deep onto it. You have no idea of what's happening right now, nor how make an escape to get out. Point gain is ^0.25 and all Dreamension Upgrades are disabled.",
            goalDescription: "1,000 points of chaos",
            rewardDescription: "The memories are greatly improved, but so is their cost and their nerfs.",
            canComplete: function() {return player.points.gte(1000)},
            onEnter() {
                player.p.points = player.p.points
            },
            unlocked() {
                return getBuyableAmount('c',11).gte(1)
            }
        },
        12: {
            name: "You're Lost II",
            challengeDescription: "You're completely confused. You can't do anything, you're afraid, you can't concentrate. Being in the void is so much pain, it didn't resolve itself last time! Point gain is ^0.65 and the Memories are ×5.00 more costly.",
            goalDescription: "500,000,000 points of chaos",
            rewardDescription: "Unlock a new row of Void Upgrades.",
            canComplete: function() {return player.points.gte(500000000)},
            unlocked() {
                return getBuyableAmount('c',11).gte(3)
            }
        }
    },    
    doReset(resettingLayer) {
        if (temp[resettingLayer].row > temp[this.layer].row) {
            // the three lines here
        let keep = []
        if (hasMilestone('a', 0)) keep.push("milestones")
        if (hasMilestone('a', 0)) keep.push("challenges")
        if (hasMilestone('a', 0)) keep.push("buyables")
        if (hasMilestone('a', 2)) keep.push("upgrades")
        layerDataReset('c', keep) 
        }         
    },    
    upgrades: {
        11: {
            title: "Enlightenment I",
            description: function() {return "Memory gain is buffed by ×" + format(upgradeEffect('c',11)) + "."},
            cost: new Decimal(17),
            unlocked() {
                return hasUpgrade('a',11)
            },
            effect() {
                let x = player.p.points.add(1).pow(0.75).log(3).add(1)
                return x
            }
        },
        12: {
            title: "Enlightenment II",
            description: function() {return "The dream effect is buffed by ×" + format(upgradeEffect('c',12)) + "."},
            cost: new Decimal(19),
            unlocked() {
                return hasUpgrade('a',11) && hasUpgrade('c',11)
            },            
            effect() {
                let x = player.d.points.add(1).pow(0.65).log(1.37).add(1)
                return x
            }
        },
        13: {
            title: "Enlightenment III",
            description: function() {return "Boost point gain by ×" + format(upgradeEffect('c',13)) + "."},
            cost: new Decimal(23),
            unlocked() {
                return hasUpgrade('a',11) && hasUpgrade('c',12)
            },
            effect() {
                let x = player.m.points.add(1).pow(0.53).log(100).add(1)
                if (hasUpgrade('a',14)) x = x.mul(upgradeEffect('a',14).y)
                return x
            }
        },
        14: {
            title: "Enlightenment IV",
            description: function() {return "Softcap is now multiplied by void cores, boosting it by ×" + format(upgradeEffect('c',14)) + "."},
            cost: new Decimal(26),
            unlocked() {
                return hasUpgrade('a',11) && hasUpgrade('c',13)
            },
            effect() {
                let x = player.c.points.add(1).log(3).pow(1.28).pow(0.99).add(1)
                return x
            }
        }
    },
    automate() {
        if (player.p.unlocked && hasMilestone('a',1)) doReset("c")
    },
    resetsNothing() {return hasMilestone('a',1)}
})

addLayer("a", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
        best: new Decimal(0),
        total: new Decimal(0),
        light: new Decimal(0)
    }},

    color: "#FFFFFF",                       // The color for this layer, which affects many elements.
    resource: "light point(s)",            // The name of this layer's main prestige resource.
    row: 4,                                 // The row this layer is on (0 is the first row).
    tooltip: "Absolute Light",
    hotkeys: [
        {key: "a", description: "A: Dive in to the absolute light, catching a light point.", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],

    baseResource: "void cores",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.c.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(16),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.25,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        let mult = new Decimal(1)
        if (hasUpgrade('a',15)) mult = mult.mul(upgradeEffect('a',15))
        if (hasUpgrade('p',33)) mult = mult.mul(upgradeEffect('p',33))
        return mult                         // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(0.5)
    },

    layerShown() { return getBuyableAmount('c',11).gte(5) },          // Returns a bool for if this layer's node should be visible in the tree.

    upgrades: {
        11: {
            title: "Dark Void",
            description: "Unlock upgrades for Dark Void.",
            cost: new Decimal(2)
        },
        12: {
            title: "Annihilate",
            description: "Unlock light generation. Cost decreases with Void Cores.",
            cost() {
                let x = new Decimal(40)
                let y = player.c.points
                return x.sub(y).max(1)
            }
        },
        13: {
            title: "The Vault of Memories",
            description: "Unlock upgrades for The Vault of Memories.",
            cost: new Decimal(10),
            canAfford() {
                return hasUpgrade('a',12)
            }
        },
        14: {
            title: "Mega-Synergy",
            description: () => {return "Points boost all point-boosting features by ×"+ format(upgradeEffect('a',14).y) +", and boost themselves in this upgrade as well by ×"+ format(upgradeEffect('a',14).x) +"."},
            cost() {
                let x = new Decimal(35)
                let y = player.c.points
                return x.sub(y).max(1)
            },
            canAfford() {
                return hasUpgrade('a',13)
            },
            effect() {
                let x = player.points.add(1).pow(0.6).log(100).add(1)
                let y = player.points.add(1).pow(0.2).log(800).add(1)
                return {
                    x: x,
                    y: y
                }
            },
        },
        15: {
            title: "LET THERE BE LIGHT",
            description: () => {return"Light points are boosted by all currently unlocked currencies, for a sum of ×" + format(upgradeEffect('a',15)) + "."},
            cost: new Decimal(20),
            effect() {
                let p = player.points.add(1).log(2).pow(0.3).add(1)
                let v = player.p.points.add(1).log(1.5).pow(0.5).add(1)
                let d = player.d.points.add(1).log(1.35).pow(0.6).add(1)
                let m = player.m.points.add(1).log(1.2).pow(0.7).add(1)
                let c = player.c.points.add(1).log(3).pow(1.3).add(1)
                let a = player.a.points.add(1).log(5).add(1)
                let l = player.a.light.add(1).log(10).add(1)
                return p.add(v).add(d).add(m).add(c).add(a).add(l)
            }
        },
        21: {
            title: "Dreamension",
            description: () => {return "Unlock a new row of upgrades for Dreamension."},
            cost: new Decimal(100)
        },
        22: {
            title: "Dreeaaaamss",
            description: () => {return "The Dreamension formula is improved."},
            cost: new Decimal(120)
        },
        23: {
            title: "Infinity",
            description: () => {
                return "Light Production is boosted by ×" + format(upgradeEffect('a',23)) + ", based on points."
            },
            cost: new Decimal(125),
            effect() {
                let x = player.points.add(1).log(3).pow(0.5).add(1)
                return x
            }
        },
        24: {
            title: "Eternity",
            description: () => {
                return "Point gain is boosted by ×" + format(upgradeEffect('a',24)) + ", based on void points."
            },
            cost: new Decimal(150),
            effect() {
                let x = player.p.points.add(1).log(1.01).pow(1.2).add(1)
                return x
            }
        },
        25: {
            title: "Last Void",
            description: () => {
                return "Unlock 2 new rows of void upgrades."
            },
            cost: new Decimal(200)
        }
    },
    branches: ['c'],
    milestones: {
        0: {
            requirementDescription: "1 light point",
            effectDescription: "Keep Dark Void milestones, challenges and THE VOID ENGINE's levels.",
            done() {
                return player.a.points.gte(1)
            }
        },
        1: {
            requirementDescription: "2 light points",
            effectDescription: "Auto-buy void cores, and those reset nothing.",
            done() {
                return player.a.points.gte(2)
            }
        },
        2: {
            requirementDescription: "4 light points",
            effectDescription: "Keep void core upgrades.",
            done() {
                return player.a.points.gte(4)
            }
        },
    },
    effect() {
        let x = player.a.points.add(1).log(8).mul(player.m.points.pow(0.75).log(3).pow(0.5)).add(1)
        if (hasUpgrade('p',32)) x = x.pow(1.5)
        let y = player.a.points.add(1).log(2).mul(player.points.pow(0.21).log(3).pow(0.61)).add(1)
        if (hasUpgrade('p',32)) y = y.pow(1.52)
        let z = player.a.light.add(1).log(2).pow(0.8).add(1)
        if (hasUpgrade('p',35)) z = z.mul(upgradeEffect('p',35))
        return {
            x: x,
            y: y,
            z: z
        }
    },
    displayProd() {
        let x = new Decimal(0)
        if (hasUpgrade('a',12)) x = x.add(1)
        if (hasUpgrade('a',23)) x = x.mul(upgradeEffect('a',23))
        return x
    },
    effectDescription:() => {return" which is boosting void core softcap limit by ×" + format(tmp.a.effect.x) + " and boosts void point gain by ×" + format(tmp.a.effect.y) + "."},
    tabFormat: [
        "main-display",
        "blank",
        "prestige-button",
        "blank",
        "resource-display",
        "blank",
        function() {
            if (hasUpgrade('a',12)) return ["display-text", "You have " + format(player.a.light) + " light.<br>You are earning " + format(tmp.a.displayProd) + "/s, and it's boosting void point gain by ×"+ format(tmp.a.effect.z) +"."]},
        "blank",
        "milestones",
        "blank",
        "upgrades",
        "blank",
    ],    
    componentStyles: {
        "clickable"() { return {'height': '200px', 'width': '200px'} },
    },
    symbol: "AL",
    update(diff) {
        let x = new Decimal(1)
        if (hasUpgrade('a',23)) x = x.mul(upgradeEffect('a',23))
        if (hasUpgrade('a',12))player.a.light = player.a.light.add(x.times(diff))
    }
})


addLayer("s", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
        best: new Decimal(0),
        total: new Decimal(0)
    }},

    color: "#41B975",                       // The color for this layer, which affects many elements.
    resource: "true dream point(s)",            // The name of this layer's main prestige resource.
    row: 1,                                 // The row this layer is on (0 is the first row).
    symbol: "💤²",
    tooltip: "Dreamension II",

    baseResource: "dream points",           // The name of the resource your prestige gain is based on.
    baseAmount() { return player.d.points },  // A function to return the current amount of baseResource.

    requires: new Decimal("1e27"),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.5,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },
    branches:['d'],

    layerShown() { return hasUpgrade('d',34) },          // Returns a bool for if this layer's node should be visible in the tree.

    upgrades: {
        11: {
            title: "Disintegrate",
            description: "e100 multiplier to point gain.",
            cost: new Decimal(1)
        }
    },
})


addLayer("t", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
        best: new Decimal(0),
        total: new Decimal(0)
    }},

    color: "#c94d34",                       // The color for this layer, which affects many elements.
    resource: "truth point(s)",                       // The name of this layer's main prestige resource.
    row: "side",                                 // The row this layer is on (0 is the first row).

    baseResource: "void points",                  // The name of the resource your prestige gain is based on.
    baseAmount() { return player.p.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(1e30),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "static",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.5,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() { return hasUpgrade('p',45) && !player.s.unlocked },          // Returns a bool for if this layer's node should be visible in the tree.

    upgrades: {
        // Look in the upgrades docs to see what goes here!
    },
    branches: ['p'],
    clickables: {
        11: {
            title: "Open the Portal",
            display() {
                if (player.m.unlocked) return "Does... something? You won't be able to come back if you proceed, though.<br><br><b>Lore'th</b><br>It seems your journey has come to an end. You've gone through every zone that is possible to be seen, and you ended up here. You are about to reveal the truth behind why you're here, and how. You're about to find out if all this was real or just a 'dream'. Once you step up this portal, there is no coming back, and you'll end up in far away from this one."
                else return "Does... something? You won't be able to come back if you proceed, though.<br><br><br><br><br><br><br><br><br>"
            },
            canClick() {return player.t.unlocked},
            onClick() {
                player.hasEnding1 = true
            }
        }
    },
    componentStyles: {
        "clickable"() { return {'height': '300px', 'width': '300px'} },
    },
})