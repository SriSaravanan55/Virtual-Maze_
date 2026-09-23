function getStudents() {
let data = localStorage.getItem("students");
if (data === null) {
    return [];
}
return JSON.parse(data);
}
function saveStudents(students) {
localStorage.setItem("students",JSON.stringify(students));
}

let studentForm =document.getElementById("student-form");
if (studentForm) {
studentForm.addEventListener("submit",function(event) {
        event.preventDefault();
        let students =getStudents();
       
        let name =document.getElementById("studentName").value.trim();
        let email = document.getElementById("email").value.trim();
        let department=document.getElementById("department").value;
        let age =Number(document.getElementById("age").value);
        let tamil =Number(document.getElementById("tamil").value);
        let english =Number( document.getElementById("english").value);
        let maths =Number(document.getElementById("maths").value);
        let science =Number(document.getElementById("science").value);
        let social =Number(document.getElementById("social").value);
        let id = 1;

/*Validation*/
     let validname=/^[A-Za-z ]+$/;
     let validmail=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if(!validname.test(name)){
        alert("Student Name Should only Contains Characters");
        return ;
      }
      if(!validmail.test(email)){
        alert("please provide an valid Email Id");
        return;
      }
      if(department===""){
        alert("Select an Department");
        return;
      }
      if(age<18 && age>30) {
        alert("Student Age should between 18 to 30");
        return;
      }
      let marks=[tamil,english,maths,science,social];
      for(let m of marks){
        if(m<0 && m>100){
            alert("mark should between 0 to 100");
            return;
        }
      }
        students=getStudents();

        if (students.length > 0) {
            id = Math.max(...students.map( student => student.id)) + 1;
        }
        let student = {
            id: id,
            name: name,
            email: email,
            age: age,
            department:department,
            marks: {
                tamil: tamil,
                english: english,
                maths: maths,
                science: science,
                social: social
            }
        };
        students.push(student);

        saveStudents(students);
        alert( "Student added successfully!");
        location.reload();
    }
);
}

function calculateAverage(student) {
let marks = student.marks;
let total =marks.tamil +marks.english +marks.maths +marks.science +marks.social;
return total / 5;
}

function loadDashboard() {
let students = getStudents();
let totalElement =document.getElementById("total-students-value");
let averageElement =document.getElementById( "average-mark-value" );
let highestElement =document.getElementById( "highest-mark-value" );
let lowestElement =document.getElementById("lowest-mark-value");
if (!totalElement) {
    return;
}
totalElement.textContent =students.length;
/* No students */

if (students.length === 0) {
    averageElement.textContent = "0";
    highestElement.textContent = "0";
    lowestElement.textContent = "0";
    return;
}

let averages =students.map(function(student) {
              return calculateAverage(student);
        }
    );

///  OVERALL AVERAGE

let total = 0;
for (let i = 0;i < averages.length;i++) {
    total += averages[i];
  }
let overallAverage =total / averages.length;
averageElement.textContent =overallAverage.toFixed(0);
let highest =Math.max(...averages);
highestElement.textContent =highest.toFixed(0);

  /// LOWEST

let lowest =Math.min(...averages);
lowestElement.textContent =lowest.toFixed(0);
 }

/* Run dashboard */
loadDashboard();
///DASHBOARD BUTTONS

let btn1 =document.getElementById("btn1");
if (btn1) {
btn1.addEventListener("click",function() {
     window.location.href ="studentlist.html";
    }
);

}

let btn2 =document.getElementById("btn2");

if (btn2) {
btn2.addEventListener("click",function() {
        window.location.href = "searchstudent.html";
    }
);
}

let btn3 =document.getElementById("btn3");
if (btn3) {btn3.addEventListener( "click",function() {
        window.location.href ="addstudent.html";
    }
);
}


function loadStudentList() {
let tableBody =document.getElementById( "student-table-body" );
if (!tableBody) {
    return;
}
let students =getStudents();
tableBody.innerHTML = "";

/* No students */
if (students.length === 0) {
    tableBody.innerHTML = `
        <tr><td colspan="14"> No students available.</td>
        </tr>`;
    return;
}


students.forEach(function(student) {
        let average =calculateAverage(student);
        let grade=Studentgrade(student);
        let row =document.createElement("tr");
        row.innerHTML = `
            <td> ${student.id}</td>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.age}</td>
            <td> ${student.department}</td>
            <td> ${student.marks.tamil}</td>
            <td>${student.marks.english}</td>
            <td>${student.marks.maths}</td>
            <td> ${student.marks.science}</td>
            <td>${student.marks.social}</td>
            <td> ${average.toFixed(0)}</td>
            <td> ${grade}</td>
            <td><button class="delete-button" onclick="deleteStudent(${student.id})"> Delete </button>
            </td>`;
        tableBody.appendChild(row);
    }
);
}
loadStudentList();
function Studentgrade(student){
   let average=calculateAverage(student);
   if(average>=90) return "O";
   else if(average >80 && average<90) return "A+";
   else if(average >70 && average<=80) return "A";
   else if(average >60 && average<=70) return "B+";
   else if(average >50 && average<=60) return "B";
   else return "RE";
}

function deleteStudent(id) {
let students =getStudents();
let confirmDelete =confirm( "Are you sure you want to delete this student?");
if (!confirmDelete) {
    return;
}
let updatedStudents =students.filter(function(student) {
            return student.id !== id
        }
    );

saveStudents(updatedStudents);
popup("Student deleted successfully!");
location.reload();
}


let searchButton =document.getElementById("search-button");
if (searchButton) {
    searchButton.addEventListener("click",searchStudent);
}


function searchStudent() {
let searchInput = document.getElementById("search-input");
let result =document.getElementById("search-result");
let searchValue =searchInput.value.trim().toLowerCase();
let students =getStudents();
result.innerHTML = "";
/* Empty search */
if (searchValue === "") {result.innerHTML ="<h2>Please enter a student name.</h2>";
    return;
}
let foundStudents =students.filter(function(student) {
            return student.name.toLowerCase().includes(searchValue);
        }
    );
/* No result */
if (foundStudents.length === 0) {
    result.innerHTML ="<h2>No student found.</h2>";
    return;
}

foundStudents.forEach(function(student) {
        let average =calculateAverage(student);
        result.innerHTML +=`
        <div class="result-card">
                <h2>${student.name}</h2>
                <p><strong>ID:</strong>${student.id}</p>
                <p><strong>Email:</strong> ${student.email}</p>
                <p> <strong>Age:</strong>${student.age}</p>
                <p><strong>Gender:</strong>${student.department}</p>
                <hr>
                <p><strong>Tamil:</strong>${student.marks.tamil}</p>
                <p><strong>English:</strong>${student.marks.english}</p>
                <p><strong>Maths:</strong>${student.marks.maths}</p>
                <p><strong>Science:</strong>${student.marks.science}
                </p>
                <p><strong>Social Science:</strong>${student.marks.social}</p>
                <p><strong>Average:</strong>${average.toFixed(0)}</p>
            </div> ` ;
         });
    }
