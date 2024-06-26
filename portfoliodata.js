/*
Expected Format:
"date": "",
"filename": "",
"name": "",
"desc": "",
"el_type": "",
"src_attr": ""
*/

let catagories = [
    {
        "displayName": "My Music",
        "name": "music",
        "desc": "Cool people love songs. These are mine.",
        "default_name": "Unnamed Song",
        "type": "mp3",
        "files" : [
            {
                "filename": "0.mp3",
            },
            {
                "filename": "1.mp3"
            },
            {
                "filename": "2.mp3"
            },
            {
                "filename": "3.mp3"
            },
            {
                "filename": "4.mp3"
            },
            {
                "filename": "8.mp3",
                "name": "Testing",
                "desc": "I think I'll leave this up here to mark the start of the development of my portfolio.",
                "date": new Date(2022, 5, 10)
            },
            {
                "filename": "5.mp3",
                "name": "Pigstep",
                "desc": "Pigstep transcribed on musescore."
            },
            {
                "filename": "6.mp3"
            },
            {
                "filename": "7.mp3"
            },
            {
                "filename": "8.mp3"
            }
        ]
    },
    {
        "displayName" : "My Programs",
        "name" : "programming",
        "desc" : "Cool people love programming. yes",
        "default_name" : "Unnamed Program",
        "type" : "html",
        "files" : [
            {
                "filename": "kermitscoming.py",
                "type": "download",
                "name": "Kermit The Frog Choose Your Own Adventure Horror Game",
                "desc": "The title says it all. But like the code is neat and expandable and cool."
            },
            {
                "filename": "bfinterpreter.zip",
                "type": "download",
                "name": "An interpreter for the esolang brainfuck.",
                "desc": "hello."
            },
            {
                "filename": "spiral.py",
                "type": "download",
                "name": "A math spiral generator thing with polar coordinates i guess inspired by a 3b1b video i think",
                "desc": "oops, i described everything above"
            },
            {
                "filename": "pongmachinelearning.zip",
                "type": "download",
                "name": "Pong machine learning NEAT thing",
                "desc": "My coding instructor coded 90% of this. <br>Warning! Buggy code ahead <a href = 'hostWebsites/pongmachinelearning/index.html'>Open Here</a>"
            },
            {
                "filename": "abstractArtGen.zip",
                "name": "An abstract art circler",
                "desc": "yes. <a href = 'hostWebsites/abstractArtGenerator/index.html'>Open Here</a>",
                "type": "download"
            },
            {
                "filename": "blackjack.py",
                "name": "Blackjack optimal play graph",
                "desc": "yes.",
                "type": "download"
            },
            {
                "filename": "russian_roulette.py",
                "name": "Russian Roulette Program",
                "desc": "(it has a 1/6 chance of deleting your files. ACTUALLY DANGEROUS. Works in vscode or some other terminals, but not in some IDE's)",
                "type": "download"
            },
            {
                "filename": "nodeGraphs.zip",
                "name": "Node Graph GPU cool",
                "desc": "it does the gpu node graph. <a href = 'hostWebsites/nodeGraphs/index.html'>Open Here</a>",
                "type": "download",
                "date": new Date(2024, 6, 25)
            }
        ]
    }
];