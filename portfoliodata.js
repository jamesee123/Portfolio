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
                "filename": "bfinterpreter/",
                "type": "download",
                "name": "An interpreter for the esolang brainfuck.",
                "desc": "hello."
            }
        ]
    }
];