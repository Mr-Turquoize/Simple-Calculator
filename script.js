// No eval Function Used, String Manipulation, Control Flow Understanding

// Result Area and key selectors
[resultArea, ...allKeys] = document.querySelectorAll('.area');
log = document.querySelector('.append');
// console.log(resultArea, allKeys);

//Event Listeners - for any key pressed or typed
allKeys.forEach(element => element.addEventListener('click', e => operate(e, false)));       //Clicking
document.querySelector('body').addEventListener('keydown', e => operate(false, e.key));      //Typing

var operatorCount = 0;                                                            //No operator (99 -> typed in keypad)
var proceed = [true];                                                             //Used to confirm if operators are chained or not. Eg (5+-)


function cleanArea() {
    resultArea.textContent = '';
    operatorCount = 0;
}

function appendResult(text){
    lastOperator = resultArea.textContent.slice(-1);                              //Evalueates answer and appends the second operator, now operatorCount = 1;
    answer =  `${text}${lastOperator}`;
    resultArea.textContent = answer;
    operatorCount = 1;                                                            // 1 operator present (14+)
}

function operationLogging(text){
    if (log.textContent.length > 15){log.textContent = '' };                      //Clear Log when reaches 20 words limit and and operator is used.
    if(text=='Backspace' || text == 'Enter'){log.textContent+=''}                 //Do not log backspace and enter
    else if (text =='C') {log.textContent = ''}
    else if(text == '@'){log.textContent= log.textContent.slice(0,-1)}
    else{log.textContent+=text};
}


function operate(e, pressed) {
    if (resultArea.textContent.length>26){resultArea.textContent = ''};             //Prevent overfill
    
    // console.log(`Clicked : ${e}, Pressed : ${pressed}`);
 
    if (pressed){
        let allowed = ['Backspace','Enter','+','-','*','/','='];
        if (allowed.includes(pressed) || pressed.match(/\d/g)){value = pressed};
    }
    else{
        value = e.target.textContent;
    }
    type = value.match(/[+\-*/]/g);  
    showCalculation(value);                                                         //Shows live calculation in the result Area
    operationLogging(value);                                                         //Updates operation log at the top of the result
    doCalculation(type); 
}

function showCalculation(text) {
    //Function of showCalculation is to show a pair of operands and an operator ( x + y ) or result (z) or clear ('')
   
    if (text == '@' || text == 'Backspace') {                                        //Deletes: Last pressed key  = Backspace     
        lastKey = resultArea.textContent.slice(-1);                                  //If last pressed key was an operator, reduce operatorCount by 1
        resultArea.textContent = resultArea.textContent.slice(0, -1);                       
    }

    else if (text == 'C') { cleanArea()}                                                                                         //Clears: Area 
    else if (text == '=' || text == 'Enter') {
        operatorCount = 0;
        resultArea.textContent = calculate(resultArea.textContent);
    }
    else { resultArea.textContent += text };                                        // Appends: Last typed key
   
}


function doCalculation(value) {
    //Function of doCalculation detects typing of operators; as soon as two operators are typed it calculates the last expression and shows the result.
    //Eg; 5+9 -> nothing happens , that is count = 1
    // when 2nd operators appears , count =2 , which calculates last expression and shows calculation.
    // That is Evaluate(5+9) + 8 -> 14+8 and repeat if another operator is typed -> Evaluate(14+8)-40

    //IF type = false, its a number else its an operator

    // Checks if last value was an operator or not, if repeated operators : dont run evaluation on it.

    if (proceed.pop() && value) {
        run = false;                                                                //'Repeated Operator'
        proceed.push(true);                                                         //reset initial array
        resultArea.textContent = resultArea.textContent.slice(0, -1);               //Deletes: Last pressed key, if operators are repeated    
    }
    
    else {
        run = true;
        proceed.push(value);                                                        //Updates last value in array
    };


    if (run && value) {                                                             //count = 0 -> No operator (5)
        operatorCount++;                                                            //count = 1 -> (5+9): 1 operator is typed                                                  
        if (operatorCount == 2) {
            expression = resultArea.textContent.slice(0, -1);                       //expression = (5+9 +) -> count = 2 means 2 operators present, evaluation of (5+9) is triggered.
            calculated = calculate(expression);                                     // Expression = (5+9),  full string was 5+9+ -> last operand is removed and 14 is the result on calculation.
            appendResult(calculated);
            
        }
    }
}



function calculate(expression) {
    // console.log(`Expression : ${expression}`);

    // Odd Cases
    let divideByZero = expression.match(/\/0/g);
    let zeroBySomething = expression.match(/0\//g);

    if (divideByZero) { return 'LoL';}
    if (zeroBySomething) {return '0';}
    if (expression.match(/[+\-*/]/g)) {0};

    let operator = expression.match(/[+\-*/]/g)[0];               //Finds the operand
    let operands = expression.split(/[+\-*/]/g);                  //Splits on operand
    
    // console.log(`Operator : ${operands}, Operands : ${operator}`);

    a = Number(operands[0]);
    b = Number(operands[1]);

    if (operator == '+') { return a + b }
    else if (operator == '-') { return a - b }
    else if (operator == '*') { return a * b }
    else { return (a / b).toFixed(2)};
}
