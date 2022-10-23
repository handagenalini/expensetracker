// function addNewExpense(e){
//     e.preventDefault();
//     const form = new FormData(e.target);

//     const expenseDetails = {
//         expenseamount: form.get("expenseamount"),
//         description: form.get("description"),
//         category: form.get("category")

//     }
//     const token = localStorage.getItem('token');
//     console.log(expenseDetails)
//     axios.post('http://localhost:3000/addexpense',expenseDetails, { headers: {Authorization: token} }).then((response) => {

//     if(response.status === 201){
//         addNewExpensetoUI(response.data.expense);
//     } else {
//         throw new Error('Failed To create new expense');
//     }

//     }).catch(err => showError(err))

// }

// window.addEventListener('load', ()=> {
//     const token = localStorage.getItem('token');
//     axios.get('http://localhost:3000/getexpenses', { headers: {Authorization: token} }).then(response => {
//         if(response.status === 200){
//             response.data.expenses.forEach(expense => {

//                 addNewExpense(expense);
//             })
//         } else {
//             throw new Error();
//         }
//     })
// });

// function addNewExpensetoUI(expense){
//     const parentElement = document.getElementById('listOfExpenses');
//     const expenseElemId = `expense-${expense.id}`;
//     parentElement.innerHTML += `
//         <li id=${expenseElemId}>
//             ${expense.expenseamount} - ${expense.category} - ${expense.description}
//             <button onclick='deleteExpense(event, ${expense.id})'>
//                 Delete Expense
//             </button>
//         </li>`
// }

// function deleteExpense(e, expenseid) {
//     const token = localStorage.getItem('token');
//     axios.delete(`http://localhost:3000/deleteexpense/${expenseid}`, { headers: {Authorization : token} }).then((response) => {

//     if(response.status === 204){
//             removeExpensefromUI(expenseid);
//         } else {
//             throw new Error('Failed to delete');
//         }
//     }).catch((err => {
//         showError(err);
//     }))
// }

// function showError(err){
//     document.body.innerHTML += `<div style="color:red;"> ${err}</div>`
// }

// function removeExpensefromUI(expenseid){
//     const expenseElemId = `expense-${expenseid}`;
//     document.getElementById(expenseElemId).remove();
// }






const token = localStorage.getItem('token');
function addNewExpense(e){
    e.preventDefault();
    const form = new FormData(e.target);

    const expenseDetails = {
        expenseamount: form.get("expenseamount"),
        description: form.get("description"),
        category: form.get("category")

    }
    console.log(expenseDetails)
    axios.post('http://localhost:3000/addexpense',expenseDetails, { headers: {"Authorization" : token} }).then((response) => {

    if(response.status === 201){
        addNewExpensetoUI(response.data.expense);
    } else {
        throw new Error('Failed To create new expense');
    }

    }).catch(err => showError(err))

}

window.addEventListener('load', ()=> {
    axios.get('http://localhost:3000/getexpenses', { headers: {"Authorization" : token} }).then(response => {
        if(response.status === 200){
            response.data.expenses.forEach(expense => {

                addNewExpense(expense);
            })
        } else {
            throw new Error();
        }
    })
});

function addNewExpensetoUI(expense){
    const parentElement = document.getElementById('listOfExpenses');
    const expenseElemId = `expense-${expense.id}`;
    parentElement.innerHTML += `
        <li id=${expenseElemId}>
            ${expense.expenseamount}-------${expense.category}-------${expense.description}
            <button  onclick='deleteExpense(event, ${expense.id})'>
                Delete Expense
            </button>
        </li>`
}

function deleteExpense(e, expenseid) {
    axios.delete(`http://localhost:3000/deleteexpense/${expenseid}`, { headers: {"Authorization" : token} }).then((response) => {

    if(response.status === 204){
            removeExpensefromUI(expenseid);
        } else {
            throw new Error('Failed to delete');
        }
    }).catch((err => {
        showError(err);
    }))
}

function showError(err){
    document.body.innerHTML += `<div style="color:red;"> ${err}</div>`
}

function removeExpensefromUI(expenseid){
    const expenseElemId = `expense-${expenseid}`;
    document.getElementById(expenseElemId).remove();
}

// let orderbtn=document.getElementById('rzp-button1')
// orderbtn.addEventListener('click',()=>{
//   console.log("axios entering")

function download(){
    console.log('in download frontend')
axios.get('http://localhost:3000/download', { headers: {"Authorization" : token} })
.then((response) => {
    if(response.status === 201){
        //the bcakend is essentially sending a download link
        //  which if we open in browser, the file would download
        var a = document.createElement("a");
        a.href = response.data.fileUrl;
        a.download = 'myexpense.csv';
        a.click();
    } else {
        throw new Error(response.data.message)
    }

})
.catch((err) => {
    showError(err)
});
}


document.getElementById('rzp-button1').onclick = async function (e) {
    console.log('12345')
    const response  = await axios.get('http://localhost:3000/purchase/premiummembership', { headers: {"Authorization" : token} });
    console.log(response);
    var options =
    {
     "key": response.data.rzp_test_giNWR1K5EXXHvF, // Enter the Key ID generated from the Dashboard
     "name": "Test Company",
     "order_id": response.data.order.id, // For one time payment
     "prefill": {
       "name": "Test User",
       "email": "test.user@example.com",
       "contact": "7003442036"
     },
     "theme": {
      "color": "#3399cc"
     },
     // This handler function will handle the success payment
     "handler": function (response) {
         console.log(response);
         axios.post('http://localhost:3000/purchase/updatetransactionstatus',{
             order_id: options.order_id,
             payment_id: response.razorpay_payment_id,
         }, { headers: {"Authorization" : token} }).then(() => {
             alert('You are a Premium User Now')
         }).catch(() => {
             alert('Something went wrong. Try Again!!!')
         })
     },
  };
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on('payment.failed', function (response){
  alert(response.error.code);
  alert(response.error.description);
  alert(response.error.source);
  alert(response.error.step);
  alert(response.error.reason);
  alert(response.error.metadata.order_id);
  alert(response.error.metadata.payment_id);
 });
}
