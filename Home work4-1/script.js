var textEl = document.getElementById('text');
var choicebtnsEl = document.getElementById('choicebtns');



let state = {}

function startquiz(){
    state ={ };
    showTextNode(1);
};

function showTextNode(textNodeIndex){
    var textNode = textNodes.find(textNode => textNode.id===textNodeIndex)
    textEl.innerText = textNode.text
};

function selectOption(choices){

}

var textNodes = [
    {
    id: 1,
    text: "Commonly used data types DO NOT include:",
    options: [
        {
            text: "strings",
            nextText: 2
        },
        {
           text: "alerts",
           setState: {alerts: true},
           nextText: 2
        }
    ]
    },
    {
        id:2
    }
]


startquiz();