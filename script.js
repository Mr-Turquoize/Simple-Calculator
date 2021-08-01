
// Result Area and key selectors

[resultArea, ...allKeys] = document.querySelectorAll('.area');
// console.log(resultArea, allKeys);


//Event Listeners - for any key pressed
allKeys.forEach(element => element.addEventListener('click', operate)); 

var operatorCount = 0;                            //No operator (99 -> typed in keypad)

function operate(e){
    let keyValue = e.target.textContent;         //Value inside pressed key eg - 9,8,C,0,-,1
    showCalculation(keyValue, false);                   //Shows live calculation in the result Area
    doCalculation(e);    
    // console.log(keyValue);
}



function showCalculation(text, result){
    //Function of showCalculation is to show a pair of operands and an operator ( x + y ) or result (z) or clear ('')
    
    // console.log(resultArea.textContent, result)

    if (result) {
        lastOperator =  resultArea.textContent.slice(-1);                                           //Assignment: To show expression -> Runs only when an expression is evaluated.
        resultArea.textContent = `${text}${lastOperator}`;
    }                                                     
    else{       

        if (text == '@'){resultArea.textContent = resultArea.textContent.slice(0,-1)}               //Deletes: Last pressed key  = Backspace     

        else if (text =='C'){
            OperatorCount = 0;
            resultArea.textContent = ''
        }                                                                                           //Clears: Area 
        else if (text == '='){        
            operatorCount = 0;        
            resultArea.textContent = calculate(resultArea.textContent);
        }                                                                                           //Deletes: Last pressed key  = Backspace     
        else {resultArea.textContent += text};                                                      // Appends: Last typed key
    }
}


function doCalculation(e){

    //Function of doCalculation detects typing of operators; as soon as two operators are typed it calculates the last expression and shows the result.
    //Eg; 5+9 -> nothing happens , that is count = 1
    // when 2nd operators appears , count =1 and if block fires , which calculates last expression and shows calculation.
    // That is Evaluate(5+9) + 8 -> 14+8 and repeat if another operator is typed -> Evaluate(14+8)-40

    let key = e.target.classList;                                        // Note '= operator' does not have a class of operator , bcz we evaluate on = and count becomes 0, else errors arise

    if (Array.from(key).includes('operator')){                       //count = 0 -> No operator (5)
        operatorCount++;                                             //count = 1 -> (5+9): 1 operator is typed
        // console.log(operatorCount)                                                   
        if (operatorCount==2){                                              
            expression = resultArea.textContent.slice(0,-1);        //expression = (5+9 +) -> count = 2 means 2 operators present, evaluation of (5+9) is triggered.
            calculated = calculate(expression)                      // Expression = (5+9),  full string was 5+9+ -> last operand is removed and 14 is the result on calculation.
            showCalculation(calculated, true)
            operatorCount = 1;                                      // 1 operator present (14+)
        }
    }
}


function calculate(expression){
    // console.log(`Expression : ${expression}`)

    if (expression.match(/\/0/g)){return 'LoL'}                   // Divide by zero case
    if (!(expression.match(/[+-X/]/g))){return 'ERROR'}           //Error if no operand Eg (9======)
    
    let operator = expression.match(/[+\-X/]/g)[0];               //Finds the operand
    let operands = expression.split(/[+\-X/]/g);                  //Splits on operand
    
    a = Number(operands[0]);
    b = Number(operands[1]);

    if (operator=='+'){return a+b}
    else if (operator=='-'){return a-b}
    else if (operator=='X'){return a*b}
    else {return (a/b).toFixed(3)};

}

