// toeknizer

function tokenizer(input_code) {
    let cursor = 0;
    let tokens = [];

    while (cursor<input_code.length) {
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
                type: "String",
                value: word,
            });
            continue;
        }
        cursor++
    }

    return tokens;
}

const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question("Enter something: ", (input) => {
    const out = tokenizer(input)
    console.log(out)

    rl.close();
});
