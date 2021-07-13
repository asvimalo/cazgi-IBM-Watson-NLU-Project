const express = require('express');
const dotenv = require("dotenv");
const cors_app = require('cors');
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

dotenv.config();
const app = new express();

//var router = express.Router();
//var urlRouter = express.Router();
//var textRouter = express.Router();


//app.use("/url", urlRouter);
//app.use("/text", textRouter);


app.use(express.static('client'));
app.use(cors_app());


app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {
    let url = req.query.url;
    // let analyzeParams = {
    //     'url': url,
    //     'features': {
    //         'categories': {
    //         'limit': 3
    //         }
    //     }
    // };
    // getNLUInstance(analyzeParams);
    return res.send({"happy":"90","sad":"10"});
});

app.get("/url/sentiment", (req,res) => {
    let url = req.query.url;
    // let analyzeParams = {
    //     'url': url,
    //     'features': {
    //         'categories': {
    //         'limit': 3
    //         }
    //     }
    // };
    // getNLUInstance(analyzeParams);
    return res.send("url sentiment for "+req.query.url);
});

app.get("/text/emotion", (req,res) => {
    let text = req.query.text;   
    // let analyzeParams = {
    //     'text': text,
    //     'features': {
    //         'categories': {
    //         'limit': 3
    //         }
    //     }
    // };
    // getNLUInstance(analyzeParams);
    return res.send({"happy":"10","sad":"90"});
});

app.get("/text/sentiment", (req,res) => {
    let text = req.query.text;   
    // let analyzeParams = {
    //     'text': text,
    //     'features': {
    //         'categories': {
    //         'limit': 3
    //         }
    //     }
    // };
    // getNLUInstance(analyzeParams);
    return res.send("text sentiment for "+req.query.text);
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

function getNLUInstance(analyzeParams){
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2021-03-25',
        authenticator: new IamAuthenticator({
            apikey: api_key,
        }),
        serviceUrl: api_url
    });

    
    naturalLanguageUnderstanding.analyze(analyzeParams)
        .then(analysisResults => {
            console.log(JSON.stringify(analysisResults, null, 2));
        })
        .catch(err => {
            console.log('error:', err);
        });
}