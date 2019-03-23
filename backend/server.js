import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import Issue from './models/Issue';

const app = express();
const router = express.Router();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/issues');

const connection = mongoose.connection;
connection.once('open', () =>{
    console.log("Mongo Db Connected ");
});

router.route('/issues').get((req,res) => {
    Issue.find((err, issues) => {
        if(err){
            console.log(err);
        }
        else{
            res.json(issues);

        }
    });

});

router.route('/issues/:id').get((req,res) => {
    Issue.findById(req.param.id, (err,issue) => {
        if(err)
            console.log(err);
        else
            res.json(issue);
    });

});

router.route('/issues/add').post((req,res) => {
    let issue = new Issue(req.body);
    issue.save()
        .then(issue => {
            res.status(200).json({'issue':' added successfully'})
        })
        .catch(err => {
            res.status(400).send('Failed to creste a issue');
        });   

});
router.route('/issue/update/:id').post((req,res) => {
    Issue.findById(req.param.id, (err,issue) =>{
        if(!issue){
            return next(new Error('Could not find Document'));
        }
        else{
            issue.title = req.body.title;
            issue.resposible = req.body.resposible;
            issue.description = req.body.description;
            issue.severity = req.body.severity;
            issue.status = req.body.status;
            
            issue.save().then(issue => {
                res.json('Update Done');

            }).catch(err => {
                res.status(400).send('Update Failed');
            });
        }       

    });
});

router.route('issue/delete/:id').get((req,res) => {
    Issue.findByIdAndRemove({_id: req.param.id}, (err, issue) => {
        if(err){
            res.json(err);
        }
        else{
            res.json("Removed Successfully");
        }
    });
});

app.use('/',router);

// app.get('/',(req,res) => res.send("Hello World !"));
app.listen(4000, () => console.log("Express Server running on port 4000"));
