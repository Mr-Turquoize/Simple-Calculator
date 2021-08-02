// Result Area and key selectors
[resultArea, ...allKeys] = document.querySelectorAll('.area');
log = document.querySelector('.append');
// console.log(resultArea, allKeys);

//Event Listeners - for any key pressed
allKeys.forEach(element => element.addEventListener('click', operate));


var operatorCount = 0;                             //No operator (99 -> typed in keypad)
var proceed = [true];                              //Used to confirm if operators are chained or not. Eg (5+-)


function operate(e) {
    if (resultArea.textContent.length>26){
        resultArea.textContent = '';               //Prevent overfill
    }

    let keyPressed = e.target.textContent;         //Value inside pressed key eg - 9,8,C,0,-,1
    showCalculation(keyPressed, false);            //Shows live calculation in the result Area
    doCalculation(e);                              // Recognizes when to do calculation and calculates, for us it is when operator count reaches 2.Eg (5+9+)
    operationLogging(keyPressed)
    // console.log(e);
}

function cleanArea() {
    resultArea.textContent = '';
    operatorCount = 0;
}

function appendResult(text){
    lastOperator = resultArea.textContent.slice(-1);         //Evalueates answer and appends the second operator, now operatorCount = 1;
    answer =  `${text}${lastOperator}`;
    resultArea.textContent = answer;
    operatorCount = 1;                                       // 1 operator present (14+)
    // log.textContent+=answer;
}

function operationLogging(text){
    if (log.textContent.length>20){log.textContent = '' };   //Clear Log when reaches 20 words limit and and operator is used.
    if (text =='C') {log.textContent = ''}
    else if(text == '@'){log.textContent= log.textContent.slice(0,-1)}
    else{log.textContent+=text};
}

function showCalculation(text) {
    //Function of showCalculation is to show a pair of operands and an operator ( x + y ) or result (z) or clear ('')
    // console.log(resultArea.textContent)

    if (text == '@') {                                                                       //Deletes: Last pressed key  = Backspace     
        lastKey = resultArea.textContent.slice(-1);
        if (!(lastKey.match(/\d/g))) {
            operatorCount--;                                                                //If last pressed key was an operator, reduce operatorCount by 1.
            // console.log('changing operatorcount', lastKey)
        }
        resultArea.textContent = resultArea.textContent.slice(0, -1);                       
    }

    else if (text == 'C') { cleanArea()}                                                                                         //Clears: Area 
    else if (text == '=') {
        operatorCount = 0;
        resultArea.textContent = calculate(resultArea.textContent);
    }
    else { resultArea.textContent += text };                                                // Appends: Last typed key
   
}


function doCalculation(e) {

    //Function of doCalculation detects typing of operators; as soon as two operators are typed it calculates the last expression and shows the result.
    //Eg; 5+9 -> nothing happens , that is count = 1
    // when 2nd operators appears , count =1 and if block fires , which calculates last expression and shows calculation.
    // That is Evaluate(5+9) + 8 -> 14+8 and repeat if another operator is typed -> Evaluate(14+8)-40


    let key = e.target.classList;                                                          // Note '= operator' does not have a class of operator , bcz we evaluate on = and count becomes 0, else errors arise
    let value = Array.from(key).includes('operator') ? true : false;                      //count = 0 -> No operator (5)   
    console.log(`Value : ${value}, Proceed ${proceed}`)


    // Checks if last key was an operator or not, if repeated operators : dont run evaluation.
    if (proceed.pop() && value) {
        run = false;                                                                //'Repeated Operator'
        proceed.push(true);                                                         //reset initial array
        resultArea.textContent = resultArea.textContent.slice(0, -1);               //Deletes: Last pressed key, if operators are repeated    
    }else {
        run = true;
        proceed.push(value);     //Updates last value in array
    };


    if (run && Array.from(key).includes('operator')) {                //count = 0 -> No operator (5)

        operatorCount++;                                              //count = 1 -> (5+9): 1 operator is typed
        // console.log(operatorCount)                                                   
        if (operatorCount == 2) {
            expression = resultArea.textContent.slice(0, -1);         //expression = (5+9 +) -> count = 2 means 2 operators present, evaluation of (5+9) is triggered.
            calculated = calculate(expression);                       // Expression = (5+9),  full string was 5+9+ -> last operand is removed and 14 is the result on calculation.
            appendResult(calculated);
            
        }
    }
}



function calculate(expression) {
    // console.log(`Expression : ${expression}`)

    // Odd Cases
    let divideByZero = expression.match(/\/0/g);
    let zeroBySomething = expression.match(/0\//g);

    if (divideByZero) { return 'LoL';}
    if (zeroBySomething) {return '0';}

    let operator = expression.match(/[+\-X/]/g)[0];               //Finds the operand
    let operands = expression.split(/[+\-X/]/g);                  //Splits on operand
    
    // console.log(`Operator : ${operands}, Operands : ${operator}`);

    a = Number(operands[0]);
    b = Number(operands[1]);

    if (operator == '+') { return a + b }
    else if (operator == '-') { return a - b }
    else if (operator == 'X') { return a * b }
    else { return (a / b).toFixed(2) };

}

