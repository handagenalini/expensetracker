const Expense = require('../models/expense');

const addexpense = (req, res) => {
    console.log('in addexpense',req.body)
    const { expenseamount, description, category } = req.body;
    Expense.create({ expenseamount, description, category,userId:req.user.id }).then(expense => {
        return res.status(201).json({expense, success: true } );
    }).catch(err => {
        return res.status(403).json({success : false, error: err})
    })
}

const getexpenses = (req, res)=> {
    console.log('in getexpense',req.body)

//     req.user.getExpenses().then(expenses => {
//         return res.status(200).json({expenses, success: true})
//     })
//     .catch(err => {
//         return res.status(402).json({ error: err, success: false})
//     })
}

const deleteexpense = (req, res) => {
    const expenseid = req.params.expenseid;
    Expense.destroy({where: { id: expenseid }}).then(() => {
        return res.status(204).json({ success: true, message: "Deleted Successfuly"})
    }).catch(err => {
        console.log(err);
        return res.status(403).json({ success: true, message: "Failed"})
    })
}

module.exports = {
    deleteexpense,
    getexpenses,
    addexpense
}