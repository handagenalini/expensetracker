const Expense = require('../models/expense');


const { BlobServiceClient } = require('@azure/storage-blob');
const { v1: uuidv1} = require('uuid');

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

    // req.user.getExpenses().then(expenses => {
    //     return res.status(200).json({expenses, success: true})
    // })
    // .catch(err => {
    //     return res.status(402).json({ error: err, success: false})
    // })
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


const downloadExpenses =  async (req, res) => {
    console.log('in download')

    try {
        if(!req.user.ispremiumuser){
            return res.status(401).json({ success: false, message: 'User is not a premium User'})
        }
        const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING; // check this in the task. I have put mine. Never push it to github.
        // Create the BlobServiceClient object which will be used to create a container client
        const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

        // V.V.V.Imp - Guys Create a unique name for the container
        // Name them your "mailidexpensetracker" as there are other people also using the same storage

        const containerName = 'handagenaliniexpensetracker'; //this needs to be unique name

        console.log('\nCreating container...');
        console.log('\t', containerName);

        // Get a reference to a container
        const containerClient = await blobServiceClient.getContainerClient(containerName);

        //check whether the container already exists or not
        if(!containerClient.exists()){
            console.log('-------------------------------------------------------')
            // Create the container if the container doesnt exist
            const createContainerResponse = await containerClient.create({ access: 'container'});
            console.log("Container was created successfully. requestId: ", createContainerResponse.requestId);
        }
        // Create a unique name for the blob
        const blobName = 'expense' + uuidv1() + '.txt';

        // Get a block blob client
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        console.log('\nUploading to Azure storage as blob:\n\t', blobName);

        // Upload data to the blob as a string
        const data =  JSON.stringify(await req.user.getExpenses());

        const uploadBlobResponse = await blockBlobClient.upload(data, data.length);
        console.log("Blob was uploaded successfully. requestId: ", JSON.stringify(uploadBlobResponse));

        //We send the fileUrl so that the in the frontend we can do a click on this url and download the file
        const fileUrl = `https://demostoragesharpener.blob.core.windows.net/${containerName}/${blobName}`;
        res.status(201).json({ fileUrl, success: true}); // Set disposition and send it.
    } catch(err) {
        res.status(500).json({ error: err, success: false, message: 'Something went wrong'})
    }

};


module.exports = {
    deleteexpense,
    getexpenses,
    addexpense,
    downloadExpenses,
}