const express = require('express');
const dotenv = require("dotenv");
const cors_app = require('cors');
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

dotenv.config();
const app = new express();

var router = express.Router();
var urlRouter = express.Router();
var textRouter = express.Router();


app.use("/url", urlRouter);
app.use("/text", textRouter);


app.use(express.static('client'));
app.use(cors_app());
app.use(express.json());


app.get("/",(req,res)=>{
    res.render('index.html');
  });

urlRouter.get("/emotion", (req,res) => {
    let url = req.query.url;
    let analyzeParams = {
        'url': url,
        'features': {
            'entities': {
                'emotion': true,
                'sentiment': false
                
            },
            'keywords': {
                'emotion': true,
                'sentiment': false
            }
        }
    };
    getNLUInstance(analyzeParams)
    .then(entities => {
        console.log(entities.emotion)
        res.send({emotions:entities.emotion});
    })
    .catch(err => res.send(err));
    
});

urlRouter.get("/sentiment", (req,res) => {
    let url = req.query.url;
    let analyzeParams = {
        'url': url,
        'features': {
            'entities': {
                'emotion': false,
                'sentiment': true
                
            },
            'keywords': {
                'emotion': false,
                'sentiment': true
            }
        }
    };
    getNLUInstance(analyzeParams)
    .then(entities => {
        console.log(entities.sentiment)
        res.send({sentiment:entities.sentiment.label});
    })
    .catch(err => res.send(err));
});

textRouter.get("/emotion", (req,res) => {
    let text = req.query.text;
    console.log(text);   
    let analyzeParams = {
        'text': text,
        'features': {
            'entities': {
                'emotion': true,
                'sentiment': false
                
            },
            'keywords': {
                'emotion': true,
                'sentiment': false
            }
        }
    };
    getNLUInstance(analyzeParams)
    .then(entities => {
        console.log(entities.emotion)
        res.send({emotions:entities.emotion});
    })
    .catch(err => res.send(err));
});

textRouter.get("/sentiment", (req,res) => {
    let text = req.query.text;   
    let analyzeParams = {
        'text': text,
        'features': {
            'entities': {
                'emotion': false,
                'sentiment': true
                
            },
            'keywords': {
                'emotion': false,
                'sentiment': true
            }
        }
    };
    getNLUInstance(analyzeParams)
    .then(entities => {
        console.log(entities.sentiment)
        res.send({sentiments:entities.sentiment.label});
    })
    .catch(err => res.send(err));
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

    
     return naturalLanguageUnderstanding.analyze(analyzeParams)
        .then(analysisResults => {
            console.log(JSON.stringify(analysisResults, null, 2))
            return analysisResults.result.entities[0];
        })
        .catch(err => {
            console.log('error:', err);
            return err;
        });
}