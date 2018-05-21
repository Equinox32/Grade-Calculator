// Define number of sections that the application starts with. This is used to assign each section a number so the 'Add Grade' button knows where to add another entry 
let numSec = 0;

// Create four sections for grades
document.addEventListener('DOMContentLoaded', getSects);
function getSects(){
    addSection();addSection();addSection();addSection();
}

// This function adds a new grade row to the section column
function addGrade(secNum){
    // Create the label for the input field
    const label = document.createElement('label');
    label.htmlFor = 'assign-name';
    label.appendChild(document.createTextNode('Grade:'));

    // Create the input field and append it inside of the label
    const input = document.createElement('input');
    input.type = 'number';
    input.className = 'card-text input-sm form-control';
    input.id = 'assign-name';
    input.min = 0;
    label.appendChild(input);
    
    // Create the list element and append label inside of it
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.appendChild(label);

    // Create the delete icon and link and then append it inside of the link
    const link = document.createElement('a');
    link.className = 'delete-item secondary-content';
    link.addEventListener('click', removeGrade);
    const i = document.createElement('i');
    i.className = 'fa fa-remove';
    link.appendChild(i);

    // Append the link to the list element
    li.appendChild(link);

    // Find the bottom of the grade list column
    let col = document.getElementById(secNum.toString());
    col = col.querySelector('ul.grades');
    
    // Finally append the complete list element to the bottom of the section
    col.appendChild(li);
}

function addSection(){
    // Create an HTML DOM parser
    let parser = new DOMParser();

    // This is the entire element that creates a section
    let domString = '<div class="col-xs-3" id="1"> <div class="card"><a class="delete-item secondary-content"> <i class="fa fa-remove removeSect"></i></a> <div class="form-group"> <ul class="list-group list-group-flush"> <li class="list-group-item"> <label for="sec-nm">Section Name: <input type="text" class="card-title input-sm form-control" id="sec-nm"> </label> <label for="sec-per">Section Percentage (%): <input type="number" class="card-title input-sm form-control sectPer" id="sec-per" min="0" max="100"> </label> </li> </ul> <ul class="list-group list-group-flush grades" id="grades"> <li class="list-group-item"> <label for="assign-grade"> Grade: <input type="number" class="card-text input-sm form-control" id="assign-grade"> </label> <a class="delete-item secondary-content"> <i class="fa fa-remove"></i></a> </li> <li class="list-group-item"> <label for="assign-grade"> Grade: <input type="number" class="card-text input-sm form-control" id="assign-grade"> </label> <a class="delete-item secondary-content"> <i class="fa fa-remove"></i></a> </li> </ul> </div> <button type="button" class="btn btn-primary addGrade" onclick="addGrade('+ (numSec+1) +')">Add Grade</button> </div> </div>';

    // Create section DOM from domString
    let section = parser.parseFromString(domString, 'text/html').body.firstChild; 
    section.id = numSec+1; //sets the section id by +1. This is legacy code, but it could be useful to be able to find a specific section column
    numSec += 1; //increment number of Sections
    
    // Add event listeners to remove the grade 
    section.querySelectorAll('a.delete-item').forEach( (e) =>{
        e.addEventListener('click', removeGrade);
    });
    
    // Get card-deck div, which is the element before each section and insert our created section
    const card_deck = document.querySelector('div.card-deck');
    card_deck.insertBefore(section, card_deck.children[0]);
}

function removeGrade(e){
    if(e.target.parentElement.classList.contains('delete-item')) {
        if(confirm('Are You Sure?')) {
            if (e.target.classList.contains('removeSect'))
                e.target.parentElement.parentElement.parentElement.remove();
            else
                e.target.parentElement.parentElement.remove();
        }
      }
}

function calcGrade(){
    let cd = document.querySelector('div.card-deck');
    let grades = Array();
    // Loop through all sections
    for (let i = 0; i < cd.childElementCount; i++){
        // Find the section percentage and get a list of all the grades
        let sectPer = cd.children[i].querySelector('input.sectPer').value;
        let gradeList = cd.children[i].querySelector('ul.grades');        
        
        // Calculate the overall grade
        let grade = 0;
        for(let j = 0; j < gradeList.childElementCount; j++){
            // querySelector will not work as only the first input will be grabbed. Avoiding another loop here that querySelectorAll would require
            grade += parseInt(gradeList.children[j].children[0].children[0].value);
        }
        // Take the total of all grades divided by the number of grades, then multiply by the section percentage 
        grade = (grade/gradeList.childElementCount)*(sectPer/100);
        // Add the grade to the grades array for final calculation
        grades.push(grade);
    }
    let finalGrade = 0;
    // Add all items in the grades array to finalGrade
    grades.forEach( (e) => finalGrade+=e );
    // Check if the user is missing a field
    if ( isNaN(finalGrade)){
        document.querySelector('a.finalGrade').innerHTML = 'Missing information';
    }else{
        document.querySelector('a.finalGrade').innerHTML = 'Final Grade: ' + finalGrade;        
    }
}

