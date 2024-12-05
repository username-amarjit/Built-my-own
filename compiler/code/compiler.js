// toeknizer

function tokenizer(input_code) {
    let cursor = 0;
    let tokens = [];

    while (cursor < input_code.length) {
        char = input_code[cursor];

        if (char === "(" || char === ")") {
            tokens.push({
                type: "paren",
                value: char,
            });
            cursor++;
            continue;
        }
        let NUMS = /[0-9]/;
        if (NUMS.test(char)) {
            let word = "";

            while (NUMS.test(char)) {
                word += char;
                char = input_code[++cursor];
            }
            tokens.push({
                type: "number",
                value: word,
            });
            continue;
        }
        let LETTERS = /[a-z]/i;
        if (LETTERS.test(char)) {
            let word = "";
            while (LETTERS.test(char)) {
                word += char;
                char = input_code[++cursor];
            }
            tokens.push({
                type: "callExpression",
                value: word,
            });
            continue;
        }
        if (char === '"') {
            let LETTERS = /[a-z]/i;
            let word = "";
            char = input_code[++cursor];
            while (LETTERS.test(char)) {
                word += char;
                char = input_code[++cursor];
            }
            cursor++
            tokens.push({
                type: "string",
                value: word,
            });
            continue;
        }
        cursor++
    }

    return tokens;
}

const { type } = require("os");
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question("Enter something: ", async (input) => {
    const out = tokenizer(input)
    console.log(out)
    const out2 = parser(out)
    console.log(out2.body[0].params)

    rl.close();
});


// function parser(tokens) {

//     let cursor = 0;

//     let token = tokens[cursor]

//     function walk() {
//         if (token.type == 'number') {
//             cursor++
//             return {
//                 type: "numberLiteral",
//                 value: token.value
//             }
//         }

//         if (token.type == 'string') {
//             cursor++
//             return {
//                 type: "stringLiteral",
//                 value: token.value
//             }
//         }
//         if (token.type === 'paren' &&
//             token.value === '(') {
//             token = tokens[++cursor]

//             let node = {
//                 type: "CallExpression",
//                 value: token.value,
//                 parmas: []
//             }
//             token = tokens[++cursor]

//             while (token.type !== 'paren' || (token.type === 'paren' &&
//                 token.value !== ')')) {
//                 node.parmas.push(walk())
//                 token = tokens[++cursor]
//             }

//             cursor++
//             return node

//         }

//         throw new TypeError("Unknown token type: " + token.type); // Handling unknown tokens

//     }

//     let ast = {
//         type: "Program",
//         body: []
//     }

//     while (cursor < tokens.length) {
//         ast.body.push(walk())
//     }


// return ast
// }

function parser(tokens) {
    let cursor = 0;
    let token = tokens[cursor];

    function walk() {
        if (token.type === 'number') {
            cursor++;
            token = tokens[cursor];
            return {
                type: "NumberLiteral",
                value: token.value
            };
        }

        if (token.type === 'string') {
            cursor++;
            token = tokens[cursor];
            return {
                type: "StringLiteral",
                value: token.value
            };
        }

        if (token.type === 'paren' && token.value === '(') {
            cursor++;
            token = tokens[cursor];

            let node = {
                type: "CallExpression",
                name: token.value, // Call function name is usually in the next token
                params: []
            };

            cursor++;
            token = tokens[cursor];

            while (token.type !== 'paren' || (token.type === 'paren' && token.value !== ')')) {
                node.params.push(walk());
                token = tokens[cursor];
            }

            cursor++;
            token = tokens[cursor];
            return node;
        }

        throw new TypeError("Unknown token type: " + token.type); // Handling unknown tokens
    }

    let ast = {
        type: "Program",
        body: []
    };

    while (cursor < tokens.length) {
        ast.body.push(walk());
    }

    return ast;
}


function traverser(ast,visiter){
    function traverseArray(array,parent){
        array.forEach(child => {
            traverseNode(child,parent)
        });
    }
    function traverseNode(node,parent){
        
        let methods = visiter[node.type]

        if (methods && methods.enter){
            methods.enter(node,parent)
        }
        
        if (node.type == 'CallExpression'){
            traverseArray(node.params,node)
        }
        else if (node.type == 'Program'){
            traverseArray(node.body,node)
        }
        else if (node.type == 'NumberLiteral' || node.type == 'StringLiteral' ){
        }
        else{
            throw new TypeError(node.type)
        }
        if (methods && methods.exit){
            methods.exit(node,parent)
        }
    }

    traverseNode(ast,null)

}